-- billing / entitlement migration for AI Companion Matching App
-- PostgreSQL
-- Assumes users table and set_updated_at() trigger function already exist

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- subscription_products
-- =========================================
CREATE TABLE IF NOT EXISTS subscription_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code VARCHAR(100) NOT NULL UNIQUE,
  store_platform VARCHAR(20) NOT NULL,
  store_product_id VARCHAR(255) NOT NULL,
  product_type VARCHAR(20) NOT NULL,
  plan_type VARCHAR(30),
  billing_period VARCHAR(20),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_subscription_products_store_platform
    CHECK (store_platform IN ('apple', 'google', 'web')),
  CONSTRAINT chk_subscription_products_product_type
    CHECK (product_type IN ('subscription', 'consumable', 'non_consumable'))
);

CREATE INDEX IF NOT EXISTS idx_subscription_products_is_active
  ON subscription_products(is_active);

-- =========================================
-- entitlements_master
-- =========================================
CREATE TABLE IF NOT EXISTS entitlements_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entitlement_code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  entitlement_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_entitlements_master_type
    CHECK (entitlement_type IN ('boolean', 'quota', 'time_limited'))
);

-- =========================================
-- product_entitlements
-- =========================================
CREATE TABLE IF NOT EXISTS product_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES subscription_products(id) ON DELETE CASCADE,
  entitlement_id UUID NOT NULL REFERENCES entitlements_master(id) ON DELETE CASCADE,
  usage_limit INT NULL,
  valid_days INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, entitlement_id)
);

CREATE INDEX IF NOT EXISTS idx_product_entitlements_product_id
  ON product_entitlements(product_id);

-- =========================================
-- user_subscriptions
-- =========================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_code VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL,
  started_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NULL,
  auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
  original_transaction_id VARCHAR(255),
  latest_transaction_id VARCHAR(255),
  store_platform VARCHAR(20) NOT NULL,
  raw_receipt_json JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_user_subscriptions_status
    CHECK (status IN ('active', 'expired', 'canceled', 'grace_period', 'refunded')),
  CONSTRAINT chk_user_subscriptions_store_platform
    CHECK (store_platform IN ('apple', 'google', 'web'))
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id
  ON user_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status
  ON user_subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires_at
  ON user_subscriptions(expires_at);

-- =========================================
-- user_entitlements
-- =========================================
CREATE TABLE IF NOT EXISTS user_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entitlement_code VARCHAR(100) NOT NULL,
  source_type VARCHAR(30) NOT NULL,
  source_ref_id UUID NULL,
  valid_from TIMESTAMP NOT NULL DEFAULT NOW(),
  valid_to TIMESTAMP NULL,
  usage_limit INT NULL,
  used_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_user_entitlements_source_type
    CHECK (source_type IN ('subscription', 'purchase', 'campaign', 'manual')),
  UNIQUE(user_id, entitlement_code, source_type, source_ref_id)
);

CREATE INDEX IF NOT EXISTS idx_user_entitlements_user_id
  ON user_entitlements(user_id);

CREATE INDEX IF NOT EXISTS idx_user_entitlements_entitlement_code
  ON user_entitlements(entitlement_code);

CREATE INDEX IF NOT EXISTS idx_user_entitlements_valid_to
  ON user_entitlements(valid_to);

-- =========================================
-- purchase_transactions
-- =========================================
CREATE TABLE IF NOT EXISTS purchase_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_code VARCHAR(100) NOT NULL,
  transaction_type VARCHAR(30) NOT NULL,
  amount NUMERIC(12,2) NULL,
  currency VARCHAR(10) NULL,
  status VARCHAR(30) NOT NULL,
  store_platform VARCHAR(20) NOT NULL,
  external_transaction_id VARCHAR(255),
  original_transaction_id VARCHAR(255),
  purchased_at TIMESTAMP NOT NULL,
  raw_payload_json JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_purchase_transactions_type
    CHECK (transaction_type IN ('subscription_start', 'renewal', 'consumable', 'refund', 'cancel')),
  CONSTRAINT chk_purchase_transactions_status
    CHECK (status IN ('pending', 'verified', 'failed', 'refunded')),
  CONSTRAINT chk_purchase_transactions_store_platform
    CHECK (store_platform IN ('apple', 'google', 'web'))
);

