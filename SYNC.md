# SYNC.md - AI 協作交接總表

## AI 快速交接區（任何 AI 開工前必讀）

最後更新：2026-07-13

### 2026-07-13 阿扣（協作流程優化：SYNC 瘦身＋交叉驗收分級＋呼叫阿扣標準腳本）
- 狀態：完成，待製作人確認 commit；**未動任何遊戲程式**
- 任務：製作人核准協作流程優化提案後執行——SYNC 歸檔瘦身、真實狀態表補更新、交叉驗收分級成文、韻西呼叫阿扣標準化
- 修改：`SYNC.md`（6/20~6/30 交接紀錄搬入既有 `SYNC_ARCHIVE.md` 最上方，原 6/8~6/18 封存批次完整保留於下；真實狀態表更新至 Build 24157365／720 keys／SteamCMD 帳號 leijoa2588；「19 項 Bug 修復發布」移到已處理；重要協作規則新增交叉驗收分級 A/B/C、打包與 commit 衛生、發布收尾義務、批次任務規範、呼叫阿扣標準流程；指令表補 sim 與 demo 打包）；新增 `scripts/call-claude-review.ps1`；`CHANGELOG.md` 新增條目
- 驗證：SYNC.md 816→548 行；SYNC_ARCHIVE.md 以 git diff 逐行核對，僅舊標頭 4 行改寫為批次標記、紀錄零遺失（1352 行、關鍵段落逐一確認存在）；call-claude-review.ps1 以 PSParser 解析通過＋兩種錯誤路徑煙霧測試
- 踩雷紀錄：切割腳本一度覆蓋既有 SYNC_ARCHIVE.md（6/30 已有封存批次），靠 git HEAD 復原合併——**動任何「看似新檔」前先 git status / git log 確認是否已存在**
- 注意（給韻西）：之後呼叫阿扣一律用 `scripts/call-claude-review.ps1`；workspace trust 請製作人在專案目錄互動開一次 claude 接受即可永久解決；B/C 級小修依新分級規則可單方完成、事後補驗
更新者：阿扣（Claude Code）

### 2026-07-12 阿扣（內容擴充計劃書：遺物／枷鎖／牌型——已定稿）
- 狀態：計劃書**定稿**（`docs/design/CONTENT_EXPANSION_PLAN.md`），製作人兩輪回覆全數核准、無開放項；**未動任何遊戲程式**。製作人指示：批次實作由**韻西協同阿扣**進行（開工前雙方先讀計劃書＋本檔，共同規劃分工並交叉驗收）
- 主要決議：鏡像對稱 x20；輕如鴻毛/重如泰山降級 x10 保留；上層/下層世界要做；雙神眷顧僅影響 A/C 區同數判定；歉收要做；批次順序照案（批次 1＝C 區補強包）；名稱每批實作前送審
- 第二輪定案：4連順+4同 命名**【舞會階梯】**；神話 rework 去散牌化新方案照案通過（微縮星雲＝每顆 1/2/3 使其倍率 +1.0x、六道輪迴＝6 的點數 20＋E×2）；批次 1 名稱（拼圖師/宴席/積少成多/平民之怒/離間）通過
- 給韻西：**兩個設計鐵則**寫在計劃書第 0 節——(1) 無金幣系統，遺物平衡旋鈕只有稀有度與強度；(2) 鎖定是攻擊前零成本動作，鎖定類效果必須綁「按下重骰瞬間」結算。另 engine 計分改動必重產 alldamege.csv，否則 sim:verify 會失敗
- 任務：製作人指示規劃後續新增的遺物、枷鎖、牌型與其他不完善處；經兩輪討論修正後寫成 `docs/design/CONTENT_EXPANSION_PLAN.md`
- 已定案：新 C 區牌型 **玻璃鞋**（5同+對子 x18）與 **午夜鐘聲**（6同+對子 x30，6×2=12 點鐘梗）名稱由製作人拍板；【灰姑娘】【加冕】【婚禮】列為保留字不用在中段牌型
- 討論中修正的兩個設計前提（重要，其他 AI 提案時也要遵守）：(1) **遊戲無金幣系統**，商店三選一，遺物平衡旋鈕只有稀有度與強度，price 欄位是遺留欄位；(2) **鎖定是攻擊前零成本自由動作**，任何「結算時看鎖定狀態」的遺物都會退化成攻擊前全鎖白拿，鎖定類效果必須綁在「按下重骰的瞬間」結算（重骰承諾）
- 設計查核發現：8 顆 1~8 骰的「全異」盤面唯一且必為鏡像對稱，新 D 牌型鏡像對稱**必須排除全異**否則全異變死牌型；「輕如鴻毛/重如泰山」枚舉全部 24 盤證實每盤都自帶 x12~x100 大牌＝大牌放大器，與 sim 平衡目標相反，已列 Q2 待裁定；全 1／全 8 盤依 engine 判定其實已是「兩極」
- 內容：11 常規遺物＋4 新融合＋2 神話 rework（微縮星雲/六道輪迴 sim 負增益）＋7 枷鎖＋7 牌型候選，分 6 批實作，每批附 sim:compare 同 seed 對照與 alldamege.csv 重產提醒
- 注意：計劃書第 5 節 Q1~Q9 是所有待製作人決策點；批次 1（C 區補強包）為建議起點
更新者：阿扣（Claude Code）

### 2026-07-12 韻西（Steam 正式版公告正文 full-size 附圖已補上）
- 狀態：正式版 AppID `4792230` 公告 `669496599819322726` 正文已補入四張 1920×1080 說明圖；Demo 未變更
- 根因：先前僅套用封面／圖像素材頁，正文未插入圖片；右側「先前上傳的圖片」列表預設是 128×72 縮圖 URL，必須使用圖片彈窗中的 full-size CDN URL
- 已插入：`steam-01-tutorial-four-zones-1920x1080.png`、`steam-02-click-zone-highlight-1920x1080.png`、`steam-03-rules-table-markers-1920x1080.png`、`steam-04-shackle-info-1920x1080.png`
- 公開驗證：繁中公開頁 `https://store.steampowered.com/news/app/4792230/view/669496599819322726?l=tchinese` 解析出 4 張 `clan.fastly.steamstatic.com/images/46162618/` 圖，尺寸皆為 1920×1080，且正文無 `[img]` / `[url=]` / `SCRATCH` 破碼
- 阿扣狀態：本輪阿扣唯讀複核可用部分確認應使用 `steam-final/steam-01..04`；仍有 workspace trust warning，最終 Steam 後台修正由韻西完成
- 後續注意：正文插圖要在「說明」頁籤處理；「圖像素材」頁籤是活動封面／形象圖，不會讓公開公告正文出現附圖。若右欄只看到 128×72 縮圖，需打開圖片彈窗取 full-size URL
更新者：韻西（Codex）

### 2026-07-11 韻西（Steam 正式版 Build 24157365 與更新公告已公開；Demo 已回退）
- 狀態：正式版 AppID `4792230` 的 `default` 已更新為 BuildID `24157365`；Demo AppID `4796530` 的 `default` 已回退並維持 BuildID `23985042`；Steam 更新公告已發布為公開可見
- 製作人指示：製作人要求韻西接手 Steam 版本上傳與更新公告發布；Threads 仍由製作人自行發。製作人後續明確指示本次只更新正式版，Demo 版不要動
- 發布修正：曾誤將 Demo `default` 切到 BuildID `24157360`；經製作人手機 Steam App 核准後，已在 Steamworks 回退到 BuildID `23985042`，版本歷史顯示 `leijoa2588` 於 7 月 10 日 20:24 設定上線 `23985042`
- 正式版發布：SteamCMD 以正確帳號 `leijoa2588` 上傳正式版 BuildID `24157365`，並經製作人手機 Steam App 核准後在 Steamworks 設為 `default`；版本歷史顯示 `leijoa2588` 於 7 月 10 日 20:22 設定上線 `24157365`
- 帳號修正：先前依過時文件誤讀 `leijoa_dev`；已改正為 `leijoa2588`，並確認專案內 `rg leijoa_dev` 無殘留
- 阿扣狀態：嘗試呼叫阿扣做發布前唯讀審查，但 `claude.exe` 卡在 workspace trust 提示與 session limit，未進入實際審查；依製作人先前授權，阿扣額度／狀態不行時由韻西先獨力完成可執行部分
- 風險修正：`scripts/publish-steam-demo.ps1` 的排除清單補上 `steam-build`、`tmp`、`docs`、`sim`、`steam-app` 與內部設定／協作檔，並修正根目錄以外同名排除檔也會清理，避免 VDF、SteamCMD 舊 log、臨時檔與內部文件被打進玩家安裝包
- 驗證：
  - `npm.cmd run steam:package:verify` 通過（正式版 `steam-full`，EXE smoke 通過）
  - `npm.cmd run steam:package:demo` 後 `node scripts/verify-steam-windows-build.js` 通過（Demo `steam-demo-build` 標記正確）
  - 打包後確認正式版／Demo dist 與 packaged app 皆不含 `steam-build`、`tmp`、`docs`、`sim`、`steam-app`、`mobile-entry.js`
- Steam 公告發布：正式版社群活動已公開，類型 `定期更新`，標題「更新：新手教學大改版，手把手看懂四區牌型」，連結正式版 BuildID `24157365`；後台狀態已由「隱藏，尚未發佈」變為「公開可見」，並顯示「發佈成功」
- 公開網址：`https://store.steampowered.com/news/app/4792230/view/669496599819322726`
- 公告圖像：製作人已手動上傳圖像素材；繁中與英文封面皆套用 `promo/announcements/tutorial-update-2026-07-11/steam-final/event-cover-800x450.png`。公開公告內未插入舊版四張帶有「正式版 / Demo 同步更新」字樣的圖片
- 公開頁驗證：繁中公開頁顯示「新手教學重做、牌型表標記法更新，正式版現已套用。」與「以上更新已於正式版生效」；英文公開頁顯示 `The full game now has a rebuilt tutorial...` 與 `This update is live in the full game...`
- 文字風險核對：繁中與英文公開頁皆未找到 `正式版與 Demo 同步`、`正式版 / Demo 同步`、`正式版和 Demo 都已更新`、`full game and the demo` 等錯誤同步說法
- 下一步：Steam 發布鏈已完成；若後續要補公告內文圖片，僅能使用 `promo/announcements/tutorial-update-2026-07-11/steam-final/` 內的修正版素材，避免誤用舊圖
更新者：韻西（Codex）

### 2026-07-11 韻西（新手教學大改版公告附圖審核包）
- 歷史狀態：完成本地素材包供製作人審核；後續 Steam 公告已依上方最新紀錄發布
- 產出：`promo/announcements/tutorial-update-2026-07-11/`
  - Steam 公告橫圖 4 張：四區牌型總覽、點牌型區看骰子高光與說明浮條、新版牌型表標記法、枷鎖說明視窗位置
  - Threads 備用直圖 2 張：新手教學重做、新版牌型表
  - `raw/` 保留原始遊戲截圖，方便後續重做版面
