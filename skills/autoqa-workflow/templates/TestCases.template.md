# 測試案例

## 案例清單

| Case ID | Source Ref | Flow Type | Preconditions | Steps | Assertions | Expected Result | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-001 | Docs: / Scan: | happy-path |  |  |  |  | high |
| TC-002 | Docs: / Scan: | negative |  |  |  |  | high |

| Case ID | Requirement ID / Doc Anchor | Source Ref | Flow Type | Preconditions | Steps | Assertions | Expected Result | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-001 | REQ-001 / docs#section-x | Docs: / Scan: | happy-path |  |  |  |  | high |
| TC-002 | REQ-002 / docs#section-y | Docs: / Scan: | negative |  |  |  |  | high |

## 覆蓋統計（必填）
- Flow Type Counts: happy-path= ; negative= ; boundary= ; permission=
- Coverage Rule Check: non-happy(happy-path 以外) >= happy-path（若已識別驗證/權限/分支/邊界訊號）
- Critical Flow Mapping: CF-001 -> [TC- ], CF-002 -> [TC- ]

## 追蹤對應
| Trace Type | Reference | Related Case IDs | Notes |
| --- | --- | --- | --- |
| Source Document |  | TC- |  |
| Source Code Scan Reference |  | TC- |  |
| Related Page / Route |  | TC- |  |

| Risk ID | Risk Description | Related Case IDs | Coverage Status |
| --- | --- | --- | --- |
| R-001 |  | TC- | covered |

## RTM 同步檢查（必填）
- `testing-artifact/deliverables/RequirementTraceability.md` 已更新：yes/no
- Covered Requirements:
- Partial Requirements:
- Not-covered Requirements:

## 備註
-