CREATE INDEX IF NOT EXISTS idx_purchase_transactions_user_id
  ON purchase_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_purchase_transactions_product_code
  ON purchase_transactions(product_code);

CREATE INDEX IF NOT EXISTS idx_purchase_transactions_external_transaction_id
  ON purchase_transactions(external_transaction_id);

-- =========================================
-- boost_usages
-- =========================================
CREATE TABLE IF NOT EXISTS boost_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  boost_type VARCHAR(30) NOT NULL,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_boost_usages_status
    CHECK (status IN ('active', 'completed', 'canceled'))
);

CREATE INDEX IF NOT EXISTS idx_boost_usages_user_id
  ON boost_usages(user_id);

-- =========================================
-- super_action_usages
-- =========================================
CREATE TABLE IF NOT EXISTS super_action_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  used_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_super_action_usages_user_id
  ON super_action_usages(user_id);

-- =========================================
-- updated_at triggers
-- =========================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_subscription_products_updated_at') THEN
      CREATE TRIGGER trg_subscription_products_updated_at
      BEFORE UPDATE ON subscription_products
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_entitlements_master_updated_at') THEN
      CREATE TRIGGER trg_entitlements_master_updated_at
      BEFORE UPDATE ON entitlements_master
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_user_subscriptions_updated_at') THEN
      CREATE TRIGGER trg_user_subscriptions_updated_at
      BEFORE UPDATE ON user_subscriptions
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_user_entitlements_updated_at') THEN
      CREATE TRIGGER trg_user_entitlements_updated_at
      BEFORE UPDATE ON user_entitlements
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_purchase_transactions_updated_at') THEN
      CREATE TRIGGER trg_purchase_transactions_updated_at
      BEFORE UPDATE ON purchase_transactions
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
  END IF;
END $$;

-- =========================================
-- seed: products
-- =========================================
INSERT INTO subscription_products
(product_code, store_platform, store_product_id, product_type, plan_type, billing_period, title, description)
VALUES
('standard_monthly', 'apple', 'com.example.standard.monthly', 'subscription', 'standard', 'monthly', 'Companion Standard Monthly', 'AI伴走を本格的に使える月額プラン'),
('standard_yearly', 'apple', 'com.example.standard.yearly', 'subscription', 'standard', 'yearly', 'Companion Standard Yearly', 'AI伴走を本格的に使える年額プラン'),
('premium_monthly', 'apple', 'com.example.premium.monthly', 'subscription', 'premium', 'monthly', 'Companion Premium Monthly', '自然な接点の成功率を最大化する月額プラン'),
('premium_yearly', 'apple', 'com.example.premium.yearly', 'subscription', 'premium', 'yearly', 'Companion Premium Yearly', '自然な接点の成功率を最大化する年額プラン'),
('boost_pack_1', 'apple', 'com.example.boost.1', 'consumable', 'addon', NULL, 'Boost 1回', '一定時間、表示を強化します'),
('super_action_pack_3', 'apple', 'com.example.superaction.3', 'consumable', 'addon', NULL, 'Super Action 3回', '特別な接点アクションを利用できます'),
('travel_pass_7d', 'apple', 'com.example.travel.7d', 'non_consumable', 'addon', NULL, 'Travel Pass 7日', '一定期間、他地域探索を解放します')
ON CONFLICT (product_code) DO NOTHING;