- 工具：`tmp/capture-tutorial-update-assets.js`（Playwright 擷取 `http://127.0.0.1:4173/?steam=portrait` 本機預覽並套公告標註）
- 協作註記：阿扣呼叫失敗，原因為 workspace trust 尚未互動接受，且 `claude.exe` session limit（Asia/Taipei 04:10 重置）；製作人先前已明確授權「阿扣額度滿了就由韻西先獨力完成」
- 驗證：六張成品已逐張人工檢查可讀性、裁切與標註位置；`node --check tmp/capture-tutorial-update-assets.js` 通過
- 後續：公開公告封面已改用 `steam-final/event-cover-800x450.png`；Threads 文案與發文仍由製作人自行處理
更新者：韻西（Codex）

### 2026-07-10~11 阿扣（新手教學：四區牌型介紹＋說明視窗位置＋修攻擊按鈕卡死）
- 狀態：完成並實機驗證（14 步全程通過）；已 commit + push；已打包進 exe（`steam:package:verify` 17 項 check＋EXE smoke 通過）
- Bug 根因（教學卡死無法攻擊）：攻擊按鈕的 disabled 是 renderControls 渲染當下寫進 HTML 的；7/10 枷鎖步移到攻擊前一步後，`onTutorialShackleInfo` 的推進路徑沒有重渲染控制列，跨越解鎖門檻時按鈕不會解鎖 → 教學卡死於攻擊步。修法：新增 `advanceBattleTutorialStep()` 統一推進入口（一律 renderControls + showTutorialStep），shackle_info／lock_two_dice／zone_highlight 路徑皆走此函式，杜絕日後重排再踩
- 四區教學（製作人問題 1）：重骰後插入 step5 四區總覽（高光 score-area；強制骰面 1,2,3,3,3,4,6,6 → A三同/B四連順/C南瓜 三區亮、D 暗，現成活教材）＋ step6 點區互動（新 waitFor `zone_highlight`，點亮任一有效區立即推進）；傷害預覽文字瘦身聚焦「總基礎 × 四區倍率」
- 說明視窗位置（製作人追加）：step7 高光「牌型說明浮條」本體（點區後跳出的浮條，教學點區時不設 5 秒自動清除、離開此步才清）；step10 高光「枷鎖說明視窗」（教學中 toast 不自動過期＋掛 `#shackle-info-toast` id，離開此步 UI.clearToasts 收掉）。教學共 **14 步**，`TUTORIAL_ATTACK_UNLOCK_STEP`=11
- **重要 CSS 根因修正**：`.tutorial-highlight` 原有 `position:relative !important` 會強制蓋掉浮條的 absolute（浮條被擠回版面流、推擠骰子＝7/9 修過的老 bug 在教學高光下復發）。已移除該行，static 元素改由 `showTutorialStep` 以 inline style 補 relative（getComputedStyle 判斷），absolute 浮條／fixed toast 保持原定位
- 修改：`js/main.js`（TUTORIAL_STEPS 14 步、helper＋離步清理、setHighlight 鉤子）、`js/ui.js`（highlightMap 加 hand-hint-banner/shackle-toast、位置特例、board-panel 提升條件、showShackleInfo 教學分支）、`css/style.css`（.tutorial-highlight 移除強制 relative）、四語系 `tutorial.step5~13` 輪轉＋新增四步（720 keys）
- 驗證：`node --check` 六檔通過；`steam:i18n:verify` 720 keys 對齊；本機實機 531×970 教學 14 步全程——鎖對子、四區 A/B/C 亮 D 暗、點 A 區 3 顆骰 dice-glow-A＋浮條 absolute 高光＋tooltip 貼浮條上方 3px、離步浮條收掉、枷鎖 toast 高光且 fixed 未破版、離步 toast 收掉、**攻擊按鈕解鎖可攻擊**、商店、完成旗標寫入，console 零錯誤
- 注意：驗證中瀏覽器 renderer 凍結（rAF 不觸發，同截圖 compositor 逾時的既知環境問題）曾使傷害逐步動畫（countUpTo 為 rAF 驅動）停住，以遊戲內建 `setting_stepAnimation=false` 路徑完成全程驗證，非遊戲 bug；正常環境逐步動畫路徑 7/10 已驗過。**韻西 7/10 的 css 修改（牌型表任意字母改黃色，待製作人視覺確認）未包含在本次 commit、保留於工作區，但已隨本次打包進 exe，製作人可直接在 exe 開牌型表視覺確認**
更新者：阿扣（Claude Code）

### 2026-07-10 韻西（牌型表抽象標記任意字母加黑框）
- 狀態：完成，待製作人視覺確認；尚未 commit / 打包
- 任務：牌型表範例骰改抽象標記後，青色英文字母與空白骰底背景太接近，辨讀吃力；製作人要求加黑框或換色加框
- 修改：只動 `css/style.css`，將 `.rule-dice-mini__num--any` 統一改回與指定數字相同的黃色數字樣式，不再使用另一套白色粗體字；保留灰色 `?`、牌型 token 資料與四語系不變
- 協作註記：阿扣呼叫失敗，原因為 workspace trust 尚未互動接受且 `claude.exe` session limit（重置 11:10pm Asia/Taipei）；製作人已明確授權此小修由韻西先獨力完成
- 驗證：`node --check js/ui.js` 通過；`npm.cmd run steam:i18n:verify` 716 keys 對齊；`git diff --check -- css/style.css CHANGELOG.md SYNC.md` 通過
更新者：韻西（Codex）

### 2026-07-10 阿扣（新手教學枷鎖移後 + 絕對秩序說明改八顆）
- 狀態：完成並實機驗證，待製作人確認 commit + 打包
- 教學：枷鎖說明原在第 2 步（玩家還沒學鎖定就要懂枷鎖）→ `TUTORIAL_STEPS` 重排，枷鎖移到 index 6（攻擊前）；順序 敵人→回合→骰子→鎖定→重骰→傷害→枷鎖→攻擊→商店→完成。文字綁索引，四語系 `tutorial.step1~6` 同步輪轉。`forceDiceAfterRoll`(idx4)、`TUTORIAL_ATTACK_UNLOCK_STEP=7` 仍對齊
- 絕對秩序：說明改「八顆數字全為奇數或全為偶數」（基礎門檻 8，7/6 靠遺物【寬容】/【天秤之極】）——`data.js` + 四語 `rule_d1.desc`；牌型表範例骰改 8 顆全奇；未動 engine 判定
- 驗證：`steam:i18n:verify` 716 keys 對齊；實機啟動教學逐步核對文字/高光對齊、枷鎖在第 7/10 步、step0=敵人 step1=回合
- 注意：預覽 screenshot 此 session 逾時（環境），以 i18n 對齊＋實機 DOM 推進驗證
更新者：阿扣（Claude Code）

### 2026-07-10 阿扣（牌型表範例骰改抽象標記 字母/數字/?）
- 狀態：完成，DOM 逐一驗證，待製作人確認 commit + 打包
- 任務：範例骰秀具體數字會誤導、小標籤不直覺 → 改抽象標記讓骰子本身表達規則
- 標記法（對照 engine.js）：相同字母 x=同數、連續字母 abc=連續、數字=指定、?=任意骰；補滿 8 顆
- 修改：`js/ui.js` `RULE_EXAMPLE_DICE` 改 token 陣列 + `renderExampleDie`(三色:金指定/青任意/灰?、?淡化) + `renderRulesLegend`(頂端圖例)；四語系加 `ui.legend_same/run/fixed/wild`；`css/style.css` num 三色 + wild 淡化 + legend 樣式；保留指定/任意小標籤
- 固定牌型 ? 數嚴格對照 engine：二進位 1248+4?、質數 2357+4?、圓周率 11346+3?、斐波那契 112358+2?、自然對數 122788+2?（注意 used=[1,2,2,7,8,8] 非 271828）；絕對二進位/絕對質數/彗星/全異/兩極整盤 8
- 驗證：`steam:i18n:verify` 716 keys（+4）；DOM 核對 39 牌型 token 與 engine 一致、三色正確、圖例 4 項、?淡化 0.5
- 注意：牌型表 modal 圖多，預覽 screenshot 會 compositor 逾時，本次以 DOM 檢查驗證（單顆骰疊字視覺前版已截圖）
更新者：阿扣（Claude Code）

### 2026-07-09 阿扣（牌型表加「指定數字／任意數字」標籤）
- 狀態：完成並實機驗證，待製作人確認 commit + 打包
- 任務：玩家分不出牌型表哪些骰子是舉例、哪些是必要特定數字 → 名稱旁加標籤
- 分類：指定數字（琥珀）＝彗星/兩極/全異/斐波那契/圓周率/自然對數/二進位/絕對二進位/質數/絕對質數（骰面即答案）；其餘為任意數字（灰）
- 修改：`js/ui.js` 新增 `FIXED_NUMBER_RULE_IDS` + `renderRuleTag()`，名稱旁加標籤；四語系 locale 新增 `ui.hand_tag_fixed`/`ui.hand_tag_any`；`css/style.css` `.rule-tag` 系列
- 驗證：`steam:i18n:verify` 712 keys 對齊（+2）；531×970 實機確認 10 指定牌型標琥珀、其餘標灰、英文不破版
更新者：阿扣（Claude Code）

### 2026-07-09 阿扣（牌型表範例骰子改空白骰底＋大字數字）
- 狀態：完成並實機驗證，待製作人確認 commit + 打包
- 任務：牌型表範例骰子的骰面數字太小難讀 → 改用空白骰底 `dice_0.webp` + 疊大字數字
- 修改：`js/ui.js` `renderRuleExampleDice` 改用 dice_0 底圖 + `.rule-dice-mini__num` 疊字；`css/style.css` `.rule-dice-mini` 改相對定位容器，骰放大 28px（portrait 32px）、金色 900 粗數字 18px（portrait 20px）+ 描邊
- 驗證：531×970 開牌型表 245 顆數字皆放大清晰、1~8 正確、分組「＋」完整、最寬列無溢位
更新者：阿扣（Claude Code）

