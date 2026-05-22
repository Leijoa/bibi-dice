# Steamworks 後台流程表

最後更新：2026-05-21  
撰寫者：阿扣  
適用對象：製作人雷爪獅本人

本檔依時序列出登入 Steamworks 後的所有操作，從註冊到 Demo 發布全程。每步驟標註：
- **預計耗時**
- **是否會阻塞下一步**
- **需準備的素材或資訊**
- **本機需配合做什麼**

> ⚠️ **強烈建議：第 0~2 階段越早做越好**。稅務審核 5-10 工作天，是整個排程最長的隱性等待。

---

## 階段 0：登入前準備（本機）

開始之前準備好以下資訊，避免後台填寫時來回找資料。

| 項目 | 已備妥位置 |
| --- | --- |
| 商店名稱（英 / 繁中） | `BIBI DICE` / `比比丟八` |
| Demo 名稱 | `比比丟八 Demo` |
| 開發商 / 發行商 | 雷爪獅 / 雷爪獅 |
| 官網 URL | `https://leijoa.itch.io/bibi-dice` |
| 短描述（4 語） | `STEAMWORKS_FIELDS_DRAFT.md` 第 2 區 |
| 長描述（繁中 / 英文 BBCode）| 同上第 3 區 |
| Demo 頁描述（繁中 / 英文）| 同上第 4 區 |
| 推薦標籤 19 個 | 同上第 5 區 |
| 系統需求 | 同上第 7 區 |
| AI 揭露文字（繁中 / 英文）| 同上第 8 區 |
| IARC 答案 10 題 | 同上第 9 區 |
| 上傳素材 11 張 | `promo/steam/assets/` |
| 銀行帳戶資訊 | 製作人自備 |
| 稅務識別資訊（W-8BEN / 居住地證明）| 製作人自備 |
| 信用卡（付 App Fee）| 製作人自備 |
| 隱私政策頁面 URL | GitHub 公開 URL：`https://github.com/Leijoa/bibi-dice/blob/main/promo/steam/PRIVACY_POLICY.md` |

---

## 階段 1：建立帳號 + 法律 / 稅務 / 銀行

| 步驟 | 操作 | 預計耗時 | 阻塞 | 備註 |
| --- | --- | --- | --- | --- |
| 1.1 | 前往 https://partner.steamgames.com 申請 Steamworks 帳號 | 10 分鐘 | ✅ 阻塞所有後續 | 用既有 Steam 帳號登入即可，但需綁定為 Partner |
| 1.2 | 簽署 Steam Distribution Agreement（電子簽名）| 5 分鐘 | ✅ | 同意 Steam 30% 分潤等條款 |
| 1.3 | 填寫公司 / 個人資訊（地址、聯絡電話）| 10 分鐘 | ✅ | 雷爪獅選「Individual」 |
| 1.4 | 填寫稅務資訊（Tax Interview）| 30 分鐘 | ✅ | 台灣居民填 W-8BEN，避免 30% 美國預扣稅，可改為 10%（依台美租稅協定）|
| 1.5 | 填寫銀行帳戶資訊（Payment Information）| 15 分鐘 | ✅ | 接受台幣帳戶（中信、玉山、國泰等大行較順）|
| 1.6 | 等待 Steam 審核稅務與銀行資料 | **5-10 工作天** | ✅ 嚴重阻塞 | 不通過無法上架，**這是整個排程最長的等待** |

**目標完成日：2026-05-23 前送出，預計 2026-06-02 審核通過**

---

## 階段 2：建立第一個 App（支付 App Fee）

| 步驟 | 操作 | 預計耗時 | 阻塞 | 備註 |
| --- | --- | --- | --- | --- |
| 2.1 | 在後台點「Create New App」| 5 分鐘 | ✅ | 進入「Steam Direct」流程 |
| 2.2 | 支付 US$100 App Fee（信用卡）| 5 分鐘 | ✅ | 達 US$1,000 銷售後可申請退款 |
| 2.3 | 取得 **Base Game AppID**（建立後產生）| 即時 | ✅ | **必須記錄**，後續所有操作都用得到 |
| 2.4 | 30 天冷卻期 | 30 天 | ⚠️ 部分阻塞 | App 建立後 **30 天內不能發布**。建議現在就建立讓冷卻期自然走完 |

**目標完成日：2026-05-23 前完成，30 天冷卻 2026-06-22 結束**

> ⚠️ **30 天冷卻會影響 7/1 Demo 發布**：5/23 建立 App → 6/22 才能發布。Demo 7/1 發布可行；但若希望提前，必須提前建 App。

---

## 階段 3：填寫 Base Game 商店頁

整個階段對照 `STEAMWORKS_FIELDS_DRAFT.md` 操作即可。

