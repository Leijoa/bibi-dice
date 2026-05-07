#!/bin/bash
TMP=$(mktemp)
cat << 'INNEREOF' > "$TMP"

### Feature：結算動畫加速與標籤閃爍特效 [2026/05/07]
* **動態加速**：傷害結算步驟現在會自動加速，隨著計算過程推進，間隔時間從 400ms 遞減至 50ms，提升爽快感。
* **倍率來源提示**：當計算到特定遺物或枷鎖效果時，對應的提示標籤會觸發彈跳放大與閃爍的特效（`.multiplier-pop`），讓玩家能更清楚感知當前發動的加成項目。
INNEREOF
cat CHANGELOG.md >> "$TMP"
mv "$TMP" CHANGELOG.md
