# Release Checklist

## 結構
- [ ] `SKILL.md` 存在且可作為 skill 入口
- [ ] `README.md`、`CHANGELOG.md`、`KNOWN-LIMITATIONS.md`、`TROUBLESHOOTING.md` 存在
- [ ] `workflow/`、`references/`、`templates/`、`examples/`、`scripts/` 結構完整

## 文件一致性
- [ ] `README.md`、`SKILL.md`、`workflow`、`references` 對必要產物定義一致
- [ ] Step 2 補件完成後一律回到 Step 1 重跑輸入驗證
- [ ] `Missing Required Inputs` 的寫入、清空與阻塞語意一致
- [ ] `framework_type` 與 `acceptance_rules` 的 resolve 時點一致
- [ ] `Planning Gate Status` 與 Step 6 / Step 7 的治理規則一致
- [ ] `MockStrategy.md` 與 `GapReport.md` 的條件式規則一致
- [ ] `GenerationReview.md` 與 `ExecutionRaw.log` 的必要性定義一致
- [ ] `test-report-html/index.html` 與 `coverage-html/index.html` 的必要性、阻塞例外與標準路徑定義一致
- [ ] `RunReport` 狀態欄位與治理規則一致
- [ ] `Normalization Status` gate 欄位在 RunReport、Step 3、Step 4、output-contract、governance 中一致
- [ ] `GapReport.md` 產生後的解除路徑（`GapReport.Status = resolved` 更新規則）在 step-2、output-contract、GapReport 模板中一致定義
- [ ] `TestAssetManifest.md` 表格格式（Script Path / Case IDs / Covered Functions / Status）在 step-7、output-contract、evidence-contract、template 中描述一致
- [ ] `Test Env Status` 合法值（`not_checked / passed / blocked`）在 RunReport 模板、Step 1、Step 8、governance 中一致；jQuery/HTML+JS 自動初始化分支（Vitest or Jest）與 `strategy-matrix.md` 描述一致
- [ ] `test_env` 的 auto-repairable 語意一致：Step 1 不得因其他 required inputs 缺失而延後 auto-setup，Step 2 不得把 `test_env` 當作一般一問一答補件欄位
- [ ] Step 9 的收尾互動語意一致：先用中文總結；只有在 HTML 報告已產出時才主動詢問是否要用網頁檢視

## 驗證
- [ ] `node scripts/verify-skill-bundle.mjs`
- [ ] `node scripts/verify-workflow-skill.mjs`
- [ ] `node scripts/verify-output-contract.mjs`
- [ ] `node scripts/verify-doc-consistency.mjs`
- [ ] `node scripts/verify-all.mjs`

## 使用者視角
- [ ] 新使用者可從 `README.md` 理解用途、用法、邊界與主要產物
- [ ] 常見阻塞可從 `TROUBLESHOOTING.md` 找到指引
- [ ] 條件式產物何時出現說明清楚

## 發布判定
- [ ] 無未解決高優先級 review finding
- [ ] 所有驗證腳本通過
- [ ] 技能包內容可追溯、可治理、可續跑
