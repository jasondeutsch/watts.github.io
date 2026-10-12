// Regenerate the static pitch page from PITCH.md. No runtime dependencies.
// Usage: node scripts/build-slides.mjs [path-to-marked-esm-module]
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const { marked } = await import(process.argv[2] ? pathToFileURL(path.resolve(process.argv[2])).href : 'marked');
const source = await readFile(path.join(root, 'PITCH.md'), 'utf8');
const linkedSource = source.replaceAll('(../watts/', '(https://github.com/jasondeutsch/watts/blob/main/');
const sections = linkedSource.split(/^## /m);
const images = [...source.matchAll(/!\[[^\]]*\]\((images\/[^)]+)\)/g)].map(match => match[1]);
const outputDir = path.join(root, 'site/slides');
await mkdir(path.join(outputDir, 'images'), { recursive: true });
for (const image of new Set(images)) {
  await copyFile(path.join(root, image), path.join(outputDir, image));
}
const escape = value => value.replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
const slides = sections.slice(1).map((section, index) => {
  const number = index + 1;
  const title = section.split('\n')[0];
  return { number, title, html: marked.parse('## ' + section, { gfm: true }) };
});
const contents = slides.map(slide => `<li><a href="#slide-${slide.number}">${escape(slide.title)}</a></li>`).join('\n');
const body = slides.map(slide => `<section class="slide" id="slide-${slide.number}" aria-label="${escape(slide.title)}"><div class="slide-number">${String(slide.number).padStart(2, '0')} / ${slides.length}</div>${slide.html}</section>`).join('\n');
const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="Watts Platform: product thesis, proposed operating model, and validation questions.">
<title>Watts Platform — Project briefing</title>
<link rel="icon" href="../assets/icon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/style.css"><link rel="stylesheet" href="./slides.css">
</head><body>
<a class="skip" href="#slides">Skip to briefing</a>
<header class="header"><a class="brand" href="../">watts<span class="brand-dot">.</span></a><span class="briefing-label">Project briefing</span></header>
<main id="slides" class="briefing">
<section class="cover"><div class="eyebrow">Product thesis & proposed platform</div><h1>Watts Platform</h1><p>Declarative workflows, execution evidence, and a basis for evaluating agentic software development.</p><p class="cover-note">A proposal for discussion. Product screens and their metrics are illustrative; capabilities and limitations are described in the briefing.</p><details><summary>Contents · ${slides.length} sections</summary><ol>${contents}</ol></details></section>
${body}
</main><footer class="footer"><a href="../">Watts project website</a><span>Platform proposal · Open-source core 0.1.0</span><a href="#slides">Back to top ↑</a></footer>
</body></html>`;
await writeFile(path.join(outputDir, 'index.html'), html);
console.log(`Generated ${slides.length} briefing sections and copied ${new Set(images).size} images.`);
