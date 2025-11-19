`git status -sb` 是 `git status -s -b` 的简写。  
-s 代表 Short（简短模式）  
-b 代表 Branch（分支信息）  


<font color=#008000><b>U</b></font> (Untracked) 未追踪：This file is new to your project. Git sees it exists, but it is not yet tracking its history. 你还没有对它执行过 git add。  
<font color=#B8B894><b>M</b></font> (Modified) 已修改：This file is already tracked by Git, but you have made changes to it since the last commit.  


`git --version`  



`Ctrl + L`  Clear screen (keeps history, just scrolls down)  
`Ctrl + U`  Clear the entire line (start over)  



`git log`  点击 `q` key 退出  


⚠️ Important: How to Exit ? `git log` opens a viewer (called a "pager"). If the history is long, your terminal will show a `:` at the bottom.

- Press `q` to quit and return to the command prompt.
- Press `Space` to scroll down.
- Press `b` to scroll back up.




ls -l       # 以详细列表显示
ls -a       # 显示所有文件(包括隐藏文件)
ls -lh      # 详细信息+人类可读格式

```zsh
curl https://example.com  # 访问网页
```

```zsh
curl -O https://example.com/file.zip  # -O = 保留原文件名下载
```

```zsh
curl https://example.com -o mypage.html  # 保存到指定的文件
```