### 2026-07-09 阿扣（浮條改底部＋動態平衡不擋骰＋ABCD 角標左下＋設定 toast 卡死修復）
- 狀態：#1~#5 全部完成並實機驗證
- #1 牌型說明浮條擠壓骰子 → **找到根因**：`#board-panel > *`（ID 選擇器）強制盤面子元素 `position:relative;z-index:1`，蓋掉浮條的 absolute，使浮條佔版面流把骰子往下推。解法：`#board-panel > .hand-hint-banner { position:absolute; z-index:30 }`（`css/style.css`）。並將浮條由頂部改**盤面底部**、右緣讓開控制列
- #4 過長說明截斷 → 浮條改可換行、移除省略號；壓縮行高/padding，最長說明（絕對質數 2 行）overlap −1px 不壓骰
- #2 動態平衡每次首骰提示擋骰 → 新增 `#board-notice-banner` + `UI.showBoardNotice()`（盤面底部同位置），`js/main.js` 的 balance 提示由 `showToast`（中央擋骰）改 `showBoardNotice`；與牌型浮條互斥
- #5 ABCD 角標英文版與牌型名重疊 → `.zone-corner-label` 由左上改**左下角**
- #3 設定介面偶發「只有設定視窗不能點」→ **已定位並修復**：`showToast` 的 toast 掛在 `body`，而設定視窗（z-120）在有 `transform` 的 `#game-container` 內（獨立 stacking context），body 層 toast（z-100）反而疊在被困住的設定視窗之上；開設定時剛好有 toast 殘留就會擋住控制項。修法：`js/ui.js` toast 本體改 `pointer-events:none`（純通知），× 另設 `auto`。實機驗證 `elementFromPoint` 於 toast 中心已回傳設定視窗內容、× 仍可點
- 修改檔：`index.html`、`js/ui.js`、`js/main.js`、`css/style.css`
- 驗證：`node --check` 通過；531×970 實機量測＋四張截圖（浮條底部不壓骰、動態平衡底部不擋骰、英文 ABCD 左下不重疊、最長說明不壓骰）
- 注意：尚未打包進 exe；#2 目前只改 balance，rebel/forcedshift 等首骰提示仍為中央 toast，如要一致可比照改
更新者：阿扣（Claude Code）

### 2026-07-09 阿扣（牌型表加入範例小骰子，子牌型分組）
- 狀態：完成，待製作人確認 commit + 打包（尚未 commit、未打包進 exe）
- 任務：牌型表只有文字不夠直觀 → 說明下方加該牌型範例小骰子，且要美觀＋辨識度高
- 修改（僅表現層，未動 engine/data/main）：
  - `js/ui.js`：新增 `RULE_EXAMPLE_DICE`（39 牌型「子牌型分組」二維陣列）＋ `renderRuleExampleDice()`；複合牌型拆多組以「＋」串接對應說明結構，單牌型單組；骰面重用 `getDiceImageUrl`／`getDiceImageFilter` 隨玩家外觀變化＋輕 drop-shadow；rule-card 改 `items-start`
  - `css/style.css`：`.rule-card__dice`／`.rule-dice-group`／`.rule-dice-plus`／`.rule-dice-mini`（22px、portrait 26px）
- 文字：骰子/「＋」皆圖示，未新增 i18n key
- 驗證：`node --check` 通過；`steam:i18n:verify` 710 keys 對齊；540×960 開牌型表——39 卡共 61 組、22 個「＋」與設計吻合、骰圖載入正確；量測南瓜馬車「五同＋三同」兩組與「＋」位置正確、經典四對子 4 組 2 顆分隔、比比丟八單組 8 顆無「＋」
- 注意：截圖工具對含大量骰圖的牌型表 modal 會 compositor 逾時（環境問題非程式），本次以幾何量測＋計數驗證；mini 骰子視覺已於前一版成功截圖確認
更新者：阿扣（Claude Code）

### 2026-07-09 阿扣（ABCD 四區左上角牌型分區浮水印 + 點區牌型說明浮條）
- 狀態：完成，待製作人確認 commit + 打包（尚未 commit、未打包進 exe）
- 追加任務：玩家搞不懂 ABCD 四區是什麼 → 四區左上角加 A/B/C/D 浮水印標示
  - `js/ui.js`：`renderScore` 四個 `#zone-box-*` 各加 `<span class="zone-corner-label">A~D</span>`（純字母，不需 i18n）
  - `css/style.css`：`.zone-corner-label`——左上角絕對定位、`var(--font-number)`（Bahnschrift）、26px（md 32px）、`currentColor` 繼承區色、opacity 0.32 浮水印、pointer-events none
  - 驗證：`node --check` 通過；540×960 實機截圖確認四區左上角 A/B/C/D、Bahnschrift 字體、色彩對應、不擋牌型名與倍率
- 原任務（點 ABCD 區高光骰子時顯示牌型說明浮條）：
- 任務：製作人回報玩家點 ABCD 區看骰子高光後仍不懂「為何這幾顆發動」，要求高光同時跳出牌型說明，但不能擋到骰子
- 修改（單點、只動表現層，未動 `engine.js`/`data.js`/`main.js`）：
  - `index.html`：`#board-panel` 內新增 `#hand-hint-banner` 浮條
  - `js/ui.js`：新增 `updateHandHintBanner()`，`renderDice` 結尾呼叫；點區高光時於盤面頂部顯示「牌型名 x倍率 — 說明」，非 WAIT_ACTION／無高光／失憶枷鎖隱藏；牌型查詢重用 `RULE_DB`＋`isRuleNameMatch`
  - `css/style.css`：`.hand-hint-banner` 系列——絕對定位盤面頂部（覆蓋標題列、骰子正上方，不遮骰子）、ABCD 四色、說明單行省略號、跳出動畫
- 文字：**重用既有 `rules.<id>.name`／`.desc` 四語 key，未新增任何 i18n key**
- 驗證：`node --check js/ui.js` 通過；`steam:i18n:verify` 四語 710 keys 對齊（不變）；本機 http server 實機——A/D 區浮條正確顯示、色彩對應、不與骰子重疊、再點同區/重骰/5 秒自動皆隱藏、540×960 無溢位
- 注意：`.claude/launch.json` 為本次 preview 用的靜態伺服器設定（暫存，不建議入 commit）；UI 已改但**尚未跑 `steam:package:verify`**，未反映到製作人玩的 exe
更新者：阿扣（Claude Code）

### 2026-07-08 阿扣（全套圖片＋影片廣告產製與審查）
- 狀態：完成；成品待製作人確認後投放，未 commit
- 任務：以官方腳本（`promo/social/steam-launch-short/` frame.md 與四語 POST_COPY）與既有素材為源，並行產出全套廣告，逐件審查後分類
- 產出（`promo/ads/`，共 9 件全數通過審查，rejected/ 為空）：
  - 圖片 6 張（approved/）：直式 1080×1920、方形 1080×1080、橫式 1200×628，各繁中＋英文版；HTML 模板＋Playwright 產圖，來源檔在 `promo/ads/src/image/` 可重跑
  - 影片 3 支（approved/，各附 contact sheet）：繁中直式 1080×1920 12s、繁中方形 1080×1080 10s、英文橫式 1920×1080 15s；HyperFrames 0.7.17 專案在 `promo/ads/src/video-*/` 可改文案重 render
  - 審查紀錄：`promo/ads/REVIEW.md`（標準、逐件結果、改進建議）
- 審查修正：直式跑馬字與橫式常駐 HUD 均誤植「ROGUELIKE」，已改「ROGUELITE」重 render 並抽幀複驗
- 注意：
  - **發現上游素材互換**：steam-launch-short 的 zh-tw/02-reroll.mp4 實為簡體、zh-cn 反為繁體（已列入待處理問題）；本次繁中影片已改用正確檔，原檔未動
  - 英文版三張圖片的實機截圖為繁中 UI（沿用 Steam 商店官方截圖）；日後投英語市場建議補英文 UI 截圖
  - 未修改任何遊戲程式與既有 promo 專案
更新者：阿扣（Claude Code）

### 2026-07-08 阿扣（擬人模擬遊玩系統 Phase 2~4：五人格／生涯模擬／儀表板／A/B 對比）
- 狀態：Phase 1~4 全部完成，待製作人確認 commit
- Phase 2（五人格＋失誤模型）：
  - 新增 `sim/personas/novice.mjs`（新手：高失誤 25%、三顆同數就提早攻擊、完全相信畫面假數字）、`veteran.mjs`（老手：低取樣心算期望值＋比較雜訊±12%＋5% 失誤）、`gambler.mjs`（賭徒：四顆同數就追大牌、六種數字追彗星、商店只梭哈高稀有度）
  - `heuristics.mjs` 新增共用失誤模型 `applyMistake`（多鎖/漏鎖一顆）
  - 500 局/組結果：零升級通關率 新手 2.6%／休閒 12.2%／老手 29.2%／賭徒 44.8%／理論派 31.8%
  - **重要平衡信號：賭徒（無腦追同數大牌）> 理論派（一步期望值最佳化）**，代表現行牌型數值極度獎勵 All-in 追大牌路線，垃圾時間少、爆發才是王道；理論派是一步貪婪不是真上限，解讀報表時兩者都要看
  - 資訊枷鎖實測有效：【假象】對新手 -47.2% 通過率（假傷害數字騙到），對理論派幾乎無感（自行心算）
- Phase 3（生涯模擬 `sim/core/career.mjs`＋`sim:career` 指令）：
  - 從零帳號連打多局：局間依人格優先序購買靈魂升級、契約層數自適應（贏加輸退；賭徒永遠拉滿、新手永遠 0）、通關後依人格意願進無限塔（上限 60 層防呆）
  - `run.mjs` 重構出 `simulateRunWithState`（可跨局共用 metaData/collection、支援契約與無限塔）；Phase 1 介面 `simulateRun` 相容保留
  - 輸出 `career_progression.csv`（逐局）與 `career_summary.csv`（每條生涯摘要：全解鎖於第幾局、前10局 vs 整體通關率、無限塔最深、契約層）
- Phase 4（儀表板＋A/B）：
  - `sim/report/dashboard.mjs`：批量模式自動產出單檔 `dashboard.html`（零依賴、離線可開、深淺色自適應）：通關率總表、分關卡通過率折線圖、遺物勝率增益 Top/Bottom 10 橫條、枷鎖難度橫條、靈魂節奏表
  - `sim/compare.mjs`＋`sim:compare` 指令：比較兩份 snapshot.json（批量模式自動輸出），列出通關率／關卡／遺物／枷鎖的顯著變動；同 seed 下差異＝純數值改動效果。用法已寫在 compare.mjs 檔頭
- 生涯模式正式跑結果（8 條生涯/人格 × 上限 120 局，seed 42）：
  - 全解鎖靈魂升級所需局數中位數：賭徒 85 局（拉滿契約刷靈魂最快但整體通關率僅 20.3%）、理論派 101、老手 106；**新手與休閒 120 局內無法全解鎖**（新手整體通關率 34.9%、休閒 77.8%）——若希望一般玩家 50~80 局全解鎖，可考慮調降部分升級價格或提高靈魂收入
  - 無限塔最深：理論派 32 層、老手 31、休閒 22、賭徒 20、新手 0（不敢進塔）
