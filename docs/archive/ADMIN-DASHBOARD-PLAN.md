# Admin Dashboard - Phase 2 Integration Plan

**Current Status:** Phase 1 Complete (Users page + Settings pages)
**Next Phase:** Integrate remaining admin pages

---

## 📋 Pages to Integrate (Priority Order)

### 1. KYC Page (High Priority)
**File:** `/src/app/(admin)/admin/kyc/page.tsx`

**Integrations Needed:**
- [ ] Add toast notifications (approve/reject feedback)
- [ ] Add loading spinner (document review)
- [ ] Add accessible modal (view documents, reject with reason)
- [ ] Add pagination for KYC submissions list
- [ ] Add search bar (search by user name/email)
- [ ] Add batch operations (bulk approve/reject)
- [ ] Add export functionality (export KYC data)
- [ ] Use `getKYCStatusColor()` for status badges
- [ ] Use `formatDate()` for submission dates

**Estimated Time:** 2-3 hours

---

### 2. Transactions Page (High Priority)
**File:** `/src/app/(admin)/admin/transactions/page.tsx`

**Integrations Needed:**
- [ ] Add toast notifications (transaction actions)
- [ ] Add loading spinner (transaction list)
- [ ] Add pagination (large transaction lists)
- [ ] Add search bar (search by ID, user, amount)
- [ ] Add date range filters
- [ ] Add export functionality (export transactions)
- [ ] Use `getTransactionStatusColor()` for status badges
- [ ] Use `formatDate()` and `formatTime()` for timestamps
- [ ] Use `formatSmartDate()` for relative times

**Estimated Time:** 2-3 hours

---

### 3. Wallets & Liquidity Page (Medium Priority)
**File:** `/src/app/(admin)/admin/wallets/page.tsx`

**Integrations Needed:**
- [ ] Add toast notifications (liquidity actions)
- [ ] Add loading spinner (wallet data loading)
- [ ] Add accessible modal (add liquidity, withdrawal)
- [ ] Add search bar (search wallets)
- [ ] Add export functionality (export wallet data)
- [ ] Use `getStatusColor()` for wallet status
- [ ] Use `formatDate()` for timestamps

**Estimated Time:** 2 hours

---

### 4. Support Page (Medium Priority)
**File:** `/src/app/(admin)/admin/support/page.tsx`

**Integrations Needed:**
- [ ] Add toast notifications (ticket actions)
- [ ] Add loading spinner (ticket list)
- [ ] Add accessible modal (view ticket, reply)
- [ ] Add pagination for tickets list
- [ ] Add search bar (search tickets)
- [ ] Add batch operations (bulk close/assign)
- [ ] Use `getPriorityColor()` for priority badges
- [ ] Use `getStatusColor()` for ticket status
- [ ] Use `formatRelativeTime()` for "5 minutes ago"

**Estimated Time:** 2-3 hours

---

### 5. Content Management (Low Priority)
**File:** `/src/app/(admin)/admin/content/page.tsx`

**Integrations Needed:**
- [ ] Add toast notifications (publish/unpublish)
- [ ] Add loading spinner (content list)
- [ ] Add accessible modal (create/edit content)
- [ ] Add pagination for content list
- [ ] Add search bar (search content)
- [ ] Add batch operations (bulk publish/delete)
- [ ] Add export functionality (export content list)
- [ ] Use `getStatusColor()` for publish status
- [ ] Use `formatDate()` for publish dates

**Estimated Time:** 2-3 hours

---

### 6. Reports Pages (Low Priority)
**Files:**
- `/src/app/(admin)/admin/reports/page.tsx`
- `/src/app/(admin)/admin/reports/user-activity/page.tsx`
- `/src/app/(admin)/admin/reports/financial-summary/page.tsx`
- `/src/app/(admin)/admin/reports/compliance/page.tsx`

**Integrations Needed:**
- [ ] Add toast notifications (report generation)
- [ ] Add loading spinner (report loading)
- [ ] Add export functionality (export reports as PDF/Excel)
- [ ] Use `formatDate()` for date ranges
- [ ] Use `formatDateTime()` for timestamps
- [ ] Add date range picker component

**Estimated Time:** 3-4 hours (multiple pages)

---

### 7. Admins Page (Already 90% Done)
**File:** `/src/app/(admin)/admin/admins/page.tsx`

