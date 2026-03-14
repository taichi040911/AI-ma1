# 11本目以降の次の10チケット実行パック

## 目的
最初の10チケットで作った  
**登録 → OTP → 基本プロフィール → AIライフナビ → Today**  
の流れの次に、**Action → 候補閲覧 → Like → Match一覧** までをつなぐ実行パックです。

この10本が終わると、ユーザーは次の体験まで進めます。

- Today から Action に進める
- 共同行動を見られる
- 共同行動詳細から「相手」や「イベント」へ進める
- おすすめユーザー一覧を見られる
- ユーザー詳細を見られる
- Like を送れる
- Match 一覧を取得できる

---

## 実行順 10本

### 11. COACT-001 共同行動一覧API
**目的**  
Action画面の入口となる一覧データを返す

**参照**
- `AGENTS.md`
- `docs/integrated_openapi_final.yaml`

**Codex依頼テンプレ**
```text
目的:
共同行動一覧APIを実装したい

参照:
- AGENTS.md
- docs/integrated_openapi_final.yaml

対象:
- GET /co-actions

やってほしいこと:
1. 共同行動一覧取得を実装
2. difficulty / mood / purpose の filter に対応
3. items を返す
4. テストを追加
5. OpenAPIとの差異がないか確認する

最後に、
1. 変更ファイル一覧
2. 実施したテスト
3. 置いた仮定
4. 次のチケットへの影響
をまとめてください。
```

**完了条件**
- `GET /co-actions` が動く
- filter が使える
- テストあり

---

### 12. COACT-003 Action画面
**目的**  
Today の次の主要導線として、行動一覧を見せる

**Codex依頼テンプレ**
```text
目的:
Action画面を実装したい

参照:
- AGENTS.md
- docs/final_screen_list_with_billing.md
- docs/screen_api_mapping.xlsx
- docs/integrated_openapi_final.yaml

対象:
- Screen Name: Action 一覧
- API: GET /co-actions

やってほしいこと:
1. Action画面UIを実装
2. 共同行動一覧を表示
3. 気軽 / 少人数 / イベント導線を置く
4. loading / empty / error state を追加
5. テストを追加

最後に、
1. 変更ファイル一覧
2. 実施したテスト
3. 置いた仮定
4. 次のチケットへの影響
をまとめてください。
```

**完了条件**
- Action画面が表示される
- 共同行動カードが出る
- empty/error がある

---

### 13. COACT-002 共同行動詳細API
**目的**  
行動ごとの詳細と、そこから進める候補を返す

**Codex依頼テンプレ**
```text
目的:
共同行動詳細APIを実装したい

参照:
- AGENTS.md
- docs/integrated_openapi_final.yaml

対象:
- GET /co-actions/{id}

やってほしいこと:
1. 詳細取得を実装
2. `why_for_you` を返す
3. `matching_users` を返す
4. `matching_events` を返す
5. テストを追加
6. OpenAPIとの差異がないか確認する

最後に、
1. 変更ファイル一覧
2. 実施したテスト
3. 置いた仮定
4. 次のチケットへの影響
をまとめてください。
```

**完了条件**
- 詳細取得できる
- why_for_you がある
- matching_users / matching_events がある

---

### 14. COACT-004 共同行動詳細画面
**目的**  
行動詳細から人やイベントへ進む導線を作る

**Codex依頼テンプレ**
```text
目的:
共同行動詳細画面を実装したい

参照:
- AGENTS.md
- docs/final_screen_list_with_billing.md
- docs/screen_api_mapping.xlsx
- docs/integrated_openapi_final.yaml

対象:
- Screen Name: 共同行動詳細
- API: GET /co-actions/{id}

やってほしいこと:
1. 詳細画面UIを実装
2. why_for_you を表示
3. 相手一覧 / イベント一覧への導線を追加
4. loading / empty / error state を追加
5. テストを追加

最後に、
1. 変更ファイル一覧
2. 実施したテスト
3. 置いた仮定
4. 次のチケットへの影響
をまとめてください。
```

**完了条件**
- 詳細画面が表示される
- 人/イベントへ遷移できる
- 理由が読める

---

### 15. REC-001 おすすめユーザー一覧API
**目的**  
候補ユーザー一覧を返す

**Codex依頼テンプレ**
```text
目的:
おすすめユーザー一覧APIを実装したい

参照:
- AGENTS.md
- docs/integrated_openapi_final.yaml

対象:
- GET /recommendations/users

やってほしいこと:
1. 候補一覧取得を実装
2. compatibility を返す
3. recommended_entry_mode を返す
4. next_best_action を返す
5. relationship_style_hint を返す
6. テストを追加
7. OpenAPIとの差異がないか確認する

最後に、
1. 変更ファイル一覧
2. 実施したテスト
3. 置いた仮定
4. 次のチケットへの影響
をまとめてください。
```

**完了条件**
- 一覧取得できる
- 相性情報がある
- next_best_action がある

