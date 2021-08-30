|              |            drone            |    cloud run     |                    dokku                     | cloudflare pages |
| :----------: | :-------------------------: | :--------------: | :------------------------------------------: | :--------------: |
|     CICD     | 需要設定docker hub, dorneCI |     GCP設定      | 本地端設定git remote,          dokku 啟用app |      CF設定      |
|   CICD權限   |        GitHub branch        |  GitHub branch   |                dokku ssh key                 |  GitHub branch   |
|     價格     |      不執行也需要付費       | 執行時才需要付費 |               不執行也需要付費               |    基本上免費    |
|      VM      |    需要打包一台,部署一台    |        x         |               打包及部屬同一台               |        x         |
|     硬體     |           VM設定            |  contianer設定   |                    VM設定                    |        x         |
|     實體     |        實體永久存在         |  執行時才有實體  |                 實體永久存在                 |        x         |
|    DB/WS     |              o              |        x         |                      o                       |        -         |
|    scale     |              x              |        o         |                      x                       |        o         |
|   前端頁面   |              o              |        x         |                      o                       |        o         |
| Request 紀錄 |              x              |        o         |                      x                       |        x         |
|     Log      |      進container看log       |    看不到Log     |               可以看到執行log                |        -         |

