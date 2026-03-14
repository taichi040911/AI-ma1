# Day4 実行バンドル

## 今日やること
1. `LIFE-002 AIライフナビ回答API`
2. `LIFE-004 AIライフナビ面談画面`

## 先に実行するコマンド
```bash
git checkout main
git pull origin main
git checkout -b feature/life-002-life-navigation-answer-api
```

## Codex への依頼 1本目
```text
現在のブランチは feature/life-002-life-navigation-answer-api です。
対象チケットは LIFE-002 です。

参照:
- AGENTS.md
- docs/integrated_openapi_final.yaml

対象:
- POST /ai/life-navigation/answer

やってほしいこと:
1. AIライフナビ回答APIを実装
2. 回答を保存する
3. `next_question` を返す
4. `progress` を返す
5. `tentative_state` を返す
6. 最後の質問時の終了挙動を定義する
7. テストを追加
8. OpenAPIとの差異がないか確認する

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
git commit -m "feat(life-002): implement life navigation answer api"
git push -u origin feature/life-002-life-navigation-answer-api
```

## 次のブランチ
```bash
git checkout main
git pull origin main
git checkout -b feature/life-004-life-navigation-screen
```

## Codex への依頼 2本目
```text
現在のブランチは feature/life-004-life-navigation-screen です。
対象チケットは LIFE-004 です。

参照:
- AGENTS.md
- docs/final_screen_list_with_billing.md
- docs/screen_api_mapping.xlsx
- docs/integrated_openapi_final.yaml

対象:
- Screen Name: AIライフナビ面談
- APIs: POST /ai/life-navigation/start, POST /ai/life-navigation/answer

やってほしいこと:
1. チャット形式UIを実装
2. start API と answer API を接続
3. progress 表示を入れる
4. 候補チップ入力を追加
5. 自由入力もできるようにする
6. 面談完了後の次画面遷移を入れる
7. loading / error state を追加
8. テストを追加

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
git commit -m "feat(life-004): implement life navigation interview screen"
git push -u origin feature/life-004-life-navigation-screen
```

## Day4 完了判定
- `POST /ai/life-navigation/answer` が動く
- 回答保存、次質問返却、進捗返却ができる
- AIライフナビ面談画面が動く
- 面談が最後まで進む
- 面談完了後に次画面へ進める
- lint / test が通る

## Day4 終了時チェック
- Day3 の `LIFE-001` と Day4 の `LIFE-002` / `LIFE-004` がつながっている
- 面談開始から完了まで詰まらない
- 最後の質問時の終了条件が明確
- Day5 の `TODAY-001` と `TODAY-003` に渡す前提データが揃っている
