#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const LOCALES_DIR = path.join(__dirname, '..', 'js', 'locales');
const LOCALES = ['zh-tw', 'zh-cn', 'en', 'ja'];
const BASE_LOCALE = 'zh-tw';

function loadLocale(loc) {
  const filePath = path.join(LOCALES_DIR, `${loc}.js`);
  let code = fs.readFileSync(filePath, 'utf8');
  code = code.replace(/export\s+const\s+\w+\s*=/, 'globalThis.__locale_data =');
  const ctx = { globalThis: {} };
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename: filePath });
  if (!ctx.globalThis.__locale_data) {
    throw new Error(`Failed to load locale: ${loc}`);
  }
  return ctx.globalThis.__locale_data;
}

function flattenKeys(obj, prefix = '') {
  const result = new Map();
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    const v = obj[k];
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      for (const [nk, nv] of flattenKeys(v, full)) {
        result.set(nk, nv);
      }
    } else {
      result.set(full, v);
    }
  }
  return result;
}

function main() {
  console.log('=== i18n 四語系驗證 ===\n');

  const data = {};
  for (const loc of LOCALES) {
    try {
      data[loc] = loadLocale(loc);
      console.log(`✅ 載入 ${loc}.js`);
    } catch (e) {
      console.error(`❌ 載入 ${loc}.js 失敗：${e.message}`);
      process.exit(1);
    }
  }

  const keys = {};
  for (const loc of LOCALES) {
    keys[loc] = flattenKeys(data[loc]);
  }

  console.log('\n--- Key 數量統計 ---');
  for (const loc of LOCALES) {
    console.log(`  ${loc}: ${keys[loc].size} keys`);
  }

  const baseKeys = keys[BASE_LOCALE];
  let hasMissing = false;
  let hasEmpty = false;

  console.log(`\n--- 以 ${BASE_LOCALE} 為基準比對 ---`);
  for (const loc of LOCALES) {
    if (loc === BASE_LOCALE) continue;
    const missing = [];
    const empty = [];
    for (const k of baseKeys.keys()) {
      if (!keys[loc].has(k)) {
        missing.push(k);
      } else {
        const v = keys[loc].get(k);
        if (v === '' || v === null || v === undefined) {
          empty.push(k);
        }
      }
    }
    const extra = [];
    for (const k of keys[loc].keys()) {
      if (!baseKeys.has(k)) extra.push(k);
    }

    console.log(`\n[${loc}]`);
    if (missing.length === 0 && empty.length === 0 && extra.length === 0) {
      console.log(`  ✅ 完全對齊（${keys[loc].size} keys）`);
    } else {
      if (missing.length > 0) {
        hasMissing = true;
        console.log(`  ❌ 缺少 ${missing.length} 個 key：`);
        for (const k of missing.slice(0, 50)) console.log(`     - ${k}`);
        if (missing.length > 50) console.log(`     ...還有 ${missing.length - 50} 個`);
      }
      if (empty.length > 0) {
        hasEmpty = true;
        console.log(`  ⚠️  空值 ${empty.length} 個 key：`);
        for (const k of empty.slice(0, 20)) console.log(`     - ${k}`);
        if (empty.length > 20) console.log(`     ...還有 ${empty.length - 20} 個`);
      }
      if (extra.length > 0) {
        console.log(`  ℹ️  多出 ${extra.length} 個 key（${BASE_LOCALE} 沒有）：`);
        for (const k of extra.slice(0, 20)) console.log(`     + ${k}`);
        if (extra.length > 20) console.log(`     ...還有 ${extra.length - 20} 個`);
      }
    }
  }

  console.log('\n--- 結論 ---');
  if (hasMissing) {
    console.log('❌ i18n 驗證失敗：有缺失的 key，會導致該語系顯示空白或 fallback');
    process.exit(1);
  }
  if (hasEmpty) {
    console.log('⚠️  i18n 驗證警告：有空值 key，但結構完整');
    process.exit(0);
  }
  console.log('✅ i18n 驗證通過：四語系 key 完全對齊');
}

main();
