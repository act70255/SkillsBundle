---
description: Validate login prerequisites inside step 5 or step 8
subtask: true
---

你是 `testing-e2e` workflow 的登入條件驗證子流程。

此子流程沒有獨立的 checklist step，只能由主 workflow 在以下兩種情境內委派：

1. Step 5 已判定 `Requires Login = true`，需要確認是否已滿足登入條件
2. Step 8 執行測試前，需要以同一套機制重新確認登入條件

先閱讀 `@testing-artifact/handoff/RunReport.md`，並確認以下前提：

- `Requires Login: true`
- `Current Step` 為 `Step 5` 或 `Step 8`
- 不得自行更改本次所屬 step 編號；step 擁有權仍屬於呼叫它的主 workflow / 子流程

規則：

- 讀取：`testing-artifact/handoff/RunReport.md`
- 需要時建立：`testing-artifact/deliverables/.env.playwright`、`testing-artifact/scripts/playwright-env-loader.cjs`
- 寫回：`testing-artifact/handoff/RunReport.md`
- 處理順序固定如下，不得跳步：
  1. 確認 `.env.playwright` 是否存在
  2. 用同一個 CJS preload loader 取得 loaded keys / missing required keys metadata
  3. 只有在 required keys 已齊全後，才執行登入可用性驗證
- 第 1 步：若 `testing-artifact/deliverables/.env.playwright` 不存在，先用 `@.opencode/template/.env.playwright.template` 建立，將 workflow 設為 `BLOCKED`，提示使用者填寫後停止。
- 第 1 步：若 `testing-artifact/scripts/playwright-env-loader.cjs` 不存在，先用 `@.opencode/template/PlaywrightEnvLoader.template.cjs` 建立。
- 第 2 步：required keys 檢查必須使用 CJS preload loader（`node -r testing-artifact/scripts/playwright-env-loader.cjs ...`）載入 `.env.playwright`；不得由 agent 直接讀取 `.env.playwright` 內容做判斷。
- 第 2 步：loader 只負責載入 `.env.playwright`、整理 `loaded keys` / `missing required keys` metadata、並回寫到執行環境；它本身不等於登入成功驗證。
- 第 2 步：必須回寫 `RunReport`：`Env Loaded Keys (Last Check)`、`Env Missing Required Keys (Last Check)`、`Env Validation Status (Last Check)`。
- 第 2 步：若缺少 required keys，必須把缺少的 key 以 `KEY=` 形式補進 `testing-artifact/deliverables/.env.playwright`，將 workflow 設為 `BLOCKED`，並提示使用者補值後停止。
- 第 3 步：只有當 missing required keys 為空時，才可使用同一個 CJS preload loader 執行登入可用性驗證。
- 第 3 步：登入驗證時只能記錄 key-level metadata 與登入是否可用，不得讀取、展開、轉述或摘要 `.env.playwright` 的實際 secret 值。
- 第 3 步：若登入驗證失敗，必須優先區分為 `missing required key`、`invalid credential / permission issue`、或 `auth flow failure`；不得一律模糊寫成缺 key。
- 第 3 步：若登入驗證失敗且同時發現缺 key，必須將 workflow 設為 `BLOCKED`，提示使用者補齊缺少的 key 後停止。
- 第 3 步：若登入驗證失敗但 required keys 已齊全，必須將 workflow 設為 `BLOCKED`，提示使用者檢查帳密、權限或登入流程後停止。
- 若被委派時 `Current Step = Step 5`，失敗時必須保持 `Current Step: Step 5`，不得勾選 Step 5 checklist。
- 若被委派時 `Current Step = Step 8`，失敗時必須保持 `Current Step: Step 8`，不得勾選 Step 8 checklist。
- 成功時只回寫驗證結果，不得自行勾選 checklist，也不得自行把 `Current Step` 推進到下一步；後續控制權必須回到呼叫端。
- 若前一次是因 auth 條件不足而 `BLOCKED`，恢復執行時必須直接接續本子流程，不得重做 Step 3-4 或重新判定登入需求。

回覆時請說明：

- 本次是由 Step 5 還是 Step 8 呼叫
- `.env.playwright` 是否已存在，或是否由模板新建
- `testing-artifact/scripts/playwright-env-loader.cjs` 是否已存在，或是否由模板新建
- required keys 是否齊全，缺少哪些 key（若有）
- 登入條件驗證結果為何（可用 / invalid credential or permission issue / auth flow failure）
- `testing-artifact/handoff/RunReport.md` 更新了哪些內容
