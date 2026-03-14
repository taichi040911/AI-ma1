# Day5 実行バンドル

## 今日やること
1. `TODAY-001 今週の伴走プランAPI`
2. `TODAY-003 Todayホーム画面`

## 先に実行するコマンド
```bash
git checkout main
git pull origin main
git checkout -b feature/today-001-weekly-plan-api
```

## Codex への依頼 1本目
```text
現在のブランチは feature/today-001-weekly-plan-api です。
対象チケットは TODAY-001 です。

参照:
- AGENTS.md
- docs/integrated_openapi_final.yaml

対象:
- GET /ai/weekly-plan

やってほしいこと:
1. 今週の伴走プランAPIを実装
2. `weekly_theme` を返す
3. `steps` を返す
4. `ai_comment` を返す
5. `suggested_mode` を返す
6. steps の順序情報を持たせる
7. テストを追加
8. OpenAPIとの差異がないか確認する

最後に、
1. 変更ファイル一覧
2. 実施したテスト
3. 置いた仮定
4. 次のチケットへの影響
をまとめてください。
```

## 1本目が終わったら
```bash
pnpm lint
pnpm test
git add .
git commit -m "feat(today-001): implement weekly plan api"
git push -u origin feature/today-001-weekly-plan-api
```

## 次のブランチ
```bash
git checkout main
git pull origin main
git checkout -b feature/today-003-today-home-screen
```

## Codex への依頼 2本目
```text
現在のブランチは feature/today-003-today-home-screen です。
対象チケットは TODAY-003 です。

参照:
- AGENTS.md
- docs/final_screen_list_with_billing.md
- docs/screen_api_mapping.xlsx
- docs/integrated_openapi_final.yaml

対象:
- Screen Name: Today ホーム
- Primary APIs: GET /ai/today-step, GET /ai/weekly-plan
- Secondary API: GET /me/current-state

やってほしいこと:
1. 今日の一歩カードを実装
2. 今週の伴走プランを表示
3. AIからの気づきを表示
4. `GET /ai/today-step` と `GET /ai/weekly-plan` を接続
5. `GET /me/current-state` を補助表示に使う
6. loading / empty / error state を追加
7. 1タップで次アクションに進める導線を入れる
8. テストを追加

最後に、
1. 変更ファイル一覧
2. 実施したテスト
3. 置いた仮定
4. 次のチケットへの影響
をまとめてください。
```

## 2本目が終わったら
```bash
pnpm lint
pnpm test
git add .
git commit -m "feat(today-003): implement today home screen"
git push -u origin feature/today-003-today-home-screen
```

## Day5 完了判定
- `GET /ai/weekly-plan` が動く
- `weekly_theme / steps / ai_comment / suggested_mode` が返る
- Todayホーム画面が動く
- 今日の一歩が表示される
- 今週の伴走プランが表示される
- AIからの気づきが表示される
- loading / empty / error state がある
- lint / test が通る

## Day5 終了時チェック
- Day1〜Day5 の一連導線がつながっている
- 新規登録 → OTP → 基本プロフィール → AIライフナビ → Today が成立している
- 最初の価値体験として「何をすればよいか」が分かる
- 11本目以降のチケットに進める土台ができている

## Day5 完了後の最終確認
```bash
pnpm lint
pnpm test
```

### 確認すること
- OpenAPI との差分がない
- review_checklist_first10.md の最終レビューを満たす
- git_rules_first10.md に沿って 10本がチケット単位で分かれている
- day1_day5_execution_schedule.md の完了条件を満たしている
