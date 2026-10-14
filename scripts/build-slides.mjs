// Regenerate the static deck from SLIDES.md, with PITCH.md as supporting notes. No runtime dependencies.
// Usage: node scripts/build-slides.mjs [path-to-marked-esm-module]
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const { marked } = await import(process.argv[2] ? pathToFileURL(path.resolve(process.argv[2])).href : 'marked');
const source = await readFile(path.join(root, 'SLIDES.md'), 'utf8');
const notes = await readFile(path.join(root, 'PITCH.md'), 'utf8');
const linkRepository = text => text.replaceAll('(../watts/', '(https://github.com/jasondeutsch/watts/blob/main/');
const report = await readFile(path.join(root, 'slides', 'report.html'));
const reportVersion = createHash('sha256').update(report).digest('hex').slice(0, 12);
const linkedSource = linkRepository(source).replaceAll('./report.html', `./report.html?v=${reportVersion}`);
const sections = linkedSource.split(/^## /m);
const images = [...notes.matchAll(/!\[[^\]]*\]\((images\/[^)]+)\)/g)].map(match => match[1]);
const outputDir = path.join(root, 'slides');
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
const css = await readFile(path.join(outputDir, 'slides.css'));
const cssVersion = createHash('sha256').update(css).digest('hex').slice(0, 12);
const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="Watts: a repeatable, measurable process for agentic software development. Product thesis and proposed business model.">
<title>Watts — Pitch deck</title>
<link rel="icon" href="../assets/icon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/style.css"><link rel="stylesheet" href="./slides.css?v=${cssVersion}">
</head><body>
<a class="skip" href="#slides">Skip to pitch</a>
<header class="header"><a class="brand" href="../">watts<span class="brand-dot">.</span></a><span class="briefing-label">Pitch deck</span></header>
<main id="slides" class="briefing">
<section class="cover"><div class="eyebrow">Agentic software development</div><h1>Watts</h1><p>Define your team’s process.<br>Measure its outcomes.<br>Improve it over time.</p><p class="cover-note">Open-source prototype · Proposed managed platform</p><details><summary>Contents · ${slides.length} slides</summary><ol>${contents}</ol></details></section>
${body}
<details class="supporting-notes" id="supporting-notes"><summary>Supporting notes · Architecture, product concepts, business model, and risks</summary><div class="notes-content">${marked.parse(linkRepository(notes), { gfm: true })}</div></details>
</main><footer class="footer"><a href="../">Watts project website</a><span>Platform proposal · Open-source core 0.1.0</span><a href="#slides">Back to top ↑</a></footer>
</body></html>`;
await writeFile(path.join(outputDir, 'index.html'), html);
console.log(`Generated ${slides.length} pitch slides and copied ${new Set(images).size} images.`);
