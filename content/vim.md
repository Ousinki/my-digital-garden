
> [!plain]- Vim 中如何像 opt+up/down 一樣移動文字？
> `:m-2` 或 `:move .-2` 表示上移一行，  
> `:m+1` 或 `:move .+1`  表示下移一行，  
> `ddp` 其中的dd表示剪下當前行（並存儲在Vim寄存器內），p表示貼到遊標的下一行。  
> `ddkp`  其中的k表示遊標上移一行。  


> [!plain]- .md.swp 是什麼文件？
> 是 Vim 编辑器生成的临时交换文件 (Swap file)。当你用 Vim (或 Vi) 编辑文件时，它会生成一个 `.swp` 文件来保存未保存的修改。如果编辑器崩溃或非正常关闭，你可以用它来恢复数据。


> [!plain]- 如何在 Vim 中保存內容？
> `:wq` = `:x` = `ZZ` 快捷保存並退出


> [!plain]- 如何展開/關閉所有的 Markdown code block fold（摺疊）?
> - `zR` 展開所有    
> - `zM` 關閉所有  


> [!plain]-  normal模式下 `o` 和 `O` 是什麼意思？
> - `O`（大写）- 在当前行上方插入一个新行，并进入 Insert mode  
> - `o`（小写）- 在当前行下方插入一个新行，并进入 Insert mode  











