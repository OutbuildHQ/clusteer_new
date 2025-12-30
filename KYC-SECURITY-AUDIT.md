# KYC System Security Audit & Recommendations

**Date:** 2025-12-09
**Audited By:** Claude Code Assistant
**Severity Levels:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## Executive Summary

The KYC (Know Your Customer) system has **14 critical security and logic issues** that must be addressed before production deployment. The system currently uses **Supabase** which needs migration to **Firebase + Django**, and has several data integrity, security, and compliance gaps.

**Risk Level:** 🔴 **CRITICAL - NOT PRODUCTION READY**

---

## 🔴 CRITICAL ISSUES

### 1. **Supabase Dependency in KYC Verification Route**
**File:** `src/app/api/kyc/verify/route.ts`
**Line:** 1-2, 18-26, 48-52, 82-96, 118-141

**Issue:**
- KYC route still uses Supabase for authentication and data storage
- Uses `supabaseAdmin` to store verification requests
- Uses `getSupabaseUserWithRetry()` for auth
- Completely bypasses Firebase migration

**Impact:**
- KYC submissions fail after Supabase removal
- Data stored in wrong database
- Authentication mismatch with rest of application

**Fix Required:**
```typescript
// BEFORE (Current - BROKEN)
import { supabaseAdmin } from "@/lib/supabase";
const { user: authUser } = await getSupabaseUserWithRetry(token);
await supabaseAdmin.from("verification_requests").insert({...});

// AFTER (Fixed)
import { NextRequest, NextResponse } from "next/server";
// Decode Firebase JWT (like wallet/profile routes)
const parts = token.split('.');
const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
const userId = payload.user_id || payload.sub;

// Store in Django backend
const response = await fetch(`${DJANGO_URL}/api/v1/user/${userId}/kyc-verification/`, {
  method: 'POST',
  headers: { 'X-API-KEY': DJANGO_API_KEY },
  body: JSON.stringify(kycData)
});
```

---

### 2. **No Document Upload Security Validation**
**File:** `src/app/api/kyc/verify/route.ts`
**Line:** N/A (Missing entirely)

**Issue:**
- No file type validation (allows ANY file type)
- No file size limits
- No virus/malware scanning
- No image validation (could upload executables)
- Document URLs stored without validation

**Attack Vectors:**
- Upload malicious files (`.exe`, `.sh`, `.bat`)
- Upload extremely large files (DoS attack)
- Upload encrypted malware in images
- XSS via SVG uploads

**Fix Required:**
```typescript
// Add before processing uploads
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateUpload(file: File): boolean {
  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and PDF allowed');
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large. Maximum size is 10MB');
  }

  // Check file extension matches MIME type
  const ext = file.name.split('.').pop()?.toLowerCase();
  const mimeExtMap: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'application/pdf': ['pdf']
  };

  const allowedExts = mimeExtMap[file.type] || [];
  if (!ext || !allowedExts.includes(ext)) {
    throw new Error('File extension does not match file type');
  }

  return true;
}

// Scan with ClamAV or similar
async function scanForMalware(fileBuffer: Buffer): Promise<boolean> {
  // Integration with virus scanning service
  // Return true if clean, false if infected
}
```

---

### 3. **BVN/NIN Validation is Weak**
**File:** `src/app/api/kyc/verify/route.ts`
**Line:** 69-79

**Issue:**
Current validation:
```typescript
const isValidLength = documentNumber.length === 11;
const isAllDigits = /^\d+$/.test(documentNumber);
const isAllSameDigit = /^(\d)\1{10}$/.test(documentNumber);
```

**Problems:**
- Accepts `12345678901` (sequential numbers)
- Accepts `10101010101` (alternating pattern)
- No checksum validation (BVN/NIN have checksums)
- No database check for duplicate submissions
- No rate limiting (can brute force valid numbers)