**Integrations Needed:**
- [ ] Add toast notifications (create/edit admin)
- [ ] Add loading spinner (admin list)
- [ ] Replace custom modal with Modal component
- [ ] Add pagination (if admin list grows)
- [ ] Add search bar (already has basic search)
- [ ] Add batch operations (bulk suspend/activate)
- [ ] Use `getRoleColor()` for role badges
- [ ] Use `formatDate()` for dates

**Estimated Time:** 1-2 hours

---

## 🎯 Integration Checklist (Per Page)

For each page, follow this checklist:

### Step 1: Setup
- [ ] Import `useToast` hook
- [ ] Add `isLoading` state
- [ ] Import necessary components (Modal, Pagination, SearchBar, etc.)
- [ ] Import utilities (date-utils, status-utils, export-utils)

### Step 2: Replace Patterns
- [ ] Replace `alert()` → `toast.success/error()`
- [ ] Replace hardcoded spinners → `<LoadingSpinner />`
- [ ] Replace custom modals → `<Modal />` or `<ConfirmModal />`
- [ ] Replace manual pagination → `<Pagination />`
- [ ] Replace basic search → `<SearchBar />`
- [ ] Replace inline colors → `getStatusColor()` utilities
- [ ] Replace date strings → `formatDate()` utilities
- [ ] Replace manual CSV → `exportTableData()`

### Step 3: Add Features
- [ ] Add batch selection with `useBatchSelection` hook
- [ ] Add batch actions with `<BatchActions />`
- [ ] Add proper error handling with try/catch
- [ ] Add loading states for all async operations
- [ ] Add form validation if forms exist

### Step 4: Testing
- [ ] Test all CRUD operations
- [ ] Test batch operations
- [ ] Test search and filters
- [ ] Test pagination
- [ ] Test export functionality
- [ ] Test toast notifications
- [ ] Test loading states
- [ ] Test modal interactions
- [ ] Test keyboard navigation
- [ ] Test mobile responsiveness

---

## 📊 Estimated Timeline

### Sprint 1 (Week 1)
- Day 1-2: KYC Page
- Day 3-4: Transactions Page
- Day 5: Wallets Page

### Sprint 2 (Week 2)
- Day 1-2: Support Page
- Day 3-4: Content Management
- Day 5: Reports Pages

### Sprint 3 (Week 3)
- Day 1: Admins Page (polish)
- Day 2-3: Testing all pages
- Day 4-5: Bug fixes and polish

**Total Time:** 3 weeks (assuming 4-6 hours/day)

---

## 🚨 Critical Notes

### Before Starting Integration:
1. Read the existing page code carefully
2. Understand the data structure and mock data
3. Check for any existing custom components
4. Review similar patterns in Users page

### During Integration:
1. Test as you go - don't save all testing for the end
2. Keep the same mock data structure
3. Don't change business logic, only UI patterns
4. Document any issues or blockers

### After Integration:
1. Update ADMIN-DASHBOARD-COMPLETE.md with new pages
2. Add usage examples to the documentation
3. Take screenshots for documentation
4. Create PR with detailed description

---

## 📚 Reference Files

**Example Implementation:**
- [Users Page](clusteer-unified/src/app/(admin)/admin/users/page.tsx) - Perfect example to follow

**Component Documentation:**
- [Toast](ADMIN-DASHBOARD-FIXES-APPLIED.md#1-toast-notifications)
- [Modal](ADMIN-DASHBOARD-FIXES-APPLIED.md#3-modal-component)
- [Pagination](ADMIN-DASHBOARD-FIXES-APPLIED.md#4-pagination-component)
- [SearchBar](ADMIN-DASHBOARD-FIXES-APPLIED.md#5-searchbar-component)
- [BatchActions](ADMIN-DASHBOARD-FIXES-APPLIED.md#6-batchactions-component)

**Utility Documentation:**
- [Date Utils](ADMIN-DASHBOARD-FIXES-APPLIED.md#1-date-formatting-utilities)
- [Status Utils](ADMIN-DASHBOARD-FIXES-APPLIED.md#2-status--role-color-utilities)
- [Export Utils](ADMIN-DASHBOARD-FIXES-APPLIED.md#3-export-utilities)

---

**Last Updated:** December 30, 2025
**Status:** Ready to start Phase 2