| 步驟 | 操作 | 預計耗時 | 阻塞 | 對應草稿 |
| --- | --- | --- | --- | --- |
| 3.1 | 填基本資訊（名稱、開發商、發行商、官網）| 10 分鐘 | — | 草稿第 1 區 |
| 3.2 | 填短描述（繁中、簡中、英、日 各 1 條）| 15 分鐘 | — | 草稿第 2 區 |
| 3.3 | 填長描述（繁中、英文 BBCode）| 20 分鐘 | — | 草稿第 3 區 |
| 3.4 | 填「關於此遊戲」區塊 | 10 分鐘 | — | 與長描述併用 |
| 3.5 | 設定支援語言（介面 4 語勾選）| 5 分鐘 | — | 草稿第 6 區 |
| 3.6 | 設定遊戲標籤（19 個，含搜尋對應）| 20 分鐘 | — | 草稿第 5 區 |
| 3.7 | 設定系統需求（Windows 最低 / 建議）| 10 分鐘 | — | 草稿第 7 區 |
| 3.8 | 設定定價（US$2.99，含區域定價）| 10 分鐘 | — | B-01 |

**整段預計：1.5-2 小時**

---

## 階段 4：上傳素材（11 張圖）

從 `D:\unity\bibi-dice\promo\steam\assets\` 拖曳上傳即可。

| 步驟 | 檔案 | 上傳位置 |
| --- | --- | --- |
| 4.1 | `store_header_capsule_920x430.png` | Store Assets → Header Capsule |
| 4.2 | `store_small_capsule_462x174.png` | Store Assets → Small Capsule |
| 4.3 | `store_main_capsule_1232x706.png` | Store Assets → Main Capsule |
| 4.4 | `store_vertical_capsule_748x896.png` | Store Assets → Vertical Capsule |
| 4.5 | 6 張 Screenshot | Store Assets → Screenshots |
| 4.6 | `library_capsule_600x900.png` | Library Assets → Library Capsule |
| 4.7 | `library_header_capsule_920x430.png` | Library Assets → Library Header |
| 4.8 | `library_logo_1280x720.png` | Library Assets → Library Logo |
| 4.9 | `shortcut_icon_256x256.png` | App Data → Shortcut Icon |
| 4.10 | `app_icon_184x184.jpg` | App Data → App Icon |

**整段預計：30 分鐘**

---

## 階段 5：IARC 年齡分級 + AI 揭露 + 隱私政策

| 步驟 | 操作 | 預計耗時 | 對應草稿 |
| --- | --- | --- | --- |
| 5.1 | 進入「Age Rating」→ 開始 IARC 問卷 | 5 分鐘 | 草稿第 9 區 |
| 5.2 | 依草稿答 10 題（E-08 Demo 答「否」）| 15 分鐘 | E-01~E-10 |
| 5.3 | 提交問卷取得自動分級 | 即時 | 預計 PEGI 3 / ESRB E |
| 5.4 | 進入「AI Disclosure」勾選「使用 AI 生成」| 5 分鐘 | 草稿第 8 區 |
| 5.5 | 貼入 AI 揭露文字（繁中 + 英文）| 5 分鐘 | 草稿第 8 區揭露文字 |
| 5.6 | 在「Privacy Policy URL」貼入隱私政策連結 | 5 分鐘 | `https://github.com/Leijoa/bibi-dice/blob/main/promo/steam/PRIVACY_POLICY.md` |

**整段預計：35 分鐘**

---

## 階段 6：建立 Demo App + 商店頁

| 步驟 | 操作 | 預計耗時 | 備註 |
| --- | --- | --- | --- |
| 6.1 | 在 Base Game 頁點「Add a Demo」 | 5 分鐘 | 不需再付 App Fee |
| 6.2 | 取得 **Demo AppID**、**Demo DepotID** | 即時 | **必須記錄** |
| 6.3 | 填 Demo 商店頁描述 | 10 分鐘 | 草稿第 4 區 |
| 6.4 | 連結 Base Game ↔ Demo | 5 分鐘 | 確認「Demo for」欄位指向 Base Game |
| 6.5 | Demo 頁定價設為「Free」 | 即時 | — |

**整段預計：20-30 分鐘**

---

## 階段 7：本機 SteamPipe 設定（製作人本機操作）

完成階段 6 取得 Demo AppID / DepotID 後執行。

