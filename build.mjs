import { build } from 'esbuild';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
await build({
  entryPoints: ['src/App.jsx'], bundle: true, minify: true,
  outfile: 'assets/app.js', format: 'iife', target: ['es2020'],
  define: { 'process.env.NODE_ENV': '"production"' }, legalComments: 'linked',
  loader: { '.woff2': 'dataurl', '.webp': 'dataurl' }
});
const html = await readFile('index.html', 'utf8');
const css = await readFile('assets/app.css', 'utf8');
const js = await readFile('assets/app.js', 'utf8');
const icon = await readFile('assets/favicon.svg', 'utf8');
const standalone = html
  .replace('href="assets/favicon.svg"', 'href="data:image/svg+xml,' + encodeURIComponent(icon) + '"')
  .replace('<link rel="stylesheet" href="assets/app.css">', () => '<style>' + css + '</style>')
  .replace('<script src="assets/app.js"></script>', () => '<script>' + js.replace(/<\/script/gi, '<\\/script') + '</script>');
await writeFile('Mellow-Admin-Standalone.html', standalone);
await mkdir('dist/assets', { recursive: true });
await copyFile('index.html', 'dist/index.html');
for (const name of ['app.js', 'app.css', 'app.js.LEGAL.txt', 'favicon.svg']) {
  await copyFile('assets/' + name, 'dist/assets/' + name);
}
console.log('Build complete. Open index.html or Mellow-Admin-Standalone.html.');
