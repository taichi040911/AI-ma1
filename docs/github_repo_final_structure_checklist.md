# GitHub に置くための最終フォルダ構成チェックリスト

## 目的
このチェックリストは、これまで作成した成果物を **GitHub リポジトリに正しく配置し、Codex が迷わず読める状態** にするための最終確認用です。

---

# 1. ルート直下チェック

## 必須
- [ ] `AGENTS.md` がルートにある
- [ ] `README.md` がルートにある
- [ ] `package.json` がルートにある
- [ ] `tsconfig.base.json` がルートにある
- [ ] `eslint.config.mjs` がルートにある
- [ ] `prettier.config.cjs` がルートにある
- [ ] `.prettierignore` がルートにある
- [ ] `vitest.config.ts` がルートにある

## 推奨
- [ ] `.gitignore` がある
- [ ] `.env.example` がある
- [ ] `pnpm-lock.yaml` または使用する package manager の lockfile がある
- [ ] `.github/workflows/` に CI 設定がある

---

# 2. docs フォルダチェック

## 必須仕様書
- [ ] `docs/integrated_openapi_final.yaml`
- [ ] `docs/billing_openapi.yaml`
- [ ] `docs/final_screen_list_with_billing.md`
- [ ] `docs/screen_api_mapping.xlsx`
- [ ] `docs/paywall_ui_copy_final.md`
- [ ] `docs/paywall_wireframe_guide.md`

## 実行運用資料
- [ ] `docs/codex_operations_manual.md`
- [ ] `docs/codex_prompt_templates_50.md`
- [ ] `docs/codex_execution_pack_first10.md`
- [ ] `docs/codex_execution_pack_next10.md`
- [ ] `docs/review_checklist_first10.md`
- [ ] `docs/git_rules_first10.md`
- [ ] `docs/day1_day5_execution_master_guide.md`
- [ ] `docs/day1_day5_execution_schedule.md`

## 開発管理資料
- [ ] `docs/tickets_new_experience_regenerated.csv`
- [ ] `docs/tickets_by_sprint_ordered.xlsx`
- [ ] `docs/test_cases_new_experience.csv`
- [ ] `docs/test_execution_new_experience.xlsx`

## 課金・設計資料
- [ ] `docs/billing_entitlement_migration.sql`
- [ ] `docs/billing_wireframe_guide.md`
- [ ] `docs/paywall_ui_copy_final.md`
- [ ] `docs/package_scripts_guide.md`
- [ ] `docs/apps_package_templates_guide.md`
- [ ] `docs/tooling_config_templates_guide.md`

---

# 3. scripts フォルダチェック

## 必須
- [ ] `scripts/setup.sh`
- [ ] `scripts/lint.sh`
- [ ] `scripts/test.sh`

## 推奨
- [ ] `scripts/seed.sh`
- [ ] `scripts/scaffold_app_directories.sh` または同等の初期構成スクリプト

## 実行権限
- [ ] `setup.sh` に実行権限がある
- [ ] `lint.sh` に実行権限がある
- [ ] `test.sh` に実行権限がある

---

# 4. apps フォルダチェック

## 4-1. apps/mobile
- [ ] `apps/mobile/package.json`
- [ ] `apps/mobile/tsconfig.json`
- [ ] `apps/mobile/src/` がある
- [ ] `apps/mobile/src/features/auth/`
- [ ] `apps/mobile/src/features/onboarding/`
- [ ] `apps/mobile/src/features/ai-companion/`
- [ ] `apps/mobile/src/features/today/`
- [ ] `apps/mobile/src/features/action/`
- [ ] `apps/mobile/src/features/connections/`
- [ ] `apps/mobile/src/features/messages/`
- [ ] `apps/mobile/src/features/me/`
- [ ] `apps/mobile/src/features/billing/`
- [ ] `apps/mobile/src/components/`
- [ ] `apps/mobile/src/lib/`
- [ ] `apps/mobile/src/hooks/`
- [ ] `apps/mobile/src/state/`
- [ ] `apps/mobile/src/types/`

## 4-2. apps/admin
- [ ] `apps/admin/package.json`
- [ ] `apps/admin/tsconfig.json`
- [ ] `apps/admin/src/` がある
- [ ] `apps/admin/src/features/auth/`
- [ ] `apps/admin/src/features/users/`
- [ ] `apps/admin/src/features/verifications/`
- [ ] `apps/admin/src/features/reports/`
- [ ] `apps/admin/src/features/kpi/`
- [ ] `apps/admin/src/features/billing-admin/`
- [ ] `apps/admin/src/components/`
- [ ] `apps/admin/src/lib/`
- [ ] `apps/admin/src/hooks/`
- [ ] `apps/admin/src/types/`

