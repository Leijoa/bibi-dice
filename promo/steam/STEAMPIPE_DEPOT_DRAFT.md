# SteamPipe / Depot 上傳手冊

最後更新：2026-05-23  
撰寫者：阿扣  
適用對象：製作人雷爪獅（取得 AppID / DepotID 後執行）

---

## 0. 現況與本檔用法

本檔已轉為「**等待 AppID / DepotID 後可直接照做**」版本。所有需要製作人填入的真實值集中在 **第 2 區「填空參數」**，其餘區塊全部用 `{{TOKEN}}` 占位符引用。

**製作人取得後台 ID 後的步驟：**

1. 在 **第 2 區** 填入 5 個值：`{{DEMO_APPID}}`、`{{DEMO_DEPOTID}}`、`{{STEAM_ACCOUNT}}`、`{{BUILD_DESC}}`、`{{TODAY}}`
2. 依 **第 4 區** 建立 VDF 檔（範本已附）
3. 執行 **第 5 區** 上傳指令
4. 在 Steamworks 後台 SetLive（**第 6 區**）

> ⚠️ **絕對不要把帳號密碼寫進任何檔案**。VDF 內只放 AppID / DepotID（公開資訊）。

---

## 1. 已就緒項目（無需製作人動作）

執行 SteamPipe 前，以下項目本機已備妥：

