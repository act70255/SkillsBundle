# autoqa-workflow

完整、自包含的 AI 輔助 E2E 測試 workflow skill。載入單一 skill 即可執行 Step 0~9 的完整受治理測試流程。

## 前置條件
**建議先準備好環境以確認 workflow 執行順暢**
### Node.js
需要 Node.js 18 以上版本。

```bash
node --version  # 確認版本 >= 18
```

### Playwright
在你的測試專案目錄安裝：

```bash
npm install -D @playwright/test
npx playwright install          # 安裝瀏覽器（Chromium/Firefox/WebKit）
npx playwright install-deps     # 安裝系統相依套件（Linux 需要）
```

### 登入憑證（需要登入的專案）
在測試專案根目錄建立 `testing-artifact/deliverables/.env.playwright`：

```env
PLAYWRIGHT_USERNAME=your_username
PLAYWRIGHT_PASSWORD=your_password
```

> 參考 `templates/.env.playwright.template`

---

## 安裝 Skill

### Claude Code

**個人安裝（所有專案皆可用）：**

```bash
測試專案/
├── .claude/                    ← Claude Code 專案 Skills
│   └── skills/
│       └── autoqa-workflow/
│           ├── SKILL.md        ← 必要，主要指令
│           ├── .....
├── src/
├── docs/
├── ...
```

安裝後重新啟動 Claude Code，或在當前 session 輸入 `/skills` 確認已載入。

### Codex CLI

Codex CLI 支援 [AgentSkills](https://agentskills.io) 開放標準，與 Claude Code 使用相同格式。

```bash
測試專案/
├── .codex/                    ← Codex CLI 專案 Skills
│   └── skills/
│       └── autoqa-workflow/
│           ├── SKILL.md        ← 必要，主要指令
│           ├── .....
├── src/
├── docs/
├── ...
```

> 請依照你的 Codex CLI 版本確認 skills 目錄路徑。

---

## 使用方式

### 啟動完整 workflow（最常用）

```prompt
請載入 autoqa-workflow，並執行完整 Step 0~9。
```

### one-shot 指定 source code 一起掃描

```
請載入 autoqa-workflow，並執行完整 Step 0~9。

target_url: https://your-app.com
dev_docs_path: ./docs
source_code_path: ./src
```

### 從中間步驟繼續（workflow 中斷後恢復）

```
請載入 autoqa-workflow，從 RunReport 確認上次進度並繼續。
```

---

## Workflow 步驟總覽

| Step | 內容 | 產出 |
|------|------|------|
| 0 | RunReport 初始化 / 狀態確認 | `RunReport.md` |
| 1-2 | 輸入驗證 + 補問 | `InputSummary.md` |
| 3 | Docs baseline 建立 | `DocsBaseline.md` |
| 4 | Source code 掃描（可 skip） | `SrcScanSummary.md` |
| 5 | 登入需求判斷 + Auth gate | `.env.playwright` 驗證 |
| 6 | 站台掃描 + a11y mini-sweep | `SiteScanSummary.md` |
| 7 | 生成測試文件 | `TestPlan.md` / `TestCases.md` / `TestScript.ts` / `RequirementTraceability.md` |
| 8 | 執行測試 + 非功能性 baseline | `ExecutionRaw.json` / `ExecutionSummary.md` |
| 9 | 最終報告 + DONE gate | `TestReport.md` |

### Artifact 目錄結構

```
testing-artifact/
├── deliverables/
│   ├── .env.playwright        # 登入憑證（不進版控）
│   ├── TestPlan.md
│   ├── TestCases.md
│   ├── TestReport.md
│   └── RequirementTraceability.md
├── handoff/
│   ├── InputSummary.md
│   ├── DocsBaseline.md
│   ├── SrcScanSummary.md
│   ├── SiteScanSummary.md
│   ├── GenerationReview.md
│   ├── ExecutionRaw.json
│   └── ExecutionSummary.md
└── scripts/
    ├── TestScript.ts
    └── playwright-env-loader.cjs
```

---

## Bundle 內容

| 檔案 | 說明 |
|------|------|
| `SKILL.md` | 主進入點，workflow 架構與 pipeline 定義 |
| `governance.md` | PASS/FAIL/BLOCKED/SKIPPED 語意鎖定、RTM 規則 |
| `project-profile-autoqa.md` | AutoQA 專案路徑與 auth 預設值 |
| `step-*.md` | Step 1~9 各步驟執行指令（8 檔） |
| `templates/` | 所有 artifact 標準模板 |
| `scripts/verify-skill-bundle.mjs` | Bundle 完整性驗證腳本 |

### 驗證 bundle 完整性

```bash
node skills/autoqa-workflow/scripts/verify-skill-bundle.mjs
```

---

## 給其他專案使用

若要在非 AutoQA 的專案上使用此 workflow：

1. 參考 `../autoqa-project-profile-template/SKILL.md` 建立新的 profile
2. 在 `autoqa-workflow/` 內新增 `project-profile-yourproject.md`
3. 啟動時告知 Claude 使用哪個 project profile

```
請載入 autoqa-workflow，使用 project-profile-yourproject.md 的設定，執行完整 Step 0~9。
```
