const fs = require('fs');
const path = require('path');

// Složka public
const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

// Vytvořit public složku, pokud neexistuje
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Složky a soubory, které se mají ignorovat
const ignoreList = [
  'node_modules',
  '.git',
  '.gitignore',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vercel.json',
  'firebase.json',
  'functions',
  'lib',
  'src',
  'scripts',
  'public',
  '.DS_Store',
  'README.md',
  '*.md'
];

// Funkce pro kontrolu, zda se má soubor ignorovat
function shouldIgnore(item) {
  const name = path.basename(item);
  
  // Ignorovat skryté soubory a složky
  if (name.startsWith('.')) {
    return true;
  }
  
  // Ignorovat testovací a debug soubory
  if (name.startsWith('test-') || name.startsWith('debug-') || name.startsWith('check-')) {
    return true;
  }
  
  // Ignorovat podle seznamu
  if (ignoreList.includes(name)) {
    return true;
  }
  
  return false;
}

// Funkce pro kopírování souboru nebo složky
function copyItem(srcPath, destPath) {
  if (!fs.existsSync(srcPath)) {
    return;
  }

  const stat = fs.statSync(srcPath);

  if (stat.isDirectory()) {
    // Rekurzivně zkopírovat složku
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    const files = fs.readdirSync(srcPath);
    files.forEach(file => {
      const srcFilePath = path.join(srcPath, file);
      if (!shouldIgnore(srcFilePath)) {
        copyItem(srcFilePath, path.join(destPath, file));
      }
    });
  } else {
    // Zkopírovat soubor
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${path.relative(rootDir, srcPath)}`);
  }
}

// Zkopírovat všechny soubory z rootu do public
console.log('Copying files to public directory...');

const rootFiles = fs.readdirSync(rootDir);
rootFiles.forEach(file => {
  const srcPath = path.join(rootDir, file);
  if (!shouldIgnore(srcPath)) {
    const destPath = path.join(publicDir, file);
    copyItem(srcPath, destPath);
  }
});

console.log('Build completed!');

