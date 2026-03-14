# Day3 実行バンドル

## 今日やること
1. `ONB-002 基本プロフィール画面`
2. `LIFE-001 AIライフナビ開始API`

## 先に実行するコマンド
```bash
git checkout main
git pull origin main
git checkout -b feature/onb-002-profile-screen
```

## Codex への依頼 1本目
```text
現在のブランチは feature/onb-002-profile-screen です。
対象チケットは ONB-002 です。

参照:
- AGENTS.md
- docs/final_screen_list_with_billing.md
- docs/screen_api_mapping.xlsx
- docs/integrated_openapi_final.yaml

対象:
- Screen Name: Basic Profile
- API: PUT /me/profile

やってほしいこと:
1. 基本プロフィール画面UIを実装
2. `PUT /me/profile` と接続
3. 必須項目バリデーションを表示
4. 保存中の loading state を入れる
5. 保存成功時に次画面へ遷移させる
6. error state を追加
7. テストを追加

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
git commit -m "feat(onb-002): implement basic profile screen"
git push -u origin feature/onb-002-profile-screen
```

## 次のブランチ
```bash
git checkout main
git pull origin main
git checkout -b feature/life-001-life-navigation-start-api
```

## Codex への依頼 2本目
```text
現在のブランチは feature/life-001-life-navigation-start-api です。
対象チケットは LIFE-001 です。

参照:
- AGENTS.md
- docs/integrated_openapi_final.yaml

対象:
- POST /ai/life-navigation/start

やってほしいこと:
1. AIライフナビ開始APIを実装
2. 認証ユーザー単位で session を開始する
3. `session_id` を返す
4. `first_question` を返す
5. `current_state_hint` を返す
6. テストを追加
7. OpenAPIとの差異がないか確認する

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
git commit -m "feat(life-001): implement life navigation start api"
git push -u origin feature/life-001-life-navigation-start-api
```

## Day3 完了判定
- 基本プロフィール画面が動く
- `PUT /me/profile` と画面が正しく接続される
- 保存成功時に次画面へ進める
- `POST /ai/life-navigation/start` が動く
- `session_id / first_question / current_state_hint` が返る
- lint / test が通る

## Day3 終了時チェック
- Day2 の `ONB-001` と Day3 の `ONB-002` がつながっている
- オンボーディング画面から AI面談へ進む準備ができている
- Day4 の `LIFE-002` と `LIFE-004` に必要な開始APIが揃っている
