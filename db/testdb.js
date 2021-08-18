const db=require("./index.js");

//DBに制度をの情報を流し込む関数
db.saveInitialDatafromJson().then(res =>{
    console.log(res)
})