import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';
import { nextCookies } from 'better-auth/next-js';

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL!,
  plugins: [adminClient(), nextCookies()],
});

export const { useSession, signOut } = authClient;

export type Session = typeof authClient.$Infer.Session;
