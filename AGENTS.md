# AGENTS.md

## Product
AI伴走型の総合マッチングアプリを開発する。
恋愛だけでなく、趣味、スポーツ、学び、仕事の接点も対象にする。

## Source of truth
- docs/integrated_openapi_final.yaml
- docs/final_screen_list_with_billing.md
- docs/screen_api_mapping.xlsx
- docs/billing_openapi.yaml

## Rules
- 1タスクにつき1機能だけ実装する
- DB変更時は migration を追加する
- API変更時は OpenAPI を更新する
- UI変更時は対象画面名を PR に書く
- 変更後に lint と test を実行する
- 不明点は仮定を明記する
- 破壊的変更は禁止
