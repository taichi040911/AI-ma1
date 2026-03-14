# tsconfig / eslint / prettier / vitest の共通設定雛形

今回の雛形は、**モノレポ前提**で、`apps/mobile`, `apps/admin`, `apps/api` を共通ルールで動かしやすくする構成です。

## 作成したファイル
- `tsconfig.base.json`
- `apps_mobile_tsconfig.json`
- `apps_admin_tsconfig.json`
- `apps_api_tsconfig.json`
- `eslint.config.mjs`
- `prettier.config.cjs`
- `.prettierignore`
- `vitest.config.ts`

## 使い方
### TypeScript
- ルートに `tsconfig.base.json` を置く
- 各アプリの `tsconfig.json` は `extends` でベース設定を継承する

### ESLint
- ルートに `eslint.config.mjs` を置く
- ESLint v9 以降の flat config 前提

### Prettier
- ルートに `prettier.config.cjs` と `.prettierignore` を置く
- editor / CLI / CI で同じ設定を使う

### Vitest
- ルートに `vitest.config.ts` を置く
- package.json の `test` / `test:e2e` から利用する
- E2E は別ランナーに分け、unit/integration は Vitest で回す

## Codex への依頼例
```text
docs にある共通設定雛形を使って、ルートに tsconfig.base.json, eslint.config.mjs, prettier.config.cjs, vitest.config.ts を追加してください。
また、apps/mobile, apps/admin, apps/api にそれぞれ tsconfig.json を作成し、extends で接続してください。
最後に、package.json scripts と矛盾がないか確認してください。
```
