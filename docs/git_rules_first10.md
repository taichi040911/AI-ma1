# 最初の10チケットを完了させるための Git 運用ルール

## 1. 目的
このルールは、**非エンジニアが Codex を使って最初の10チケットを安全に完了させる** ための Git 運用ルールです。

目的は次の4つです。
1. 変更を小さく保つ
2. 差し戻しを簡単にする
3. どのチケットの変更か分かるようにする
4. Codex の作業をレビューしやすくする

---

## 2. 基本方針
- **1チケット = 1ブランチ = 1PR** を原則にする
- `main` へ直接コミットしない
- 各チケット完了ごとに Git checkpoint を切る
- Codex には、必ず「今のブランチ名」と「対象チケットID」を明示する
- チケットをまたぐ変更は原則禁止
- 仕様変更は別PRに分ける

---

## 3. ブランチ運用ルール

## 3-1. メインブランチ
- `main` を正本にする
- `main` は常にデプロイ可能状態を維持する
- 未レビューの変更は入れない

## 3-2. 作業ブランチ命名規則
以下の形式で統一します。

```text
feature/{ticket-id}-{short-name}
```

例:
```text
feature/auth-001-register-api
feature/life-004-life-navigation-screen
feature/today-003-today-home
```

### 命名ルール
- ticket-id は小文字
- 単語は `-` でつなぐ
- 短く、内容が分かる名前にする

---

## 4. 最初の10チケット専用の推奨ブランチ名

1. `feature/auth-001-register-api`
2. `feature/auth-003-send-otp-api`
3. `feature/auth-004-otp-verify-screen`
4. `feature/onb-001-profile-api`
5. `feature/onb-002-profile-screen`
6. `feature/life-001-life-navigation-start-api`
7. `feature/life-002-life-navigation-answer-api`
8. `feature/life-004-life-navigation-screen`
9. `feature/today-001-weekly-plan-api`
10. `feature/today-003-today-home-screen`

---

## 5. 1チケットごとの標準フロー

## Step 1. main を最新化
```bash
git checkout main
git pull origin main
```

## Step 2. 作業ブランチ作成
例:
```bash
git checkout -b feature/auth-001-register-api
```

## Step 3. Codex に依頼
Codex に必ず次を明記する。
- 今のブランチ名
- 対象チケットID
- 参照すべき仕様書
- 最後にテストと変更点要約を出すこと

依頼例:
```text
現在のブランチは feature/auth-001-register-api です。
対象チケットは AUTH-001 です。

参照:
- AGENTS.md
- docs/integrated_openapi_final.yaml

POST /auth/register を実装してください。
最後に、変更ファイル一覧、実施したテスト、置いた仮定をまとめてください。
```

## Step 4. ローカル確認
最低限これを実行する。
```bash
pnpm lint
pnpm test
```

または
```bash
bash ./scripts/lint.sh
bash ./scripts/test.sh
```

## Step 5. commit
```bash
git add .
git commit -m "feat(auth-001): implement register api"
```

## Step 6. push
```bash
git push -u origin feature/auth-001-register-api
```

## Step 7. PR 作成
PR タイトル例:
```text
[AUTH-001] 新規登録APIを実装
```

PR 本文に最低限書くこと:
- 目的
- 変更内容
- 変更ファイル一覧
- テスト結果
- 置いた仮定
- 次チケットへの影響

## Step 8. レビュー
`review_checklist_first10.md` に沿って確認する

## Step 9. main にマージ
レビューOKなら squash merge を推奨する

## Step 10. ブランチ削除
```bash
git branch -d feature/auth-001-register-api
git push origin --delete feature/auth-001-register-api
```

---

## 6. commit メッセージ規則

以下の形式を推奨します。

```text
type(ticket-id): short summary
```

### type
- `feat`
- `fix`
- `refactor`
- `test`
- `docs`
- `chore`

### 例
```text
feat(auth-001): implement register api
feat(auth-004): add otp verify screen
feat(life-001): add life navigation session start api
feat(today-003): implement today home screen
fix(onb-002): handle empty profile validation state
test(life-002): add answer api tests
docs(today-003): update implementation notes
```

---

## 7. checkpoint ルール

Codex で作業していると、途中で戻したくなることが多いです。  
そのため、**小さな checkpoint commit** を許可します。

### checkpoint commit 例
```bash
git add .
git commit -m "chore(auth-001): checkpoint before validation update"
```

### いつ切るか
- API の骨組みができたとき
- UI の骨組みができたとき
- テスト追加前
- 大きめのリファクタ前

### 注意
- checkpoint は PR 前に整理してもよい
- 履歴をきれいにしたい場合は squash merge を使う

---

## 8. PR 運用ルール

## 8-1. 1PR に入れてよいもの
- 対象チケットの実装
- そのチケットに必要なテスト
- そのチケットに必要な最小限の OpenAPI 更新
- そのチケットに必要な最小限の migration

