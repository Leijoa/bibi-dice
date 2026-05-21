const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'promo', 'steam', 'assets');

const EXPECTED_ASSETS = [
  ['store_header_capsule_920x430.png', 920, 430],
  ['store_small_capsule_462x174.png', 462, 174],
  ['store_main_capsule_1232x706.png', 1232, 706],
  ['store_vertical_capsule_748x896.png', 748, 896],
  ['store_screenshot_01_title_1920x1080.png', 1920, 1080],
  ['store_screenshot_02_battle_start_1920x1080.png', 1920, 1080],
  ['store_screenshot_03_combo_preview_1920x1080.png', 1920, 1080],
  ['store_screenshot_04_rules_table_1920x1080.png', 1920, 1080],
  ['store_screenshot_05_relic_shop_1920x1080.png', 1920, 1080],
  ['store_screenshot_06_soul_offering_1920x1080.png', 1920, 1080],
  ['library_capsule_600x900.png', 600, 900],
  ['library_header_capsule_920x430.png', 920, 430],
  ['library_logo_1280x720.png', 1280, 720],
  ['shortcut_icon_256x256.png', 256, 256],
  ['app_icon_184x184.jpg', 184, 184]
];

const FORBIDDEN_ASSETS = [
  'library_hero_3840x1240.png'
];

function readPngSize(buffer) {
  const signature = '89504e470d0a1a0a';
  if (buffer.subarray(0, 8).toString('hex') !== signature) return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function readJpegSize(buffer) {
  let offset = 2;
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7)
      };
    }
    offset += 2 + length;
  }
  return null;
}

function readImageSize(file) {
  const buffer = fs.readFileSync(file);
  return readPngSize(buffer) || readJpegSize(buffer);
}

function formatResult(result) {
  const status = result.ok ? 'OK' : 'FAIL';
  return `${status.padEnd(4)} ${result.file.padEnd(48)} expected ${result.expected} actual ${result.actual}`;
}

function main() {
  if (!fs.existsSync(ASSETS)) {
    throw new Error(`Missing assets folder: ${ASSETS}`);
  }

  const results = [];
  for (const [file, expectedWidth, expectedHeight] of EXPECTED_ASSETS) {
    const fullPath = path.join(ASSETS, file);
    if (!fs.existsSync(fullPath)) {
      results.push({
        file,
        expected: `${expectedWidth}x${expectedHeight}`,
        actual: 'missing',
        ok: false
      });
      continue;
    }

    const size = readImageSize(fullPath);
    const actual = size ? `${size.width}x${size.height}` : 'unknown';
    results.push({
      file,
      expected: `${expectedWidth}x${expectedHeight}`,
      actual,
      ok: Boolean(size && size.width === expectedWidth && size.height === expectedHeight)
    });
  }

  for (const file of FORBIDDEN_ASSETS) {
    const exists = fs.existsSync(path.join(ASSETS, file));
    results.push({
      file,
      expected: 'absent',
      actual: exists ? 'present' : 'absent',
      ok: !exists
    });
  }

  for (const result of results) {
    console.log(formatResult(result));
  }

  const failed = results.filter(result => !result.ok);
  if (failed.length) {
    throw new Error(`Steam asset verification failed: ${failed.map(result => result.file).join(', ')}`);
  }

  console.log(`Steam asset verification passed: ${EXPECTED_ASSETS.length} required assets, ${FORBIDDEN_ASSETS.length} forbidden assets.`);
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
