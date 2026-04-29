/**
 * Centralized Firebase mocks for tests
 */

// Mock for '@/lib/firebase'
export const mockFirebaseModule = {
	app: {},
	auth: { currentUser: null },
	storage: {},
	isFirebaseConfigured: true,
};

// Mock functions for '@/lib/auth-firebase'
export const mockLoginWithFirebase = jest.fn();
export const mockRegisterWithFirebase = jest.fn();
export const mockLogoutFirebase = jest.fn();
export const mockResetPassword = jest.fn();

export const mockAuthFirebaseModule = {
	loginWithFirebase: mockLoginWithFirebase,
	registerWithFirebase: mockRegisterWithFirebase,
	logoutFirebase: mockLogoutFirebase,
	resetPassword: mockResetPassword,
};

/**
 * Reset all Firebase mocks between tests
 */
export function resetFirebaseMocks() {
	mockLoginWithFirebase.mockReset();
	mockRegisterWithFirebase.mockReset();
	mockLogoutFirebase.mockReset();
	mockResetPassword.mockReset();
}