- 驗證：`sim:verify` 10 項全過（決定性涵蓋五人格）；批量 5000 局 66 秒；生涯正式跑 253 秒完成；compare 以 500 局 vs 100 局同 seed 快照實測，統計波動正確標示
- 指令總覽：`npm.cmd run sim`（批量＋CSV＋儀表板＋快照）、`sim:career`（生涯）、`sim:compare A B`（A/B）、`sim:verify`（保真）
更新者：阿扣（Claude Code）

### 2026-07-08 阿扣（擬人模擬遊玩系統 Phase 1：sim/ 無頭模擬器＋四份平衡報表）
- 狀態：Phase 1 完成；後續 Phase 2~4 見上一條
- 任務：製作人指示規劃「最擬人的模擬遊玩」輔助平衡數值。舊的 capture-random-locale-playtest.js 是純隨機點擊（截圖用），無決策概念
- 實作（新增 `sim/` 目錄，**未動任何遊戲程式**）：
  - `sim/core/adapter.mjs`：Node 掛空殼 window 後直接 import 真引擎 `js/engine.js` 與 `js/data.js`，計分數值零複製
  - `sim/core/rules.mjs` / `battle.mjs` / `shop.mjs` / `run.mjs`：從 main.js 忠實移植回合結構、重骰／鎖定限制、全部枷鎖結算、商店三選一、融合、菁英掉落、靈魂公式（每段註記 main.js 來源行號；**main.js 戰鬥邏輯改動時需同步**）
  - `sim/personas/`：casual（休閒：留最大同數群＋10% 手滑）與 theorist（理論派：候選鎖法＋真引擎取樣期望值，平衡上限基準）；人格只看得到「畫面可見資訊」，盲眼／幻象／虛張聲勢／酒醉／假象會真實影響決策品質
  - `sim/report/`＋`sim/cli.mjs`：五份 CSV（UTF-8 BOM，Excel 直開）：難度曲線與死亡熱點、遺物強度榜、枷鎖難度實測、靈魂節奏、每局摘要
  - `package.json`：新增 `sim`、`sim:verify` 指令；`.gitignore` 新增 `sim/output/`
- 驗證：`sim:verify` 7 項全過（含 **alldamege.csv 全部 6435 組合 vs 引擎輸出零誤差**、同 seed 決定性、鐵壁／絕對屏障／同歸於盡結算劇本）；正式批量 2000 局（2 人格 × 零升級/全升級 × 500 局）48 秒跑完
- 首批發現（500 局/組，seed 42）：
  - 通關率：休閒×零升級 12.2%、理論派×零升級 31.8%、休閒×全升級 94.8%、理論派×全升級 97.8%
  - 死亡熱點：零升級集中在第 6~10 關（休閒卡第 8 關遺忘守護者、理論派卡第 9 關虛空大祭司）
  - 枷鎖：對休閒零升級最兇的是【同歸於盡】-48.8%、【反傷裝甲】-37.3% 通過率
  - 遺物：【中流砥柱】持有勝率 +41%；**神話遺物【微縮星雲】【六道輪迴】勝率增益為負**，疑似做工成本高於回報，建議製作人檢視
  - 靈魂節奏：零升級休閒玩家估計需 ~1196 局才能全解鎖局外升級（未計契約加成，Phase 3 會精算）
- 注意：製作人未回覆的兩個選項採推薦值執行（經濟報表改為靈魂節奏＋三選一選購行為，因遊戲無金錢系統；難度曲線跑零升級/全升級兩組對照），可隨時推翻重跑；`sim` 為模擬工具非遊戲內容，不影響 Steam 打包與四語系
更新者：阿扣（Claude Code）

### 2026-07-06 阿扣（製作人專用作弊測試捷徑：--bibi-dev 開發閘門）
- 狀態：完成，待製作人確認 commit 範圍
- 任務：H1 鎖定作弊入口後，製作人需要「點兩下就開作弊模式主程式」的專用捷徑
- 實作：
  - `steam-app/main.js`：新增 `DEV_CHEAT_MODE`（啟動參數 `--bibi-dev` 或環境變數 `BIBI_DICE_DEV=1`），成立時遊戲 URL 附加 `bibiDev=1`
  - `js/main.js`、`js/ui.js`：IS_DEV 增加「`bibi:` 協定且帶 `bibiDev=1`」判斷；**限定 bibi: 協定**，網頁版（itch/GH Pages）網址帶參數無效
  - `package.json`：新增 `steam:app:devcheat` 指令（Electron 直啟作弊模式）
  - 桌面捷徑：`C:\Users\Leijoa\Desktop\BIBI DICE 作弊測試模式.lnk` → `dist/steam-windows/BIBI-DICE.exe --bibi-dev`（捷徑檔在桌面、不在 repo）
- 安全邊界：Steam / 正常點 exe 不帶參數 → 作弊全關；玩家須自行讀公開原始碼並刻意帶參數啟動才能開（等同單機祕技，僅影響自己）
- 驗證：四檔語法檢查通過；`steam:package:verify` 19 項 check 全過（曾因殘留 BIBI-DICE.exe 行程失敗一次，Stop-Process 後重跑通過）；已確認打包後 exe 內含閘門
- 注意：**每次重新打包後捷徑仍然有效**（指向固定 dist 路徑）；`package.json` 的 devcheat 指令與 capacitor 相依同檔，建議留給手機版批次一起 commit
更新者：阿扣（Claude Code）

### 2026-07-06 阿扣（Phase 3 交叉驗收通過；獨立完成 Phase 4，19 項全數修復）
- 狀態：**Phase 1～4 全部完成**；尚未 commit / push / 發布，待製作人決定
- 背景：阿扣 session 上限恢復後回歸；製作人指示韻西額度用盡，Phase 3 驗收與 Phase 4 由阿扣獨立完成
- **Phase 3 交叉驗收：通過**（唯讀重驗 M2/M4/M7，並抽查 Phase 1/2）：
  - M2 弒神：`buildActiveShackleConfig` 展開完整 SHACKLE_DB 定義、data.js 改 heavy、骰面角標同步停用；引擎獨立實測 8 顆 2＋血色聖戰 totalBase 240→16
  - M4：`window.showToast` 已掛上；M7：subscribe 改呼叫 UI 模組函式並帶正確參數，`currentTab` 已提升作用域
  - 抽查 H1（IS_DEV 閘門全數到位，含 keydown 作弊、dev API、5 連點）、H2（fireAttack→enemyDefeated、無限塔直接開商店）、M1/M3/M5/M6/M8 皆與計畫一致；引擎實測 M3 空區不生效／對子×2、banality 下 D 藥水維持×1
- **Phase 4（L1~L9）由阿扣實作完成**：
  - L1：applyMatch 加 matchVal（黑洞 8 視為 1）修高亮錯位
  - L2：天譴改 `rarity >= 4`（含 rarity 5，依裁定）；並發現原精確比對會漏掉「比比丟八(ビビデバ)」，改用 `getRuleMetaByName`
  - L3：商店買空文案與契約前綴改四語 key（`ui.contract_prefix`、`ui.contract_prefix_infinite`、`messages.shop_sold_out`）
  - L4：依裁定採現狀（平庸之惡完全封鎖 D 藥水），不改碼
  - L5：移除重骰動畫開始前的 saveGame，避免「已扣次、骰面未換」半套存檔
  - L6：loadGame 回傳成敗；損毀存檔改退回標題＋清除＋`messages.save_corrupted` 提示，不再黑畫面軟鎖
  - L7：i18n.js 四語 ui 區塊重複 key 去重（保留後者覆蓋的生效值，Node 實測 11 組一致）
  - L8：Electron `bibi://` 路徑檢查補 `root + path.sep` 前綴
  - L9：runtime.js `crypto.randomUUID` 加非安全來源 fallback
  - M7 補強：語言切換時收集冊分頁按鈕文字同步刷新（`refreshCollectionModalUI`）
- **驗證**：全部修改檔 `node --check` 通過；`steam:i18n:verify` 四語 710 keys（+4）完全對齊；i18n 生效值與新 key 格式化 Node 實測通過；引擎功能測試（弒神/藥水/banality）通過；`npm.cmd run steam:package:verify` 完整通過（17 項 check ＋ EXE smoke，含最終天譴修正後重跑一次）
- **注意**：本檔待處理問題已結案搬移至已處理問題；發布前建議製作人實機試玩 `dist/steam-windows/BIBI-DICE.exe`（重點：通關 Boss 拿 2 靈魂＋掉落、正式包無作弊入口、四語切換）
更新者：阿扣（Claude Code）

### 2026-07-06 鑀韻西 × 阿扣（19 項 Bug 修復進行中；Phase 3 驗收受阻）
- **製作人裁定**：M2「弒神」完成上線；M3 區域藥水採非空區 `×2.0`；L2「天譴」包含 rarity 5；【平庸之惡】完全封鎖 D 區藥水。
- **Phase 1 已完成並由韻西交叉驗收**：正式 `bibi://` 封裝不再建立作弊碼、開發者 API／按鈕 handler 或五連點入口；localhost／127.0.0.1 開發工具維持可用。最終 Boss 改走 `enemyDefeated()` 正常發放 2＋契約靈魂與傳說掉落，進入無限塔改直接開商店、不重複發獎。
- **Phase 2 已完成並由韻西交叉驗收**：修正破壞鉗套用順序、區域藥水乘算與空區判斷、血色聖戰角標／死碼、舊存檔契約 fallback、無掉落菁英靈魂。專項實測確認平庸之惡下 D 藥水最終維持 `×1`、血色聖戰 HP `2/3` 時八顆 2 皆顯示 40、全遺物後第 3 關菁英仍獲得 1 靈魂。
- **Phase 3 已實作、尚未完成阿扣交叉驗收**：弒神已改為重型枷鎖並透過共用設定組裝傳入 `suppressMythic`；骰面角標同步停用神話加成；噪音遺物提示與三種 modal 語言切換已修復。本機實測弒神八顆 2 的總基礎由 240 降為 16、角標由 30 回到 2；噪音提示與歷史／收集冊／靈魂視窗切語言皆通過且零 console error。
- **驗證**：Phase 1～3 相關檔案 `node --check`、`git diff --check`、四語 706 keys、最新 `npm.cmd run steam:package:verify` 16 項均通過。
- **確切阻塞**：阿扣啟動 Phase 3 唯讀交叉驗收時，`claude.exe` 回報 `You've hit your session limit · resets 10pm (Asia/Taipei)`，未取得有效驗收輸出。依共同規劃硬閘門，韻西已停止後續 Phase 4，不得在阿扣恢復前獨自繼續。
- **下一步**：台北時間 22:00 後重新呼叫阿扣完成 Phase 3 唯讀交叉驗收；通過後才開始 Phase 4（L1～L9、聚焦測試與最終文件收尾）。目前未 commit、未 push、未部署或發布。

