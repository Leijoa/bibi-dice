import fs from 'fs';
import path from 'path';

function checkI18n() {
  const localesDir = './js/locales';
  const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.js'));
  console.log(`Found ${files.length} locale files`);
}

checkI18n();
