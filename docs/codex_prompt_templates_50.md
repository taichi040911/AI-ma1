# そのままコピペできる Codex依頼テンプレ50本

## 使い方
- 1回につき1本だけ使う
- `参照:` のファイル名は実際のリポジトリ構成に合わせて修正する
- `最後に` の指示は消さずに使う

---

## 1. リポジトリ初期設定

### 1
```text
目的:
このリポジトリに AGENTS.md を追加したい

参照:
- docs/integrated_openapi_final.yaml
- docs/final_screen_list_with_billing.md

やってほしいこと:
1. この案件向けの AGENTS.md を作成
2. Source of truth と実装ルールを明記
3. 変更後に内容を要約
最後に、追加したファイル全文を表示してください
```

### 2
```text
目的:
scripts/setup.sh, scripts/test.sh, scripts/lint.sh の雛形を作りたい

やってほしいこと:
1. scripts ディレクトリを作成
2. setup/test/lint スクリプトを追加
3. README に実行方法を追記
最後に、各スクリプトの用途を要約してください
```

### 3
```text
目的:
OpenAPI から API クライアント生成の土台を整えたい

参照:
- docs/integrated_openapi_final.yaml

やってほしいこと:
1. OpenAPI client 生成の方針を決める
2. 必要な設定ファイルを追加
3. 再生成手順を README に追記
最後に、実行コマンドを教えてください
```

### 4
```text
目的:
DB migration 基盤を整えたい

やってほしいこと:
1. migration ディレクトリ構成を追加
2. ローカル実行手順を README に追記
3. 初期 migration 例を作成
最後に、次に作るべき migration の命名規則を提案してください
```

### 5
```text
目的:
CI で lint と test を回したい

やってほしいこと:
1. GitHub Actions などのCI設定を追加
2. lint と test を自動実行
3. 失敗時にわかりやすいログが出るようにする
最後に、CI の実行条件を要約してください
```

---

## 2. 認証

### 6
```text
目的:
新規登録APIを実装したい

参照:
- docs/integrated_openapi_final.yaml

対象:
- POST /auth/register

やってほしいこと:
1. API を実装
2. バリデーションを追加
3. テストを追加
4. OpenAPIとの差異がないか確認
最後に、リクエスト例とレスポンス例を示してください
```

### 7
```text
目的:
ログインAPIを実装したい

対象:
- POST /auth/login

やってほしいこと:
1. ログイン処理を実装
2. JWT 発行処理を追加
3. テストを追加
最後に、失敗時のエラーケースを一覧化してください
```

### 8
```text
目的:
OTP送信APIを実装したい

対象:
- POST /auth/send-otp

やってほしいこと:
1. OTP 送信処理を実装
2. レート制限を追加
3. テストを追加
最後に、再送時の扱いを説明してください
```

### 9
```text
目的:
OTP検証APIを実装したい

対象:
- POST /auth/verify-otp

やってほしいこと:
1. コード照合処理を実装
2. 成功/失敗/期限切れを返せるようにする
3. テストを追加
最後に、検証ロジックの前提を要約してください
```

### 10
```text
目的:
Login / Register 画面を実装したい

参照:
- docs/final_screen_list_with_billing.md
- docs/screen_api_mapping.xlsx

対象:
- Screen Name: Login / Register

やってほしいこと:
1. 画面UIを実装
2. register/login API と接続
3. loading / error state を追加
4. 画面テストを追加
最後に、確認観点を5個書いてください
```

---

## 3. オンボーディング

### 11
```text
目的:
Basic Profile 画面を実装したい

対象:
- Screen Name: Basic Profile
- API: PUT /me/profile

やってほしいこと:
1. UIを実装
2. API 接続
3. バリデーション追加
4. テスト追加
最後に、必須入力項目を一覧で示してください
```

### 12
```text
目的:
Purpose Select 画面を実装したい

対象:
- Screen Name: Purpose Select
- API: PUT /me/purposes

やってほしいこと:
1. 複数選択UIを実装
2. API接続
3. 保存後遷移を実装
最後に、選択状態の扱いを説明してください
```