### 2026-07-06 阿扣（遊戲程式碼全面查核：19 項問題與修復計畫書）
- 狀態：查核完成、**未修改任何遊戲程式**；待製作人核准後由阿扣 × 韻西共同修復
- 任務：製作人指示全面細讀程式碼找出實際 bug 與邊界破綻，按嚴重度列出
- 範圍：`js/` 全部（engine/data/main/ui/i18n/audio/diceSkin/platform 全套）、`steam-app/`、`index.html`；並以 grep 與 Node 腳本交叉驗證全域函式、遺物 id、四語系 key 對齊
- 發現：**高 2 項**（H1 正式版作弊入口全未鎖 IS_DEV 可刷靈魂/成就；H2 通關最終 Boss 直接 gameWin 跳過靈魂與傳說掉落）、**中 8 項**（破壞鉗無法還原枯萎、弒神枷鎖半成品零效果、區域藥水空區白拿 3 倍、噪音枷鎖點遺物 TypeError、血色聖戰角標引用不存在 id、舊存檔誤套最高契約、語言切換回呼呼叫不存在函式、菁英怪無掉落時不給靈魂）、**低 9 項**
- 產出：
  - `docs/ai-collaboration/tasks/game-bugfix-2026-07/BUGFIX_PLAN.md`：完整問題清單（位置、影響、修復方案、驗收條件）與四階段修復計畫、分工建議、風險注意
  - 本檔「待處理問題」新增 H1/H2、M1~M8、L1~L9 條目
- 待製作人決策：M2（弒神完成或移除）、M3（藥水 +2.0 或 x2.0）、L2（天譴是否含 rarity 5 牌型）
- 注意（給韻西）：四語系 key 與 data.js 全部 id 已驗證對齊、`.promo-card.hidden` 修正已在本機、平台層與 Electron IPC 白名單皆乾淨，免重工；修復動到 UI/邏輯後必跑 `npm.cmd run steam:package:verify` 才會反映到製作人玩的 exe
更新者：阿扣（Claude Code）

### 2026-07-05 鑀韻西 × 阿扣：完成 Firebase Email／密碼 Authentication 基礎
- **共同方案 C**：雙方先完成獨立檢查、異議交換與責任表；將任務分成「本機安全修正」與「Auth-only 遠端部署」兩階段，製作人核准後才開始修改，Phase 1 未經阿扣通過前不得部署。
- **客戶端安全修正**：驗證信、重寄驗證信與密碼重設信會依 App 語言設定 Firebase `auth.languageCode`；App 內刪除帳號改用登入後才顯示的專用密碼欄，順序固定為重新驗證、刪除 Firestore 使用者文件、刪除 Auth 使用者。訪客不再看到刪除入口，登出會清空刪除密碼。
- **Auth-as-code**：`firebase.json` 使用官方 Boolean schema，只宣告 `auth.providers.emailPassword: true`；以 Firebase CLI 15.22.4 執行 `--only auth`，新專案 `bibi-dice-mobile-leijoa` 已成功啟用 Email／密碼，未部署 Firestore 或 Hosting。
- **Console 權威狀態**：Email／密碼開啟、Email Link 關閉；帳號建立、帳號刪除與 Email 枚舉防護皆開啟；預設驗證信與密碼重設信範本存在；授權網域只有兩個 Firebase 預設網域，沒有 `localhost`；使用者清單維持 0。
- **驗證**：四語 706 keys 完全對齊、手機建置 6 項、手機測試 12/12、帳號刪除頁建置、語法與任務檔案 diff 檢查通過；320／390／430px 無頁面水平溢位，320px 實際畫面確認訪客狀態正確。
- **阿扣交叉驗收**：Phase 1 與 Phase 2 均使用 US$5 上限執行唯讀驗收；兩階段皆獨立重跑必要測試並明確回覆「交叉驗收通過」。
- **安全停點與下一步**：`mobile.config.local.json` 仍為 `enabled:false`，RevenueCat Key、帳號刪除網址仍空白，AdMob 維持測試模式。下一個獨立任務應共同規劃帳號刪除 Hosting 或其餘手機後台，完成必要服務前不得啟用正式雲端客戶端。

### 2026-07-04 鑀韻西 × 阿扣：完成台灣區 Firestore 基礎與新專案修復
- **共同規劃**：韻西與阿扣先對 region、Rules 型別防線與責任表取得方案 C 共識；首次 Rules dry-run 意外在舊專案建立不可改位置的 `nam5` 資料庫後，雙方重新比較接受美國區、刪除重建、新專案與 named database，明確同意方案 R，並取得製作人二次核准。
- **新 Firebase 專案**：建立 `bibi-dice-mobile-leijoa`（Display Name `BIBI DICE Mobile`，Spark／Analytics 停用），先單獨啟用 Firestore API 並確認資料庫清單為空，再用完整參數建立 `(default)`。
- **Firestore 狀態**：新資料庫位於 `asia-east1`，使用 `FIRESTORE_NATIVE`／`STANDARD`，free tier 啟用、刪除保護啟用、PITR 停用；Rules 已完成語法 dry-run 與正式部署。
- **Rules 補強**：`energySpendsByOrigin` 存在時必須是 map；`freeMythicVesselLevels` 存在時必須是 0～4 整數。Authentication 尚未啟用時，`owns(uid)` 讓所有第三方請求維持 fail-closed。
- **新 Web App 與本機設定**：建立 App ID `1:406034512445:web:ea8a80105dc7b5cbf58854`；`.firebaserc` 與被 Git 忽略的 `mobile.config.local.json` 已切到新專案，四欄與遠端 SDK config 一致，`enabled:false`、AdMob 測試模式、RevenueCat 空 Key 與帳號刪除網址空白均未改變。
- **舊專案保留**：`bibi-dice-leijoa` 與其中的 `nam5` 空資料庫完整保留，不部署 Rules、不啟用 Auth、不供 App 使用；資料庫 `createTime`／`updateTime` 均維持 `2026-07-04T10:24:38.310981Z`。前一條 Firebase Web App 紀錄保留為歷史，但已由新專案設定取代。
- **驗證**：新舊專案與新 Web App 均為 ACTIVE；新資料庫全部欄位符合核准值；匿名讀取 `users/test` 回 HTTP 403；`mobile:verify` 6 項與 `test:mobile` 12 項通過；本機設定仍被 Git 忽略且沒有 stage、commit 或 push。
- **阿扣交叉驗收**：第一次因 Claude shell 沙盒拒絕唯讀命令而退回；補齊方案 R 任務單並使用核准的唯讀權限模式後，阿扣獨立重跑 9 類驗收並明確回覆「交叉驗收通過」。
- **範圍與下一步**：未修改遊戲碼、四語系、Android／iOS、Hosting、Authentication、AdMob、RevenueCat 或 Steam；下一個獨立任務才共同規劃 Email／密碼 Authentication、枚舉防護與帳號刪除流程，手機雲端功能在此之前不得切成 `true`。

### 2026-07-04 鑀韻西 × 阿扣：首波 Threads 繁中貼文已公開
- **發布完成**：製作人自行在 Threads 帳號 `@leijoalan` 發布繁中正式上市短片，公開網址為 `https://www.threads.com/@leijoalan/post/DaXgWWhDLQZ`，發布時間約為 2026-07-04 18:17（Asia/Taipei）。
- **公開驗證**：未登入狀態可開啟貼文；主文正確顯示 `172,800,000` 傷害、鎖定／重擲／牌型／遺物玩法、正式上市與首發九折，影片附件與 Steam 商店預覽皆存在。
- **連結限制**：公開頁的 Threads 轉址只保留正式版 Steam 商店基礎網址，原文規劃的 `utm_source=threads` 等查詢參數已被平台移除；本次不誤記為可追蹤 UTM 導流。
- **首波狀態**：Threads 繁中與 YouTube Shorts 英文均已公開；接下來在各自發布後 24／72 小時回填觀看、互動與 Steam 成效，再決定第二、三波節奏。
- **共同規劃與驗收**：韻西與阿扣先核對既有繁中 MP4、文案、傷害數字、折扣期限與發布範圍，明確同意由製作人／韻西負責瀏覽器、阿扣負責文件交叉驗收；發布後阿扣唯讀核對三份紀錄並回覆「交叉驗收通過」，未發現矛盾或需立即修正事項。
- **範圍控制**：未修改遊戲程式、手機後台、Steam Build、四語影片成品或其他平台內容。

### 2026-07-04 鑀韻西 × 阿扣：完成 Firebase Web App 與本機停用接線
- **新流程執行**：韻西與阿扣先各自讀取需求與現況、提出方案、交換 `enabled` 與 Git ignore 驗收異議，最後明確同意共同計畫與責任表；製作人核准後才開始實作。
- **任務單**：新增 `docs/ai-collaboration/tasks/mobile-firebase-foundation/TASK_BRIEF.md`，記錄本輪目標、禁止範圍、驗收條件、已知限制與責任表；未重複建立 PROJECT_CORE、DEV_LOG 或獨立驗收表。
- **Firebase Web App**：在 `bibi-dice-leijoa` 建立唯一的 Web App `BIBI DICE Mobile`，App ID 為 `1:483341544303:web:f96579ff2797e42030d69a`，遠端狀態為 `ACTIVE`。
- **本機設定**：新增 `.firebaserc`，default 指向 `bibi-dice-leijoa`；建立被 Git 忽略的 `mobile.config.local.json`，Firebase `apiKey`、`authDomain`、`projectId`、`appId` 均由 `apps:sdkconfig` 取得並核對一致。
- **安全停用**：本機設定維持 `enabled: false`，AdMob 維持測試模式與官方測試 ID，RevenueCat Key 與帳號刪除網址保持空白。尚未完成 Auth／Firestore／Rules／Hosting 前，手機與 Steam 正式建置都不啟用雲端功能。
- **韻西驗證**：`apps:list`、`apps:sdkconfig`、`git check-ignore`、ignored status、一般 git status、`npm.cmd run mobile:verify` 與管理端私鑰掃描全部通過；建置輸出含正確 projectId／appId 且 `enabled=false`。
- **阿扣交叉驗收**：阿扣唯讀重跑全部 7 項驗收並明確回覆「交叉驗收通過」；確認沒有超出共同計畫，也沒有建立 Firestore／Auth 或部署 Rules／Hosting。
- **範圍控制**：未修改遊戲程式、四語系、Android／iOS 原生專案、Firestore Rules、Hosting、AdMob、RevenueCat 或任何 Steam 檔案；未執行 Git stage、commit 或 push。
- **下一步**：另立共同規劃任務後，才決定 Firestore 地區與 Authentication／Rules／Hosting 的建立順序；不得直接把 `enabled` 切成 `true`。

