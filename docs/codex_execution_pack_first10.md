# 最初の10チケットを実装順に並べた Codex実行パック

## 目的
非エンジニアが Codex を使って、**最初の価値体験が出るところまで** を迷わず進めるための実行パックです。

Codex は `AGENTS.md` を読み、プロジェクトのルールを作業前に取り込みます。Codex CLI はローカルでコードを読み・変更し・実行でき、Codex web はクラウドで並列タスクを進められます。公式のベストプラクティスでも、作業を小さく分け、Git のチェックポイントを使い、仕様ファイルを明示して依頼することが推奨されています。さらに、Codex では多くのタスクで `gpt-5.4` が推奨されています。 citeturn439862search0turn439862search2turn439862search3turn439862search4turn439862search7turn439862search12

---

## 使い方
1. この順番どおりに 1チケットずつ Codex に投げます
2. 各チケットごとに、実装 → テスト → 変更点要約 まで完了させます
3. 1本終わるごとに Git で checkpoint を切ります
4. 10本終わると、**登録 → 面談 → Today表示** までがつながります

---

## 実行順 10本

### 1. AUTH-001 新規登録API
**目的**  
アプリの最初の入口を作る

**参照**
- `docs/integrated_openapi_final.yaml`
- `docs/AGENTS.md`

**Codex依頼テンプレ**
```text
目的:
新規登録APIを実装したい

参照:
- docs/integrated_openapi_final.yaml
- AGENTS.md

対象:
- POST /auth/register

やってほしいこと:
1. API を実装
2. 必須バリデーションを追加
3. 重複メール時のエラーを返す
4. テストを追加
5. OpenAPIとの差異がないか確認する
最後に、変更ファイル一覧と確認観点を出してください
```

**完了条件**
- 正常登録できる
- メール重複でエラー
- 必須不足でエラー

---

### 2. AUTH-003 OTP送信API
**目的**  
登録後の認証コード送信を成立させる

**Codex依頼テンプレ**
```text
目的:
OTP送信APIを実装したい

参照:
- docs/integrated_openapi_final.yaml
- AGENTS.md

対象:
- POST /auth/send-otp

やってほしいこと:
1. OTP送信処理を実装
2. レート制限を追加
3. expires_in_seconds を返す
4. テストを追加
最後に、再送制限のルールを説明してください
```

**完了条件**
- 送信成功
- レート制限
- 期限設定あり

---

### 3. AUTH-004 OTP認証画面
**目的**  
登録フローを画面上で完結させる

**Codex依頼テンプレ**
```text
目的:
OTP認証画面を実装したい

参照:
- docs/final_screen_list_with_billing.md
- docs/screen_api_mapping.xlsx
- docs/integrated_openapi_final.yaml
- AGENTS.md

対象:
- Screen Name: OTP Verify
- API: POST /auth/verify-otp

やってほしいこと:
1. 6桁入力UIを実装
2. verify API と接続
3. 成功時の次画面遷移を入れる
4. 失敗時エラー表示を入れる
5. テストを追加
最後に、成功/失敗/期限切れの見え方を整理してください
```

**完了条件**
- 6桁入力
- 成功で次へ
- エラー表示あり

---

### 4. ONB-001 基本プロフィール更新API
**目的**  
オンボーディングの保存基盤を作る

**Codex依頼テンプレ**
```text
目的:
基本プロフィール更新APIを実装したい

参照:
- docs/integrated_openapi_final.yaml
- AGENTS.md

対象:
- PUT /me/profile

やってほしいこと:
1. API を実装
2. 必須項目バリデーションを追加
3. 更新済プロフィールを返す
4. テストを追加
最後に、必須項目一覧を示してください
```

**完了条件**
- 保存成功
- 必須バリデーション
- レスポンス返却

---

### 5. ONB-002 基本プロフィール画面
**目的**  
初回入力画面を成立させる

**Codex依頼テンプレ**
```text
目的:
基本プロフィール画面を実装したい

参照:
- docs/final_screen_list_with_billing.md
- docs/screen_api_mapping.xlsx
- docs/integrated_openapi_final.yaml
- AGENTS.md

対象:
- Screen Name: Basic Profile
- API: PUT /me/profile

やってほしいこと:
1. UIを実装
2. API 接続
3. 必須バリデーションを表示
4. 保存後に次画面へ遷移
5. テストを追加
最後に、画面の確認観点を5個書いてください
```

**完了条件**
- 入力できる
- 保存できる
- 次画面へ進める

---

### 6. LIFE-001 AIライフナビ開始API
**目的**  
AI伴走の入口を作る