### 13
```text
目的:
Interest Select 画面を実装したい

対象:
- Screen Name: Interest Select
- API: PUT /me/interests

やってほしいこと:
1. タグ検索UIを実装
2. 複数選択状態を保持
3. API接続
最後に、empty state と no-result state を作ってください
```

### 14
```text
目的:
Availability Select 画面を実装したい

対象:
- Screen Name: Availability Select
- API: PUT /me/availability

やってほしいこと:
1. テンプレ選択UI
2. 詳細時間入力UI
3. API接続
4. テスト追加
最後に、境界値テストを追加してください
```

### 15
```text
目的:
Verification 画面を実装したい

対象:
- Screen Name: Verification
- APIs: POST /verifications, GET /verifications/status

やってほしいこと:
1. 書類提出UIを実装
2. ステータス表示を実装
3. エラー時表示を追加
最後に、承認/差し戻し/審査中の状態差分を説明してください
```

---

## 4. AIライフナビ / Today

### 16
```text
目的:
AIライフナビ面談の開始と回答処理を実装したい

対象:
- POST /ai/life-navigation/start
- POST /ai/life-navigation/answer

やってほしいこと:
1. セッション開始API
2. 回答保存API
3. テスト追加
最後に、session_id の扱い方を説明してください
```

### 17
```text
目的:
AIライフナビ面談画面を実装したい

対象:
- Screen Name: AIライフナビ面談

やってほしいこと:
1. チャット形式UIを実装
2. start/answer API接続
3. progress表示
4. 候補チップ表示
最後に、画面遷移を要約してください
```

### 18
```text
目的:
AIサマリー画面を実装したい

対象:
- Screen Name: AIサマリー
- API: GET /ai/life-navigation/result

やってほしいこと:
1. 結果表示UI
2. 今の状態/向いている接点/今週の方針を表示
3. テスト追加
最後に、表示項目を箇条書きで整理してください
```

### 19
```text
目的:
今週の伴走プランAPIを実装したい

対象:
- GET /ai/weekly-plan
- GET /ai/today-step

やってほしいこと:
1. 伴走プラン取得処理
2. 今日の一歩取得処理
3. テスト追加
最後に、返却項目を表にしてください
```

### 20
```text
目的:
Today ホーム画面を実装したい

対象:
- Screen Name: Today ホーム
- APIs: GET /ai/today-step, GET /ai/weekly-plan, GET /me/current-state

やってほしいこと:
1. 今日の一歩カード
2. 今週の伴走プラン
3. AIからの気づき
4. loading / empty / error state
最後に、ユーザーに見える状態パターンを整理してください
```

---

## 5. 共同行動 / Discovery

### 21
```text
目的:
共同行動一覧APIを実装したい

対象:
- GET /co-actions

やってほしいこと:
1. 一覧取得
2. filter対応
3. テスト追加
最後に、difficulty / mood / purpose の扱いを要約してください
```

### 22
```text
目的:
共同行動詳細APIを実装したい

対象:
- GET /co-actions/{id}

やってほしいこと:
1. why_for_you を含む詳細返却
2. matching_users/matching_events を返す
3. テスト追加
最後に、関連データの取得方針を説明してください
```

### 23
```text
目的:
Action 一覧画面を実装したい

対象:
- Screen Name: Action 一覧
- API: GET /co-actions

やってほしいこと:
1. おすすめ共同行動一覧
2. 気軽 / 少人数 / イベント導線
3. テスト追加
最後に、カードごとの表示項目を整理してください
```

### 24
```text
目的:
共同行動詳細画面を実装したい

対象:
- Screen Name: 共同行動詳細
- API: GET /co-actions/{id}

やってほしいこと:
1. 詳細UI
2. 相手一覧 / イベント一覧への導線
3. テスト追加
最後に、ユーザーフローを3行で要約してください
```

