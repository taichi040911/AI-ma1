# 非エンジニア向け Codex運用手順書

## 1. この手順書の目的
この手順書は、非エンジニアが Codex を使って、アプリを **開発 → テスト → リリース** まで進めるための運用マニュアルです。

前提として、Codex はローカルの Codex CLI、クラウドの Codex web、IDE 拡張、SDK などで使えます。Codex CLI はローカルでコードを読み・変更し・実行でき、Codex web はクラウド上で並列タスクを進められます。OpenAI 公式では、プロジェクト固有ルールを `AGENTS.md` に書く運用が推奨されています。  
出典:
- OpenAI Codex CLI
- OpenAI Codex web
- OpenAI AGENTS.md guide
- OpenAI Codex models

## 2. 先に決めておくこと
開発を始める前に、次の4つを固定します。

1. **仕様の正本**
   - `integrated_openapi_final.yaml`
   - `final_screen_list_with_billing.md`
   - `screen_api_mapping.xlsx`
   - `billing_openapi.yaml`

2. **リポジトリの正本**
   - GitHub の main ブランチを正本にする

3. **運用ルールの正本**
   - `AGENTS.md`

4. **実装単位**
   - 1回の依頼で 1画面 or 1API or 1DB変更に限定する

## 3. Codexを使う前の準備
### 3-1. 推奨環境
- GitHub リポジトリを用意する
- `README.md` を作る
- `AGENTS.md` を作る
- `docs/` に仕様書を置く
- `scripts/test.sh`, `scripts/lint.sh`, `scripts/setup.sh` を置く

### 3-2. Codex CLI の位置づけ
Codex CLI はローカルの作業フォルダで、コードの読取り・変更・実行ができます。対話モードではターミナルUIで会話しながら作業できます。モデルは CLI で `-m gpt-5.4` のように指定できます。  
出典:
- OpenAI Codex CLI
- OpenAI Codex CLI features
- OpenAI Codex models

### 3-3. Codex web の位置づけ
Codex web はクラウド環境でタスクを実行でき、並列作業にも向いています。大きな実装、複数タスクの同時進行、レビュー待ちの分業に向いています。  
出典:
- OpenAI Codex web
- OpenAI multi-agents

## 4. AGENTS.md に必ず書く内容
OpenAI 公式では、Codex は作業前に `AGENTS.md` を読む前提です。  
出典:
- OpenAI AGENTS.md guide
- OpenAI Codex prompting guide

### 必須テンプレ
```md
# AGENTS.md

## Product
AI伴走型の総合マッチングアプリを開発する。
恋愛だけでなく、趣味、スポーツ、学び、仕事の接点も対象。

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
- 破壊的変更は禁止
- 不明点は仮定を明記する
```

## 5. 非エンジニアの役割
あなたがやることは、コードを書くことではありません。

- 何を作るか決める
- 優先順位を決める
- Codex に作業を依頼する
- 画面・文言・動作を確認する
- 修正を再依頼する
- 最後にマージや公開を判断する

## 6. 依頼の基本ルール
### やってはいけない依頼
- アプリ全部作って
- MVPを完成させて
- 全機能を一気に実装して

### 良い依頼
- `Today ホーム` を実装して
- `POST /ai/life-navigation/answer` を実装して
- `Paywall メイン` を文言集どおりに実装して
- `relationship_states` の migration と API を追加して

## 7. 1タスクの標準フロー
1. チケットを1つ選ぶ
2. 仕様書を添えて Codex に依頼する
3. Codex に次も頼む
   - テスト追加
   - OpenAPI更新
   - migration追加
   - PR説明作成
4. 画面や挙動を確認する
5. 修正を依頼する
6. マージする

## 8. 標準プロンプトの型
```text
目的:
Todayホーム画面を実装したい

参照:
- docs/final_screen_list_with_billing.md
- docs/screen_api_mapping.xlsx
- docs/integrated_openapi_final.yaml

対象:
- Screen Name: Today ホーム
- Primary APIs: GET /ai/today-step, GET /ai/weekly-plan
- Secondary APIs: GET /me/current-state

やってほしいこと:
1. API client を追加
2. 画面UIを実装
3. loading / empty / error state を入れる
4. テストを追加
5. 変更ファイル一覧と確認観点を最後にまとめる
```

## 9. 開発フェーズごとの進め方
### Phase 1: 土台
- 認証
- OpenAPI client 生成
- DB migration 基盤
- CI
- lint / test scripts

### Phase 2: P0実装
- Onboarding
- AIライフナビ
- Today
- Action
- Connections
- Chat
- Event
- Report / Block

### Phase 3: 課金
- Paywall
- Billing API
- Entitlement
- Boost / Super Action

### Phase 4: βテスト
- TestFlight / Android内部テスト
- 通報/本人確認/課金確認
- 20〜50人で試験運用

### Phase 5: 本番
- App Store / Google Play 提出
- 初期イベントと共同行動 seed
- サポート導線確認

## 10. 非エンジニアの確認項目
### 毎回確認
- 画面名は合っているか
- 文言は仕様どおりか
- 戻る導線があるか
- エラー表示があるか
- 落ちないか

### 毎スプリント確認
- P0画面がつながるか
- APIエラーで壊れないか
- OpenAPI が更新されているか
- migration が追加されているか
- テストが増えているか

### ローンチ前確認
- 新規登録
- OTP
- 本人確認
- AIライフナビ
- Today
- 共同行動
- いいね/マッチ
- チャット
- 通報/ブロック
- 課金
- 課金後の特典反映

## 11. Codexを安定させるコツ
OpenAI 公式では、Codex の動作を安定させるために、プロジェクトルールを `AGENTS.md` に書き、決まりきった処理を `scripts/` に寄せる運用が有効と案内しています。  
出典:
- OpenAI AGENTS.md guide
- OpenAI skills & Agents SDK blog

### コツ
- 依頼は小さくする
- 参照ファイルを明記する
- 変更後に必ず test/lint を実行させる
- 「最後に変更点を箇条書きで出して」と頼む
- 「仮定があれば明記して」と頼む

## 12. マルチエージェントの使い分け
OpenAI 公式では、Codex は複数エージェントを並列に走らせる運用もできます。  
出典:
- OpenAI multi-agents

### 推奨分担
- エージェントA: フロント画面
- エージェントB: API実装
- エージェントC: DB migration
- エージェントD: テスト追加

## 13. Agents SDK を使う場所
OpenAI Agents SDK は、ツール利用、ハンドオフ、トレースつきのエージェント実装に向いています。  
出典:
- OpenAI Agents SDK
- OpenAI Agent Builder
- OpenAI Use Codex with Agents SDK

### この案件で向く用途
- AIライフナビの会話オーケストレーション
- 今週の伴走プラン生成
- 関係コーチ
- 共同ログ要約
- 振り返り→次の一歩提案

## 14. 失敗しやすいパターン
- 一度に大きすぎる依頼
- 仕様なしで作らせる
- 画面名を曖昧にする
- OpenAPI と実装をズラす
- テストなしでマージする
- main ブランチで直接作業する

## 15. 最後に
非エンジニアがローンチできるかどうかは、技術力よりも、
**仕様 → 小さな依頼 → 確認 → 修正**
の運用を固定できるかで決まります。