**Codex依頼テンプレ**
```text
目的:
AIライフナビ開始APIを実装したい

参照:
- docs/integrated_openapi_final.yaml
- AGENTS.md

対象:
- POST /ai/life-navigation/start

やってほしいこと:
1. セッション開始処理を実装
2. session_id を返す
3. first_question を返す
4. current_state_hint を返す
5. テストを追加
最後に、セッション管理方針を説明してください
```

**完了条件**
- session_id返却
- first_question返却
- テストあり

---

### 7. LIFE-002 AIライフナビ回答API
**目的**  
面談を進行できるようにする

**Codex依頼テンプレ**
```text
目的:
AIライフナビ回答APIを実装したい

参照:
- docs/integrated_openapi_final.yaml
- AGENTS.md

対象:
- POST /ai/life-navigation/answer

やってほしいこと:
1. 回答保存処理を実装
2. next_question を返す
3. progress を返す
4. tentative_state を返す
5. テストを追加
最後に、回答が最後の質問だった場合の挙動を説明してください
```

**完了条件**
- 回答保存
- 次質問返却
- 進捗返却

---

### 8. LIFE-004 AIライフナビ面談画面
**目的**  
新体験の中核を見える形にする

**Codex依頼テンプレ**
```text
目的:
AIライフナビ面談画面を実装したい

参照:
- docs/final_screen_list_with_billing.md
- docs/screen_api_mapping.xlsx
- docs/integrated_openapi_final.yaml
- AGENTS.md

対象:
- Screen Name: AIライフナビ面談
- APIs: POST /ai/life-navigation/start, POST /ai/life-navigation/answer

やってほしいこと:
1. チャット形式UIを実装
2. start/answer API を接続
3. progress 表示を入れる
4. 候補チップ入力を追加
5. テストを追加
最後に、面談完了後の遷移を要約してください
```

**完了条件**
- チャットUI
- 質問が進む
- 面談完了で次へ

---

### 9. TODAY-001 今週の伴走プランAPI
**目的**  
Todayの中核データを返せるようにする

**Codex依頼テンプレ**
```text
目的:
今週の伴走プランAPIを実装したい

参照:
- docs/integrated_openapi_final.yaml
- AGENTS.md

対象:
- GET /ai/weekly-plan

やってほしいこと:
1. weekly_theme を返す
2. steps を返す
3. ai_comment を返す
4. テストを追加
最後に、steps の最小件数と想定フォーマットを説明してください
```

**完了条件**
- weekly_theme返却
- steps返却
- テストあり

---

### 10. TODAY-003 Todayホーム画面
**目的**  
ユーザーが最初の価値体験を感じる画面を作る

**Codex依頼テンプレ**
```text
目的:
Todayホーム画面を実装したい

参照:
- docs/final_screen_list_with_billing.md
- docs/screen_api_mapping.xlsx
- docs/integrated_openapi_final.yaml
- AGENTS.md

対象:
- Screen Name: Today ホーム
- Primary APIs: GET /ai/today-step, GET /ai/weekly-plan
- Secondary API: GET /me/current-state

やってほしいこと:
1. 今日の一歩カードを実装
2. 今週の伴走プランを表示
3. AIからの気づきを表示
4. loading / empty / error state を追加
5. テストを追加
最後に、ユーザーが最初に見るべき情報の優先順位を整理してください
```

**完了条件**
- Today表示成功
- 今日の一歩表示
- 伴走プラン表示
- エラー時に壊れない

---

## Git checkpoint ルール
Codex の公式クイックスタートでも、各タスクの前後で Git checkpoint を切ることが推奨されています。 citeturn439862search12

各チケット完了後に、少なくとも次を実施します。

```bash
git add .
git commit -m "feat: complete AUTH-001 register api"
```

---

## 推奨モデル
Codex では、多くのタスクで `gpt-5.4` が推奨されています。CLI でもモデル指定が可能です。 citeturn439862search7turn439862search2

例:
```bash
codex -m gpt-5.4
```

---

## 実行後に必ず確認すること
- 変更ファイル一覧
- 実施したテスト
- 置いた仮定
- 次のチケットに影響する変更
- OpenAPI 更新有無

---

## この10本が終わると何ができるか
- 登録できる
- OTP認証できる
- 基本プロフィールを保存できる
- AIライフナビ面談が動く
- 今週の伴走プランが取得できる
- Todayホームに最初の価値体験が出る

これで、**非エンジニアが Codex を使って最初の価値体験まで到達する最短ルート** ができます。