### 25
```text
目的:
おすすめユーザー一覧APIを実装・更新したい

対象:
- GET /recommendations/users

やってほしいこと:
1. recommended_entry_mode を返す
2. next_best_action を返す
3. relationship_style_hint を返す
4. テスト追加
最後に、レスポンスの差分を示してください
```

### 26
```text
目的:
おすすめユーザー一覧画面を実装したい

対象:
- Screen Name: おすすめユーザー一覧
- API: GET /recommendations/users

やってほしいこと:
1. 一覧UI
2. 相性ラベル表示
3. empty state追加
最後に、フィルタ条件を整理してください
```

### 27
```text
目的:
ユーザー詳細画面を実装したい

対象:
- Screen Name: ユーザー詳細
- API: GET /recommendations/users/{id}

やってほしいこと:
1. 詳細画面UI
2. co_actions 表示
3. like 導線追加
4. テスト追加
最後に、次アクション導線を説明してください
```

---

## 6. 関係ステージ / 共同ログ

### 28
```text
目的:
relationship_states の migration を追加したい

参照:
- docs/billing_entitlement_migration.sql ではなく既存 relationship 差分設計
- docs/integrated_openapi_final.yaml

やってほしいこと:
1. migration追加
2. model/repository追加
3. テスト追加
最後に、追加テーブルの責務を説明してください
```

### 29
```text
目的:
関係一覧APIを実装したい

対象:
- GET /relationships

やってほしいこと:
1. recommended/growing/recent を返せるようにする
2. relationship stage を返す
3. テスト追加
最後に、一覧の並び順ルールを説明してください
```

### 30
```text
目的:
関係詳細APIを実装したい

対象:
- GET /relationships/{id}

やってほしいこと:
1. current_stage
2. natural_next_actions
3. not_recommended_actions
4. ai_guidance
を返す
最後に、レスポンス例を出してください
```

### 31
```text
目的:
AI共同ログAPIを実装したい

対象:
- GET /relationships/{id}/shared-log

やってほしいこと:
1. first_topics
2. shared_topics
3. shared_actions
4. next_topic_hints
を返す
最後に、ログ集計ロジックの前提を説明してください
```

### 32
```text
目的:
Connections 一覧画面を実装したい

対象:
- Screen Name: Connections 一覧
- API: GET /relationships

やってほしいこと:
1. recommended/growing/recent タブ
2. 一覧表示
3. テスト追加
最後に、各タブの意味を説明してください
```

### 33
```text
目的:
関係ステージ詳細画面を実装したい

対象:
- Screen Name: 関係ステージ詳細
- API: GET /relationships/{id}

やってほしいこと:
1. current_stage 表示
2. 今自然なこと
3. 急がなくてよいこと
4. 次の一歩
最後に、画面構成を箇条書きで示してください
```

### 34
```text
目的:
AI共同ログ画面を実装したい

対象:
- Screen Name: AI共同ログ
- API: GET /relationships/{id}/shared-log

やってほしいこと:
1. 接点履歴
2. 共通テーマ
3. 次に話すヒント
を表示
最後に、タイムラインUIの前提を説明してください
```

---

## 7. マッチ / チャット / 安全

### 35
```text
目的:
いいね送信APIを実装したい

対象:
- POST /likes

やってほしいこと:
1. like 作成
2. 相互なら match 作成
3. テスト追加
最後に、matched 時の返却形式を示してください
```

### 36
```text
目的:
マッチ一覧APIを実装したい

対象:
- GET /matches

やってほしいこと:
1. unread_count
2. relationship_stage
3. next_best_action
4. ai_note
を返す
最後に、レスポンス例を出してください
```

### 37
```text
目的:
チャットメッセージ一覧と送信APIを実装したい

対象:
- GET /chat/rooms/{id}/messages
- POST /chat/rooms/{id}/messages

やってほしいこと:
1. 一覧取得
2. 送信処理
3. moderation_status対応
4. テスト追加
最後に、不適切表現時の挙動を説明してください
```

