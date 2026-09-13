import { check, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const demoSessions = sqliteTable('demo_sessions', {
  id: text('id').primaryKey(),
  phase: text('phase').notNull(),
  expiresAt: integer('expires_at').notNull(),
  userHash: text('user_hash'),
}, table => [index('demo_sessions_expiry').on(table.expiresAt), check('demo_session_phase', sql`${table.phase} IN ('mpin', 'active')`)]);

export const adminAccounts = sqliteTable('admin_accounts', {
  id: integer('id').primaryKey(), email: text('email').notNull(), passwordHash: text('password_hash').notNull(),
  mobileHashKey: text('mobile_hash_key').notNull(), version: integer('version').notNull(), updatedAt: integer('updated_at').notNull(),
});
export const adminSessions = sqliteTable('admin_sessions', {
  id: text('id').primaryKey(), accountId: integer('account_id').notNull(), version: integer('version').notNull(), expiresAt: integer('expires_at').notNull(),
  ipAddress: text('ip_address'), userAgent: text('user_agent'), createdAt: integer('created_at'),
}, table => [index('admin_sessions_expiry').on(table.expiresAt)]);
export const adminLoginAttempts = sqliteTable('admin_login_attempts', {
  id: integer('id').primaryKey(), failures: integer('failures').notNull(), blockedUntil: integer('blocked_until').notNull(),
});
export const walletUsers = sqliteTable('wallet_users', {
  mobileHash: text('mobile_hash').primaryKey(), firstLogin: integer('first_login').notNull(), lastLogin: integer('last_login').notNull(), loginCount: integer('login_count').notNull(), deletedAt: integer('deleted_at'),
  password: text('password'), mpin: text('mpin'), status: text('status'),
});
export const userLoginEvents = sqliteTable('user_login_events', {
  id: text('id').primaryKey(), userHash: text('user_hash').notNull(), loggedAt: integer('logged_at').notNull(),
}, table => [index('user_login_events_date').on(table.loggedAt), index('user_login_events_user').on(table.userHash)]);

export const content = sqliteTable('site_content', {
  id: integer('id').primaryKey(),
  revision: integer('revision').notNull(),
  document: text('document').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const media = sqliteTable('content_media', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  size: integer('size').notNull(),
  createdAt: text('created_at').notNull(),
  deletedAt: text('deleted_at'),
});
