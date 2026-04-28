const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');
const distDir = path.join(__dirname, '..', 'dist');

// 删除 dist 目录（如果存在）
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

// 复制 out 到 dist
fs.cpSync(outDir, distDir, { recursive: true });

console.log('✅ Successfully copied out/ to dist/');