### 38
```text
目的:
AI会話提案APIを実装したい

対象:
- POST /chat/rooms/{id}/ai-suggestions

やってほしいこと:
1. suggestion を3件以上返す
2. テスト追加
最後に、suggestion 生成条件を要約してください
```

### 39
```text
目的:
関係コーチ提案APIを実装したい

対象:
- POST /chat/rooms/{id}/relationship-guidance

やってほしいこと:
1. relationship_stage
2. best_approach
3. suggested_topics
4. caution_points
を返す
最後に、入力に使うコンテキストを説明してください
```

### 40
```text
目的:
チャットルーム画面を実装したい

対象:
- Screen Name: チャットルーム

やってほしいこと:
1. メッセージ表示
2. 送信
3. AI話題提案導線
4. 関係コーチ導線
5. 通報 / ブロック導線
最後に、ヘッダーに表示する要素を整理してください
```

### 41
```text
目的:
会う前チェックAPIを実装したい

対象:
- POST /relationships/{id}/pre-meeting-check

やってほしいこと:
1. readiness_score 算出
2. safety_flags
3. suggested_adjustments
を返す
最後に、危険寄り条件のルールを説明してください
```

### 42
```text
目的:
会う前チェック画面を実装したい

対象:
- Screen Name: 会う前チェック

やってほしいこと:
1. 入力UI
2. API接続
3. 結果表示
4. テスト追加
最後に、low readiness 時の見せ方を説明してください
```

### 43
```text
目的:
接点後振り返りAPIを実装したい

対象:
- POST /relationships/{id}/reflection

やってほしいこと:
1. 振り返り保存
2. reflection_summary 生成
3. next_best_action 返却
4. テスト追加
最後に、relationship_stage_update の条件を説明してください
```

### 44
```text
目的:
会った後振り返り画面を実装したい

対象:
- Screen Name: 会った後振り返り

やってほしいこと:
1. 入力UI
2. API接続
3. 結果画面への遷移
最後に、質問項目を一覧で示してください
```

---

## 8. イベント / 通報 / 通知

### 45
```text
目的:
イベント一覧と詳細APIを実装したい

対象:
- GET /events
- GET /events/{id}

やってほしいこと:
1. 一覧返却
2. 詳細返却
3. テスト追加
最後に、entry_style の扱いを説明してください
```

### 46
```text
目的:
イベント参加申請APIを実装したい

対象:
- POST /events/{id}/apply

やってほしいこと:
1. 重複申請防止
2. applied/approved 返却
3. テスト追加
最後に、通知発火の扱いを説明してください
```

### 47
```text
目的:
通報APIを実装したい

対象:
- POST /reports

やってほしいこと:
1. user/message/event の通報対応
2. reason_code 保存
3. テスト追加
最後に、管理画面側で必要な情報を列挙してください
```

### 48
```text
目的:
通知一覧と既読更新を実装したい

対象:
- GET /notifications
- PUT /notifications/read

やってほしいこと:
1. 通知一覧取得
2. 既読更新
3. テスト追加
最後に、通知種別を一覧化してください
```

---

## 9. 課金 / Entitlement

### 49
```text
目的:
Billing API を実装したい

対象:
- GET /billing/products
- POST /billing/subscribe
- POST /billing/verify-receipt
- GET /billing/me
- GET /entitlements/me

参照:
- docs/billing_openapi.yaml

やってほしいこと:
1. API 実装
2. entitlement 付与ロジック
3. テスト追加
最後に、商品コードと entitlement の対応を整理してください
```

### 50
```text
目的:
Paywall メイン画面を実装したい

対象:
- Screen Name: Paywall メイン
- API: GET /billing/products, GET /billing/me, GET /entitlements/me

参照:
- docs/paywall_ui_copy_final.md
- docs/paywall_wireframe_guide.md

やってほしいこと:
1. Paywall UI 実装
2. プラン表示
3. CTA導線
4. loading / error state
5. テスト追加
最後に、Free / Standard / Premium の見せ分けを説明してください
```
