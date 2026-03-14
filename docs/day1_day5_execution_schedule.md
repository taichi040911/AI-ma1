# 最初の10チケットをそのまま実行するための Day1〜Day5 実行スケジュール

## 目的
非エンジニアが Codex を使って、最初の10チケットを **5日で着実に進める** ための実行スケジュールです。

対象チケット:
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

## 全体方針
- 1日あたり **2チケット** を基本にする
- API → UI の順で進める
- 各日最後に **レビュー・Git commit・次日準備** を必ず行う
- Codex には **1チケットずつ** 依頼する
- 依頼ごとに `変更ファイル一覧 / テスト結果 / 仮定` を出させる

---

## Day1: 認証の入口を作る

### 対象
- AUTH-001 新規登録API
- AUTH-003 OTP送信API

### ゴール
- 新規登録の入口ができる
- OTP送信までAPIでつながる

### 作業順
#### 1. AUTH-001
- ブランチ作成  
  `feature/auth-001-register-api`
- Codex に新規登録APIを依頼
- lint / test 実行
- レビュー観点チェック
- commit / push / PR作成

#### 2. AUTH-003
- ブランチ作成  
  `feature/auth-003-send-otp-api`
- Codex に OTP送信APIを依頼
- lint / test 実行
- レビュー観点チェック
- commit / push / PR作成

### Day1 完了条件
- `POST /auth/register` が動く
- `POST /auth/send-otp` が動く
- メール重複や再送制限など最低限の異常系がある

### Day1 終了時チェック
- OpenAPIとの差分がないか
- 次の OTP認証画面が着手可能か
- commit message が規則どおりか

---

## Day2: 認証画面とオンボーディング保存基盤を作る

### 対象
- AUTH-004 OTP認証画面
- ONB-001 基本プロフィール更新API

### ゴール
- 登録 → OTP認証の画面導線ができる
- 基本プロフィール保存APIができる

### 作業順
#### 1. AUTH-004
- ブランチ作成  
  `feature/auth-004-otp-verify-screen`
- Codex に OTP認証画面を依頼
- 6桁入力・成功遷移・エラー表示まで確認
- commit / push / PR作成

#### 2. ONB-001
- ブランチ作成  
  `feature/onb-001-profile-api`
- Codex に基本プロフィール更新APIを依頼
- 必須項目バリデーションを確認
- commit / push / PR作成

### Day2 完了条件
- OTP認証画面が動く
- `PUT /me/profile` が動く
- 次の日にプロフィール画面をつなげられる

### Day2 終了時チェック
- 登録から OTP認証まで詰まらないか
- 認証後ユーザーで profile 更新ができるか

---

## Day3: オンボーディング画面と AI伴走の入口を作る

### 対象
- ONB-002 基本プロフィール画面
- LIFE-001 AIライフナビ開始API

### ゴール
- 基本プロフィール入力画面が動く
- AIライフナビの開始セッションが作れる

### 作業順
#### 1. ONB-002
- ブランチ作成  
  `feature/onb-002-profile-screen`
- Codex に基本プロフィール画面を依頼
- API接続・必須チェック・保存後遷移を確認
- commit / push / PR作成

#### 2. LIFE-001
- ブランチ作成  
  `feature/life-001-life-navigation-start-api`
- Codex に AIライフナビ開始APIを依頼
- `session_id / first_question / current_state_hint` を確認
- commit / push / PR作成

### Day3 完了条件
- 基本プロフィール画面が保存まで動く
- AIライフナビ面談の開始APIが動く

### Day3 終了時チェック
- オンボーディング画面から次に AI 面談へ進める状態か
- session 作成ロジックが明確か

---

## Day4: AIライフナビ面談を最後までつなぐ

### 対象
- LIFE-002 AIライフナビ回答API
- LIFE-004 AIライフナビ面談画面

### ゴール
- AI面談が開始から最後まで進む
- 完了後に次の Today 導線へ進める状態を作る