### 2026-07-04 鑀韻西：手機版後台設定暫停，等待新版工作流程
- **暫停狀態**：製作人要求立即停止手機版後台設定，先更新工作流程；在新版流程確認前，不得繼續建立 Web App、Firestore、Authentication、AdMob、RevenueCat、Google Play 資源，也不得部署 Rules 或 Hosting。
- **Firebase 已完成**：Firebase CLI 已完成 Google OAuth 登入；Google Cloud／Firebase 專案 `BIBI DICE` 已建立，Project ID 為 `bibi-dice-leijoa`，使用 Spark 免費方案，Google Analytics 依首發規則保持停用。
- **建立過程**：CLI 先成功建立 Google Cloud 專案，但因帳號尚未接受 Firebase 條款，`addFirebase` 回傳 `403 PERMISSION_DENIED`；製作人在 Firebase Console 接受條款後，以既有 Cloud 專案完成加入 Firebase。CLI 已再次確認專案為 `ACTIVE` 且帶有 `firebase: enabled`。
- **明確未完成**：尚未建立 Firebase Web App；尚未建立 Cloud Firestore 或選擇資料位置；尚未啟用 Email／密碼 Authentication；尚未建立 `.firebaserc` 或 `mobile.config.local.json`；尚未部署 `firestore.rules`、帳號刪除 Hosting 或任何正式 App 設定。
- **建議但未執行**：原規劃建議 Firestore 使用 `asia-east1`（台灣），但位置不可變更，因此尚未建立，留待新版工作流程重新確認。
- **阿扣核對**：依專案規範以 US$5 上限完成唯讀盤點，確認 Android 工程已到需要真實後台識別碼的邊界，Firebase 應先於 RevenueCat，AdMob 可平行；本輪未讓阿扣修改檔案。
- **續作入口**：恢復工作前先讀本條紀錄與新版工作流程，再由製作人重新核准外部資源建立順序；不可直接沿用舊流程繼續送出。

### 2026-07-03 韻西：首波英文 YouTube Shorts 已公開
- **發布完成**：英文正式上市短片已於 2026-07-03 晚間公開，標題為 `120,960,000 Damage From 8 Dice?! BIBI DICE Is Out Now 🎲`。
- **公開網址**：`https://youtube.com/shorts/E2X6iPzoN7E`。
- **導流設定**：說明已加入正式版 Steam AppID `4792230` 的英文 Shorts UTM 連結，並將公開正式預告片 `https://youtu.be/U4BvT5RyU5M` 設為 Shorts 相關影片。
- **YouTube 設定**：影片語言為英文、非兒童專屬、AI 寫實內容聲明為否；廣告自評為不含列舉內容，著作權與廣告合適度檢查皆未發現問題。
- **下一步**：完成第一波 Threads 繁中貼文；英文 Shorts 於發布後 24／72 小時回填觀看、留存、互動與 Steam UTM 成效，再安排日文、簡中版本。
- **範圍控制**：本輪未修改遊戲程式、Steam Build 或四語影片成品，只執行英文 Shorts 發布並更新紀錄。

### 2026-07-03 鑀韻西：手機版首發工程基線與 Android 模擬器驗收完成
- **程式狀態**：Capacitor 8、Android／iOS 專案、手機 Web 建置、原生檔案存檔、Firebase Auth／Firestore、AdMob／UMP、RevenueCat、挑戰次數、四語手機 UI、本機通知與生命週期接線均已完成；未修改 `js/engine.js` 或靜態戰鬥數值。
- **App 識別與平台**：主 App ID `com.leijoa.bibidice`；Android API 24～36，iOS 15+／僅 iPhone，兩邊固定直式。若後台占用，需將 Capacitor、Android、Xcode 三處一起切成 `com.leijoalion.bibidice`。
- **資料安全**：手機完整白名單存檔寫入 `profile-v2.json`，採暫存檔、舊檔備份與 rename；Firebase 只合併局外進度。靈魂使用每來源單調帳本，收集冊聯集、奉獻與最高紀錄取高，舊檔遷移與重複同步已有測試。
- **次數與收益**：免費版 5 次、每小時恢復 1；新局最終確認與無限塔確認各扣 1。廣告完成才給獎勵，商店再議規則與每店最多一支刷新廣告已接線；完整版移除廣告與次數限制，RevenueCat 權益為 `premium`。
- **帳號**：訪客可玩；同步或購買才需 Email 帳號，購買前需驗證 Email。已完成 App 內與四語網頁刪除入口、密碼重設與 Firestore Rules；Firebase Console 仍需手動開啟 enumeration protection。
- **Steam／Demo**：Steam 正式版可在存在 `mobile.config.local.json` 時打包 Firebase 局外同步；目前沒有正式設定，因此安全停用。Demo 與一般 Steam 包不含 Android／iOS、帳號刪除頁、Firebase 設定或手機 UI，正式包／EXE smoke 已通過。
- **自動驗證**：`test:mobile` 12 項、四語 704 keys、`mobile:verify`、帳號刪除頁、`cap sync`、320／390／430px 四語瀏覽器回歸、`steam:verify`、`steam:package:verify` 與 `npm audit` 通過。Windows 大視窗 675×1200 實際為 676×1200 的系統四捨五入已納入測試容差。
- **Android 工具鏈**：已安裝 Android Studio 2026.1.1.10、OpenJDK 21.0.11、Android SDK／Build Tools 36、ADB、Emulator 與 API 36 Google APIs x86_64 映像；Windows 使用者環境已寫入 `ANDROID_HOME`、`ANDROID_SDK_ROOT` 與工具路徑。
- **Android 產物**：Debug APK `android/app/build/outputs/apk/debug/app-debug.apk` 與 Debug AAB `android/app/build/outputs/bundle/debug/app-debug.aab` 均建置成功；APK 已安裝到 `BIBI_DICE_API_36` Pixel 6 AVD，套件為 `com.leijoa.bibidice`、minSdk 24、targetSdk 36。
- **Android 實測**：API 36 模擬器通過冷啟動、直式與觸控、開始新局 5/5→4/5、拒絕通知權限後進入戰鬥、背景建立 `profile-v2.json` 與備份、強制終止後顯示續玩且維持 4/5、續玩不扣次，以及戰鬥中返回鍵顯示離開確認。沒有 App 崩潰。
- **仍待後台／實機**：AdMob 測試 App 與 UMP 初始化成功；Firebase Email、正式／獎勵廣告及 RevenueCat Test Store 尚待正式設定。Android 實機仍需驗證 WebView、內購、廣告、背景回收與低記憶體；Windows 仍無法執行 Xcode／TestFlight。
- **建置警告**：AdMob 與 RevenueCat 會讓 Kotlin plugin 重複載入，RevenueCat 的 Amazon Appstore 相依套件在 APK dex 時會出現 stack-map 警告；目前未阻止 APK／AAB 建置及 API 36 啟動，升級外掛時再追蹤。
- **製作人下一步**：建立 Firebase、AdMob、RevenueCat、Apple Developer、Google Play Console；提供正式設定、聯絡 Email、隱私政策網址、1024×1024 App Icon 與啟動畫面；借 Android 實機驗收，之後租 Mac＋Xcode 26 驗證 iPhone／TestFlight。
- **文件入口**：先讀 `docs/mobile/README.md`，再依 `docs/mobile/RELEASE_CHECKLIST.md` 執行；隱私政策草案在 `docs/mobile/PRIVACY_POLICY_DRAFT_ZH_TW.md`。
- **阿扣協作**：OAuth 過期問題已透過重新登入修復，實際模型請求與兩輪 US$5 唯讀審查成功。審查發現的離線廣告獎勵被上限吃掉、跨帳號消耗計數污染已修正並補回歸；client-authoritative 單機進度可由帳號本人竄改的限制已記錄，未來若加入排行榜必須改可信伺服器。

### 2026-07-02 鑀韻西：完成 G8 電玩展報名截圖與表單資料包
- **交付資料夾**：新增 `promo/g8-2026-registration/`，內含四張可直接上傳的 PNG 與 `APPLICATION_INFO.md`。
- **指定檔名**：依主辦方文字原樣保留 `Scrrenshot` 拼字，建立 `Game Scrrenshot_LeijoaLion_2026-07-02_1.png` 至 `_4.png`。
- **截圖內容**：依序選用戰鬥與八顆骰子、牌型倍率、遺物商店、48 億傷害精彩時刻；來源為既有 Steam 商店截圖 `02`、`03`、`05`、`08`，沒有修改或重新壓縮原圖。
- **表單資料**：上市日期填 `2026-06-30`；Demo 為 `https://store.steampowered.com/app/4796530/BIBI_DICE_Demo/`；Steam 正式版為 `https://store.steampowered.com/app/4792230/BIBI_DICE/`。
- **Trailer 核對**：表單畫面中的 `https://youtu.be/nnJj7DlKvxw` 是 G-EIGHT 官方 2024 宣傳片，不是《比比丟八》影片；目前沒有公開的《比比丟八》YouTube Trailer，因此報名資料明確標示該欄留白。
- **驗證**：四張皆為 1920×1080 PNG、單檔低於 2MB，且 SHA-256 與各自來源完全相同。
- **範圍控制**：沒有修改遊戲程式、Steam Build、原始截圖或影片；尚未替製作人送出 G8 表單。

### 2026-07-01 鑀韻西：完成 video-autopilot-kit 正式版設定與四語四平台發布包
- **工具設定**：外部 `video-autopilot-kit` v0.6.0 的 `config.py` 已改指向 `D:\unity\bibi-dice\promo\social\steam-launch-short`；原本的 Demo AppID `4796530`、Demo CTA、18 秒規格與「仍缺乾淨四語素材」皆已更新為正式版 AppID `4792230`、立即遊玩、13 秒四語成品與現有素材狀態。
- **工具定位**：HyperFrames `0.7.17` 仍是四語影片的來源，不把 `video-autopilot-kit` 加入遊戲或影片專案依賴；該工具只供未來 CapCut 輔助、FFmpeg 後製、規劃與交付 QA。
- **新增 profiles**：更新 `brand.md`、`content_pipeline.md`、`your_context.md`，新增 `algorithm.md`、`community.md`；已記錄 Steam 基準、四平台帳號、首波發布測試與 24／72 小時數據觀察方式，未蒐集的 YouTube／社群數字明確保留為未知。
- **四語發布文案**：在 `promo/social/steam-launch-short/` 新增 `POST_COPY_EN.md`、`POST_COPY_JA.md`、`POST_COPY_ZH_CN.md`、`POST_COPY_ZH_TW.md`，每語皆包含 YouTube Shorts、Threads、Instagram Reels、X；CTA 改為正式版已上市與立即遊玩。
- **追蹤連結**：四平台／四語使用獨立 Steam UTM，統一加入 `utm_content=high_damage_v1`；影片中各語傷害數字與文案一致，未沿用舊版 48 億或願望清單文案。
- **發布檢查表**：新增 `PUBLISH_CHECKLIST.md`，包含成品對照、發布波次、平台限制、公開網址紀錄與 24／72 小時成效欄位。第一波建議為 Threads 繁中與 YouTube Shorts 英文。
- **尚未執行**：本輪沒有登入或發布任何社群平台，也沒有修改、重剪或重新輸出四支正式影片。
- **阿扣協作**：依規範以 `--max-budget-usd 5.00` 執行限縮唯讀核對；`auth status` 顯示已登入，但正式呼叫回傳 `401 Invalid authentication credentials`，request ID `req_011CcbGPT8pQhLa87bjkUi5u`，本輪由鑀韻西完成實作與驗證。

