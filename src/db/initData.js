const db=require("./index.js");

//まっさらなDBに制度の情報を流し込む関数
db.saveInitialDatafromJson().then(res =>{
    console.log(res)
})