---

### 16. REC-005 おすすめユーザー一覧画面
**目的**  
候補一覧をUIで見せる

**Codex依頼テンプレ**
```text
目的:
おすすめユーザー一覧画面を実装したい

参照:
- AGENTS.md
- docs/final_screen_list_with_billing.md
- docs/screen_api_mapping.xlsx
- docs/integrated_openapi_final.yaml

対象:
- Screen Name: おすすめユーザー一覧
- API: GET /recommendations/users

やってほしいこと:
1. 一覧UIを実装
2. compatibility ラベルを表示
3. フィルタUIを追加
4. empty / error state を追加
5. テストを追加

最後に、
1. 変更ファイル一覧
2. 実施したテスト
3. 置いた仮定
4. 次のチケットへの影響
をまとめてください。
```

**完了条件**
- 候補一覧が見える
- フィルタできる
- empty/error がある

---

### 17. REC-002 おすすめユーザー詳細API
**目的**  
Like前に必要な候補詳細を返す

**Codex依頼テンプレ**
```text
目的:
おすすめユーザー詳細APIを実装したい

参照:
- AGENTS.md
- docs/integrated_openapi_final.yaml

対象:
- GET /recommendations/users/{id}

やってほしいこと:
1. 詳細取得を実装
2. shared_points を返す
3. current_fit_reason を返す
4. co_actions を返す
5. avoid_rushing_points を返す
6. テストを追加
7. OpenAPIとの差異がないか確認する

最後に、
1. 変更ファイル一覧
2. 実施したテスト
3. 置いた仮定
4. 次のチケットへの影響
をまとめてください。
```

**完了条件**
- 詳細取得できる
- shared_points がある
- co_actions がある

---

### 18. REC-006 ユーザー詳細画面
**目的**  
候補詳細を確認して Like へ進める

**Codex依頼テンプレ**
```text
目的:
ユーザー詳細画面を実装したい

参照:
- AGENTS.md
- docs/final_screen_list_with_billing.md
- docs/screen_api_mapping.xlsx
- docs/integrated_openapi_final.yaml

対象:
- Screen Name: ユーザー詳細
- API: GET /recommendations/users/{id}

やってほしいこと:
1. 詳細画面UIを実装
2. shared_points / co_actions を表示
3. Like導線を追加
4. empty / error state を追加
5. テストを追加

最後に、
1. 変更ファイル一覧
2. 実施したテスト
3. 置いた仮定
4. 次のチケットへの影響
をまとめてください。
```

**完了条件**
- 詳細画面が出る
- Likeボタンがある
- 詳細理由が読める

---

### 19. MATCH-001 いいね送信API
**目的**  
候補に対して Like を送れるようにする

**Codex依頼テンプレ**
```text
目的:
いいね送信APIを実装したい

参照:
- AGENTS.md
- docs/integrated_openapi_final.yaml

対象:
- POST /likes

やってほしいこと:
1. like 作成処理を実装
2. 相互 like のとき match を作成
3. matched 時に必要情報を返す
4. テストを追加
5. OpenAPIとの差異がないか確認する

最後に、
1. 変更ファイル一覧
2. 実施したテスト
3. 置いた仮定
4. 次のチケットへの影響
をまとめてください。
```

**完了条件**
- Like送信できる
- 相互時に match になる
- テストあり

---

### 20. MATCH-002 マッチ一覧API
**目的**  
Like後の遷移先として、マッチ一覧を返す

**Codex依頼テンプレ**
```text
目的:
マッチ一覧APIを実装したい

参照:
- AGENTS.md
- docs/integrated_openapi_final.yaml

対象:
- GET /matches

やってほしいこと:
1. マッチ一覧取得を実装
2. unread_count を返す
3. relationship_stage を返す
4. next_best_action / ai_note を返す
5. テストを追加
6. OpenAPIとの差異がないか確認する

最後に、
1. 変更ファイル一覧
2. 実施したテスト
3. 置いた仮定
4. 次のチケットへの影響
をまとめてください。
```

**完了条件**
- マッチ一覧取得できる
- unread_count がある
- relationship_stage がある

---

## この10本が終わるとできること
- Action で行動を選べる
- 候補ユーザーを見られる
- 候補詳細を見られる
- Like を送れる
- マッチ一覧を取得できる

つまり、**最初の価値体験の次に来る「接点の入口」まで到達** できます。

---

## 次の自然な続き
この次の10本では、以下に進むのが自然です。

- `MATCH-004 マッチ一覧画面`
- `CHAT-001 メッセージ一覧API`
- `CHAT-002 メッセージ送信API`
- `CHAT-003 AI会話提案API`
- `CHAT-005 チャット画面`
- `COACH-001 関係コーチAPI`
- `COACH-002 関係コーチ付きチャット`
- `SAFE2-001 会う前チェックAPI`
- `SAFE2-002 会う前チェック画面`
- `REFL-001 接点後振り返りAPI`
