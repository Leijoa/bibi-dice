# 製作人 Steam 上架決策清單

最後更新：2026-05-21  
撰寫者：阿扣  
適用對象：製作人本人:雷爪獅

本檔集中整理所有「**必須由製作人親自決定**」的欄位，避免在多份文件間反覆查找。  
AI 不會在本檔提供任何決策建議，僅列出選項、來源與決定後需更新的位置。

決定每一項後，請在 `決定` 欄位填入答案，並依「決定後需同步到」欄位更新對應文件。

---

## 一、必須在 Steamworks 建立 App 前決定

這些欄位會直接寫進 Steamworks Partner 後台的 App Landing Page，建立後修改困難。

| 編號 | 欄位 | 選項 / 範圍 | 決定後需同步到 | 決定 |
| --- | --- | --- | --- | --- |
| A-01 | 開發商名稱（Developer） | 個人本名 / 工作室名 / 筆名 | `STEAMWORKS_FIELDS_DRAFT.md` 第 1 區、Steam 後台 |雷爪獅|
| A-02 | 發行商名稱（Publisher） | 同 A-01 / 另設 / 自行發行 | `STEAMWORKS_FIELDS_DRAFT.md` 第 1 區、Steam 後台 |同 A-01|
| A-03 | 商店顯示名稱（英文） | 草案：`BIBI DICE` | `STEAMWORKS_FIELDS_DRAFT.md` 第 1 區 |BIBI DICE|
| A-04 | 商店顯示名稱（繁中） | 草案：`BIBI DICE 比比丟八` | `STEAMWORKS_FIELDS_DRAFT.md` 第 1 區 |比比丟八|
| A-05 | Demo 顯示名稱 | 草案：`BIBI DICE 比比丟八 Demo` | `STEAMWORKS_FIELDS_DRAFT.md` 第 1 區 |比比丟八 Demo|
| A-06 | 是否使用既有官方網站 | 有（填入 URL）/ 無 | `STEAMWORKS_FIELDS_DRAFT.md` 第 1 區 |無|
| A-07 | 是否使用既有 itch.io 頁作為網站連結 | 是 / 否 | `STEAMWORKS_FIELDS_DRAFT.md` 第 1 區 |是|https://leijoa.itch.io/bibi-dice
| A-08 | 是否願意支付 US$100 App Fee | 是 / 暫緩 | （無，自行記錄） |是|

---

## 二、必須在商店頁送審前決定

這些欄位影響商店頁文案與素材，送審前需全部就位。

| 編號 | 欄位 | 選項 / 範圍 | 決定後需同步到 | 決定 |
| --- | --- | --- | --- | --- |
| B-01 | 正式版售價 | US$2.99 / 其他 / 暫不公開 | `STEAMWORKS_FIELDS_DRAFT.md` 第 10 區、Steam 後台 Pricing |US$2.99|
| B-02 | 推薦標籤是否採用草案 10 個 | 全採用 / 部分採用 / 自選 | `STEAMWORKS_FIELDS_DRAFT.md` 第 5 區、Steam 後台 Tags |我已修改，全採用|
| B-03 | 備用標籤是否補入 | 補入哪些 / 全不補 | `STEAMWORKS_FIELDS_DRAFT.md` 第 5 區 |全補入|
| B-04 | 截圖 #4（牌型倍率表）是否替換 | 保留 / 重抓 Boss 枷鎖戰鬥畫面替換 | `STEAM_ASSET_FINAL_AUDIT.md` 第 5 區 |保留|
| B-05 | 是否補做 Page Background（1438×810） | 補做 / 不做 | `STEAM_ASSET_FINAL_AUDIT.md` 第 4 區 |補做、但我看效果再決定要不要使用|
| B-06 | 是否剪 Steam Trailer | 剪 / 不剪 / 用既有 25 秒草稿 | `STEAMWORKS_FIELDS_DRAFT.md` 第 10 區 |剪。但我看效果再決定要不要使用|
| B-07 | 系統需求是否採用草案 | 全採用 / 調整哪些項目 | `STEAMWORKS_FIELDS_DRAFT.md` 第 7 區 |全採用|
| B-08 | 長描述是否採用草案文案 | 採用 / 修改哪些段落 | `STEAMWORKS_FIELDS_DRAFT.md` 第 3 區 |採用|
| B-09 | Demo 頁描述是否採用草案 | 採用 / 修改哪些段落 | `STEAMWORKS_FIELDS_DRAFT.md` 第 4 區 |採用|

---

## 三、必須在 Demo 發布前決定

這些欄位影響 Demo 上架的時機與最終發布條件。

