# 阿扣任務：SteamPipe / Depot 上傳草案

阿扣，請先讀根目錄 `SYNC.md`，並依照它要求補讀 `AGENTS.md`、`CHANGELOG.md`。

## 任務目標

請整理 SteamPipe / Depot 上傳前的操作草案，供製作人之後登入 Steamworks、安裝 steamcmd、建立 depot 與上傳 Demo Build 時使用。

## 請建立或更新的檔案

只允許修改以下檔案：

```text
promo/steam/STEAMPIPE_DEPOT_DRAFT.md
SYNC.md
CHANGELOG.md
```

如果 `promo/steam/STEAMPIPE_DEPOT_DRAFT.md` 不存在，請新增。

## 可參考檔案

- `promo/steam/STEAM_RELEASE_CHECKLIST.md`
- `promo/steam/STEAMWORKS_FIELDS_DRAFT.md`
- `promo/steam/STEAM_ASSET_FINAL_AUDIT.md`
- `promo/steam/FULL_VERSION_SCOPE.md`
- `promo/steam/STEAM_DESKTOP_PORTRAIT_STRATEGY.md`
- `package.json`
- `scripts/publish-steam-demo.ps1`

## 請整理的內容

請用繁體中文整理，並分成以下區塊：

1. SteamPipe 上傳前提條件
2. Demo Build 來源資料夾與重建指令
3. 建議的 Depot / Branch 命名草案
4. Windows Demo Build 上傳流程草案
5. 上傳後 Steamworks 後台檢查項目
6. 不能由 AI 代做、需要製作人登入後台的事項
7. 可能失敗點與排查建議
8. 正式執行前檢查清單

## 禁止事項

- 不要修改 `package.json`
- 不要修改 `steam-app/`
- 不要修改 `scripts/`
- 不要執行 SteamPipe 或 steamcmd
- 不要新增任何憑證、帳號、密碼、AppID 或 DepotID 假資料
- 不要重產圖片素材
- 不要產出或恢復 `library_hero_3840x1240.png`

## 完成後

請依照 `SYNC.md` 規則更新：

- `SYNC.md`
- `CHANGELOG.md`

如果發現新問題，請寫進 `SYNC.md` 的「待處理問題」。如果完成某個問題，請移到「已處理問題」。
