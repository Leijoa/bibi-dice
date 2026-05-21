# 阿扣任務：製作人 Steam 決策清單

阿扣，請先讀根目錄 `SYNC.md`，並依照它要求補讀 `AGENTS.md`、`CHANGELOG.md`。

## 任務目標

請整理一份「製作人必須親自決定」的 Steam 上架決策清單，讓製作人不用在多份文件之間找欄位。

## 請建立或更新的檔案

只允許修改以下檔案：

```text
promo/steam/STEAM_OWNER_DECISIONS.md
SYNC.md
CHANGELOG.md
```

如果 `promo/steam/STEAM_OWNER_DECISIONS.md` 不存在，請新增。

## 可參考檔案

- `promo/steam/STEAM_RELEASE_CHECKLIST.md`
- `promo/steam/STEAMWORKS_FIELDS_DRAFT.md`
- `promo/steam/STEAM_ASSET_FINAL_AUDIT.md`
- `promo/steam/FULL_VERSION_SCOPE.md`
- `promo/steam/STEAM_DESKTOP_PORTRAIT_STRATEGY.md`
- `promo/steam/STEAMPIPE_DEPOT_DRAFT.md`（若已存在）

## 請整理的內容

請用繁體中文整理，並分成以下區塊：

1. 必須在 Steamworks 建立 App 前決定
2. 必須在商店頁送審前決定
3. 必須在 Demo 發布前決定
4. AI 生成素材揭露待確認
5. 年齡分級問卷待確認
6. 素材目視確認清單
7. 可延後到正式版再決定的事項
8. 建議製作人下一次回覆 AI 的決策格式

## 禁止事項

- 不要修改 `package.json`
- 不要修改 `steam-app/`
- 不要修改 `scripts/`
- 不要重產任何圖片
- 不要執行 SteamPipe 或 steamcmd
- 不要產出或恢復 `library_hero_3840x1240.png`
- 不要自行替製作人決定開發商名稱、AI 揭露、年齡分級、Coming Soon 日期或正式售價，只能整理選項與待確認欄位

## 完成後

請依照 `SYNC.md` 規則更新：

- `SYNC.md`
- `CHANGELOG.md`

如果發現新問題，請寫進 `SYNC.md` 的「待處理問題」。如果完成某個問題，請移到「已處理問題」。