### 2026-07-01 韻西：正式上市、熱修、Demo 導購與首日營運狀態已同步
- **正式版目前 Build**：Base Game AppID `4792230`／DepotID `4792231` 的 `default` 與私人 `internal` 皆為 Build `23984755`，描述 `BIBI DICE Launch Hotfix - 2026-06-30`。正式版不再顯示 Demo／itch.io 專用導購卡，Steam 原生安裝、啟動與隱藏狀態皆已驗證。
- **Demo 目前 Build**：Demo AppID `4796530`／DepotID `4796531` 的 `default` 為 Build `23985042`，描述 `BIBI DICE Demo Store CTA - 2026-06-30`。標題與通關導購按鈕會顯示、事件已綁定，並可安全開啟正式版 Steam 商店頁。
- **修正根因**：正式版導購卡雖帶有 `hidden`，但較晚載入的 `.promo-card { display:flex; }` 覆蓋隱藏樣式，造成正式版出現無反應按鈕；已用 `.promo-card.hidden { display:none !important; }` 恢復正確版本行為。
- **正式上市**：Steamworks 顯示遊戲已於 2026-06-30 上午 4:47 開始上架曝光，首發折扣為 10%／7 天；上架曝光回合已啟動，最長持續 30 天。
- **首日銷售**：Steam 財務報表截至 2026-06-30 顯示售出 `4` 份、Steam 毛營收 `US$9`、扣除退款／拒付／稅金後淨額 `US$8`、退款 `0`；四份銷售目前皆來自台灣。
- **願望清單**：累計新增 `42`、刪除 `6`、購買／啟用轉換 `2`，目前尚有 `34`。上市日新增 `11`、刪除 `1`、轉換 `2`，期間淨增 `8`；26 封上市通知帶來 2 次轉換，報表轉換率 `7.7%`，但 Steam 標記樣本仍不足。
- **曝光資料**：商店流量目前只回填到 2026-06-29；6/23～6/29 共 `22,508` 次曝光、`1,210` 次造訪、`868` 次計入曝光點擊的造訪，CTR `3.9%`，其中 `339` 次造訪被標記為機器人流量。上市日完整曝光尚未回填，不可用上市前流量推算首日購買轉換率。
- **外部導流**：6/17～6/30 UTM 共 `73` 次造訪、`40` 次可信造訪、`24` 次可追蹤造訪、`1` 次願望清單轉換，尚無 UTM 歸因購買；報表中的 `ig_text_post_permalink` 是目前最主要可信來源。Steam UTM 購買歸因可能延遲數日。
- **Demo 觸及**：Demo 累計免費授權 `1,062`，但實際累計不重複玩家為 `23`、遊玩時間中位數 `18` 分鐘；2026-06-30 新增 `7` 份免費授權，不能把免費授權總數直接視為實際玩家數。
- **宣傳狀態**：英、日、簡中、繁中四支正式上市短片均已完成且尚未發布；下一步仍是建立四平台／四語貼文、各平台獨立 UTM，並分批發布。
- **文件範圍**：本次只同步交接文件，沒有修改遊戲程式、Steam Build、商店設定或影片成品。

### 2026-07-01 鑀韻西：四平台四語宣傳影片工作已移交至專案內
- **交接位置**：新增 `promo/social/multiplatform-launch-handoff/`，內含總交接、素材索引與四平台發布矩陣。後續新視窗應先讀本檔頂部，再讀該目錄的 `README.md`。
- **平台帳號**：Threads `https://www.threads.com/@leijoalan`，Instagram `https://www.instagram.com/leijoalan/`，YouTube `https://www.youtube.com/@LeijoaLion`，X `https://x.com/Leijoa2588`；台灣地區以 Threads 為主力宣傳平台。
- **既有成品**：確認 `promo/social/steam-launch-short/previews/` 已有英、日、簡中、繁中四支 1080×1920、60fps、約 13.035 秒正式成品，品質與在地化均優於 Codex 文件區的外部暫製原型，不需重新索取玩法錄影、BGM、音效、Logo、角色立繪或四語術語。
- **素材盤點**：確認 `promo/steam/trailer/raw-captures/` 有 23 支四語 1920×1080、60fps 實機錄影，合計約 350.28 秒；專案另有完整 BGM／SFX、透明 Logo、兩張透明角色立繪與四語 locale。
- **下一步**：在 `promo/social/steam-launch-short/` 新增四語發布文案，每語包含 YouTube Shorts、Threads、Instagram Reels、X；將舊版願望清單 CTA 更新為正式版已上市的立即遊玩 CTA，並建立分平台／語系 UTM。既有影片、遊戲程式與 Steam Build 不需修改。
- **外部原型**：先前 Codex 文件區的 18 秒直式／橫式 HyperFrames 原型保留於原位置供研究，因素材與成品重複且畫面仍混有繁中 UI，未複製進正式專案。
- **阿扣協作**：`claude.exe auth status` 顯示已登入，但正式唯讀素材核對回傳 `401 Invalid authentication credentials`，request ID `req_011CcbD8fxEQomf6xaWYw7f7`；本輪未以其他子代理替代。

> **歸檔說明**：2026-06-30（含）以前的交接紀錄已移至 `SYNC_ARCHIVE.md`，僅供追溯，不作為目前進度來源。
> 本區僅保留最近約兩週的紀錄；更舊條目由當班 AI 在更新本檔時順手搬移。

---

### 開工讀取順序

1. 先讀本區，確認目前真實狀態。
2. 再讀 `AGENTS.md`，遵守繁體中文、MVC 分層、i18n 與改檔前計畫規則。
3. 再讀 `AI_COLLABORATORS.md`，確認 AI 協作稱呼與身份。
4. 再讀 `CHANGELOG.md` 最新段落，確認已完成變更。
5. 若任務與 Steam 有關，先讀 `promo/steam/README.md`，不要直接讀舊任務單或憑記憶判斷。

### 重要協作規則

- 禁止只依照 AI 自己的記憶判斷進度。
- 禁止從本檔下方很舊的歷史紀錄直接推斷目前狀態。
- 若文件互相衝突，以本區、`promo/steam/README.md`、`STEAMWORKS_UPLOAD_PACKET.md` 的最新狀態為準，並回報衝突。
- 新任務完成後，必須把「目前真實狀態」更新到本區或相關主文件，避免下一位 AI 讀到落後資訊。
- 已封存到 `promo/steam/archive/` 的文件只供追溯，不再作為任務進度來源。
- 本檔快速交接區僅保留最近約兩週；更舊條目由當班 AI 更新本檔時順手搬到 `SYNC_ARCHIVE.md`（僅供追溯）。
- 條目瘦身：SYNC 條目以 5~8 行摘要為原則；根因分析、逐項驗證等細節寫進 `docs/ai-collaboration/tasks/<任務>/` 的任務文件並在條目附路徑。

#### 交叉驗收分級（2026-07-13 起適用）

- **A 級（必須交叉驗收；對方不可用時暫停並記錄阻塞）**：`js/engine.js` 計分／判定、`js/data.js` 數值、Steam 發布鏈（SteamPipe 上傳、SetLive、公告發布）、帳號／金流／雲端後台設定。
- **B 級（可單方完成、事後補驗）**：UI 表現層（`js/ui.js`／`css/style.css`）、文案與四語系、宣傳素材。完成後記入本檔，對方下次開工時順手唯讀複核。
- **C 級（免交叉驗收）**：純文件整理、截圖／素材產出、暫存工具腳本。
- 對方額度／狀態不可用時：A 級暫停；B/C 級依製作人既有授權（2026-07-10、07-11）由可用方先獨力完成並註記原因。

#### 打包與 commit 衛生

- 跑 `steam:package:verify` 前先 `git status`：發現非本次任務的工作區變更，必須在 SYNC 條目點名（哪些檔案、屬於誰的哪個任務），避免未審內容被夾帶進製作人玩的 exe。
- 小修（B 級）經製作人確認後當天就提請 commit，不隔夜堆積。

#### 發布類任務收尾義務

- 任何 Steam 發布／Build 變更任務結束時，**必須同步更新下方「目前真實狀態」表**（Build、四語 keys 數、待處理問題搬移）；漏更新視為任務未完成。

#### 韻西呼叫阿扣標準流程

- 一律使用 `scripts/call-claude-review.ps1`（非互動 `-p`、預算上限 US$5.00、輸出自動存檔、session limit／trust／401 偵測），不要手打參數。
- workspace trust 提示：製作人在專案目錄互動執行一次 `claude` 並接受信任即可永久解決。
- 腳本失敗時依警告訊息處理：session limit → 記下重置時間，B/C 級由韻西先獨力完成；401 → 請製作人重新登入。

#### 批次實作任務（內容擴充等多批次工程）

- 每批開工前先建 `docs/ai-collaboration/tasks/<批次名>/TASK_BRIEF.md`（用 `docs/ai-collaboration/templates/` 模板），寫明分工切面與驗收條件。
- 建議分工切面對齊 MVC 分層：一方負責 `data.js`＋四語系，另一方負責 `engine.js` 判定＋`alldamege.csv` 重產＋`sim:compare` 同 seed 對照；交叉驗收方各自獨立跑 `sim:verify`＋`steam:i18n:verify`。

### 已安裝插件與優先使用時機

後續 AI 不可只用通用回答；遇到下列任務時，應優先檢查並使用對應插件或 MCP 工具：

