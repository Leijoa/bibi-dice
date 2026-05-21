# SteamPipe / Depot 上傳草案

最後更新：2026-05-21  
撰寫者：阿扣  
適用對象：製作人準備上傳 Demo Build 到 Steamworks 時使用

本檔僅為操作草案，**不包含任何實際 AppID、DepotID、帳號、密碼**。  
所有 ID 與憑證需製作人在 Steamworks 後台建立 App 後取得，再回填本檔對應位置。

---

## 1. SteamPipe 上傳前提條件

執行 SteamPipe / steamcmd 前，以下條件必須全部成立：

| 項目 | 狀態判斷 | 備註 |
| --- | --- | --- |
| Steamworks Partner 帳號 | 製作人已註冊並完成稅務與銀行資料 | 未完成稅務資訊將無法發布 |
| Steam Direct App Fee | 已支付 US$100（可在達標後收回） | 每個新遊戲須個別支付 |
| Base Game App 已建立 | 後台「Steamworks Apps」可看見 App | 取得 Base Game AppID |
| Demo App 已建立並關聯 Base Game | 後台 Demo Setup 顯示已連結 | 取得 Demo AppID |
| Depot 已建立 | 後台 SteamPipe / Depots 顯示已建立 | 取得 DepotID |
| 帳號已啟用 2FA（Steam Guard） | Steam 客戶端可收到驗證碼 | steamcmd 登入會要求 |
| 已安裝 SteamCMD | 本機可執行 `steamcmd.exe` | 下載點：https://partner.steamgames.com/doc/sdk/uploading/quickstart |
| Demo Build 來源資料夾已重建 | `dist/steam-demo` 內含 `index.html` 與遊戲資源 | 詳見第 2 節 |
| 內容已通過離線驗證 | `npm.cmd run steam:verify` 通過 | 確認 Electron 殼可離線啟動 |

> Steamworks Partner 必須先公開 Coming Soon 頁至少 2 週才能發布 Demo。  
> 本檔操作流程假設這些前置作業已完成。

## 目前目標排程

| 日期 | 目標 |
| --- | --- |
| 2026-06-01 前 | 商店頁素材、文案、Demo Build 準備完成 |
| 2026-06-03 | 送 Steam 商店頁審核 |
| 2026-06-10 | 目標公開 Coming Soon 頁 |
| 2026-07-01 | 目標發布 Demo |

`2026-06-10` 到 `2026-07-01` 間隔 21 天，符合 Coming Soon 頁至少公開 2 週的要求。

---

## 2. Demo Build 來源資料夾與重建指令

### 來源資料夾

```text
D:\unity\bibi-dice\dist\steam-demo
```

此資料夾由 `scripts/publish-steam-demo.ps1` 自動產生，內容說明：

- 由 `robocopy /MIR` 從專案根目錄同步檔案到 `dist/steam-demo`
- 排除目錄：`.git`、`.claude`、`node_modules`、`scripts`、`promo`、`dist`
- 排除檔案：`.gitignore`、`AGENTS.md`、`GDD.md`、`CHANGELOG.md`、`alldamege.csv`、`package.json`、`package-lock.json`、`publish-*.cmd`
- 自動為 `<body>` 注入 `steam-portrait` class，移除 `steam-layout` class
- 自動掃描外部 CDN 引用，若發現會以警告呈現

### 重建指令

```powershell
npm.cmd run steam:build
```

執行成功後會輸出：
```
Offline check passed: no active external runtime references detected.
Done. Steam Demo build folder is ready: D:\unity\bibi-dice\dist\steam-demo
```

### 上傳前最終驗證

```powershell
npm.cmd run steam:verify
```

此指令會：
- 重新執行 `steam:build`
- 啟動 Electron 並執行 Playwright 自動驗證
- 確認 `dist/steam-demo` 結構、`bibi://` 協定、三段解析度切換、localStorage 持久化

`steam:verify` 通過後，`dist/steam-demo` 即為 SteamPipe 上傳就緒狀態。

---

## 3. 建議的 Depot / Branch 命名草案

以下為命名建議，實際 ID 由製作人在 Steamworks 後台建立後取得。

### App 結構

```
Base Game App        AppID: <待製作人於後台建立後填入>
└── Demo App         AppID: <待製作人於後台建立後填入>
    └── Demo Depot   DepotID: <待製作人於後台建立後填入>
```

### Depot 命名建議