| 步驟 | 操作 | 對應文件 |
| --- | --- | --- |
| 7.1 | 下載並安裝 SteamCMD | `STEAMPIPE_DEPOT_DRAFT.md` 第 1 區 |
| 7.2 | 建立 `D:\unity\bibi-dice\steam-build\` 目錄（已加入 `.gitignore`） | 第 2 區 |
| 7.3 | 在該目錄建立 `app_build_demo.vdf` 與 `depot_build_demo.vdf`，填入真實 AppID / DepotID | 第 4 區 Step 2 範本 |
| 7.4 | 執行 `npm.cmd run steam:verify` 確認 build 就緒 | 第 2 區 |
| 7.5 | 執行 `steamcmd.exe +login <帳號> +run_app_build <vdf 路徑>` | 第 4 區 Step 3 |
| 7.6 | 記錄 BuildID | — |
| 7.7 | 回後台 SteamPipe → Builds，SetLive 到 `internal` branch 自測（依 C-03）| 第 4 區 Step 4 |
| 7.8 | 自測通過後手動 SetLive 到 `default` | C-04 製作人本人執行 |

**整段預計：1-2 小時（首次含 SteamCMD 安裝時間）**

---

## 階段 8：送審 Coming Soon + Demo

| 步驟 | 操作 | 預計耗時 | 阻塞 |
| --- | --- | --- | --- |
| 8.1 | 在後台確認 Base Game 所有欄位填寫完整 | 30 分鐘 | ✅ |
| 8.2 | 送 Base Game Store Presence Review（Coming Soon 審核）| 即時送出 | ✅ |
| 8.3 | 等待 Steam 審核 | **1-5 工作天** | ✅ 阻塞 |
| 8.4 | 審核通過後，**公開 Coming Soon 頁** | 即時 | ✅ |
| 8.5 | Coming Soon 頁公開至少 **2 週** | 14 天 | ✅ Steam 規定 |
| 8.6 | 同時送 Demo Build + Demo Store Presence 審核 | 即時 | — |
| 8.7 | Demo 審核通過 | **1-5 工作天** | ✅ |
| 8.8 | 在 Demo 預定日按下「Release Demo」 | 即時 | — |

**目標排程對照：**
- 2026-06-03 ← 階段 8.2 送審
- 2026-06-10 ← 階段 8.4 公開 Coming Soon
- 2026-06-24 起 ← Coming Soon 滿 2 週，可發 Demo
- 2026-07-01 ← 階段 8.8 發布 Demo

---

## 整體甘特圖

```
2026-05-21 ──┬── 階段 1：稅務銀行送審 ────────────┐
             │   （5-10 工作天）                    │
             ├── 階段 2：付 App Fee 建立 App ───┐  │
             │   （30 天冷卻期 → 6/22 解除）    │  │
             │                                  │  │
2026-06-01 ──┼── 階段 3-5：填寫商店頁、上傳素材 ─┴──┴── 完成
             │   （3-4 小時）
             │
2026-06-03 ──┼── 階段 8.2：送審 Coming Soon
             │   （1-5 工作天）
             │
2026-06-10 ──┼── 階段 8.4：公開 Coming Soon
             │   （至少 2 週）
             │
2026-06-20 ──┼── 階段 6-7：建立 Demo App、SteamPipe 上傳
             │
2026-06-24 ──┼── 階段 8.6：送 Demo 審核
             │   （1-5 工作天）
             │
2026-07-01 ──┴── 階段 8.8：發布 Demo 🎉
```

---

## 必死注意事項

1. **稅務審核越早送越好** — 5-10 工作天阻塞所有後續，本週內送出最安全
2. **30 天冷卻期** — App 建立後 30 天才能發布，建議 5/23 前建立
3. **隱私政策 URL** — 是 Demo 送審 blocker，已準備 GitHub 公開 URL，5/31 前必須填入後台；itch.io 頁面仍需手動加入連結
4. **不要在送審後改商店頁文字** — 修改會觸發重新審核
5. **截圖欄位只放實機截圖** — 不要把宣傳合成圖混入，會被退回
6. **Steam Deck 相容性** — 草稿建議留空 / 「Unknown」，不要勾「Verified」
7. **VDF 設定檔不要提交到 git** — `steam-build/` 已加入 `.gitignore`，密碼絕不可寫進去

---

## 阻塞依賴清單

```
階段 1 稅務銀行 → 阻塞所有付款相關
階段 2 App Fee + AppID → 阻塞階段 3~8
階段 5.6 隱私政策 URL → 阻塞階段 8.2 送審
階段 6 Demo AppID → 阻塞階段 7 SteamPipe
階段 8.3 Coming Soon 審核 → 阻塞階段 8.4
階段 8.5 Coming Soon 公開 2 週 → 阻塞階段 8.8
```

---

## 相關文件

| 文件 | 用途 |
| --- | --- |
| [`STEAMWORKS_FIELDS_DRAFT.md`](STEAMWORKS_FIELDS_DRAFT.md) | 所有欄位填寫草稿（10 區）|
| [`STEAM_ASSET_FINAL_AUDIT.md`](STEAM_ASSET_FINAL_AUDIT.md) | 11 張素材清單與檔案位置 |
| [`STEAMPIPE_DEPOT_DRAFT.md`](STEAMPIPE_DEPOT_DRAFT.md) | SteamPipe 上傳流程細節 |
| [`STEAM_RELEASE_CHECKLIST.md`](STEAM_RELEASE_CHECKLIST.md) | 三區檢查清單總表 |
| [`STEAM_OWNER_DECISIONS.md`](STEAM_OWNER_DECISIONS.md) | 製作人決策清單（已填）|
