# AI Companion Matching App

AIと一緒に、自然な接点をつくる総合マッチングアプリです。

## まず読むファイル
1. AGENTS.md
2. docs/day1_day5_execution_master_guide.md
3. docs/day1_execution_bundle.md
4. docs/review_checklist_first10.md
5. docs/git_rules_first10.md

## 開発の進め方
- 1タスク = 1画面 or 1API or 1DB変更
- UI変更時は画面名を明記
- API変更時は OpenAPI を更新
- DB変更時は migration を追加
- 変更後は lint / test を実行