| 欄位 | 建議值 | 備註 |
| --- | --- | --- |
| Depot 名稱 | `BIBI DICE Demo Windows Content` | 後台顯示用，純識別 |
| Platform | Windows | Demo 僅承諾 Windows |
| Language | All Languages | 四語介面打包在同一份檔案，不需分語言 depot |
| Filesystem | Windows | |
| Default Branch | `default` | Steam 預設 branch，公開發布用 |

### Branch 命名建議

| Branch | 用途 | 備註 |
| --- | --- | --- |
| `default` | 公開正式 Demo | 發布前最終建版 |
| `internal` | 內部測試 | 上傳後僅製作人可見，用於審查前自測 |
| `qa-rc1` | 送審候選版本 | 可選，若有額外 QA 流程才需 |

> **製作人已決定（C-03）**：所有上傳先進 `internal` branch，自測完成後再手動切換到 `default`。

---

## 4. Windows Demo Build 上傳流程草案

### Step 1：登入 steamcmd

```powershell
cd <SteamCMD 安裝目錄>
.\steamcmd.exe +login <Steamworks 帳號>
```

首次登入時 Steam Guard 會要求輸入驗證碼，輸入後完成登入。  
**禁止把帳號密碼寫進任何腳本或文件。**

### Step 2：準備 VDF 設定檔

