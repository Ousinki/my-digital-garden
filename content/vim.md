




<details>
  <summary>Vim 中如何像 opt+up/down 一樣移動文字？</summary>
  <p><code>:m-2</code> 或 <code>:move .-2</code> 表示上移一行，<br>
<code>:m+1</code> 或 <code>:move .+1</code>  表示下移一行，<br>
<code>ddp</code> 其中的dd表示剪下當前行（並存儲在Vim寄存器內），p表示貼到遊標的下一行。<br>
<code>ddkp</code>  其中的k表示遊標上移一行。
</p>
</details>


<details>
  <summary>.md.swp 是什麼文件？</summary>
  <p>是 Vim 编辑器生成的临时交换文件 (Swap file)。当你用 Vim (或 Vi) 编辑文件时，它会生成一个 <code>.swp</code> 文件来保存未保存的修改。如果编辑器崩溃或非正常关闭，你可以用它来恢复数据。</p>
</details>
















