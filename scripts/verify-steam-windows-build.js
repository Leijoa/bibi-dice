const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(ROOT, 'dist', 'steam-windows');
const EXE_NAME = 'BIBI-DICE.exe';
const EXE_PATH = path.join(BUILD_DIR, EXE_NAME);
const APP_ROOT = path.join(BUILD_DIR, 'resources', 'app');

async function main() {
  const requiredPaths = [
    EXE_PATH,
    path.join(APP_ROOT, 'package.json'),
    path.join(APP_ROOT, 'steam-app', 'main.js'),
    path.join(APP_ROOT, 'steam-app', 'preload.js'),
    path.join(APP_ROOT, 'dist', 'steam-demo', 'index.html'),
    path.join(APP_ROOT, 'dist', 'steam-demo', 'css', 'style.css'),
    path.join(APP_ROOT, 'dist', 'steam-demo', 'js', 'main.js'),
    path.join(BUILD_DIR, 'resources.pak'),
    path.join(BUILD_DIR, 'icudtl.dat')
  ];

  for (const requiredPath of requiredPaths) {
    if (!fs.existsSync(requiredPath)) throw new Error(`Missing packaged file: ${requiredPath}`);
  }

  const result = {
    exe: EXE_PATH,
    checks: {
      exeExists: fs.existsSync(EXE_PATH),
      appRootExists: fs.existsSync(APP_ROOT),
      steamDemoExists: fs.existsSync(path.join(APP_ROOT, 'dist', 'steam-demo', 'index.html')),
      noDefaultAppAsar: !fs.existsSync(path.join(BUILD_DIR, 'resources', 'default_app.asar'))
    }
  };

  const smoke = await new Promise(resolve => {
    const child = spawn(EXE_PATH, [], {
      cwd: BUILD_DIR,
      windowsHide: false,
      stdio: 'ignore'
    });

    let exited = false;
    child.once('exit', (code, signal) => {
      exited = true;
      resolve({ started: true, stayedOpen: false, code, signal });
    });
    child.once('error', error => {
      exited = true;
      resolve({ started: false, stayedOpen: false, error: error.message });
    });

    setTimeout(() => {
      if (!exited) {
        child.kill();
        resolve({ started: true, stayedOpen: true, pid: child.pid });
      }
    }, 5000);
  });

  result.smoke = smoke;
  result.checks.launchSmoke = smoke.started && smoke.stayedOpen;

  console.log(JSON.stringify(result, null, 2));

  const failed = Object.entries(result.checks).filter(([, ok]) => !ok);
  if (failed.length) {
    throw new Error(`Steam Windows build verification failed: ${failed.map(([name]) => name).join(', ')}`);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
