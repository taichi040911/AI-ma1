# Day1 実行バンドル

## 今日やること
1. `AUTH-001 新規登録API`
2. `AUTH-003 OTP送信API`

## 先に実行するコマンド
```bash
git checkout main
git pull origin main
git checkout -b feature/auth-001-register-api
```

## Codex への依頼 1本目
```text
現在のブランチは feature/auth-001-register-api です。
対象チケットは AUTH-001 です。

参照:
- AGENTS.md
- docs/integrated_openapi_final.yaml

対象:
- POST /auth/register

やってほしいこと:
1. API を実装
2. 必須バリデーションを追加
3. 重複メール時のエラーを返す
4. テストを追加
5. OpenAPIとの差異がないか確認する

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
git commit -m "feat(auth-001): implement register api"
git push -u origin feature/auth-001-register-api
```

## 次のブランチ
```bash
git checkout main
git pull origin main
git checkout -b feature/auth-003-send-otp-api
```

## Codex への依頼 2本目
```text
現在のブランチは feature/auth-003-send-otp-api です。
対象チケットは AUTH-003 です。

参照:
- AGENTS.md
- docs/integrated_openapi_final.yaml

対象:
- POST /auth/send-otp

やってほしいこと:
1. OTP送信処理を実装
2. レート制限を追加
3. expires_in_seconds を返す
4. テストを追加

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
git commit -m "feat(auth-003): implement send otp api"
git push -u origin feature/auth-003-send-otp-api
```

## Day1 完了判定
- `POST /auth/register` が動く
- `POST /auth/send-otp` が動く
- 重複エラーと再送制限がある
- lint / test が通る