| 編號 | 欄位 | 選項 / 範圍 | 決定後需同步到 | 決定 |
| --- | --- | --- | --- | --- |
| C-01 | Coming Soon 頁公開日期 | 具體日期 | `STEAM_RELEASE_CHECKLIST.md` 第 2 區、Steam 後台 | 2026-06-10 |
| C-02 | Demo 預定發布日期 | 具體日期（須在 Coming Soon 公開後 ≥ 2 週） | `STEAM_RELEASE_CHECKLIST.md` 第 2 區 | 2026-07-01 |
| C-03 | 是否先上傳到 `internal` branch 自測 | 是 / 直接上 `default` | `STEAMPIPE_DEPOT_DRAFT.md` 第 3、4 區 |是|
| C-04 | 上傳完成後由誰執行 SetLive | 製作人 / 委託其他人 | `STEAMPIPE_DEPOT_DRAFT.md` 第 4 區 |製作人|
| C-05 | `steam-build/` 是否加入 `.gitignore` | 加入 / 公開（內容不含密碼） | `STEAMPIPE_DEPOT_DRAFT.md` 第 6 區 |加入|

---

## 四、AI 生成素材揭露待確認

Steam 後台規定，使用 AI 工具生成的素材必須揭露。以下需製作人逐項確認原始來源是否含 AI 生成。

| 編號 | 素材 | 原始來源 | 是否含 AI 生成 | 揭露說明草稿 |
| --- | --- | --- | --- | --- |
| D-01 | `img/itch_banner.png` | （主視覺來源） | 是 / 否 / 部分 |是|
| D-02 | `img/home_bg.webp` | （Library / Vertical Capsule 來源） | 是 / 否 / 部分 |是|
| D-03 | 主視覺美術字 Logo | （Library Logo 來源） | 是 / 否 / 部分 |是|
| D-04 | `favicon.png` | （Shortcut / App Icon 來源） | 是 / 否 / 部分 |是| 但我不滿意現在這張，所以先請韻東重新生成
| D-05 | 遊戲內骰子、遺物、敵人美術 | （遊戲本體） | 是 / 否 / 部分 |部分|
| D-06 | 遊戲內 BGM / SFX | （遊戲本體） | 是 / 否 / 部分 |部分|
| D-07 | 商店截圖 | Playwright 自動擷取實機畫面 | ✅ 否（已確認） | 程式自動擷圖，非 AI 生成 |

> 任一項為「是」或「部分」時，需在 Steam 後台 AI 生成內容揭露欄位說明。  
> 決定後同步到：`STEAMWORKS_FIELDS_DRAFT.md` 第 8 區、Steam 後台 AI 揭露欄位

---

## 五、年齡分級問卷待確認

Steam 採用 IARC 自評問卷，完成後自動套用多國分級。以下問題需製作人依實際遊戲內容作答。

| 編號 | 問題 | 製作人回答 |
| --- | --- | --- |
| E-01 | 是否含真實賭博或賭場元素？ |否|
| E-02 | 是否含模擬賭博（如撲克、骰子賭注）？ |否|
| E-03 | 是否含血腥或暴力畫面？ |否|
| E-04 | 是否含恐怖或驚嚇元素？ |否|
| E-05 | 是否含成人內容（性、裸露）？ |否|
| E-06 | 是否含強烈語言或髒話？ |否|
| E-07 | 是否含藥物或毒品描述？ |否|
| E-08 | Demo / 正式版是否含購買遊戲內貨幣或道具？ |Demo 否/ 正式版 是|
| E-09 | 是否含玩家間互動（聊天、PvP 等）？ |否|
| E-10 | 是否會收集玩家個人資料 / 上傳分析數據？ |是|(注意:之後將新增收集玩家遊玩數據來評估更新方向)

> 完成 IARC 問卷後，PEGI、ESRB、USK 等分級會自動套用，無需分別申請。  
> 決定後同步到：`STEAMWORKS_FIELDS_DRAFT.md` 第 9 區、Steam 後台 IARC 問卷

---

## 六、素材目視確認清單

以下素材已產出且尺寸符合官方規格，但需製作人目視確認後才能上傳。

