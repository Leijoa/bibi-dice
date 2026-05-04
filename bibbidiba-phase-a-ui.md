# Bibbidiba 開發任務 Phase A｜視覺 UI 強化

> **執行前請先閱讀 AGENTS.md 的全域開發規範**
> 本文件涉及檔案：`js/ui.js`、`css/style.css`
> 不涉及 `engine.js` 與 `data.js` 的邏輯修改
> 每個任務完成後請更新 `CHANGELOG.md`

---

## 任務一｜血量預判 UI

**目標：** 攻擊前在敵人血條上顯示本次預估傷害佔比的閃爍預判條。

### 執行步驟

**Step 1 — 閱讀現況**
- 閱讀 `js/ui.js`，找到敵人血條的渲染函式（關鍵字：hp-bar、enemy hp、血條）
- 確認血條 DOM 結構與容器元素名稱
- 找到「預估傷害」數值由 engine 傳入 ui 的變數或函式名稱
- 確認每次預估傷害更新時，呼叫的是哪個 ui.js 函式

**Step 2 — 新增預判條元素（`js/ui.js`）**
- 在血條容器內新增子元素 `.damage-preview-bar`
- 寬度計算：`Math.min(預估傷害 / 敵人當前HP, 1) * 100%`
- 定位：從當前血量右端往左延伸（代表即將扣除的部分）
- 若預估傷害 >= 敵人當前HP，整條血條閃爍（代表可擊殺）
- 每次預估傷害數值更新時，呼叫 `updateDamagePreviewBar()` 重新計算寬度

**Step 3 — 新增樣式（`css/style.css`）**

```css
.damage-preview-bar {
  background: rgba(255, 80, 80, 0.55);
  animation: dmg-preview-blink 0.8s ease-in-out infinite alternate;
}

@keyframes dmg-preview-blink {
  from { opacity: 0.3; }
  to   { opacity: 0.85; }
}
```

**Step 4 — 注意事項**
- 此功能不涉及文字顯示，無需更新 `js/locales/`
- 預判條不得遮蔽血條上的 HP 數字顯示

---

## 任務二｜預估傷害金色高亮條件修改

**目標：** 將金色高亮的觸發條件改為「能打掉敵人當前血量 50% 以上」。

### 執行步驟

**Step 1 — 閱讀現況**
- 閱讀 `js/ui.js`，搜尋預估傷害數字的樣式切換邏輯
- 關鍵字：gold、highlight、estimated-damage、text-gold 或類似 class 名稱
- 確認目前的觸發條件是什麼

**Step 2 — 修改判斷條件（`js/ui.js`）**
- 將觸發金色樣式的判斷式改為：
  ```
  預估傷害 >= 敵人當前HP × 0.5
  ```
- ⚠️ 使用「當前 HP」（currentHp 或對應變數），**不是最大 HP（maxHp）**
- 確認此判斷在每次預估傷害更新時都會重新執行並即時切換樣式

**Step 3 — 注意事項**
- 不涉及新增文字，無需更新 `js/locales/`

---

## 任務三｜敵人攻擊倒數視覺強化

**目標：** 讓玩家對即將被攻擊有明顯的壓迫感。

### 執行步驟

**Step 1 — 閱讀現況**
- 閱讀 `js/ui.js`，找到敵人倒數回合數的渲染位置
- 關鍵字：countdown、attack-countdown、turns、剩餘回合 或對應 DOM 元素
- 確認目前 DOM 結構與套用樣式的方式

**Step 2 — 新增樣式（`css/style.css`）**

```css
/* 倒數基礎強化 */
.enemy-countdown {
  font-size: 1.5em;
  font-weight: bold;
  color: #FF3333;
  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.8),
    0 0 16px rgba(255, 0, 0, 0.6);
  background: rgba(180, 0, 0, 0.2);
  border: 1px solid rgba(255, 50, 50, 0.6);
  border-radius: 6px;
}

/* 倒數為 1 時的脈衝警示 */
@keyframes countdown-pulse {
  0%, 100% { transform: scale(1.0); color: #FF3333; }
  50%       { transform: scale(1.3); color: #8B0000; }
}
.countdown-urgent {
  animation: countdown-pulse 0.5s ease-in-out infinite;
}
```

**Step 3 — 修改 `js/ui.js`**
- 倒數更新時，當值為 1，在倒數元素上加上 `.countdown-urgent` class
- 值不為 1 時移除 `.countdown-urgent`
- 確認樣式不會蓋住骰子或其他 UI 資訊，與現有骰子框架視覺風格一致

**Step 4 — 注意事項**
- 倒數文字若有對應 locales key，確認四個語系檔一致
- 若無新增文字則不需修改 `js/locales/`

---

## 完成檢查清單

- [ ] 血條預判條正確顯示並閃爍
- [ ] 預估傷害 >= 敵人當前HP 時，整條血條閃爍
- [ ] 金色高亮在傷害達當前HP 50% 時觸發，低於時關閉
- [ ] 倒數回合一般狀態視覺強化
- [ ] 倒數為 1 時脈衝動畫觸發
- [ ] 所有動畫不干擾其他 UI 元素
- [ ] `CHANGELOG.md` 已更新
