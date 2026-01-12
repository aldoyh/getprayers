// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
			code?: string;
			stack?: string;
		}

		interface Locals {
			user?: {
				id: string;
				name: string;
				email: string;
			};
			sessionId?: string;
		}

		interface PageData {
			title?: string;
			description?: string;
			metadata?: Record<string, unknown>;
		}

		interface Platform {
			env: {
				KV_NAMESPACE: KVNamespace;
				DB: D1Database;
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
0;