### 作業順
#### 1. LIFE-002
- ブランチ作成  
  `feature/life-002-life-navigation-answer-api`
- Codex に AIライフナビ回答APIを依頼
- `next_question / progress / tentative_state` を確認
- commit / push / PR作成

#### 2. LIFE-004
- ブランチ作成  
  `feature/life-004-life-navigation-screen`
- Codex に AIライフナビ面談画面を依頼
- start/answer API接続
- チャットUI、候補チップ、進捗表示を確認
- commit / push / PR作成

### Day4 完了条件
- 面談が途中で止まらない
- 完了後の遷移方針が明確
- Day5 で Today に接続できる

### Day4 終了時チェック
- ラスト質問時の挙動が自然か
- 長文回答でもUIが崩れないか
- 仮定が残っていないか

---

## Day5: Todayで最初の価値体験を出す

### 対象
- TODAY-001 今週の伴走プランAPI
- TODAY-003 Todayホーム画面

### ゴール
- 最初の価値体験が見える
- 「今日の一歩」「今週の伴走プラン」が表示される

### 作業順
#### 1. TODAY-001
- ブランチ作成  
  `feature/today-001-weekly-plan-api`
- Codex に伴走プランAPIを依頼
- `weekly_theme / steps / ai_comment` を確認
- commit / push / PR作成

#### 2. TODAY-003
- ブランチ作成  
  `feature/today-003-today-home-screen`
- Codex に Todayホーム画面を依頼
- 今日の一歩・今週の伴走プラン・AIの気づきを表示
- loading / empty / error state を確認
- commit / push / PR作成

### Day5 完了条件
- Todayホームが表示される
- 今日の一歩が出る
- 伴走プランが出る
- 最初の価値体験が伝わる

### Day5 終了時チェック
- 新規登録 → OTP → プロフィール → AI面談 → Today の一連導線がつながるか
- 次の11本目に進む前提が揃っているか

---

## 毎日の標準タイムテーブル

### 午前
- main 最新化
- 当日1本目のチケットを Codex に依頼
- 実装 / テスト / レビュー
- commit / push / PR作成

### 午後
- 当日2本目のチケットを Codex に依頼
- 実装 / テスト / レビュー
- commit / push / PR作成

### 終業前
- 当日2本の PR を見直す
- `review_checklist_first10.md` で確認
- 次の日のチケット参照資料を開いておく
- 必要なら `codex_execution_pack_first10.md` を更新

---

## 毎日の Codex依頼ルール
各チケットで必ず最後にこれを付ける。

```text
最後に、
1. 変更ファイル一覧
2. 実施したテスト
3. 置いた仮定
4. 次のチケットへの影響
をまとめてください。
```

---

## Day1〜Day5 の最低成果物
5日終わった時点で、最低限以下が揃っていれば成功です。

- 認証API
- OTP送信API
- OTP認証画面
- 基本プロフィール更新API
- 基本プロフィール画面
- AIライフナビ開始API
- AIライフナビ回答API
- AIライフナビ面談画面
- 今週の伴走プランAPI
- Todayホーム画面

---

## 5日終了後の確認
### ユーザーフロー
- 新規登録できる
- OTP送信できる
- OTP認証できる
- 基本プロフィールを保存できる
- AIライフナビを開始できる
- 面談が進む
- Todayが表示される

### 品質
- lint が通る
- test が通る
- OpenAPIと矛盾しない
- 変更ファイルが追跡できる
- 10本のPRがチケット単位で分かれている

---

## 6日目以降に進む前の判断
次に進んでよい条件:
- Day1〜Day5 のユーザーフローが壊れていない
- 重大バグが残っていない
- review checklist で大きなNGがない
- 次の対象チケットが明確

問題があれば:
- 追加実装に進まず、まず修正日を1日取る
- Day4 / Day5 周辺の不整合を優先修正する