建議放置位置：`D:\unity\bibi-dice\steam-build\`。**製作人已決定（C-05）此目錄加入 `.gitignore`**（已更新 `.gitignore`），避免內含真實 AppID / DepotID 的 VDF 與密碼意外提交。

#### `app_build_demo.vdf`（草案）

```vdf
"AppBuild"
{
    "AppID" "<Demo AppID>"
    "Desc" "BIBI DICE Demo Build - <yyyy-mm-dd>"
    "BuildOutput" "D:\unity\bibi-dice\steam-build\output"
    "ContentRoot" "D:\unity\bibi-dice\dist\steam-demo"
    "SetLive" ""

    "Depots"
    {
        "<Demo DepotID>" "depot_build_demo.vdf"
    }
}
```

備註：
- `SetLive` 留空表示**不自動推到 default branch**，上傳完成後在後台手動 SetLive
- `BuildOutput` 為 steamcmd 工作目錄，建立後 steamcmd 會自動使用
- `ContentRoot` 必須指向 `dist/steam-demo`

#### `depot_build_demo.vdf`（草案）

```vdf
"DepotBuild"
{
    "DepotID" "<Demo DepotID>"
    "ContentRoot" "D:\unity\bibi-dice\dist\steam-demo"

    "FileMapping"
    {
        "LocalPath" "*"
        "DepotPath" "."
        "Recursive" "1"
    }

    "FileExclusion" ".DS_Store"
    "FileExclusion" "Thumbs.db"
}
```

### Step 3：執行上傳

```powershell
.\steamcmd.exe +login <Steamworks 帳號> +run_app_build "D:\unity\bibi-dice\steam-build\app_build_demo.vdf" +quit
```

上傳過程會顯示：
- 檔案掃描
- Chunk 上傳進度
- BuildID 產出

完成後輸出類似：
```
Successfully finished AppID <Demo AppID> build (BuildID <數字>)
```

記錄此 BuildID，後續在 Steamworks 後台 SetLive 時需要。

### Step 4：在 Steamworks 後台 SetLive

steamcmd 上傳完成後，build 預設不會公開。**製作人已決定（C-04）：SetLive 由製作人本人執行**。流程：

1. 進入 Demo App 的 `SteamPipe` → `Builds`
2. 確認剛上傳的 BuildID 出現在列表
3. 在 `Set Build Live on Branch` 欄位先選擇 `internal`（依 C-03 自測流程）
4. 自測通過後，再 SetLive 到 `default` 公開

---

## 5. 上傳後 Steamworks 後台檢查項目

上傳完成後，登入 Steamworks Partner 後台確認以下項目：

| 區塊 | 檢查項目 | 通過條件 |
| --- | --- | --- |
| SteamPipe → Builds | 新 BuildID 出現 | 狀態顯示 `Available` |
| SteamPipe → Depots | Depot 大小、檔案數量符合預期 | 比對 `dist/steam-demo` 實際內容 |
| Demo App → Installation | Launch Option 已設定 | 指向 Electron 主程式（見第 6 區） |
| Demo App → Store Presence | 商店頁素材已上傳 | 對照 `STEAM_ASSET_FINAL_AUDIT.md` 第一區 |
| Demo App → Demo 設定 | Demo 已關聯 Base Game | 後台顯示 Base Game AppID 連結 |
| Localization | 介面語言已勾選四語 | 繁中、簡中、英、日 |
| Pricing | Demo 設為免費 | 不需設定區域價格 |

---

## 6. 不能由 AI 代做、需要製作人登入後台的事項

以下事項**必須由製作人本人在 Steamworks 後台操作**，AI 無法代為執行：

### Steamworks 後台操作

- 建立 Base Game App 與 Demo App（含支付 App Fee）
- 取得並記錄 Base Game AppID、Demo AppID、Demo DepotID
- 完成稅務、銀行、商業資訊填寫
- 完成 IARC 年齡分級問卷
- 填寫 AI 生成素材揭露（見 `STEAMWORKS_FIELDS_DRAFT.md` 第 8 區）
- 公開 Coming Soon 頁面並等待 2 週
- 在 Demo App 設定 Launch Option（指向 Electron 入口）
- 送出 Demo Build 與 Demo Store Presence 審核
- SetLive 操作（將 build 推到 default branch）

### 本機操作

- 安裝 SteamCMD
- 登入 steamcmd（Steam Guard 驗證需製作人手動輸入）
- 建立 `steam-build/` 目錄與 VDF 設定檔（含填入真實 AppID / DepotID）
- 執行 `steamcmd.exe +run_app_build`
- 確認 Electron build 可在無 Steam 環境啟動（已由 `steam:verify` 通過）

### 注意

- **不要把 AppID / DepotID / 帳號 / 密碼提交到 Git**
- **製作人已決定（C-05）：`steam-build/` 加入 `.gitignore`**，所有 VDF 設定檔（含真實 ID）一律不入版控
- 帳號密碼絕對不可寫入任何腳本或文件

---

## 7. 可能失敗點與排查建議

### 失敗點 A：steamcmd 登入失敗

| 症狀 | 原因 | 排查 |
| --- | --- | --- |
| `FAILED login with result code Two-factor code mismatch` | Steam Guard 驗證碼錯誤或超時 | 重新登入並即時輸入驗證碼 |
| `FAILED login with result code Rate Limit Exceeded` | 短時間嘗試太多次 | 等 30 分鐘後重試 |
| `FAILED login with result code Invalid Password` | 密碼錯誤 | 使用 Steam 客戶端確認密碼正確 |

### 失敗點 B：app_build 執行失敗

| 症狀 | 原因 | 排查 |
| --- | --- | --- |
| `ERROR! Failed to load app build script` | VDF 路徑錯誤或格式錯誤 | 檢查 VDF 檔絕對路徑與引號是否正確 |
| `ERROR! No such AppID` | AppID 錯誤或帳號無權限 | 確認 AppID 與帳號是否關聯到該 App |
| `Failed to upload chunk` | 網路中斷或 Steam 後端問題 | 重試；若持續失敗檢查 Steamworks Status 頁 |

### 失敗點 C：ContentRoot 內容不對

| 症狀 | 原因 | 排查 |
| --- | --- | --- |
| 上傳的檔案大小與預期落差大 | `dist/steam-demo` 未重建或含舊檔 | 執行 `npm.cmd run steam:build` 重建 |
| 包含 `node_modules` 或 `.git` | publish 腳本被改動或未執行 | 重跑 `npm.cmd run steam:build` 並比對 `excludeDirs` |
| 缺 `index.html` | 來源資料夾結構錯誤 | 確認 `D:\unity\bibi-dice\index.html` 存在 |

### 失敗點 D：上傳後遊戲無法啟動

| 症狀 | 原因 | 排查 |
| --- | --- | --- |
| Steam 啟動 Demo 後沒有視窗 | Launch Option 未設定或路徑錯誤 | 後台 Installation → Launch Options 確認指向 Electron 主程式 |
| 視窗顯示空白 | `bibi://` protocol 註冊失敗或 ContentRoot 不對 | 用 `steam:verify` 在本機重現問題 |
| 存檔無法保留 | userData 路徑錯誤 | 確認 `package.json` 的 `productName`、`steam-app/main.js` 的 `app.setName()` 已正確生效（已修復）|

### 失敗點 E：審核被退回