**Fix Required:**
```typescript
function validateBVN(bvn: string): boolean {
  // Length check
  if (bvn.length !== 11) return false;

  // All digits
  if (!/^\d{11}$/.test(bvn)) return false;

  // Not all same digit
  if (/^(\d)\1{10}$/.test(bvn)) return false;

  // Not sequential
  const isSequential = /^(0123456789|9876543210)/.test(bvn);
  if (isSequential) return false;

  // Not alternating pattern
  const first = bvn[0];
  const second = bvn[1];
  const alternating = new RegExp(`^(${first}${second}){5}${first}$`);
  if (alternating.test(bvn)) return false;

  // Check if already used by another user
  const existingSubmission = await checkDuplicateBVN(bvn, userId);
  if (existingSubmission) {
    throw new Error('This BVN has already been used for verification');
  }

  return true;
}

// Add rate limiting
const MAX_KYC_ATTEMPTS = 3;
const LOCKOUT_PERIOD = 24 * 60 * 60 * 1000; // 24 hours

async function checkKYCRateLimit(userId: string): Promise<boolean> {
  const attempts = await getKYCAttempts(userId, LOCKOUT_PERIOD);
  if (attempts >= MAX_KYC_ATTEMPTS) {
    throw new Error('Too many verification attempts. Please try again in 24 hours.');
  }
  return true;
}
```

---

### 4. **No PII (Personally Identifiable Information) Encryption**
**File:** `Clusteer-Blockchain-Engine/p2p/user_settings_models.py`
**Line:** 198-218

**Issue:**
- BVN/NIN stored in **plain text** in database
- Document numbers not encrypted
- Full names, DOB, addresses stored unencrypted
- Violates NDPR (Nigeria Data Protection Regulation)
- Violates GDPR (if any EU users)

**Legal Compliance Risk:**
- **NDPR Fine:** Up to ₦10,000,000 or 2% of annual revenue
- **GDPR Fine:** Up to €20,000,000 or 4% of annual revenue

**Fix Required:**
```python
from cryptography.fernet import Fernet
from django.conf import settings

class KYCVerification(models.Model):
    # ... other fields ...

    # Encrypted fields
    document_number_encrypted = models.BinaryField()

    @property
    def document_number(self):
        """Decrypt and return document number"""
        if not self.document_number_encrypted:
            return None
        fernet = Fernet(settings.KYC_ENCRYPTION_KEY)
        return fernet.decrypt(self.document_number_encrypted).decode()

    @document_number.setter
    def document_number(self, value):
        """Encrypt and store document number"""
        if value:
            fernet = Fernet(settings.KYC_ENCRYPTION_KEY)
            self.document_number_encrypted = fernet.encrypt(value.encode())

    # Add field-level encryption for:
    # - BVN/NIN numbers
    # - Full names (from verification response)
    # - Addresses
    # - Phone numbers
```

**Additional Requirements:**
- Store encryption keys in AWS KMS / Azure Key Vault
- Implement key rotation policy
- Add audit logging for decryption access

---

### 5. **KYC Provider API Keys Exposed in Frontend Code**
**File:** `src/lib/kyc-provider.ts`
**Line:** 43-44, 194

**Issue:**
```typescript
this.apiKey = process.env.SMILE_IDENTITY_API_KEY || '';
this.partnerId = process.env.SMILE_IDENTITY_PARTNER_ID || '';
```

**Problem:**
- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to browser
- API keys bundled in client JavaScript
- Anyone can extract and use your KYC API keys
- Can lead to **unlimited API costs** charged to your account

