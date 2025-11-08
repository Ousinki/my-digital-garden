#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import serveHandler from "serve-handler";
import chokidar from "chokidar";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { toHtml } from "hast-util-to-html";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const contentDir = path.join(projectRoot, "Public");

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ["yaml", "toml"])
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug);

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));

  if (command === "help") {
    printUsage();
    return;
  }

  if (command !== "build") {
    console.error(`Unknown command: ${command}`);
    printUsage();
    process.exitCode = 1;
    return;
  }

  await ensureInputExists(contentDir);

  const outputDir = path.resolve(projectRoot, options.directory);
  await buildSite({ inputDir: contentDir, outputDir });

  if (options.serve) {
    await serveAndWatch({ inputDir: contentDir, outputDir, port: options.port });
  }
}

async function buildSite({ inputDir, outputDir }) {
  await resetOutput(outputDir);

  const files = await collectEntries(inputDir);
  if (files.markdown.length === 0) {
    console.warn(`No markdown files found in ${inputDir}. Nothing to build.`);
    return;
  }

  const pages = await Promise.all(
    files.markdown.map(async (filePath) => {
      const relativePath = path.relative(inputDir, filePath);
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = matter(raw);
      const title = extractTitle(parsed, relativePath);
      const summary = extractDescription(parsed);
      const outputPath = toOutputPath(relativePath);
      const urlPath = toUrlPath(outputPath);
      return {
        filePath,
        relativePath,
        outputPath,
        urlPath,
        title,
        summary,
        content: parsed.content,
      };
    })
  );

  const navigation = buildNavigation(pages);

  await Promise.all(
    pages.map(async (page) => {
      const html = await renderPage({
        title: page.title,
        description: page.summary,
        navigation,
        currentUrl: page.urlPath,
        content: page.content,
      });
      const destination = path.join(outputDir, page.outputPath);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, html, "utf8");
    })
  );

  await copyStaticAssets({ staticFiles: files.staticFiles, outputDir });

  const relativeOut = path.relative(projectRoot, outputDir) || ".";
  console.log(`Built ${pages.length} page(s) into ${relativeOut}`);
}

async function ensureInputExists(dir) {
  try {
    await fs.access(dir);
  } catch (error) {
    throw new Error(`Expected content directory at ${dir} but none was found.`);
  }
}

async function resetOutput(outputDir) {
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
}

async function collectEntries(directory) {
  const markdown = [];
  const staticFiles = [];
  await walk(directory, async (absolutePath, relativePath, dirent) => {
    if (dirent.name.startsWith(".")) {
      return false;
    }

    if (dirent.isDirectory()) {
      return true;
    }

    if (!dirent.isFile()) {
      return false;
    }

    if (dirent.name.toLowerCase().endsWith(".md")) {
      markdown.push(absolutePath);
    } else {
      staticFiles.push({ absolutePath, relativePath });
    }
    return false;
  });
  return { markdown, staticFiles };
}

async function walk(currentDir, visitor, relativeBase = "") {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(currentDir, entry.name);
    const relativePath = path.join(relativeBase, entry.name);
    const shouldDive = await visitor(absolutePath, relativePath, entry);
    if (shouldDive && entry.isDirectory()) {
      await walk(absolutePath, visitor, relativePath);
    }
  }
}

function extractTitle(parsed, relativePath) {
  if (typeof parsed.data.title === "string" && parsed.data.title.trim().length > 0) {
    return parsed.data.title.trim();
  }

  const headingMatch = parsed.content.match(/^\s*#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }

  const baseName = path.parse(relativePath).name;
  return toTitleCase(baseName.replace(/[-_]+/g, " "));
}

function extractDescription(parsed) {
  if (typeof parsed.data.description === "string" && parsed.data.description.trim().length > 0) {
    return parsed.data.description.trim();
  }
  return parsed.content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

function toOutputPath(relativePath) {
  const withoutExt = relativePath.replace(/\.md$/i, "");
  const normalised = withoutExt
    .split(path.sep)
    .map((segment) =>
      segment
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\u00A0-\uFFFF-]+/g, "")
        .toLowerCase()
    )
    .join(path.sep);
  const parsed = path.parse(normalised);
  const fileName = parsed.name === "index" ? "index.html" : `${parsed.name}/index.html`;
  return path.join(parsed.dir, fileName);
}

function toUrlPath(outputPath) {
  const withoutIndex = outputPath.replace(/index\.html$/i, "");
  const withSlashes = withoutIndex.split(path.sep).join("/");
  if (!withSlashes) {
    return "/";
  }
  const trimmed = withSlashes.replace(/\/+$/g, "");
  return `/${trimmed}/`;
}

function buildNavigation(pages) {
  const sorted = [...pages].sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
  return sorted.map((page) => ({ title: page.title, url: page.urlPath })).filter(Boolean);
}

