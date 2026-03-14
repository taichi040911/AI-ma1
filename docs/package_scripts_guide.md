# package.json scripts の推奨形

## 1. 目的
この `package.json` は、すでに用意した以下のスクリプトを前提にした**ルート用の推奨形**です。

- `scripts/setup.sh`
- `scripts/lint.sh`
- `scripts/test.sh`

モノレポ前提で、`apps/mobile`, `apps/admin`, `apps/api` をまとめて扱いやすい構成にしています。

---

## 2. scripts の役割

### setup
```json
"setup": "bash ./scripts/setup.sh"
```
初期セットアップを統一します。  
非エンジニアでも `pnpm setup` だけで始めやすくします。

### lint
```json
"lint": "bash ./scripts/lint.sh"
```
Node/Python の lint を一括実行します。

### test
```json
"test": "bash ./scripts/test.sh"
```
単体テスト・APIテスト・必要に応じてE2Eまで流します。

### test:e2e
```json
"test:e2e": "pnpm -r --if-present test:e2e"
```
各パッケージ側に `test:e2e` があれば再帰実行します。

### dev
```json
"dev": "pnpm -r --parallel --if-present dev"
```
各アプリの開発サーバーを並列起動します。

### build
```json
"build": "pnpm -r --if-present build"
```
全体ビルドです。

### typecheck
```json
"typecheck": "pnpm -r --if-present typecheck"
```
TypeScript の型チェックをまとめて実行します。

### format
```json
"format": "pnpm -r --if-present format"
```
整形コマンドです。

### check
```json
"check": "pnpm lint && pnpm typecheck && pnpm test"
```
PR前の最重要コマンドです。

### ci
```json
"ci": "pnpm check"
```
CIでの共通入口にします。

### db:migrate
```json
"db:migrate": "pnpm --filter api db:migrate"
```
API サーバー配下の migration を実行します。

### db:seed
```json
"db:seed": "bash ./scripts/seed.sh"
```
初期データ投入です。  
`seed.sh` はまだ未作成なら後で追加してください。

### openapi:generate
```json
"openapi:generate": "pnpm -r --if-present openapi:generate"
```
OpenAPI からクライアント再生成するときの入口です。

### mobile:dev / admin:dev / api:dev
```json
"mobile:dev": "pnpm --filter mobile dev"
"admin:dev": "pnpm --filter admin dev"
"api:dev": "pnpm --filter api dev"
```
担当別に起動しやすくします。

---

## 3. この形が強い理由
- 非エンジニアでも入口コマンドが分かりやすい
- Codex に「`pnpm check` を通して」と依頼しやすい
- モノレポでも責務が分かれる
- CI とローカルの実行入口を揃えやすい

---

## 4. Codexへの依頼例
```text
このリポジトリの package.json scripts を docs/package_json_recommended.json に合わせて整えてください。
不足する scripts がある場合は apps/mobile, apps/admin, apps/api に必要な dev/build/typecheck/test scripts を追加してください。
最後に、pnpm check で何が実行されるか説明してください。
```

---

## 5. 補足
- `pnpm` を前提にしています
- `npm` や `yarn` を使う場合は scripts 自体はほぼ同じで置き換え可能です
- 実際の技術スタックに応じて、各 app 側の `dev/build/test` は調整してください