| 項目 | 狀態 | 驗證指令 |
| --- | --- | --- |
| Web 內容來源 | ✅ `dist/steam-demo` 由 `steam:build` 產出 | `npm.cmd run steam:build` |
| Electron Windows 打包 | ✅ 由 `steam:package` 產出（輸出目錄 = SteamPipe ContentRoot）| `npm.cmd run steam:package` |
| Windows 打包結構驗證 | ✅ 由 `steam:package:verify` 自動檢查 | `npm.cmd run steam:package:verify` |
| 離線啟動驗證（Electron）| ✅ 通過 | `npm.cmd run steam:verify` |
| 三段解析度切換 | ✅ 通過 | 同上 |
| localStorage 持久化 | ✅ 通過 | 同上 |
| 11 張 Steam 素材就緒 | ✅ 通過 | `npm.cmd run steam:assets:verify` |
| i18n 四語系對齊 | ✅ 通過（601 keys × 4） | `npm.cmd run steam:i18n:verify` |
| `.gitignore` 已加入 `steam-build/` | ✅ | 檔案末行 |
| Electron app userData 路徑 | ✅ `%APPDATA%\BIBI DICE 比比丟八\` | `steam:verify` 已驗證 |

> ⚠️ **關鍵釐清**：SteamPipe 上傳的 ContentRoot **必須是 Electron Windows 打包後的輸出目錄**（含 `.exe` 與資源），**不是** `dist/steam-demo`（純 web 內容，玩家拿到無法執行）。請以 `steam:package` 輸出為準。實際輸出路徑由 `scripts/package-steam-windows.ps1` 與 `scripts/verify-steam-windows-build.js` 決定，**製作人首次執行後請把實際路徑回填到第 2 區 `{{WIN_BUILD_DIR}}`**。

## 1.1 仍待製作人取得（必填 blocker）

| 項目 | 取得位置 | 對應 token |
| --- | --- | --- |
| Steamworks Partner 帳號 + 稅務 / 銀行審核通過 | https://partner.steamgames.com | （不入檔，登入用）|
| Base Game AppID | 後台建立 App 後產生 | `{{BASE_APPID}}`（本檔僅參考，VDF 不用）|
| Demo AppID | 後台「Add a Demo」後產生 | `{{DEMO_APPID}}` |
| Demo DepotID | 後台 SteamPipe → Depots 建立後產生 | `{{DEMO_DEPOTID}}` |
| Steamworks 帳號名 | 製作人登入用的帳號 | `{{STEAM_ACCOUNT}}` |
| Steam Guard 2FA 設備 | Steam 客戶端 | （登入時即時輸入）|
| SteamCMD 已下載 | https://partner.steamgames.com/doc/sdk/uploading/quickstart | （路徑記為 `{{STEAMCMD_DIR}}`）|

---

## 2. 填空參數（取得 ID 後填這裡）

> 製作人收到後台分配的 ID 後，**只需要填這個表，其餘區塊會自動引用**。

| Token | 填入值 | 範例（僅示意）| 用途 |
| --- | --- | --- | --- |
| `{{DEMO_APPID}}` | _待填_ | `2899990` | Demo App 的 AppID（純數字）|
| `{{DEMO_DEPOTID}}` | _待填_ | `2899991` | Demo Depot 的 DepotID（純數字，通常為 AppID+1）|
| `{{STEAM_ACCOUNT}}` | _待填_ | `leijoa_dev` | steamcmd 登入帳號 |
| `{{STEAMCMD_DIR}}` | _待填_ | `D:\tools\steamcmd` | SteamCMD 安裝路徑 |
| `{{WIN_BUILD_DIR}}` | _待填_（首次 `steam:package` 後回填）| `D:\unity\bibi-dice\dist\steam-windows` | Electron Windows 打包輸出，即 SteamPipe ContentRoot |
| `{{BUILD_DESC}}` | _待填_ | `BIBI DICE Demo v0.1.0` | 後台 Build 列表顯示的描述 |
| `{{TODAY}}` | _待填_ | `2026-06-25` | 上傳當天日期（寫入 build 描述）|

固定值（不需填，本檔已寫死）：

| 名稱 | 值 |
| --- | --- |
| BuildOutput | `D:\unity\bibi-dice\steam-build\output` |
| VDF 目錄 | `D:\unity\bibi-dice\steam-build\` |
| 預設 SetLive Branch | 空字串（不自動 setlive）|
| 上傳後自測 Branch | `internal`（C-03 製作人決定）|
| 公開 Branch | `default`（自測通過後手動切換）|

---

## 3. Depot / Branch 規格

依製作人決定固定如下：

| 欄位 | 值 | 備註 |
| --- | --- | --- |
| Depot 名稱 | `BIBI DICE Demo Windows Content` | 後台顯示用 |
| Platform | Windows | Demo 僅承諾 Windows |
| Language | All Languages | 四語介面打包同一份 |
| Filesystem | Windows | |
| Default Branch | `default` | 公開發布用 |
| 自測 Branch | `internal` | C-03 規定先進此 branch |

### App 結構

```
Base Game App        AppID: {{BASE_APPID}}   ← 本檔不直接使用，但建議製作人記錄
└── Demo App         AppID: {{DEMO_APPID}}   ← 第 4 區 VDF 用
    └── Demo Depot   DepotID: {{DEMO_DEPOTID}} ← 第 4 區 VDF 用
