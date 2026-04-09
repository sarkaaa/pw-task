#!/usr/bin/env node
// Writes index.html listing runs/ subfolders (newest id first).
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? ".");
const runsDir = path.join(root, "runs");
if (!fs.existsSync(runsDir)) fs.mkdirSync(runsDir, { recursive: true });

const ids = fs
	.readdirSync(runsDir, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => d.name)
	.sort((a, b) => Number(b) - Number(a));

const list = ids
	.map((id) => `<li><a href="./runs/${id}/index.html">Run ${id}</a></li>`)
	.join("");

const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><title>Allure reports</title></head>
<body>
<h1>Allure reports</h1>
<ul>${list || "<li>No reports yet.</li>"}</ul>
</body>
</html>`;

fs.writeFileSync(path.join(root, "index.html"), html);
