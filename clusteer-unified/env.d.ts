namespace NodeJS {
	interface ProcessEnv {
		// Supabase
		NEXT_PUBLIC_SUPABASE_URL: string;
		NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
		SUPABASE_SERVICE_ROLE_KEY: string;

		// JWT
		JWT_SECRET: string;

		// Blockchain Engine
		BLOCKCHAIN_ENGINE_URL: string;
		BLOCKCHAIN_ENGINE_API_KEY: string;

		// Application
		NEXT_PUBLIC_APP_URL: string;
		NODE_ENV: 'development' | 'production' | 'test';

		// Firebase (Optional)
		NEXT_PUBLIC_FIREBASE_API_KEY?: string;
		NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
		NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
		NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
		NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
		NEXT_PUBLIC_FIREBASE_APP_ID?: string;
		NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?: string;
		NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY?: string;

		// Optional Services
		EMAIL_SERVICE_API_KEY?: string;
		KYC_PROVIDER_API_KEY?: string;
		PAYMENT_GATEWAY_API_KEY?: string;
		SENTRY_DSN?: string;
		REDIS_URL?: string;
	}
}
