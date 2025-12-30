#!/bin/bash

# Database Restore Script for Clusteer
# Restores database from encrypted backup

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if backup file provided
if [ -z "$1" ]; then
    echo "Usage: $0 <backup-file>"
    echo ""
    echo "Available backups:"
    ls -lh /var/backups/clusteer/clusteer_*.sql.* 2>/dev/null | tail -10 || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}✗${NC} Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Load environment variables
if [ -f "../Clusteer-Blockchain-Engine/.env" ]; then
    set -a
    source "../Clusteer-Blockchain-Engine/.env"
    set +a
else
    echo "Error: .env file not found"
    exit 1
fi

echo "========================================"
echo "  CLUSTEER DATABASE RESTORE"
echo "========================================"
echo ""
echo -e "${YELLOW}⚠  WARNING: This will OVERWRITE the current database${NC}"
echo ""
echo "Backup file: $BACKUP_FILE"
echo "Target database: $DB_NAME"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Create temporary directory
TMP_DIR=$(mktemp -d)
trap "rm -rf $TMP_DIR" EXIT

# Decrypt if encrypted
if [[ "$BACKUP_FILE" == *.enc ]]; then
    echo "Decrypting backup..."
    if [ -z "$BACKUP_ENCRYPTION_PASSWORD" ]; then
        echo -e "${RED}✗${NC} BACKUP_ENCRYPTION_PASSWORD not set"
        exit 1
    fi

    DECRYPTED_FILE="$TMP_DIR/backup.sql.gz"
    if openssl enc -aes-256-cbc -d \
        -in "$BACKUP_FILE" \
        -out "$DECRYPTED_FILE" \
        -k "$BACKUP_ENCRYPTION_PASSWORD"; then
        echo -e "${GREEN}✓${NC} Backup decrypted"
        BACKUP_FILE="$DECRYPTED_FILE"
    else
        echo -e "${RED}✗${NC} Decryption failed"
        exit 1
    fi
fi

# Decompress if compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "Decompressing backup..."
    SQL_FILE="$TMP_DIR/backup.sql"
    if gunzip -c "$BACKUP_FILE" > "$SQL_FILE"; then
        echo -e "${GREEN}✓${NC} Backup decompressed"
    else
        echo -e "${RED}✗${NC} Decompression failed"
        exit 1
    fi
else
    SQL_FILE="$BACKUP_FILE"
fi

# Create backup of current database before restore
echo ""
echo "Creating safety backup of current database..."
SAFETY_BACKUP="$TMP_DIR/pre_restore_backup_$(date +%Y%m%d_%H%M%S).sql"
PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --no-owner \
    --no-acl \
    -F p \
    > "$SAFETY_BACKUP"
echo -e "${GREEN}✓${NC} Safety backup created: $SAFETY_BACKUP"

# Drop and recreate database
echo ""
echo "Dropping current database..."
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -c "DROP DATABASE IF EXISTS ${DB_NAME};"

echo "Creating new database..."
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -c "CREATE DATABASE ${DB_NAME};"

# Restore database
echo ""
echo "Restoring database from backup..."
if PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    < "$SQL_FILE"; then
    echo -e "${GREEN}✓${NC} Database restored successfully"
else
    echo -e "${RED}✗${NC} Restore failed"
    echo ""
    echo "Attempting to restore from safety backup..."
    PGPASSWORD="$DB_PASSWORD" psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        < "$SAFETY_BACKUP"
    exit 1
fi

# Run migrations to ensure schema is up-to-date
echo ""
echo "Running migrations..."
cd "../Clusteer-Blockchain-Engine"
python3 manage.py migrate --noinput

echo ""
echo -e "${GREEN}✓${NC} Database restore completed successfully"
echo ""
echo "Safety backup saved at: $SAFETY_BACKUP"
echo "(Will be deleted when script exits unless you move it)"
echo ""
