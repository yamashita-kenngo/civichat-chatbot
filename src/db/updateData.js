const db=require("./index.js");

// dbのデータ更新
// 引数は各テーブル名
db.updateDatafromJson(process.argv[2]).then(res =>{
    console.log(res)
})