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
import { fileURLToPath } from "url";
import path from "path";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cli = path.resolve(__dirname, "..", "..", "quartz", "bootstrap-cli.mjs");

const child = spawn(process.execPath, [cli, ...process.argv.slice(2)], {
  stdio: "inherit",
});
child.on("close", (code) => {
  process.exit(code ?? 0);
});
child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
`;

const windowsStubContent = `@ECHO OFF\r\nIF EXIST "%~dp0\\node.exe" (\r\n  "%~dp0\\node.exe" "%~dp0\\..\\..\\quartz\\bootstrap-cli.mjs" %*\r\n) ELSE (\r\n  node "%~dp0\\..\\..\\quartz\\bootstrap-cli.mjs" %*\r\n)\r\n`;

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
