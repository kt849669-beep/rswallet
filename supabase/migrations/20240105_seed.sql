-- ============================================
-- RsWallet 3.0 - Seed Data
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================

-- Insert default popup_video record (disabled by default)
INSERT INTO popup_video (title, is_enabled)
VALUES ('Welcome Video', false)
ON CONFLICT DO NOTHING;

-- Insert default telegram_popup record (disabled by default)
INSERT INTO telegram_popup (title, description, is_enabled)
VALUES (
  'Join our Telegram',
  'Get latest updates, offers and priority support on our official channel.',
  false
)
ON CONFLICT DO NOTHING;

-- Insert default admin settings
INSERT INTO admin_settings (admin_email, admin_password, admin_name)
VALUES ('admin@rswallet.com', 'admin@0123', 'RsWallet Admin')
ON CONFLICT DO NOTHING;

-- Insert initial activity log
INSERT INTO activity_logs (action, details)
VALUES ('System Initialized', 'RsWallet 3.0 database setup completed');
