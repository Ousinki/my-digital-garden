`Ctrl+L` 可以清屏，但保留歷史  
`Cmd+K` 清屏並清除歷史  
`Ctrl+U` 清除整行


> [!plain]- 如何創建一個新的md文件？
> `touch newfile.md` 用於創建新文件；`mkdir new_folder` 用於創建新文件夾。


> [!plain]- 如何通過終端在文件中插入新文本？
> ```bash
> echo "新內容" > file.md  # > 會覆蓋原有內容，檔案中只剩 "新內容"。
> echo "新內容" >> file.md  # >> 會在檔案最後新增一行，不刪掉原內容。
> ```


> [!plain]- 如何刪除文件？  
> ```bash
> rm test.txt  # 直接刪除文件（不進垃圾桶）  
> rm -i test.txt  # interactive：互動。刪除前會先詢問 `remove test.txt? (y/n)`  
> rm -f test.txt  # force：強制刪除。不詢問、不顯示錯誤（新手慎用）  
> ```  


> [!plain]- 如何刪除資料夾？  
> ```bash
> rm -r folder_name  # recursive：遞迴刪除。刪資料夾時，連同裡面所有檔案、子資料夾，一層一層全部刪掉  
> rm -ri folder_name  # 遞迴刪除 + 每個檔案都詢問（推薦）  
> rm -rf folder_name  # 遞迴 + 強制刪除（非常危險，無法復原）  
> ```



















