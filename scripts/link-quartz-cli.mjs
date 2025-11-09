#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const binDir = path.join(projectRoot, "node_modules", ".bin");
const unixStubPath = path.join(binDir, "quartz");
const windowsStubPath = path.join(binDir, "quartz.cmd");

const unixStubContent = `#!/usr/bin/env node
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

// Use local Quartz bootstrap CLI
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// __dirname is node_modules/.bin, so go up two levels to project root
const projectRoot = path.resolve(__dirname, "../..");
const bootstrapCli = path.join(projectRoot, "quartz", "bootstrap-cli.mjs");

const args = process.argv.slice(2);
const child = spawn("node", [bootstrapCli, ...args], {
  stdio: "inherit",
  cwd: projectRoot,
});
child.on("close", (code) => {
  process.exit(code ?? 0);
});
child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
`;

const windowsStubContent = `@ECHO OFF\r\nnode quartz\\bootstrap-cli.mjs %*\r\n`;

async function ensureDirectory(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeFileIfChanged(file, contents, mode) {
  try {
    const existing = await fs.readFile(file, "utf8");
    if (existing === contents) {
      if (mode) {
        await fs.chmod(file, mode);
      }
      return;
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
  await fs.writeFile(file, contents, { mode, encoding: "utf8" });
}

async function main() {
  await ensureDirectory(binDir);
  await writeFileIfChanged(unixStubPath, unixStubContent, 0o755);
  await writeFileIfChanged(windowsStubPath, windowsStubContent, 0o755);
}

main().catch((error) => {
  console.error("Failed to prepare Quartz CLI stubs:", error);
  process.exit(1);
});
