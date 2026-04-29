# Release Checklist

## 結構
- [ ] `SKILL.md` 存在且可作為 skill 入口
- [ ] `README.md`、`CHANGELOG.md`、`KNOWN-LIMITATIONS.md`、`TROUBLESHOOTING.md` 存在
- [ ] `workflow/`、`references/`、`templates/`、`examples/`、`scripts/` 結構完整

## 文件一致性
- [ ] `README.md`、`SKILL.md`、`workflow`、`references` 對必要產物定義一致
- [ ] `MockStrategy.md` 與 `GapReport.md` 的條件式規則一致
- [ ] `GenerationReview.md` 與 `ExecutionRaw.log` 的必要性定義一致
- [ ] `RunReport` 狀態欄位與治理規則一致

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
