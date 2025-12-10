
U 未追蹤(Untracked)：新文件，还未对它执行过 git add。  
M 已修改(Modified)。  


> [!plain]- 提交 git 更改的完整流程是什麼？
> ✅ `git add -A .` - 已暂存所有更改  
> ⬇️ `git commit -m "提交信息"` - 提交更改  
> ⬇️ `git push` - 推送到远程仓库（可选）  



> [!plain]- [如圖](img/main.png) `main ±` 和 `main ✚` 表示是什麼意思？
> `±`（加减号）说明：文件已修改，但还没有用 `git add` 添加到暂存区  
> `✚`（加号）说明：文件已用 `git add` 添加到暂存区，但还没有提交  


> [!plain]- `git commit -m` 中的 `-m` 是什麼意思？
> `-m` 是 `--message` 的简写，用来直接在命令行里写提交说明。  


> [!plain]- 命令中 `-單橫線` 與 `--雙橫線` 有什麼區別？
> `-m` 这种单横线后跟单字母，是短选项（short option），`-abc` 可以等同于 `-a -b -c`。  
> `--message` 这种双横线后跟完整单词，是长选项（long option）。  


> [!plain]- `git add -A` 和 `git add -A .` 有什麼區別？
> - `git add -A`：暂存整个仓库的变更。  
> - `git add -A .`：只暂存当前目录及子目录的变更。  
>
> 如果你当前在 `SyncVault` 仓库根目录，两者效果相同；在子目录下就不同。