-- =========================================
-- seed: entitlements
-- =========================================
INSERT INTO entitlements_master (entitlement_code, name, description, entitlement_type)
VALUES
('basic_ai_summary', 'Basic AI Summary', 'AIサマリーの基本利用', 'boolean'),
('basic_today_step', 'Basic Today Step', 'Todayの基本利用', 'boolean'),
('basic_recommendations', 'Basic Recommendations', '基本おすすめ表示', 'boolean'),
('basic_chat_access', 'Basic Chat Access', '基本チャット利用', 'boolean'),
('unlimited_ai_suggestions', 'Unlimited AI Suggestions', 'AI会話提案を無制限化', 'boolean'),
('weekly_plan_regeneration', 'Weekly Plan Regeneration', '伴走プランの再生成', 'boolean'),
('relationship_coach_standard', 'Relationship Coach Standard', '標準関係コーチ', 'boolean'),
('advanced_filters', 'Advanced Filters', '高度フィルタ', 'boolean'),
('event_priority_access', 'Event Priority Access', 'イベント優先参加', 'boolean'),
('expanded_co_actions', 'Expanded Co Actions', '共同行動提案量拡張', 'boolean'),
('ad_free', 'Ad Free', '広告非表示', 'boolean'),
('see_all_likes', 'See All Likes', 'Likes You 全件閲覧', 'boolean'),
('priority_like_delivery', 'Priority Like Delivery', '優先Like配送', 'boolean'),
('priority_visibility', 'Priority Visibility', '優先表示', 'boolean'),
('verified_only_filter', 'Verified Only Filter', '認証済みのみフィルタ', 'boolean'),
('high_intent_filter', 'High Intent Filter', '高意図フィルタ', 'boolean'),
('incognito_mode', 'Incognito Mode', '非公開閲覧', 'boolean'),
('travel_mode', 'Travel Mode', 'Travel探索', 'boolean'),
('chat_translate', 'Chat Translate', 'チャット翻訳', 'boolean'),
('relationship_coach_pro', 'Relationship Coach Pro', '高度関係コーチ', 'boolean'),
('premium_co_actions', 'Premium Co Actions', 'Premium共同行動', 'boolean'),
('ai_deep_analysis', 'AI Deep Analysis', 'AI特別分析', 'quota'),
('boost_credit', 'Boost Credit', 'Boost利用権', 'quota'),
('super_action_credit', 'Super Action Credit', 'Super Action利用権', 'quota'),
('travel_pass', 'Travel Pass', 'Travel Pass利用権', 'time_limited'),
('event_priority_pass', 'Event Priority Pass', 'イベント優先パス', 'quota'),
('ai_analysis_credit', 'AI Analysis Credit', 'AI分析1回券', 'quota')
ON CONFLICT (entitlement_code) DO NOTHING;

-- =========================================
-- seed: product_entitlements
-- =========================================
INSERT INTO product_entitlements (product_id, entitlement_id, usage_limit, valid_days)
SELECT p.id, e.id, NULL, NULL
FROM subscription_products p
JOIN entitlements_master e
  ON e.entitlement_code IN (
    'unlimited_ai_suggestions',
    'weekly_plan_regeneration',
    'relationship_coach_standard',
    'advanced_filters',
    'event_priority_access',
    'expanded_co_actions',
    'ad_free'
  )
WHERE p.product_code IN ('standard_monthly', 'standard_yearly')
ON CONFLICT DO NOTHING;

INSERT INTO product_entitlements (product_id, entitlement_id, usage_limit, valid_days)
SELECT p.id, e.id, NULL, NULL
FROM subscription_products p
JOIN entitlements_master e
  ON e.entitlement_code IN (
    'unlimited_ai_suggestions',
    'weekly_plan_regeneration',
    'relationship_coach_standard',
    'advanced_filters',
    'event_priority_access',
    'expanded_co_actions',
    'ad_free',
    'see_all_likes',
    'priority_like_delivery',
    'priority_visibility',
    'verified_only_filter',
    'high_intent_filter',
    'incognito_mode',
    'travel_mode',
    'chat_translate',
    'relationship_coach_pro',
    'premium_co_actions'
  )
WHERE p.product_code IN ('premium_monthly', 'premium_yearly')
ON CONFLICT DO NOTHING;

INSERT INTO product_entitlements (product_id, entitlement_id, usage_limit, valid_days)
SELECT p.id, e.id, 1, NULL
FROM subscription_products p
JOIN entitlements_master e
  ON e.entitlement_code = 'boost_credit'
WHERE p.product_code = 'boost_pack_1'
ON CONFLICT DO NOTHING;

INSERT INTO product_entitlements (product_id, entitlement_id, usage_limit, valid_days)
SELECT p.id, e.id, 3, NULL
FROM subscription_products p
JOIN entitlements_master e
  ON e.entitlement_code = 'super_action_credit'
WHERE p.product_code = 'super_action_pack_3'
ON CONFLICT DO NOTHING;

INSERT INTO product_entitlements (product_id, entitlement_id, usage_limit, valid_days)
SELECT p.id, e.id, NULL, 7
FROM subscription_products p
JOIN entitlements_master e
  ON e.entitlement_code = 'travel_pass'
WHERE p.product_code = 'travel_pass_7d'
ON CONFLICT DO NOTHING;