## 4-3. apps/api
- [ ] `apps/api/package.json`
- [ ] `apps/api/tsconfig.json`
- [ ] `apps/api/src/index.ts`
- [ ] `apps/api/src/routes/`
- [ ] `apps/api/src/controllers/`
- [ ] `apps/api/src/services/`
- [ ] `apps/api/src/repositories/`
- [ ] `apps/api/src/schemas/`
- [ ] `apps/api/src/middlewares/`
- [ ] `apps/api/src/lib/`
- [ ] `apps/api/src/types/`
- [ ] `apps/api/src/jobs/`
- [ ] `apps/api/src/tests/`

---

# 5. starter files チェック

## mobile
- [ ] `apps/mobile/src/features/auth/api.ts`
- [ ] `apps/mobile/src/features/auth/hooks.ts`
- [ ] `apps/mobile/src/features/today/TodayScreen.tsx`
- [ ] `apps/mobile/src/features/today/api.ts`
- [ ] `apps/mobile/src/features/action/ActionScreen.tsx`
- [ ] `apps/mobile/src/features/connections/ConnectionsScreen.tsx`
- [ ] `apps/mobile/src/features/messages/MessagesScreen.tsx`
- [ ] `apps/mobile/src/features/me/MeScreen.tsx`
- [ ] `apps/mobile/src/features/billing/PaywallScreen.tsx`
- [ ] `apps/mobile/src/lib/apiClient.ts`

## admin
- [ ] `apps/admin/src/features/auth/LoginPage.tsx`
- [ ] `apps/admin/src/features/users/UsersPage.tsx`
- [ ] `apps/admin/src/features/verifications/VerificationReviewPage.tsx`
- [ ] `apps/admin/src/features/reports/ReportsPage.tsx`
- [ ] `apps/admin/src/features/kpi/KpiDashboardPage.tsx`

## api
- [ ] `apps/api/src/routes/auth/index.ts`
- [ ] `apps/api/src/routes/me/index.ts`
- [ ] `apps/api/src/routes/ai-life-navigation/index.ts`
- [ ] `apps/api/src/routes/weekly-plan/index.ts`
- [ ] `apps/api/src/routes/co-actions/index.ts`
- [ ] `apps/api/src/routes/recommendations/index.ts`
- [ ] `apps/api/src/routes/relationships/index.ts`
- [ ] `apps/api/src/routes/chat/index.ts`
- [ ] `apps/api/src/routes/events/index.ts`
- [ ] `apps/api/src/routes/billing/index.ts`
- [ ] `apps/api/src/routes/entitlements/index.ts`
- [ ] `apps/api/src/controllers/healthController.ts`
- [ ] `apps/api/src/services/aiLifeNavigationService.ts`
- [ ] `apps/api/src/services/weeklyPlanService.ts`
- [ ] `apps/api/src/services/billingService.ts`
- [ ] `apps/api/src/repositories/userRepository.ts`
- [ ] `apps/api/src/repositories/relationshipRepository.ts`
- [ ] `apps/api/src/schemas/common.ts`
- [ ] `apps/api/src/schemas/billing.ts`
- [ ] `apps/api/src/middlewares/authMiddleware.ts`
- [ ] `apps/api/src/lib/logger.ts`
- [ ] `apps/api/src/tests/health.test.ts`

---

# 6. db フォルダチェック

## 必須
- [ ] `db/migrations/` がある
- [ ] 課金 migration を置く場所がある
- [ ] relationship 系 migration を置く場所がある

## 推奨
- [ ] `db/schema.sql` または使用ORMの schema ファイルがある
- [ ] migration 命名規則が README または docs に書かれている

---

# 7. Codex 連携前の最終確認

## 読みやすさ
- [ ] `AGENTS.md` に Source of Truth が書いてある
- [ ] `README.md` に最初に読むべきファイルが書いてある
- [ ] docs のファイル名が分かりやすい
- [ ] 不要な重複ファイルが repo に混ざっていない

## 実行性
- [ ] `pnpm setup` または `bash ./scripts/setup.sh` が実行できる
- [ ] `pnpm lint` が実行できる
- [ ] `pnpm test` が実行できる
- [ ] `pnpm check` が実行できる

## GitHub
- [ ] main ブランチが最新
- [ ] README / AGENTS / docs / scripts / apps が push 済み
- [ ] 大きすぎるバイナリを不要に入れていない
- [ ] `.env` の実値を commit していない

---

# 8. 推奨フォルダ構成（最終形）

```text
/
  AGENTS.md
  README.md
  package.json
  tsconfig.base.json
  eslint.config.mjs
  prettier.config.cjs
  .prettierignore
  vitest.config.ts
  /docs
  /scripts
  /apps
    /mobile
    /admin
    /api
  /db
    /migrations
  /tests
  /packages   # 必要なら
  /.github
    /workflows
```

---

# 9. 最後に見ること
- [ ] Codex に渡すための正本が repo 内に揃っている
- [ ] 実行バンドルをそのままコピペできる
- [ ] 1チケット = 1ブランチ で進められる
- [ ] 次に Day1 実行バンドルから着手できる