```

---

## 4. VDF 檔範本（直接複製，替換 token）

### 4.1 建立目錄

```powershell
New-Item -ItemType Directory -Force -Path D:\unity\bibi-dice\steam-build
```

> 此目錄已在 `.gitignore` 中（C-05），不會入版控。

### 4.2 `app_build_demo.vdf`

放置位置：`D:\unity\bibi-dice\steam-build\app_build_demo.vdf`

```vdf
"AppBuild"
{
    "AppID" "{{DEMO_APPID}}"
    "Desc" "{{BUILD_DESC}} - {{TODAY}}"
    "BuildOutput" "D:\unity\bibi-dice\steam-build\output"
    "ContentRoot" "{{WIN_BUILD_DIR}}"
    "SetLive" ""

    "Depots"
    {
        "{{DEMO_DEPOTID}}" "depot_build_demo.vdf"
    }
}
```

**填值要點：**
- `AppID` ← `{{DEMO_APPID}}`（注意：是 Demo AppID，不是 Base AppID）
- `Desc` ← 自由文字，但建議含版本與日期
- `ContentRoot` ← `{{WIN_BUILD_DIR}}`（Electron Windows 打包輸出，**不是** `dist/steam-demo`）
- `SetLive` 留空 ← **故意不自動 SetLive**，避免上傳即公開
- `Depots` 內鍵名 ← `{{DEMO_DEPOTID}}`

### 4.3 `depot_build_demo.vdf`

放置位置：`D:\unity\bibi-dice\steam-build\depot_build_demo.vdf`

```vdf
"DepotBuild"
{
    "DepotID" "{{DEMO_DEPOTID}}"
    "ContentRoot" "{{WIN_BUILD_DIR}}"

    "FileMapping"
    {
        "LocalPath" "*"
        "DepotPath" "."
        "Recursive" "1"
    }

    "FileExclusion" ".DS_Store"
    "FileExclusion" "Thumbs.db"
    "FileExclusion" "*.log"
}
```

**填值要點：**
- `DepotID` ← `{{DEMO_DEPOTID}}`
- `FileMapping` 區塊將 `{{WIN_BUILD_DIR}}/*` 整包映射到 depot 根目錄
- `FileExclusion` 額外排除常見系統垃圾檔

---

## 5. 上傳指令（依序執行）

> **執行前先確認 `npm.cmd run steam:verify` 通過**（離線、視窗、存檔三項自動驗證）。

### Step 5.1：重建 Demo Build（含 Electron Windows 打包）

```powershell
npm.cmd run steam:package:verify
```

此指令會：
1. 跑 `steam:build` 產出 `dist/steam-demo`（web 內容）
2. 跑 `package-steam-windows.ps1` 將 web 內容包成 Electron Windows EXE
3. 跑 `verify-steam-windows-build.js` 自動驗證打包結構

**驗證腳本會印出 Windows build 的實際輸出路徑** — 把它記下並回填到第 2 區 `{{WIN_BUILD_DIR}}`，再去修 VDF。

> 若只想跑打包不驗證：`npm.cmd run steam:package`。但首次必須跑 `:verify` 版本確認結構正確。

### Step 5.2：登入 steamcmd

```powershell
cd {{STEAMCMD_DIR}}
.\steamcmd.exe +login {{STEAM_ACCOUNT}}
```

首次登入會出現 Steam Guard 驗證碼提示，從 Steam 行動 App 或信箱取得後即時輸入。

> 登入成功後輸入 `quit` 結束（憑證已快取，下次不需重新驗證）。

### Step 5.3：執行上傳

```powershell
cd {{STEAMCMD_DIR}}
.\steamcmd.exe +login {{STEAM_ACCOUNT}} +run_app_build "D:\unity\bibi-dice\steam-build\app_build_demo.vdf" +quit
```

預期最後輸出：
```
Successfully finished AppID {{DEMO_APPID}} build (BuildID <數字>)
```

**記錄此 BuildID**（後台 SetLive 時要用）。

---

## 6. Steamworks 後台 SetLive（C-04 製作人本人執行）

steamcmd 上傳後 build **預設不會公開**。流程：

### Step 6.1：先進 internal branch 自測（C-03）

1. 登入 https://partner.steamgames.com
2. 進入 Demo App → `SteamPipe` → `Builds`
3. 確認剛上傳的 BuildID 出現，狀態 = `Available`
4. 在 `Set Build Live on Branch` 欄位選 **`internal`**
5. 製作人本機開 Steam → Library → 找到 Demo（會出現在帳號的「Family / Beta」清單）
6. 切到 `internal` branch（Steam Library → 遊戲 → 右鍵 → Properties → Betas）
7. 下載安裝、實際遊玩確認沒問題

### Step 6.2：自測通過後 SetLive 到 default

1. 回 Steamworks → `SteamPipe` → `Builds`
2. 同一 BuildID 的 `Set Build Live on Branch` 改選 **`default`**
3. 即推送至正式 branch

> ⚠️ **default branch SetLive 後，所有持有 Demo 的玩家會自動更新**。發布前 Demo 尚未公開時不會有玩家，可放心。

---

## 7. 上傳後 Steamworks 後台檢查

完成 SetLive 後驗證以下項目：

| 區塊 | 檢查項目 | 通過條件 |
| --- | --- | --- |
| SteamPipe → Builds | 新 BuildID 出現 | 狀態 `Available` |
| SteamPipe → Depots | Depot 大小符合預期 | 比對 `dist/steam-windows`，必須含 `BIBI-DICE.exe` |
| Demo App → Installation | Launch Option 已設定 | 指向 `BIBI-DICE.exe`（見第 8 區）|
| Demo App → Store Presence | 商店素材已上傳 | 對照 `STEAM_ASSET_FINAL_AUDIT.md` 第一區 |
| Demo App → Demo 設定 | 已關聯 Base Game | 顯示 Base Game AppID 連結 |
| Localization | 介面語言四語勾選 | 繁中、簡中、英、日 |
| Pricing | Demo 設為免費 | — |

---

## 8. Launch Option 設定（必填）

Demo App → Installation → Launch Options（後台手動填）：

| 欄位 | 值 |
| --- | --- |
| Executable | `BIBI-DICE.exe` |
| Arguments | （留空）|
| Working Directory | （留空，預設為 install dir）|
| Launch Type | Launch (Default) |
| OS | Windows |

> ✅ Electron Windows 打包已由 `npm.cmd run steam:package` 提供，輸出目錄即第 2 區 `{{WIN_BUILD_DIR}}`。首次執行 `steam:package:verify` 後，驗證腳本會印出實際 EXE 名稱，把它填入上方 `Executable` 欄位。

---

## 9. 不能由 AI 代做、需要製作人登入後台的事項

### Steamworks 後台（必須製作人）

- 建立 Base Game / Demo App（含 App Fee）
- 取得 `{{DEMO_APPID}}` / `{{DEMO_DEPOTID}}`
- 完成稅務、銀行、IARC、AI 揭露填寫
- 公開 Coming Soon 頁（2026-06-10）
- Demo Launch Option 設定
- 送 Demo Build / Store Presence 審核
- SetLive 操作（C-04 製作人本人）

### 本機（必須製作人）

- 安裝 SteamCMD
- 登入 steamcmd（Steam Guard 需即時輸入）
- 在 `D:\unity\bibi-dice\steam-build\` 建立填好真實 ID 的 VDF
- 執行 `steamcmd.exe +run_app_build`

### 安全紀律

- **絕對不要**把 `{{STEAM_ACCOUNT}}` 的密碼寫進任何檔案
- VDF 內僅放 AppID / DepotID（公開資訊），不入版控
- `steam-build/` 已在 `.gitignore`，所有真實 ID 檔案不會誤提交

---

## 10. 可能失敗點與排查

### A：steamcmd 登入失敗

| 症狀 | 排查 |
| --- | --- |
| `Two-factor code mismatch` | Steam Guard 過期，重新登入並即時輸入 |
| `Rate Limit Exceeded` | 等 30 分鐘後重試 |
| `Invalid Password` | 用 Steam 客戶端確認密碼 |

### B：app_build 執行失敗

| 症狀 | 排查 |
| --- | --- |
| `Failed to load app build script` | VDF 路徑錯誤或 token 沒替換乾淨；檢查是否還有 `{{...}}` 殘留 |
| `No such AppID` | `{{DEMO_APPID}}` 填錯，或帳號無權限 |
| `Failed to upload chunk` | 網路問題，重試；或檢查 https://steamstat.us |

### C：ContentRoot 內容不對

| 症狀 | 排查 |
| --- | --- |
| 上傳檔案大小落差大 | Windows build 未重新打包，跑 `npm.cmd run steam:package:verify` |
| 上傳的是 web 內容而非 EXE | `ContentRoot` 寫錯了，應指向 `{{WIN_BUILD_DIR}}` 而非 `dist/steam-demo` |
| 包含 `node_modules` / `.git` | publish / package 腳本被改動；以 `steam:package:verify` 重跑並查看驗證輸出 |
| 缺 `.exe` 或缺資源 | `steam:package` 失敗，先排除打包錯誤再上傳 |

### D：Demo 安裝後無法啟動

| 症狀 | 排查 |
| --- | --- |
| Steam 啟動 Demo 後沒有視窗 | Launch Option 未設定，回第 8 區 |
| 視窗顯示空白 | `bibi://` protocol 註冊失敗；以 `steam:verify` 本機重現 |
| 存檔無法保留 | userData 路徑錯誤；檢查 `package.json` 的 `productName` 與 `steam-app/main.js` 的 `app.setName()`（已驗證通過）|

### E：審核被退回

| 症狀 | 排查 |
| --- | --- |
| 截圖含宣傳合成圖 | 對照 `STEAM_ASSET_FINAL_AUDIT.md` 第 3 區 |
| Capsule 含禁用文字 | 對照 `ASSET_CHECKLIST.md` 製作注意；不可有 `Wishlist Now`、`Demo` 行銷字 |
| Library Logo 透明背景不乾淨 | 重產 `library_logo_1280x720.png` |
| 年齡分級異常 | 重做 IARC，參考 `STEAMWORKS_FIELDS_DRAFT.md` 第 9 區 |

---

## 11. 正式執行前檢查清單

製作人取得 `{{DEMO_APPID}}` / `{{DEMO_DEPOTID}}` 後，依序勾選後再執行：

### 11.1 第 2 區填空參數已填齊

- [ ] `{{DEMO_APPID}}` = ______
- [ ] `{{DEMO_DEPOTID}}` = ______
- [ ] `{{STEAM_ACCOUNT}}` = ______
- [ ] `{{STEAMCMD_DIR}}` = ______
- [ ] `{{WIN_BUILD_DIR}}` = ______（首次 `steam:package:verify` 後回填實際路徑）
- [ ] `{{BUILD_DESC}}` = ______
- [ ] `{{TODAY}}` = ______

### 11.2 前置帳號與權限

- [ ] Steamworks Partner 帳號完成稅務與銀行（**5-10 工作天 blocker**）
- [ ] Base Game App 已建立、Demo App 已關聯
- [ ] Demo Depot 已建立
- [ ] Steam Guard 2FA 可正常收驗證碼
- [ ] SteamCMD 已安裝且可執行

### 11.3 本機 Build 準備

- [ ] `npm.cmd run steam:build` 通過
- [ ] `npm.cmd run steam:verify` 通過
- [ ] `npm.cmd run steam:package:verify` 通過（產出 Windows EXE 並驗證打包結構）
- [ ] `npm.cmd run steam:assets:verify` 通過
- [ ] `npm.cmd run steam:i18n:verify` 通過
- [ ] `{{WIN_BUILD_DIR}}` 已從 `steam:package:verify` 輸出回填到第 2 區
- [ ] `dist/steam-demo/index.html` 存在
- [ ] `dist/steam-demo` 不含 `.git`、`node_modules`、`promo`、`scripts`、`package.json`、`CHANGELOG.md`
- [ ] `dist/steam-windows/BIBI-DICE.exe` 存在
- [ ] `dist/steam-windows/resources/app/dist/steam-demo/index.html` 存在
- [ ] SteamPipe ContentRoot 使用 `dist/steam-windows`，不是 `dist/steam-demo`
- [ ] 離線檢查訊息為 `Offline check passed`

### 11.4 Steamworks 商店頁

- [ ] 商店頁文字已填寫（依 `STEAMWORKS_FIELDS_DRAFT.md`）
- [ ] 11 張素材已上傳（依 `STEAM_ASSET_FINAL_AUDIT.md`）
- [ ] 支援語言已勾選四語
- [ ] IARC 年齡分級問卷已完成
- [ ] AI 生成素材揭露已填寫
- [ ] Privacy Policy URL 已填入 `https://github.com/Leijoa/bibi-dice/blob/main/promo/steam/PRIVACY_POLICY.md`
- [ ] Coming Soon 頁已公開至少 2 週（2026-06-10 公開 → 2026-06-24 後可發 Demo）

### 11.5 VDF 設定

- [ ] `D:\unity\bibi-dice\steam-build\` 目錄已建立
- [ ] `app_build_demo.vdf` 已建立並完成 token 替換
- [ ] `depot_build_demo.vdf` 已建立並完成 token 替換
- [ ] 兩個 VDF 內**無任何剩餘的 `{{...}}` 占位符**
- [ ] `ContentRoot` 指向 `{{WIN_BUILD_DIR}}`（Electron Windows 打包輸出，不是 `dist/steam-demo`）
- [ ] `SetLive` 欄位留空

### 11.6 上傳

- [ ] steamcmd 登入成功
- [ ] `run_app_build` 執行成功，記錄 BuildID = ______
- [ ] Steamworks 後台 Builds 列表可看見新 BuildID
- [ ] 先 SetLive 到 `internal` branch
- [ ] 製作人本機切到 internal branch 自測通過
- [ ] 手動 SetLive 到 `default`

### 11.7 送審

- [ ] 送出 Demo Store Presence 審核
- [ ] 送出 Demo Build 審核
- [ ] Steam 審核通過（1-5 工作天）
- [ ] 2026-07-01 執行最終發布

---

## 附錄 A：填空對照速查

製作人填值前後對照範例（**僅示意，實際數值以後台為準**）：

| Token | 填空前 | 填空後（範例）|
| --- | --- | --- |
| `{{DEMO_APPID}}` | `"AppID" "{{DEMO_APPID}}"` | `"AppID" "2899990"` |
| `{{DEMO_DEPOTID}}` | `"{{DEMO_DEPOTID}}" "depot_build_demo.vdf"` | `"2899991" "depot_build_demo.vdf"` |
| `{{STEAM_ACCOUNT}}` | `+login {{STEAM_ACCOUNT}}` | `+login leijoa_dev` |
| `{{WIN_BUILD_DIR}}` | `"ContentRoot" "{{WIN_BUILD_DIR}}"` | `"ContentRoot" "D:\unity\bibi-dice\dist\steam-windows"` |
| `{{BUILD_DESC}}` | `"Desc" "{{BUILD_DESC}} - {{TODAY}}"` | `"Desc" "BIBI DICE Demo v0.1.0 - 2026-06-25"` |
| `{{STEAMCMD_DIR}}` | `cd {{STEAMCMD_DIR}}` | `cd D:\tools\steamcmd` |

**替換建議：** 用編輯器的 Find & Replace（VS Code: Ctrl+H）逐個替換，確認替換後檔案內**完全沒有任何 `{{` 殘留**。

---

## 附錄 B：相關文件交叉引用

| 文件 | 用途 |
| --- | --- |
| [`STEAMWORKS_ONBOARDING_FLOW.md`](STEAMWORKS_ONBOARDING_FLOW.md) | 後台 9 階段流程（建立 App、填欄位、送審）|
| [`STEAMWORKS_FIELDS_DRAFT.md`](STEAMWORKS_FIELDS_DRAFT.md) | 商店頁文案與後台欄位草稿 |
| [`STEAM_ASSET_FINAL_AUDIT.md`](STEAM_ASSET_FINAL_AUDIT.md) | 11 張素材清單與檔案位置 |
| [`STEAM_RELEASE_CHECKLIST.md`](STEAM_RELEASE_CHECKLIST.md) | 三區檢查清單總表 |
| [`STEAM_OWNER_DECISIONS.md`](STEAM_OWNER_DECISIONS.md) | 製作人決策清單（C-03/04/05 來源）|
| [`PRIVACY_POLICY.md`](PRIVACY_POLICY.md) | 隱私政策正式版（E-10 對應）|

---

## 附錄 C：官方參考

- SteamPipe Quickstart：https://partner.steamgames.com/doc/sdk/uploading/quickstart
- SteamCMD 下載：https://partner.steamgames.com/doc/sdk/uploading/quickstart
- App Build VDF 格式：https://partner.steamgames.com/doc/sdk/uploading
- Steam Direct（上架流程）：https://partner.steamgames.com/steamdirect
- Demo 規範：https://partner.steamgames.com/doc/store/application/demos
- Steam Status（網路問題排查）：https://steamstat.us
