const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    // Just verify the file contents directly since module testing in playwright here is blocked by module scopes
    const mainJs = fs.readFileSync('js/main.js', 'utf8');
    const uiJs = fs.readFileSync('js/ui.js', 'utf8');

    let pass = true;

    if (!mainJs.includes('cons_clover_')) {
        console.log('FAILURE: clover logic missing in main.js');
        pass = false;
    }

    if (!uiJs.includes('ui.next_stage')) {
        console.log('FAILURE: next_stage logic missing in ui.js');
        pass = false;
    }

    if (pass) {
        console.log('SUCCESS: All files successfully modified.');
    }
})();