## 8-2. 1PR に入れてはいけないもの
- 無関係なリファクタ
- 別チケットの画面
- 別チケットの API
- 気分でやった整形だけの大規模変更
- 仕様変更

## 8-3. PR テンプレ
```text
## 対象チケット
AUTH-001

## 目的
新規登録APIを実装する

## 変更内容
- POST /auth/register を実装
- バリデーション追加
- 重複メールエラー追加
- テスト追加

## 変更ファイル
- apps/api/src/routes/auth/index.ts
- apps/api/src/services/authService.ts
- apps/api/src/tests/auth/register.test.ts

## テスト
- pnpm lint
- pnpm test

## 仮定
- メールアドレスをユニークとする
- 規約同意が必須

## 次チケットへの影響
- AUTH-003 の OTP送信API 実装で user 作成済み前提を使える
```

---

## 9. rebase / merge のルール

最初の10チケットでは、複雑さを避けるために以下を推奨します。

- 基本は **main からブランチを切る**
- 他ブランチをベースにしない
- `main` 更新があったら、必要時のみ rebase する
- マージ方式は **squash merge** を推奨

### main 取り込み例
```bash
git checkout feature/today-003-today-home-screen
git fetch origin
git rebase origin/main
```

### コンフリクト時のルール
- 非エンジニアが迷ったら無理に解消しない
- Codex に「コンフリクト解消だけ」を依頼する
- 依頼時に両ファイルの意図を明記する

---

## 10. rollback ルール

問題が起きたら、すぐ戻せることが大切です。

### ローカル未commit を戻す
```bash
git restore .
```

### 直前 commit を戻す
```bash
git reset --soft HEAD~1
```

### merge 後に打ち消す
```bash
git revert <commit-hash>
```

### 原則
- 履歴を書き換えるより revert を優先
- main に入った後は force push を避ける

---

## 11. タグ運用（最初の10チケット用）

10本の節目で、状態が分かるように軽いタグを推奨します。

### 例
```bash
git tag v0.1-auth-ready
git tag v0.2-onboarding-ready
git tag v0.3-life-navigation-ready
git tag v0.4-today-ready
git push origin --tags
```

### 推奨タイミング
- AUTH-004 完了後
- ONB-002 完了後
- LIFE-004 完了後
- TODAY-003 完了後

---

## 12. 非エンジニア向け確認ポイント

各 PR で最低限見ること:
- ブランチ名が合っているか
- ticket-id がPRタイトルに入っているか
- 変更ファイルが多すぎないか
- テスト実行結果があるか
- 置いた仮定が書かれているか
- 次のチケットへ悪影響が出ないか

---

## 13. Codex に Git 操作を頼むときのテンプレ

### ブランチ作成から始める
```text
これから AUTH-001 を進めます。
新しいブランチ `feature/auth-001-register-api` を前提に作業してください。

参照:
- AGENTS.md
- docs/integrated_openapi_final.yaml

最後に、変更ファイル一覧、実施したテスト、推奨 commit message を出してください。
```

### PR 用サマリーを作らせる
```text
この変更について、PR本文を作ってください。
以下の見出しを必ず含めてください。
- 対象チケット
- 目的
- 変更内容
- 変更ファイル
- テスト
- 仮定
- 次チケットへの影響
```

### コンフリクト解消だけ依頼する
```text
現在のブランチで rebase 時にコンフリクトが発生しました。
対象ファイルは次の2つです。
- apps/api/src/routes/auth/index.ts
- apps/api/src/services/authService.ts

意図:
- main 側は共通エラーフォーマット導入
- 自分の変更は AUTH-001 の register 実装

register 実装を残しつつ、共通エラーフォーマットを取り込む形で解消してください。
最後に、解消内容を要約してください。
```

---

## 14. 最初の10チケットでの推奨マージ順

1. AUTH-001
2. AUTH-003
3. AUTH-004
4. ONB-001
5. ONB-002
6. LIFE-001
7. LIFE-002
8. LIFE-004
9. TODAY-001
10. TODAY-003

### 理由
- 先に認証の入口を固める
- その後オンボーディング保存を作る
- 次に AI伴走の入口を作る
- 最後に Today の価値体験へつなぐ

---

## 15. 最低限の Git コマンド一覧

```bash
# main 最新化
git checkout main
git pull origin main

# ブランチ作成
git checkout -b feature/auth-001-register-api

# 状態確認
git status

# 差分確認
git diff

# add / commit
git add .
git commit -m "feat(auth-001): implement register api"

# push
git push -u origin feature/auth-001-register-api

# rebase
git fetch origin
git rebase origin/main

# マージ後削除
git branch -d feature/auth-001-register-api
git push origin --delete feature/auth-001-register-api
```

---

## 16. この Git 運用ルールのゴール
このルールに従うと、最初の10チケットを進める間に、

- どの変更がどのチケットか分かる
- Codex の作業を安全にレビューできる
- 差し戻ししやすい
- 途中で壊れても戻しやすい
- 非エンジニアでも進行管理しやすい

状態を作れます。
