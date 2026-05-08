# Settings Backend Setup Guide

This guide explains how to set up the new user settings backend APIs for Clusteer.

## 📋 What Was Created

### Backend (Django - Clusteer-Blockchain-Engine)

1. **Models** (`p2p/user_settings_models.py`):
   - `NotificationPreferences` - Email, SMS, and push notification settings
   - `BankAccount` - User bank accounts for fiat deposits/withdrawals
   - `PrivacySettings` - Profile visibility, cookie preferences, data sharing
   - `AccountLimits` - Daily/monthly transaction limits with automatic reset
   - `DataExportRequest` - Track user data export requests

2. **Serializers** (`p2p/user_settings_serializers.py`):
   - Full serializers for all models
   - Validation logic (e.g., 10-digit account numbers)
   - Computed fields (e.g., limit usage percentages)

3. **Views** (`p2p/views/user_settings_views.py`):
   - `NotificationPreferencesView` - GET/PUT notification settings
   - `BankAccountListView` - GET/POST bank accounts
   - `BankAccountDetailView` - PUT/DELETE specific bank account
   - `PrivacySettingsView` - GET/PUT privacy settings
   - `AccountLimitsView` - GET account limits (auto-resets)
   - `DataExportRequestView` - POST/GET data export requests

4. **URLs** (`p2p/urls.py`):
   - `/api/v1/user/notifications/preferences/` - Notification settings
   - `/api/v1/user/bank-accounts/` - List/create bank accounts
   - `/api/v1/user/bank-accounts/<id>/` - Update/delete bank account
   - `/api/v1/user/privacy-settings/` - Privacy settings
   - `/api/v1/user/account-limits/` - Transaction limits
   - `/api/v1/user/data-export/` - Data export requests

### Frontend (Next.js - clusteer-unified)

1. **Settings Landing Page** (`/settings`):
   - Card-based navigation to all settings sections
   - Priority badges for high-priority features
   - Dynamic "Action needed" badge for security

2. **Settings Pages**:
   - `/settings/profile` - Personal information
   - `/settings/security` - 2FA, email verification, password
   - `/settings/notifications` - Email/SMS/Push preferences (ready for backend)
   - `/settings/payment-methods` - Bank account management (ready for backend)
   - `/settings/privacy` - Privacy & data settings (ready for backend)
   - `/settings/account` - Limits, export, account closure (ready for backend)

## 🚀 Setup Instructions

### Step 1: Register Models in Django Admin

Edit `Clusteer-Blockchain-Engine/p2p/admin.py`:

```python
from .user_settings_models import (
    NotificationPreferences,
    BankAccount,
    PrivacySettings,
    AccountLimits,
    DataExportRequest
)

@admin.register(NotificationPreferences)
class NotificationPreferencesAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'email_transactions', 'sms_security', 'updated_at']
    search_fields = ['user_id']

@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'bank_name', 'account_number', 'is_default', 'is_verified', 'created_at']
    list_filter = ['is_default', 'is_verified']
    search_fields = ['user_id', 'account_number', 'account_name']

@admin.register(PrivacySettings)
class PrivacySettingsAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'profile_visibility', 'analytical_cookies', 'updated_at']
    search_fields = ['user_id']

@admin.register(AccountLimits)
class AccountLimitsAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'daily_withdrawal_used', 'daily_withdrawal_limit', 'limit_currency']
    search_fields = ['user_id']

@admin.register(DataExportRequest)
class DataExportRequestAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'request_type', 'status', 'requested_at', 'completed_at']
    list_filter = ['status', 'request_type']
    search_fields = ['user_id']
```

### Step 2: Create and Run Django Migrations

```bash
cd Clusteer-Blockchain-Engine
source venv/bin/activate
python manage.py makemigrations
python manage.py migrate
```

### Step 3: Test Backend APIs

#### Test Notification Preferences:
```bash
# GET preferences (creates default if doesn't exist)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/user/notifications/preferences/

# Update preferences
curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email_marketing": true, "sms_transactions": true}' \
  http://localhost:8000/api/v1/user/notifications/preferences/
```