- **Canva**：社群圖、宣傳圖、Steam/itch.io 行銷素材、可編輯設計稿。
- **Creative Production**：行銷視覺、廣告素材、活動宣傳圖初稿。
- **Figma / Product Design**：UI 設計稿、Steam 圖像版型、設計系統、Figma 連結或設計轉程式工作。
- **HyperFrames by HeyGen**：HTML 動畫影片、Steam Trailer、短影片、社群影片、可重複渲染的影片模板。
- **Remotion**：程式化影片、發售倒數影片、更新公告影片、固定模板式 Trailer。
- **Presentations**：簡報、提案、pitch deck、企劃整理。
- **Spreadsheets / Data Analytics**：表格、數據整理、KPI、銷售/願望清單/測試回饋分析。
- **GitHub**：PR、Issue、CI、發佈流程、程式碼審查與上傳協作。
- **CodeRabbit**：PR 自動審查、風險檢查、程式碼品質回饋。
- **Linear**：任務管理、bug 追蹤、Steam 發行 checklist、阿扣/Codex 分工。
- **Sentry**：玩家端錯誤、Electron/前端例外、發行後 crash 或錯誤追蹤。
- **Notion / Google Drive / Gmail / Slack**：文件、雲端檔案、信件與團隊訊息需要搜尋、整理或撰寫時使用。

注意：上述插件不能直接補上 in-app Browser 的本機檔案上傳能力；Steamworks 檔案選擇器若仍不支援自動選檔，需由製作人手動選檔，AI 負責產生、驗證、整理正確檔案路徑。
---

### 目前真實狀態

| 項目 | 狀態 |
|---|---|
| Base Game AppID | 4792230 |
| Base Game Build | 24157365（default，2026-07-11 新手教學大改版） |
| 發行狀態 | 2026-06-30 上午 4:47 已上市；10% 首發折扣／7 天 |
| Demo AppID | 4796530 |
| Demo Build | 23985042（default；2026-07-11 曾誤切 24157360 已回退） |
| 版本導購 | 正式版隱藏；Demo 顯示且可開啟正式版商店 |
| 四語系 | 720 keys 對齊（2026-07-11 驗證） |
| SteamCMD | D:\tools\steamcmd\steamcmd.exe |
| SteamCMD 帳號 | leijoa2588（舊文件的 leijoa_dev 為誤植，已修正） |
| ContentRoot | D:\unity\bibi-dice\dist\steam-windows |
| 首日銷售 | 4 份；毛營收 US$9、淨額 US$8、退款 0 |
| 願望清單 | 目前 34；上市日新增 11、轉換 2、淨增 8 |
| 上市前一週曝光 | 22,508 次曝光、1,210 次造訪、CTR 3.9%；上市日資料尚未回填 |
| 四語上市短片 | 四支正式成品與四語四平台文案／檢查表已完成；首波英文 YouTube Shorts 與 Threads 繁中已公開 |
| itch.io html Build | 第 14 版；仍同步舊 Demo Build 23496399，尚未跟進 23985042 |

---

### 待處理問題

| 問題 | 狀態 | 說明 |
|---|---|---|
| steam-launch-short 繁簡 gameplay 素材互換 | 待修正 | `promo/social/steam-launch-short/assets/gameplay/zh-tw/02-reroll.mp4` 實為簡體 UI、`zh-cn/02-reroll.mp4` 反為繁體，兩檔疑似互換（2026-07-08 廣告產製時發現）。已發布的四語短片 previews 若曾用錯置素材渲染可能受影響，需抽幀確認；是否重 render 待製作人決定 |
| G8 電玩展報名送件 | 待製作人上傳 | 四張截圖與表單資料已整理於 `promo/g8-2026-registration/`；目前可使用公開 Trailer `https://youtu.be/U4BvT5RyU5M` |
| 四平台四語上市短片發布 | 進行中 | 第一波英文 YouTube Shorts 與 Threads 繁中已完成；待回填 24／72 小時數據後安排第二、三波 |
| 上市日曝光判讀 | 待 Steam 回填 | 商店流量目前只到 2026-06-29；待 6 月 30 日資料可用後再計算上市曝光與購買轉換 |
| itch.io 同步 | 待確認 | 線上第 14 版仍是舊 Demo Build 23496399；尚未同步目前 Demo 23985042 的正式版導購修正 |

### 已處理問題

| 問題 | 完成日期 | 處理方式 |
|---|---|---|
| 19 項 Bug 修復後的 SteamPipe 發布 | 2026-07-11 | 已 commit＋隨新手教學大改版 Build 24157365 發布至正式版 default；Demo 維持 23985042 |
| 【H1】正式版作弊入口未鎖 IS_DEV | 2026-07-06 | 作弊碼監聽、dev API、5 連點入口全收進 IS_DEV 閘門（韻西實作、雙方驗收） |
| 【H2】通關最終 Boss 拿不到靈魂與傳說掉落 | 2026-07-06 | fireAttack 改走 enemyDefeated()，Boss 正常發 2＋契約靈魂與掉落；進無限塔改直接開商店不重複發獎 |
| 【M1】破壞鉗無法還原枯萎/時間壓縮 | 2026-07-06 | cons_pliers 檢查移到枷鎖效果套用之前 |
| 【M2】弒神枷鎖半成品 | 2026-07-06 | 製作人裁定完成上線：改 heavy 型別、buildActiveShackleConfig 傳入完整定義、骰面角標同步停用；引擎實測 240→16 |
| 【M3】區域藥水與敘述不符 | 2026-07-06 | 製作人裁定非空區 ×2.0；空區不再生效（引擎實測通過） |
| 【M4】噪音枷鎖點遺物 TypeError | 2026-07-06 | ui.js 補 `window.showToast = showToast` |
| 【M5】血色聖戰角標錯誤 | 2026-07-06 | 改用 fusion_blood_crusade 正確公式與 getMaxHp；刪除 fusion_titan/fusion_bloody/fusion_peak 死碼 |
| 【M6】舊存檔誤套最高契約 | 2026-07-06 | contractLevel fallback 改 0 |
| 【M7】語言切換回呼呼叫不存在函式 | 2026-07-06 | 改呼叫 UI 模組函式並帶正確參數；阿扣補強收集冊分頁標籤同步刷新 |
| 【M8】菁英怪無掉落時不給靈魂 | 2026-07-06 | else 分支補菁英 1 靈魂（＋契約加成） |
| 【L1】黑洞下牌型高亮錯位 | 2026-07-06 | applyMatch 加 matchVal 換算（8 視為 1）（阿扣） |
| 【L2】天譴不含 rarity 5 牌型 | 2026-07-06 | 製作人裁定含 rarity 5：改 `rarity >= 4` 並改用 getRuleMetaByName 比對（修正「比比丟八(ビビデバ)」精確比對漏判）（阿扣） |
| 【L3】i18n 硬編碼 | 2026-07-06 | 商店買空文案與契約前綴改四語系 key（contract_prefix/contract_prefix_infinite/shop_sold_out）（阿扣） |
| 【L4】平庸之惡洗掉 D 藥水 | 2026-07-06 | 製作人裁定完全封鎖 D 區藥水＝現行行為，不改碼（引擎實測 banality 下 D 藥水維持 ×1） |
| 【L5】重骰動畫前先扣次存檔 | 2026-07-06 | 移除動畫開始前的 saveGame，改由動畫收尾存檔（阿扣） |
| 【L6】損毀存檔黑畫面軟鎖 | 2026-07-06 | loadGame 回傳成功與否；失敗退回標題、清除存檔並顯示 save_corrupted 提示（阿扣） |
| 【L7】i18n 重複 key | 2026-07-06 | 四語 ui 區塊去重，保留原「後者覆蓋」生效值（Node 實測 11 組生效值一致）（阿扣） |
| 【L8】Electron 路徑前綴檢查 | 2026-07-06 | `startsWith(root + path.sep)` 補分隔符（阿扣） |
| 【L9】randomUUID 非安全來源拋錯 | 2026-07-06 | runtime.js 加時間戳亂數 fallback（阿扣） |
| G8 報名截圖與欄位資料未整理 | 2026-07-02 | 建立 G8 報名資料夾、四張指定檔名截圖與 APPLICATION_INFO.md |
| video-autopilot-kit 仍是 Demo／18 秒舊設定 | 2026-07-01 | 更新 config 與五份 profiles，改用正式版 AppID 4792230、13 秒四語成品與立即遊玩 CTA |
| 四語四平台上市文案與 UTM 尚未建立 | 2026-07-01 | 新增四份發布文案與 PUBLISH_CHECKLIST，依平台／語系拆分 UTM |
| 正式版誤顯示 Demo 導購且按鈕無反應 | 2026-06-30 | Build 23984755 修正 `.hidden` 樣式覆蓋並發布至 default／internal |
| Demo 缺少正式版導購 | 2026-06-30 | Build 23985042 加入 `steam-demo-build`、導購事件與驗證，發布至 Demo default |
| Build 23853875 驗收通過並發布至 default | 2026-06-23 | SteamPipe 上傳，internal 驗收後 SetLive default |
| 發行前後台總檢完成 | 2026-06-23 | 阿扣唯讀稽核後同步文件 |
| D 區「兩極」有效牌型顯示變暗 | 2026-06-26 | isZoneActive() 分離判斷 |
| 南瓜馬車招式浮字誤顯示為南瓜 | 2026-06-21 | isRuleNameMatch() 完全比對 |
| 顛倒是非枷鎖沒有實際視覺效果 | 2026-06-21 | hue-rotate 濾鏡替代舊背景 class |
|幻覺枷鎖重骰後沒有立即套用假資訊 | 2026-06-06 | renderDice 收尾套用 fakeNumber |
| library_hero_3840x1240.png 規則誤判 | 2026-06-01 | 改為必要素材（Steam 守則更新） |

---

### 目前可用指令

    npm.cmd run steam:build               # 重產 dist/steam-demo（純 web）
    npm.cmd run steam:package              # 打包 Windows Steam build
    npm.cmd run steam:package:verify       # 打包 + 驗證 + smoke（UI 改後必跑）
    npm.cmd run steam:verify               # Electron 啟動驗證
    npm.cmd run steam:i18n:verify          # 四語系 key 對齊驗證
    npm.cmd run steam:assets:verify        # Steam 素材尺寸驗證（19 必要）
    npm.cmd run steam:capture              # 重產 9 張 Steam 商店截圖
    npm.cmd run steam:capsules             # 重產 Store Capsule
    npm.cmd run steam:library              # 重產 Library 素材
    npm.cmd run steam:app:dev              # Electron 直接啟動（不重打包）
    npm.cmd run steam:package:demo         # 打包 Demo Windows build
    npm.cmd run sim                        # 擬人模擬批量（CSV＋儀表板＋快照）
    npm.cmd run sim:verify                 # 模擬器保真驗證（engine 計分改動必跑）
    npm.cmd run sim:compare A B            # 兩份快照 A/B 對比（同 seed）

韻西呼叫阿扣（唯讀審查／交叉驗收）：

    powershell -NoProfile -ExecutionPolicy Bypass -File scripts/call-claude-review.ps1 -PromptFile <任務單.md>