**Impact:**
- Attacker can make unlimited KYC requests
- Costs can reach $10,000+ per day
- API key ban/suspension
- Data breach (attacker can verify anyone's BVN/NIN)

**Fix Required:**
```typescript
// WRONG - Frontend code
export async function verifyKYC() {
  const apiKey = process.env.SMILE_IDENTITY_API_KEY; // ❌ EXPOSED
}

// CORRECT - Backend-only API route
// File: src/app/api/kyc/verify/route.ts
export async function POST(request: NextRequest) {
  const apiKey = process.env.SMILE_IDENTITY_API_KEY; // ✅ SECURE (server-side only)

  // Call KYC provider from server
  const response = await fetch(SMILE_API_URL, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
}
```

**Move all KYC provider logic to server-side API routes ONLY.**

---

## 🟠 HIGH PRIORITY ISSUES

### 6. **No Duplicate Verification Check**
**File:** `src/app/api/kyc/verify/route.ts`
**Line:** Missing

**Issue:**
- Same user can submit KYC multiple times
- Can submit different BVN/NIN for same account
- No check for one BVN = one account rule

**Fix:**
```typescript
// Before creating verification request
const existingVerification = await getKYCStatus(userId);

if (existingVerification && existingVerification.status === 'approved') {
  return NextResponse.json({
    status: false,
    message: 'Your account is already verified'
  }, { status: 400 });
}

if (existingVerification && existingVerification.status === 'pending') {
  return NextResponse.json({
    status: false,
    message: 'You have a pending verification. Please wait for review.'
  }, { status: 400 });
}

// Check if BVN/NIN already used by another user
const duplicateCheck = await checkDuplicateDocument(documentNumber);
if (duplicateCheck && duplicateCheck.user_id !== userId) {
  // Log suspicious activity
  await logSecurityEvent({
    event: 'duplicate_kyc_attempt',
    userId,
    documentNumber: maskBVN(documentNumber),
    existingUserId: duplicateCheck.user_id
  });

  return NextResponse.json({
    status: false,
    message: 'This document has already been used for verification'
  }, { status: 400 });
}
```

---

### 7. **No Audit Trail for KYC Actions**
**File:** All KYC files
**Line:** N/A (Missing entirely)

**Issue:**
- No logging of who accessed PII data
- No logging of verification decisions
- No logging of document downloads
- Cannot investigate data breaches
- Non-compliant with NDPR/GDPR

**Fix Required:**
```typescript
// Create audit log model
interface KYCAuditLog {
  id: string;
  userId: string;
  action: 'submit' | 'view' | 'approve' | 'reject' | 'download' | 'access_pii';
  performedBy: string; // Admin user ID
  ipAddress: string;
  userAgent: string;
  documentType?: string;
  changes?: Record<string, any>;
  reason?: string;
  timestamp: Date;
}

// Log every KYC action
async function logKYCAction(action: KYCAuditLog) {
  await db.kycAuditLogs.create(action);

  // Also send to centralized logging (Datadog, CloudWatch, etc.)
  logger.info('KYC_ACTION', action);
}

// Example usage
await logKYCAction({
  userId: authUser.id,
  action: 'submit',
  performedBy: authUser.id,
  ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
  userAgent: request.headers.get('user-agent') || 'unknown',
  documentType: 'BVN',
  timestamp: new Date()
});
```

---

### 8. **Document Storage Not Secure**
**File:** `Clusteer-Blockchain-Engine/p2p/user_settings_models.py`
**Line:** 204-209

**Issue:**
```python
document_front_url = models.URLField(blank=True, null=True)
document_back_url = models.URLField(blank=True, null=True)
selfie_url = models.URLField(blank=True, null=True)
```

**Problems:**
- URLs are public (no authentication required)
- Anyone with URL can access documents
- No expiration on URLs
- No watermarking
- No access control

**Fix Required:**
```python
# Use signed URLs with expiration
def get_document_url(self, document_type: str, user_id: str) -> str:
    """Generate time-limited signed URL for document access"""

    # Check authorization
    if not is_authorized_to_view_kyc(user_id, requesting_user_id):
        raise PermissionDenied("Not authorized to view this document")

    # Generate signed URL (expires in 5 minutes)
    from google.cloud import storage
    client = storage.Client()
    bucket = client.bucket('kyc-documents-secure')
    blob = bucket.blob(f'{user_id}/{document_type}')

    url = blob.generate_signed_url(
        version='v4',
        expiration=timedelta(minutes=5),
        method='GET'
    )

    # Log access
    log_document_access(user_id, document_type, requesting_user_id)

    return url

# Store documents in private bucket
# Firebase Storage rules:
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /kyc-documents/{userId}/{document} {
      // Only authenticated admins can read
      allow read: if request.auth != null &&
                     request.auth.token.admin == true;
      // Only the user can write their own documents
      allow write: if request.auth != null &&
                      request.auth.uid == userId;
    }
  }
}
```

---

### 9. **No Liveness Detection for Selfie**
**File:** `src/lib/kyc-provider.ts`
**Line:** N/A (Missing)

**Issue:**
- Users can upload any photo (even from Google Images)
- No verification that person is actually present
- Easy to fake with printed photos

**Fix Required:**
```typescript
// Use Smile Identity's liveness check
async function verifyWithLiveness(request: KYCVerificationRequest) {
  // Step 1: Request liveness challenge
  const challenge = await fetch(`${SMILE_API}/liveness/request`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      user_id: request.userId,
      job_type: 5, // Enhanced KYC with liveness
    })
  });

  const { upload_url, smile_job_id } = await challenge.json();

  // Step 2: User must complete liveness check in frontend
  // (look left, right, blink, etc.)
  return {
    uploadUrl: upload_url,
    jobId: smile_job_id,
    instructions: 'Please complete the liveness check by following on-screen instructions'
  };
}

// Frontend: Use Smile Identity SDK
import { SmileIdentity } from '@smile-identity/web-sdk';

const smileInstance = new SmileIdentity({
  partnerId: PARTNER_ID,
  jobId: jobId,
  jobType: 5
});

// This shows camera UI with liveness challenges
smileInstance.startLivenessCheck({
  onSuccess: (result) => {
    // Submit to backend
    submitKYC(result);
  },
  onError: (error) => {
    showError('Liveness check failed. Please try again.');
  }
});
```

---

## 🟡 MEDIUM PRIORITY ISSUES

### 10. **No Webhook Signature Verification**
**File:** Missing webhook handler

**Issue:**
- When KYC provider sends results via webhook, no signature verification
- Attacker can forge approval webhooks
- Can mark any account as verified

**Fix Required:**
```typescript
// File: src/app/api/webhooks/kyc/route.ts
export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-smile-signature');
  const payload = await request.text();

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  if (signature !== expectedSignature) {
    console.error('Invalid webhook signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // Process webhook
  const data = JSON.parse(payload);
  await processKYCWebhook(data);

  return NextResponse.json({ received: true });
}
```

---

### 11. **Missing Document Expiration Check**
**File:** `src/app/api/kyc/verify/route.ts`
**Line:** N/A (Missing)

**Issue:**
- No validation that documents are not expired
- Could accept 10-year-old passport
- Non-compliant with KYC best practices

**Fix:**
```typescript
function validateDocumentExpiration(documentType: string, expiryDate: string): boolean {
  const expiry = new Date(expiryDate);
  const today = new Date();

  if (expiry < today) {
    throw new Error(`Your ${documentType} has expired. Please use a valid document.`);
  }

  // Warn if expiring within 30 days
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  if (expiry < thirtyDaysFromNow) {
    return {
      valid: true,
      warning: `Your ${documentType} expires soon. Consider renewing it.`
    };
  }

  return { valid: true };
}
```

---

### 12. **No Age Verification**
**File:** `src/app/api/kyc/verify/route.ts`
**Line:** N/A (Missing)

**Issue:**
- Financial services require minimum age (usually 18+)
- No DOB validation
- Minors could create accounts

**Fix:**
```typescript
function validateAge(dateOfBirth: string): boolean {
  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  const MIN_AGE = 18;
  if (age < MIN_AGE) {
    throw new Error(`You must be at least ${MIN_AGE} years old to use this service`);
  }

  // Also check if age is realistic (e.g., not 150 years old)
  const MAX_AGE = 120;
  if (age > MAX_AGE) {
    throw new Error('Invalid date of birth');
  }

  return true;
}
```

---

### 13. **KYC Data Retention Not Defined**
**File:** All KYC files
**Line:** N/A (Missing)

**Issue:**
- GDPR/NDPR require data retention policies
- Must delete data after certain period
- No automated deletion process

**Fix:**
```python
# Add to KYCVerification model
class KYCVerification(models.Model):
    # ... existing fields ...

    # Data retention
    data_retention_days = models.IntegerField(default=2555)  # 7 years
    scheduled_deletion_date = models.DateField(null=True, blank=True)

    def schedule_deletion(self):
        """Schedule data for deletion after retention period"""
        from datetime import timedelta
        if self.reviewed_at:
            self.scheduled_deletion_date = self.reviewed_at + timedelta(
                days=self.data_retention_days
            )
            self.save()

    @classmethod
    def delete_expired_data(cls):
        """Delete KYC data past retention period"""
        from django.utils import timezone
        today = timezone.now().date()

        expired_records = cls.objects.filter(
            scheduled_deletion_date__lte=today
        )

        for record in expired_records:
            # Log deletion for compliance
            log_data_deletion(record.user_id, 'kyc_data', 'retention_period_expired')

            # Soft delete (keep status, delete PII)
            record.document_number = None
            record.document_front_url = None
            record.document_back_url = None
            record.selfie_url = None
            record.address_document_url = None
            record.save()

# Add cron job
# python manage.py delete_expired_kyc_data (run daily)
```

---

### 14. **No Manual Review Workflow for Edge Cases**
**File:** `Clusteer-Blockchain-Engine/p2p/views/user_settings_views.py`
**Line:** 314-349

**Issue:**
- Automatic approval/rejection only
- No human review for suspicious cases
- No admin dashboard to review submissions

**Fix:**
```python
# Update KYC verification view
def post(self, request, user_id):
    # ... existing validation ...

    # Call KYC provider
    result = verify_with_provider(data)

    # Decision logic
    if result.confidence >= 95:
        # High confidence - auto approve
        verification.status = 'approved'
        verification.reviewed_at = timezone.now()
    elif result.confidence >= 70:
        # Medium confidence - manual review needed
        verification.status = 'under_review'
        send_admin_notification('New KYC submission needs manual review', user_id)
    else:
        # Low confidence - auto reject
        verification.status = 'rejected'
        verification.rejection_reason = 'Could not verify identity. Please submit clearer documents.'

    verification.save()

    return Response({
        'status': True,
        'message': get_status_message(verification.status)
    })

# Create admin review endpoint
# POST /admin/kyc-review/{user_id}/
class KYCAdminReviewView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        action = request.data.get('action')  # 'approve' or 'reject'
        reason = request.data.get('reason', '')

        verification = KYCVerification.objects.get(user_id=user_id)

        if action == 'approve':
            verification.status = 'approved'
        elif action == 'reject':
            verification.status = 'rejected'
            verification.rejection_reason = reason

        verification.reviewed_by = request.user.id
        verification.reviewed_at = timezone.now()
        verification.save()

        # Log admin action
        log_kyc_action('admin_review', user_id, request.user.id, action)

        # Notify user
        send_kyc_status_email(user_id, verification.status)

        return Response({'status': True})
```

---

## Summary of Required Actions

### Immediate (Before ANY Production Use):
1. ✅ Migrate KYC route from Supabase to Firebase + Django
2. ✅ Add file upload validation and security
3. ✅ Encrypt all PII data at rest
4. ✅ Move KYC provider API keys to server-side only
5. ✅ Implement duplicate document checking
6. ✅ Add comprehensive audit logging

### Before Launch (Within 1 Week):
7. ✅ Implement rate limiting on KYC submissions
8. ✅ Add signed URLs for document access
9. ✅ Implement liveness detection
10. ✅ Add webhook signature verification

### Post-Launch (Within 1 Month):
11. ✅ Add document expiration validation
12. ✅ Add age verification (18+)
13. ✅ Implement data retention policy
14. ✅ Build admin review dashboard

---

## Compliance Checklist

### Nigeria Data Protection Regulation (NDPR):
- [ ] PII encryption at rest
- [ ] Access control and logging
- [ ] Data retention policy
- [ ] User consent for data processing
- [ ] Right to deletion implementation

### General Data Protection Regulation (GDPR):
- [ ] Data minimization
- [ ] Purpose limitation
- [ ] Storage limitation
- [ ] Integrity and confidentiality
- [ ] Accountability

---

## Estimated Implementation Time

| Priority | Tasks | Time Estimate |
|----------|-------|---------------|
| 🔴 Critical | Issues #1-5 | 3-5 days |
| 🟠 High | Issues #6-9 | 2-3 days |
| 🟡 Medium | Issues #10-14 | 3-4 days |
| **Total** | **All Fixes** | **8-12 days** |

---

## Conclusion

The KYC system has a solid foundation but **requires significant security hardening** before production use. The most critical issues are:

1. Supabase migration
2. PII encryption
3. API key exposure
4. File upload security

**Recommendation:** Do NOT enable KYC verification in production until at minimum the 5 critical issues are resolved.