| 編號 | 素材 | 確認項目 | 通過 |
| --- | --- | --- | --- |
| F-01 | `library_capsule_600x900.png` | 中文主視覺清楚、無英文字遮擋、深色背景下美觀 |色澤似乎跑掉了，整體偏暗|
| F-02 | `library_header_capsule_920x430.png` | 中文主視覺清楚、橫幅構圖合理 |色澤似乎跑掉了，整體偏暗|
| F-03 | `library_logo_1280x720.png` | 透明背景乾淨、深色背景下可讀 |通過|
| F-04 | `store_header_capsule_920x430.png` | Logo 清楚、無禁用行銷字 |色澤似乎跑掉了，整體偏暗||
| F-05 | `store_small_capsule_462x174.png` | 縮圖尺寸下 Logo 可讀 |色澤似乎跑掉了，整體偏暗||
| F-06 | `store_main_capsule_1232x706.png` | 主視覺呈現完整 |色澤似乎跑掉了，整體偏暗||
| F-07 | `store_vertical_capsule_748x896.png` | 直式構圖完整 |色澤似乎跑掉了，整體偏暗||
| F-08 | `shortcut_icon_256x256.png` | 桌面環境清晰 |重新設計|
| F-09 | `app_icon_184x184.jpg` | Steam 後台縮放後無失真 |重新設計|
| F-10 | `store_screenshot_01~06` | 6 張截圖全年齡顯示安全 |通過|

> 通過後，請在 `STEAM_RELEASE_CHECKLIST.md` 第一區「素材確認」勾選對應項目。

---

## 七、可延後到正式版再決定的事項

以下項目**目前 Demo 不需要決定**，但正式版上架前需面對。先列出讓製作人心裡有底。

| 編號 | 事項 | 來源 |
| --- | --- | --- |
| G-01 | Steam 成就清單與數量 | `FULL_VERSION_SCOPE.md` 成就策略 |
| G-02 | 是否啟用 Steam Cloud 雲端存檔 | `FULL_VERSION_SCOPE.md` |
| G-03 | 是否承諾 Steam Deck Verified | `STEAM_DESKTOP_PORTRAIT_STRATEGY.md` |
| G-04 | 控制器支援程度（鍵鼠 / 部分 / 完整） | `FULL_VERSION_SCOPE.md` |
| G-05 | 是否加入線上排行榜 | `FULL_VERSION_SCOPE.md` |
| G-06 | 是否加入每日挑戰 | `FULL_VERSION_SCOPE.md` |
| G-07 | 正式版新增內容承諾數量（成就 / 遺物 / Boss） | `FULL_VERSION_SCOPE.md` 正式版暫不承諾區 |
| G-08 | 是否支援 macOS / Linux | （目前未測試） |
| G-09 | 正式版 Trailer 與宣傳影片企劃 | 待製作人決定 |
| G-10 | Demo 玩家成就回補機制（Demo→正式版） | `FULL_VERSION_SCOPE.md` 成就策略 |

---

## 八、建議製作人下一次回覆 AI 的決策格式

製作人下次回覆時，建議直接複製以下格式並填入答案。AI 收到後會依「決定後需同步到」欄位逐一更新對應文件。

### 範例：填寫第一區決策

```
A-01: 開發商名稱：XXX 工作室
A-02: 發行商名稱：同 A-01
A-06: 官方網站：無
A-07: itch.io 頁作為連結：是，URL 為 https://...
A-08: 願意支付 App Fee：是
```

### 範例：填寫 AI 揭露

```
D-01: 否
D-02: 否
D-03: 部分（字體為 AI 生成、底圖為手繪）
D-04: 否
D-05: 否
D-06: 否
```

### 範例：填寫 IARC

```
E-01: 否
E-02: 否（骰子為策略構築機制，非賭注）
E-03: 否
E-04: 否
E-05: 否
E-06: 否
E-07: 否
E-08: 否
E-09: 否
E-10: 否
```

### 範例：素材目視確認

```
F-01: 通過
F-02: 通過
F-03: 退回（Logo 邊緣有白邊雜訊，需重產）
F-04: 通過
...
```

### 一次回覆多區

製作人可一次回覆多區，AI 會分別處理。例如：

```
A-01: 個人開發者，本名 XXX
A-02: 同 A-01
B-01: US$2.99
B-04: 保留第 4 張截圖
C-01: 2026-06-10 公開 Coming Soon
C-02: 2026-07-01 發布 Demo
D-01~D-06: 全部否
E-01~E-10: 全部否
F-01~F-10: 全部通過
```

---

## 附錄：相關文件交叉引用

| 來源文件 | 對應決策編號 |
| --- | --- |
| `STEAM_RELEASE_CHECKLIST.md` 第 2 區 | 全部需製作人決定欄位 |
| `STEAMWORKS_FIELDS_DRAFT.md` 第 1、5、6、7、8、9、10 區 | A、B、D、E 系列 |
| `STEAM_ASSET_FINAL_AUDIT.md` 第 2、4、5、7 區 | B-04、B-05、B-06、D 系列、F 系列 |
| `STEAMPIPE_DEPOT_DRAFT.md` 第 3、4、6 區 | C 系列 |
| `FULL_VERSION_SCOPE.md` 全文 | G 系列（正式版） |
| `STEAM_DESKTOP_PORTRAIT_STRATEGY.md` | B-01（定價）、G-03（Steam Deck）|
