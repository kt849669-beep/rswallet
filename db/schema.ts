import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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
