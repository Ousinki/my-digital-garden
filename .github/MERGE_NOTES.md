# Merge Conflict Resolution Guide

When resolving the merge between `codex/gh-pages-display-issue-my-digital-garden-80lvkz` and `main`, use the following options in VS Code's conflict resolver:

1. **`package.json`** – Accept the **current change** so that the npm scripts keep calling `node quartz/bootstrap-cli.mjs ...`. This preserves the local Quartz bootstrapper and the `prepare` hook that links the CLI shim.
2. **`.gitignore`** – Accept the **current change** to keep the explicit negations for `.github/`, `quartz/`, `scripts/`, and the config files. These ensure the workflow, bootstrap CLI, and configs stay tracked while the rest of the vault remains ignored.
3. **`.github/workflows/deploy.yml`** – Accept the **current change** so the workflow runs `actions/configure-pages@v5` with `enablement: true` before building. That step auto-enables GitHub Pages and prevents deployment 404 errors.

After applying the choices above, run `npm install` (if dependencies are missing), `npm run build` locally to verify the bootstrap CLI still works, and commit the resolved merge.