async function renderPage({ title, description, navigation, currentUrl, content }) {
  const tree = processor.parse(content);
  const transformed = await processor.run(tree);
  const body = toHtml(transformed, { allowDangerousCharacters: true });
  const navLinks = navigation
    .map((item) => {
      const isActive = item.url === currentUrl || (item.url === "/" && currentUrl === "");
      return `<li><a href="${item.url || "/"}"${isActive ? ' aria-current="page"' : ""}>${item.title}</a></li>`;
    })
    .join("\n");

  const metaDescription = description || `Read ${title} in this digital garden.`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${escapeHtml(metaDescription)}" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f4f4f5;
        color: #18181b;
      }

      body {
        margin: 0;
        display: grid;
        grid-template-columns: minmax(14rem, 18rem) 1fr;
        min-height: 100vh;
      }

      nav {
        background: #1f2937;
        color: #f9fafb;
        padding: 2rem 1.5rem;
      }

      nav h1 {
        margin-top: 0;
        font-size: 1.5rem;
      }

      nav ul {
        list-style: none;
        padding: 0;
        margin: 1.5rem 0 0;
        display: grid;
        gap: 0.5rem;
      }

      nav a {
        color: inherit;
        text-decoration: none;
        display: block;
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
      }

      nav a[aria-current="page"] {
        background: rgba(255, 255, 255, 0.18);
        color: #fff;
      }

      main {
        padding: 2.5rem 3rem;
        background: #fff;
      }

      main article {
        max-width: 70ch;
      }

      article :is(h1, h2, h3, h4, h5, h6) {
        color: #111827;
      }

      article pre {
        background: #111827;
        color: #e5e7eb;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
      }

      article code {
        font-family: "JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      }

      article a {
        color: #2563eb;
      }

      @media (max-width: 960px) {
        body {
          grid-template-columns: 1fr;
        }

        nav {
          display: none;
        }

        main {
          padding: 1.5rem;
        }
      }
    </style>
  </head>
  <body>
    <nav>
      <h1>Digital Garden</h1>
      <ul>
        ${navLinks}
      </ul>
    </nav>
    <main>
      <article>
        ${body}
      </article>
    </main>
  </body>
</html>`;
}

async function copyStaticAssets({ staticFiles, outputDir }) {
  await Promise.all(
    staticFiles.map(async ({ absolutePath, relativePath }) => {
      const destination = path.join(outputDir, normaliseStaticPath(relativePath));
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.copyFile(absolutePath, destination);
    })
  );
}

function normaliseStaticPath(relativePath) {
  return relativePath
    .split(path.sep)
    .map((segment) => segment.replace(/\s+/g, "-"))
    .join(path.sep);
}

function toTitleCase(value) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function serveAndWatch({ inputDir, outputDir, port }) {
  const server = http.createServer((request, response) => {
    return serveHandler(request, response, { public: outputDir });
  });

  await new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Serving ${outputDir} at http://localhost:${port}`);
      resolve();
    });
  });

  const watcher = chokidar.watch(inputDir, { ignoreInitial: true });
  let building = false;
  let queued = false;

  const triggerBuild = async () => {
    if (building) {
      queued = true;
      return;
    }

    building = true;
    try {
      await buildSite({ inputDir, outputDir });
    } catch (error) {
      console.error("Failed to rebuild after change:", error);
    } finally {
      building = false;
      if (queued) {
        queued = false;
        triggerBuild().catch((error) => console.error("Failed to process queued rebuild:", error));
      }
    }
  };

  watcher.on("all", (event, changedPath) => {
    console.log(`Detected ${event} in ${changedPath}. Rebuilding...`);
    triggerBuild().catch((error) => console.error("Failed to rebuild:", error));
  });

  const shutdown = () => {
    watcher.close().catch(() => {});
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  await new Promise(() => {});
}

function parseArgs(argv) {
  if (argv.length === 0) {
    return { command: "build", options: { directory: "public", serve: false, port: 8080 } };
  }

  const args = [...argv];
  const command = args.shift() ?? "build";
  const options = { directory: "public", serve: false, port: 8080 };

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (token === "--help" || token === "-h") {
      return { command: "help", options };
    }

    if (token === "--serve") {
      options.serve = true;
      continue;
    }

    if (token.startsWith("--serve=")) {
      options.serve = true;
      options.port = parsePort(token.split("=")[1], "--serve");
      continue;
    }

    if (token === "--port") {
      if (i + 1 >= args.length) {
        throw new Error("--port requires a numeric value");
      }
      options.port = parsePort(args[++i], "--port");
      options.serve = true;
      continue;
    }

    if (token.startsWith("--port=")) {
      options.port = parsePort(token.split("=")[1], "--port");
      options.serve = true;
      continue;
    }

    if (token === "-d" || token === "--dir" || token === "--out" || token === "--output" || token === "--output-dir") {
      if (i + 1 >= args.length) {
        throw new Error(`${token} requires a directory path`);
      }
      options.directory = args[++i];
      continue;
    }

    if (token.startsWith("-d=") || token.startsWith("--dir=") || token.startsWith("--out=") || token.startsWith("--output=")) {
      const [, value] = token.split("=");
      if (!value) {
        throw new Error(`${token} requires a directory path`);
      }
      options.directory = value;
      continue;
    }

    throw new Error(`Unknown option: ${token}`);
  }

  return { command, options };
}

function parsePort(value, flag) {
  const port = Number.parseInt(value, 10);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`${flag} expects a positive integer port number`);
  }
  return port;
}

function printUsage() {
  console.log(`Usage: quartz build [options]\n\nOptions:\n  -d, --output <dir>   Set the output directory (default: public)\n      --serve           Serve the generated site locally after building\n      --port <number>   Port to use when serving (default: 8080)\n  -h, --help            Show this help message`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
