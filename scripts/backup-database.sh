#!/bin/bash

# Database Backup Script for Clusteer
# Creates encrypted backups of PostgreSQL database

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/clusteer}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Load environment variables
if [ -f "../Clusteer-Blockchain-Engine/.env" ]; then
    set -a
    source "../Clusteer-Blockchain-Engine/.env"
    set +a
else
    echo "Error: .env file not found"
    exit 1
fi

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "========================================"
echo "  CLUSTEER DATABASE BACKUP"
echo "========================================"
echo ""
echo "Timestamp: $TIMESTAMP"
echo "Database: $DB_NAME"
echo "Backup directory: $BACKUP_DIR"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup filename
BACKUP_FILE="$BACKUP_DIR/clusteer_${DB_NAME}_${TIMESTAMP}.sql"
BACKUP_FILE_GZ="${BACKUP_FILE}.gz"
BACKUP_FILE_ENC="${BACKUP_FILE_GZ}.enc"

# Perform backup
echo "Creating database backup..."
if PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --no-owner \
    --no-acl \
    -F p \
    > "$BACKUP_FILE"; then
    echo -e "${GREEN}✓${NC} Database backup created"
else
    echo -e "${RED}✗${NC} Database backup failed"
    exit 1
fi

# Compress backup
echo "Compressing backup..."
if gzip -9 "$BACKUP_FILE"; then
    echo -e "${GREEN}✓${NC} Backup compressed"
else
    echo -e "${RED}✗${NC} Compression failed"
    exit 1
fi

# Encrypt backup (optional but recommended)
if [ ! -z "$BACKUP_ENCRYPTION_PASSWORD" ]; then
    echo "Encrypting backup..."
    if openssl enc -aes-256-cbc -salt \
        -in "$BACKUP_FILE_GZ" \
        -out "$BACKUP_FILE_ENC" \
        -k "$BACKUP_ENCRYPTION_PASSWORD"; then
        echo -e "${GREEN}✓${NC} Backup encrypted"
        rm "$BACKUP_FILE_GZ"
        FINAL_BACKUP="$BACKUP_FILE_ENC"
    else
        echo -e "${RED}✗${NC} Encryption failed"
        FINAL_BACKUP="$BACKUP_FILE_GZ"
    fi
else
    echo "⚠  Backup not encrypted (set BACKUP_ENCRYPTION_PASSWORD to enable)"
    FINAL_BACKUP="$BACKUP_FILE_GZ"
fi

# Calculate file size
BACKUP_SIZE=$(du -h "$FINAL_BACKUP" | cut -f1)
echo ""
echo "Backup completed:"
echo "  File: $FINAL_BACKUP"
echo "  Size: $BACKUP_SIZE"

# Clean up old backups
echo ""
echo "Cleaning up old backups (older than $RETENTION_DAYS days)..."
DELETED=$(find "$BACKUP_DIR" -name "clusteer_*.sql.*" -type f -mtime +$RETENTION_DAYS -delete -print | wc -l)
echo "Deleted $DELETED old backup(s)"

# List recent backups
echo ""
echo "Recent backups:"
ls -lh "$BACKUP_DIR"/clusteer_*.sql.* 2>/dev/null | tail -5 || echo "No backups found"

# Upload to cloud storage (optional)
if [ ! -z "$AWS_S3_BACKUP_BUCKET" ]; then
    echo ""
    echo "Uploading to S3..."
    if aws s3 cp "$FINAL_BACKUP" "s3://$AWS_S3_BACKUP_BUCKET/database-backups/" --storage-class GLACIER; then
        echo -e "${GREEN}✓${NC} Uploaded to S3"
    else
        echo -e "${RED}✗${NC} S3 upload failed"
    fi
fi

echo ""
echo -e "${GREEN}✓${NC} Backup completed successfully"
echo ""