| 症狀 | 原因 | 排查 |
| --- | --- | --- |
| Steam 退回截圖（含宣傳合成圖） | 截圖欄位放了非實機圖 | 對照 `STEAM_ASSET_FINAL_AUDIT.md` 第 3 區規則 |
| Steam 退回 Capsule（含禁用文字） | Capsule 上有「Wishlist Now」、「Demo」等行銷字 | 對照 `ASSET_CHECKLIST.md` 素材製作注意 |
| Steam 退回 Library Logo | 透明背景不乾淨或字體不清楚 | 檢查 `library_logo_1280x720.png` 並重產 |
| 年齡分級異常 | IARC 問卷答錯 | 重做 IARC 問卷，參考 `STEAMWORKS_FIELDS_DRAFT.md` 第 9 區 |

---

## 8. 正式執行前檢查清單

製作人正式執行 SteamPipe 上傳前，請依序確認以下項目（每項打勾後再進行下一步）：

### 前置帳號與權限

- [ ] Steamworks Partner 帳號完成稅務與銀行資料
- [ ] Base Game App 已建立（取得 Base AppID）
- [ ] Demo App 已建立並關聯 Base Game（取得 Demo AppID）
- [ ] Demo Depot 已建立（取得 Demo DepotID）
- [ ] Steam Guard 2FA 啟用且可正常收到驗證碼
- [ ] SteamCMD 已安裝且可執行

### 本機 Build 準備

- [ ] `npm.cmd run steam:build` 通過，輸出 `dist/steam-demo`
- [ ] `npm.cmd run steam:verify` 通過（含三段解析度與存檔重開驗證）
- [ ] 確認 `dist/steam-demo/index.html` 存在
- [ ] 確認 `dist/steam-demo` 不含 `.git`、`node_modules`、`promo`、`scripts`
- [ ] 確認 `dist/steam-demo` 不含 `package.json` 或 `CHANGELOG.md`
- [ ] 離線檢查訊息為 `Offline check passed`

### Steamworks 後台填寫

- [ ] 商店頁文字已填寫（依 `STEAMWORKS_FIELDS_DRAFT.md`）
- [ ] 所有素材已上傳（依 `STEAM_ASSET_FINAL_AUDIT.md`）
- [ ] 支援語言已勾選四語
- [ ] IARC 年齡分級問卷已完成
- [ ] AI 生成素材揭露已填寫
- [ ] Coming Soon 頁已公開至少 2 週

### VDF 設定

- [ ] 建立 `D:\unity\bibi-dice\steam-build\` 目錄
- [ ] `app_build_demo.vdf` 已建立並填入真實 Demo AppID / DepotID
- [ ] `depot_build_demo.vdf` 已建立並填入真實 DepotID
- [ ] VDF 檔案的 `ContentRoot` 指向 `D:\unity\bibi-dice\dist\steam-demo`
- [ ] `SetLive` 欄位留空（避免自動推到 default）

### 上傳

- [ ] steamcmd 登入成功
- [ ] `run_app_build` 執行成功，記錄 BuildID
- [ ] Steamworks 後台 Builds 列表可看見新 BuildID
- [ ] 先 SetLive 到 `internal` branch 自測
- [ ] 自測通過後手動 SetLive 到 `default`

### 送審

- [ ] 送出 Demo Store Presence 審核
- [ ] 送出 Demo Build 審核
- [ ] 等待 Steam 審核結果（通常 1-5 工作天）
- [ ] 審核通過後執行最終發布

---

## 附錄：相關文件交叉引用

- 商店頁文案與後台欄位：[`STEAMWORKS_FIELDS_DRAFT.md`](STEAMWORKS_FIELDS_DRAFT.md)
- 素材最終盤點：[`STEAM_ASSET_FINAL_AUDIT.md`](STEAM_ASSET_FINAL_AUDIT.md)
- 上架前檢查總表：[`STEAM_RELEASE_CHECKLIST.md`](STEAM_RELEASE_CHECKLIST.md)
- Demo 與正式版承諾範圍：[`FULL_VERSION_SCOPE.md`](FULL_VERSION_SCOPE.md)
- 桌面直式策略：[`STEAM_DESKTOP_PORTRAIT_STRATEGY.md`](STEAM_DESKTOP_PORTRAIT_STRATEGY.md)

---

## 官方參考

- SteamPipe Quickstart：https://partner.steamgames.com/doc/sdk/uploading/quickstart
- SteamCMD 下載：https://partner.steamgames.com/doc/sdk/uploading/quickstart
- App Build VDF 格式：https://partner.steamgames.com/doc/sdk/uploading
- Steam Direct（上架流程）：https://partner.steamgames.com/steamdirect
- Demo 規範：https://partner.steamgames.com/doc/store/application/demos
