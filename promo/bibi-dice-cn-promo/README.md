# BIBI DICE 中文宣傳影片

這是一支約 25 秒的中文版宣傳影片工程，使用 HyperFrames 風格的 HTML composition 製作。

## 檔案

- `index.html`：影片主工程，1920x1080，25 秒。
- `assets/hero-dice.png`：自製主視覺素材。
- `assets/relic-fusion.png`：自製遺物融合素材。
- `assets/boss-shackle.png`：自製 Boss 枷鎖素材。
- `assets/*-1080.png`：影片實際引用的 1920x1080 放大版素材。
- `assets/promo-score.wav`：程式合成音軌。
- `generate-audio.js`：重新產生音軌用腳本。
- `renders/bibi-dice-cn-promo.mp4`：高品質 MP4 成品。

## 預覽與輸出

可直接開啟 `index.html` 檢視靜態與動畫來源。若本機已允許 HyperFrames CLI，可在此資料夾執行：

```powershell
npx.cmd hyperframes lint
npx.cmd hyperframes validate
npx.cmd hyperframes preview
npx.cmd hyperframes render --output renders/bibi-dice-cn-promo.mp4 --quality high
```

已使用 HyperFrames CLI 輸出高品質 MP4：`renders/bibi-dice-cn-promo.mp4`。
