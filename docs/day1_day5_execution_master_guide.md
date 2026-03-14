
# Day1〜Day5 実行マスターガイド

## 1. 目的
このガイドは、非エンジニアが Codex を使って、**最初の10チケットを Day1〜Day5 で実行するための統合ガイド**です。

この5日で到達したい状態は次の通りです。

- 新規登録できる
- OTP送信できる
- OTP認証できる
- 基本プロフィールを保存できる
- AIライフナビを開始できる
- AIライフナビ面談を最後まで進められる
- 今週の伴走プランを取得できる
- Todayホームに最初の価値体験が表示される

---

## 2. この5日で進める10チケット

1. AUTH-001 新規登録API
2. AUTH-003 OTP送信API
3. AUTH-004 OTP認証画面
4. ONB-001 基本プロフィール更新API
5. ONB-002 基本プロフィール画面
6. LIFE-001 AIライフナビ開始API
7. LIFE-002 AIライフナビ回答API
8. LIFE-004 AIライフナビ面談画面
9. TODAY-001 今週の伴走プランAPI
10. TODAY-003 Todayホーム画面

---

## 3. 先に使うファイル

### 実行バンドル
- `day1_execution_bundle.md`
- `day2_execution_bundle.md`
- `day3_execution_bundle.md`
- `day4_execution_bundle.md`
- `day5_execution_bundle.md`

### チェックリスト
- `day1_execution_checklist.json`
- `day2_execution_checklist.json`
- `day3_execution_checklist.json`
- `day4_execution_checklist.json`
- `day5_execution_checklist.json`

### レビュー・Git運用
- `review_checklist_first10.md`
- `git_rules_first10.md`

### 仕様の正本
- `AGENTS.md`
- `README.md`
- `docs/integrated_openapi_final.yaml`
- `docs/final_screen_list_with_billing.md`
- `docs/screen_api_mapping.xlsx`

---

## 4. 実行前チェック

Day1 を始める前に、次を満たしていることを確認します。

### リポジトリ
- `AGENTS.md` がルートにある
- `README.md` がルートにある
- `docs/` に仕様書がある
- `scripts/setup.sh / lint.sh / test.sh` がある

### ツール
- Git が使える
- Codex が使える
- `pnpm` か同等の package manager が使える
- `pnpm lint`, `pnpm test` が実行できる

### 依頼ルール
- 1回の依頼で 1チケットだけ投げる
- 最後に `変更ファイル一覧 / 実施したテスト / 置いた仮定 / 次のチケットへの影響` を出させる
- 1チケットごとに commit / push / PR を分ける

---

## 5. Dayごとの全体像

## Day1
### 対象
- AUTH-001 新規登録API
- AUTH-003 OTP送信API

### ゴール
- 登録入口を作る
- OTP送信までのAPIを揃える

### 完了条件
- `POST /auth/register` が動く
- `POST /auth/send-otp` が動く
- 重複エラーと再送制限がある

---

## Day2
### 対象
- AUTH-004 OTP認証画面
- ONB-001 基本プロフィール更新API

### ゴール
- OTP認証画面を成立させる
- プロフィール保存基盤を作る

### 完了条件
- OTP認証画面が動く
- `PUT /me/profile` が動く
- 認証後の保存導線が成立する

---

## Day3
### 対象
- ONB-002 基本プロフィール画面
- LIFE-001 AIライフナビ開始API

### ゴール
- プロフィール入力画面を成立させる
- AI伴走の入口を作る

### 完了条件
- 基本プロフィール画面が保存まで動く
- `POST /ai/life-navigation/start` が動く

---

## Day4
### 対象
- LIFE-002 AIライフナビ回答API
- LIFE-004 AIライフナビ面談画面

### ゴール
- AI面談を最後まで進める

### 完了条件
- `POST /ai/life-navigation/answer` が動く
- 面談画面が最後まで進む
- 面談完了後の遷移がある

---

## Day5
### 対象
- TODAY-001 今週の伴走プランAPI
- TODAY-003 Todayホーム画面

### ゴール
- 最初の価値体験を出す

### 完了条件
- `GET /ai/weekly-plan` が動く
- Todayホームに「今日の一歩」「伴走プラン」「AIの気づき」が表示される

---

## 6. 毎日の標準フロー

### Step 1. main を最新化
```bash
git checkout main
git pull origin main
```

### Step 2. 当日の1本目のブランチを切る
例:
```bash
git checkout -b feature/auth-001-register-api
```

### Step 3. Codex に実装依頼
- 実行バンドルの依頼文をそのまま使う
- 対象チケットIDとブランチ名を明記する

### Step 4. ローカル確認
```bash
pnpm lint
pnpm test
```

### Step 5. commit / push
```bash
git add .
git commit -m "feat(auth-001): implement register api"
git push -u origin feature/auth-001-register-api
```

### Step 6. レビュー
- `review_checklist_first10.md` を使う

### Step 7. 2本目も同じ流れで進める
- main に戻る
- 最新化する
- 次ブランチを切る
- 実装 → テスト → commit → push → レビュー

---

## 7. 毎日使う確認テンプレ

各チケット完了後、必ず次を確認します。

### 実装
- 対象チケットの範囲だけ変更されているか
- 不要な変更が混ざっていないか

### テスト
- 少なくとも1つテストが追加されているか
- lint / test が通っているか

### 仕様
- OpenAPI と矛盾していないか
- 画面名や API が仕様どおりか

### 次のチケット
- 次チケットが着手しやすい状態か
- 必要な前提が揃ったか

---

## 8. Day1〜Day5 のマージ順

推奨順:
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

理由:
- 認証
- オンボーディング保存
- AI伴走入口
- AI面談完了
- Today価値体験

の順に依存しているためです。

---

## 9. 5日間の標準タイムテーブル

### 午前
- 1本目のチケットを実行
- lint / test
- commit / push
- レビュー

### 午後
- 2本目のチケットを実行
- lint / test
- commit / push
- レビュー

### 終業前
- 当日2本の結果を確認
- 次の日の資料を開く
- 残課題があればメモする

---

## 10. トラブル時のルール

### 実装が大きくなりすぎた
- そこで止める
- 変更内容を整理する
- 別チケットに分けられるなら分ける

### テストが通らない
- その日の追加実装をやめる
- まずテストが通るところまで戻す

### 仕様が曖昧
- 仮定を置く
- ただし最後に仮定を明記する

### Gitで迷った
- `git_rules_first10.md` を見る
- 無理なら Codex に Git 操作だけ依頼する

---

## 11. 5日終了後の最終確認

### フロー確認
- 新規登録できる
- OTP送信できる
- OTP認証できる
- 基本プロフィール保存できる
- AIライフナビ開始できる
- AIライフナビ面談が進む
- 今週の伴走プランが返る
- Todayホームに価値体験が出る

### 品質確認
- lint が通る
- test が通る
- OpenAPI との差分がない
- review checklist の最終レビューを満たす
- Git 履歴がチケット単位で分かれている

---

## 12. 成功ライン
このマスターガイドどおりに進めて、Day5終了時に次ができれば成功です。

- 非エンジニアでも Codex を使って 10チケットを完了できた
- アプリの最初の価値体験が出た
- 11本目以降に進める土台ができた

---

## 13. 次の自然なアクション
この5日が終わったら、次は

- 11本目以降の Codex実行パック
- 初回価値体験のE2Eレビュー
- βテスト向けの限定公開準備

に進むのが自然です。