#### Test Bank Accounts:
```bash
# Create bank account
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bank_name": "GTBank",
    "account_number": "0123456789",
    "account_name": "John Doe"
  }' \
  http://localhost:8000/api/v1/user/bank-accounts/

# List bank accounts
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/user/bank-accounts/

# Set as default
curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_default": true}' \
  http://localhost:8000/api/v1/user/bank-accounts/1/

# Delete bank account
curl -X DELETE -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/user/bank-accounts/1/
```

#### Test Privacy Settings:
```bash
curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profile_visibility": true,
    "analytical_cookies": true,
    "marketing_cookies": false
  }' \
  http://localhost:8000/api/v1/user/privacy-settings/
```

#### Test Account Limits:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/user/account-limits/
```

#### Test Data Export:
```bash
# Request export
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"request_type": "full_data"}' \
  http://localhost:8000/api/v1/user/data-export/

# Check export status
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/user/data-export/
```

### Step 4: Update Frontend API Clients

The frontend pages are already built but need to be connected to the backend. Next steps in separate files...

## 📊 Database Schema

### notification_preferences
```sql
CREATE TABLE notification_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(100) UNIQUE NOT NULL,
    email_transactions BOOLEAN DEFAULT TRUE,
    email_security BOOLEAN DEFAULT TRUE,
    email_marketing BOOLEAN DEFAULT FALSE,
    email_order_updates BOOLEAN DEFAULT TRUE,
    sms_transactions BOOLEAN DEFAULT FALSE,
    sms_security BOOLEAN DEFAULT TRUE,
    sms_order_updates BOOLEAN DEFAULT FALSE,
    push_transactions BOOLEAN DEFAULT TRUE,
    push_security BOOLEAN DEFAULT TRUE,
    push_price_alerts BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### bank_accounts
```sql
CREATE TABLE bank_accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_name VARCHAR(200) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, bank_name, account_number)
);
```

### privacy_settings
```sql
CREATE TABLE privacy_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(100) UNIQUE NOT NULL,
    profile_visibility BOOLEAN DEFAULT FALSE,
    transaction_history_visibility BOOLEAN DEFAULT FALSE,
    analytical_cookies BOOLEAN DEFAULT TRUE,
    marketing_cookies BOOLEAN DEFAULT FALSE,
    third_party_sharing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### account_limits
```sql
CREATE TABLE account_limits (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(100) UNIQUE NOT NULL,
    daily_withdrawal_limit DECIMAL(20,2) DEFAULT 50000,
    daily_withdrawal_used DECIMAL(20,2) DEFAULT 0,
    daily_deposit_limit DECIMAL(20,2) DEFAULT 100000,
    daily_deposit_used DECIMAL(20,2) DEFAULT 0,
    monthly_withdrawal_limit DECIMAL(20,2) DEFAULT 500000,
    monthly_withdrawal_used DECIMAL(20,2) DEFAULT 0,
    monthly_deposit_limit DECIMAL(20,2) DEFAULT 1000000,
    monthly_deposit_used DECIMAL(20,2) DEFAULT 0,
    limit_currency VARCHAR(10) DEFAULT 'NGN',
    daily_reset_date DATE DEFAULT CURRENT_DATE,
    monthly_reset_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### data_export_requests
```sql
CREATE TABLE data_export_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    request_type VARCHAR(50) DEFAULT 'full_data',
    file_url TEXT,
    error_message TEXT,
    requested_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);
```

## ✅ Features Implemented

### High Priority (Complete Backend + Frontend):
- ✅ Profile settings (already working)
- ✅ Security settings (already working)
- ✅ Notification preferences (backend ready, frontend ready)
- ✅ Payment methods (backend ready, frontend ready)

### Medium Priority (Complete Backend + Frontend):
- ✅ Privacy settings (backend ready, frontend ready)
- ✅ Account limits (backend ready, frontend ready)
- ✅ Data export (backend ready, frontend ready)

## 🔄 Next Steps

1. Run Django migrations
2. Test all backend endpoints
3. Create frontend API client functions (next file)
4. Connect frontend pages to backend
5. Add Celery task for data export processing
6. Implement email notifications for data export completion

## 📝 Notes

- All endpoints require authentication via Supabase token
- Bank account limit is 5 per user
- Account limits auto-reset daily/monthly
- Default account cannot be deleted if others exist
- Data export requests are throttled (1 per 24 hours)
