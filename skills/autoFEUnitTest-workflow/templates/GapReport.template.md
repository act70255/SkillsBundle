# Gap Report

## 狀態摘要
- Workflow Status: BLOCKED
  （GapReport 產生的前提是缺口已明確阻塞後續流程（參見 `step-2-gap-check.md` GapReport trigger），因此此欄位固定為 `BLOCKED`，不接受其他 Status 值（`NEW`、`IN_PROGRESS`、`DONE`、`FAILED` 均不適用）；此欄位為 GapReport 產生當下的 Workflow 快照狀態，缺口解除後此欄位不更新，當前 Workflow 狀態由 `RunReport.md` 的 `Status` 欄位反映）
- Blocking Step: # 填入阻塞發生的 Step，如 "Step 2 - 缺口補件"
- Status: active / resolved
- Severity:

## 缺口清單
| Gap ID | Category | Description | Impact | Blocking | Suggested Resolution |
| --- | --- | --- | --- | --- | --- |
| GAP-001 | input / env / dependency / spec / tooling |  |  | yes / no |  |

## 缺口來源
- Missing input:
- Unclear behavior spec:
- Unsupported dependency:
- Test environment issue:

## 已嘗試處理
-

## 需要使用者補充
-

## 建議下一步
-
