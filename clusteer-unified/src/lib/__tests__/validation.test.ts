import {
	LoginFormSchema,
	SignupFormSchema,
	BuyCryptoSchema,
	SellCryptoSchema,
	OTPFormSchema,
	ResetPasswordFormSchema,
	BVNVerificationFormSchema,
	UpdateProfileFormSchema,
	PaymentFormSchema,
	ForgotPasswordFormSchema,
	ChangePasswordFormSchema,
	ChangeEmailFormSchema,
} from "../validation";

describe("Validation Schemas", () => {
	describe("LoginFormSchema", () => {
		it("passes with valid input", () => {
			const result = LoginFormSchema.safeParse({
				email: "test@example.com",
				password: "password123",
			});
			expect(result.success).toBe(true);
		});

		it("fails with invalid email", () => {
			const result = LoginFormSchema.safeParse({
				email: "not-an-email",
				password: "password123",
			});
			expect(result.success).toBe(false);
		});

		it("fails with empty password", () => {
			const result = LoginFormSchema.safeParse({
				email: "test@example.com",
				password: "",
			});
			expect(result.success).toBe(false);
		});

		it("fails with missing email", () => {
			const result = LoginFormSchema.safeParse({
				password: "password123",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("SignupFormSchema", () => {
		const validSignup = {
			username: "testuser",
			email: "test@example.com",
			phone: "08012345678",
			password: "password123",
		};

		it("passes with valid input", () => {
			const result = SignupFormSchema.safeParse(validSignup);
			expect(result.success).toBe(true);
		});

		it("fails with username too short", () => {
			const result = SignupFormSchema.safeParse({ ...validSignup, username: "ab" });
			expect(result.success).toBe(false);
		});

		it("fails with username starting with number", () => {
			const result = SignupFormSchema.safeParse({ ...validSignup, username: "1user" });
			expect(result.success).toBe(false);
		});

		it("fails with username containing special chars", () => {
			const result = SignupFormSchema.safeParse({ ...validSignup, username: "user@name" });
			expect(result.success).toBe(false);
		});

		it("allows underscore in username", () => {
			const result = SignupFormSchema.safeParse({ ...validSignup, username: "user_name" });
			expect(result.success).toBe(true);
		});

		it("fails with invalid email", () => {
			const result = SignupFormSchema.safeParse({ ...validSignup, email: "bad-email" });
			expect(result.success).toBe(false);
		});

		it("fails with invalid Nigerian phone format", () => {
			const result = SignupFormSchema.safeParse({ ...validSignup, phone: "1234567890" });
			expect(result.success).toBe(false);
		});

		it("passes with valid Nigerian phone", () => {
			const result = SignupFormSchema.safeParse({ ...validSignup, phone: "09012345678" });
			expect(result.success).toBe(true);
		});
	});

	describe("BuyCryptoSchema", () => {
		it("passes with valid positive amount", () => {
			const result = BuyCryptoSchema.safeParse({ pay: 5000 });
			expect(result.success).toBe(true);
		});

		it("fails with zero", () => {
			const result = BuyCryptoSchema.safeParse({ pay: 0 });
			expect(result.success).toBe(false);
		});

		it("fails with negative", () => {
			const result = BuyCryptoSchema.safeParse({ pay: -100 });
			expect(result.success).toBe(false);
		});

		it("fails when exceeding 100M", () => {
			const result = BuyCryptoSchema.safeParse({ pay: 100_000_001 });
			expect(result.success).toBe(false);
		});
	});

	describe("SellCryptoSchema", () => {
		it("passes with valid amount", () => {
			const result = SellCryptoSchema.safeParse({ pay: 50 });
			expect(result.success).toBe(true);
		});

		it("fails when exceeding 100k", () => {
			const result = SellCryptoSchema.safeParse({ pay: 100_001 });
			expect(result.success).toBe(false);
		});

		it("fails with zero", () => {
			const result = SellCryptoSchema.safeParse({ pay: 0 });
			expect(result.success).toBe(false);
		});
	});

	describe("OTPFormSchema", () => {
		it("passes with valid 6-digit string", () => {
			const result = OTPFormSchema.safeParse({ otp: "123456" });
			expect(result.success).toBe(true);
		});

		it("fails with 5 digits", () => {
			const result = OTPFormSchema.safeParse({ otp: "12345" });
			expect(result.success).toBe(false);
		});

		it("fails with 7 digits", () => {
			const result = OTPFormSchema.safeParse({ otp: "1234567" });
			expect(result.success).toBe(false);
		});

		it("fails with letters", () => {
			const result = OTPFormSchema.safeParse({ otp: "12345a" });
			expect(result.success).toBe(false);
		});
	});

	describe("ResetPasswordFormSchema", () => {
		it("passes with matching passwords >= 8 chars", () => {
			const result = ResetPasswordFormSchema.safeParse({
				newPassword: "password123",
				confirmPassword: "password123",
			});
			expect(result.success).toBe(true);
		});

		it("fails with mismatched passwords", () => {
			const result = ResetPasswordFormSchema.safeParse({
				newPassword: "password123",
				confirmPassword: "different456",
			});
			expect(result.success).toBe(false);
		});

		it("fails with password < 8 chars", () => {
			const result = ResetPasswordFormSchema.safeParse({
				newPassword: "short",
				confirmPassword: "short",
			});
			expect(result.success).toBe(false);
		});

		it("fails with empty confirm", () => {
			const result = ResetPasswordFormSchema.safeParse({
				newPassword: "password123",
				confirmPassword: "",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("BVNVerificationFormSchema", () => {
		it("passes with valid 11-digit BVN", () => {
			const result = BVNVerificationFormSchema.safeParse({ bvn: "12345678901" });
			expect(result.success).toBe(true);
		});

		it("fails with 10 digits", () => {
			const result = BVNVerificationFormSchema.safeParse({ bvn: "1234567890" });
			expect(result.success).toBe(false);
		});

		it("fails with 12 digits", () => {
			const result = BVNVerificationFormSchema.safeParse({ bvn: "123456789012" });
			expect(result.success).toBe(false);
		});

		it("fails with all same digit", () => {
			const result = BVNVerificationFormSchema.safeParse({ bvn: "11111111111" });
			expect(result.success).toBe(false);
		});

		it("fails with non-digit chars", () => {
			const result = BVNVerificationFormSchema.safeParse({ bvn: "1234567890a" });
			expect(result.success).toBe(false);
		});
	});

	describe("UpdateProfileFormSchema", () => {
		it("passes with valid data", () => {
			const result = UpdateProfileFormSchema.safeParse({
				firstName: "John",
				lastName: "Doe",
				username: "johndoe",
				email: "john@example.com",
				phone: "08012345678",
			});
			expect(result.success).toBe(true);
		});

		it("fails with username containing special chars", () => {
			const result = UpdateProfileFormSchema.safeParse({
				username: "user@name!",
				email: "john@example.com",
			});
			expect(result.success).toBe(false);
		});

		it("fails with invalid email", () => {
			const result = UpdateProfileFormSchema.safeParse({
				username: "johndoe",
				email: "not-email",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("PaymentFormSchema", () => {
		it("passes with valid payment data", () => {
			const result = PaymentFormSchema.safeParse({
				accountNo: "0123456789",
				accountName: "John Doe",
				bank: "Test Bank",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("ForgotPasswordFormSchema", () => {
		it("passes with valid email", () => {
			const result = ForgotPasswordFormSchema.safeParse({ email: "test@example.com" });
			expect(result.success).toBe(true);
		});

		it("fails with invalid email", () => {
			const result = ForgotPasswordFormSchema.safeParse({ email: "bad" });
			expect(result.success).toBe(false);
		});
	});

	describe("ChangePasswordFormSchema", () => {
		it("passes with matching passwords", () => {
			const result = ChangePasswordFormSchema.safeParse({
				newPassword: "newpass",
				confirmPassword: "newpass",
			});
			expect(result.success).toBe(true);
		});

		it("fails with mismatched passwords", () => {
			const result = ChangePasswordFormSchema.safeParse({
				newPassword: "newpass",
				confirmPassword: "different",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("ChangeEmailFormSchema", () => {
		it("passes with valid email and OTP", () => {
			const result = ChangeEmailFormSchema.safeParse({
				email: "new@example.com",
				otp: "123456",
			});
			expect(result.success).toBe(true);
		});

		it("fails with invalid OTP", () => {
			const result = ChangeEmailFormSchema.safeParse({
				email: "new@example.com",
				otp: "abc",
			});
			expect(result.success).toBe(false);
		});
	});
});
