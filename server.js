const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const ejs = require("ejs");


const app = express();
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const PORT = 8080;


const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) return console.error(err.message);
})

let sqlCreate = `CREATE TABLE IF NOT EXISTS programming_train(
    recordId INTEGER PRIMARY KEY,
    date TEXT NOT NULL,
    language TEXT NOT NULL,
    time INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    description TEXT NOT NULL
)`

db.run(sqlCreate);


var records = [];

app.get("/", (req, res)=>{ //odpovídám načetním databáze, nakonci každého requestu znovu načíst
    records = [];
    sqlSelect = "SELECT * FROM programming_train";
    db.all(sqlSelect, [], (err, rows) => {
        if (err) return console.error(err.message);
        rows.forEach((row)=>{
            // console.log(typeof row);
            records.push(row);
            // console.log(records);

        })
        console.log(records);

        res.render("list", {records:records});

        // res.json({"records":records})
        
    })
    
})

app.post("/add", (req, res)=> {  // přidávám do databáze
    const body = req.body;
    // console.log(body);

    
    const date = body.date;
    const language = body.language;
    const time = body.time;
    const rating = body.rating;
    const description = body.description;

    // record = {
    //     date : date,
    //     language : language,
    //     time : time,
    //     rating : rating,
    //     description : description
    // }

    let sqlAdd = `INSERT INTO programming_train(date, language, time, rating, description) VALUES (?,?,?,?,?)`;
    db.run(sqlAdd, [date, language, time, rating, description]);
    console.log("ADDED");
    // records.push(record)

    res.redirect("/");

    // sqlSelect = "SELECT * FROM programming_train ORDER BY recordId DESC LIMIT 1";
    // db.get(sqlSelect, [], (err, row) => {
    //     if (err) return console.error(err.message);
    //     res.send(row)

    // })

    
})

app.post("/update", (req, res)=>{   // upravuje
    const body = req.body;

    console.log(body)

    const date = body.date;
    const language = body.language;
    const time = body.time;
    const rating = body.rating;
    const description = body.description;
    const recordId = body.id

    const sqlUpdate = "UPDATE programming_train SET date = ?, language = ?, time = ?, rating = ?, description = ? WHERE recordId = ?";
    db.run(sqlUpdate, [date, language, time, rating, description, recordId], (err) => {
        if (err) return console.error(err.message);
    })

    res.redirect("/");



    // let respnoseRecords = []

    // sqlSelect = "SELECT * FROM programming_train";
    // db.all(sqlSelect, [], (err, rows) => {
    //     if (err) return console.error(err.message);
    //     rows.forEach((row)=>{
    //         // console.log(typeof row);
    //         respnoseRecords.push(row);
    //         // console.log(records);

    //     })
    //     console.log(respnoseRecords);

    //     // res.render("list", {records:records});

    //     res.json({"records":respnoseRecords})
        
    // })


})

app.post("/delete", (req, res)=>{ // smaže

    const body = req.body;
    console.log(body)
    const id = body.deleteId;

    let sqlDel = "DELETE FROM programming_train WHERE recordId=?";
    db.run(sqlDel, [id], (err) => {
        if (err) return console.error(err.message);
    })

    res.redirect("/")
    
    // let respnoseRecords = []

    // sqlSelect = "SELECT * FROM programming_train";
    // db.all(sqlSelect, [], (err, rows) => {
    //     if (err) return console.error(err.message);
    //     rows.forEach((row)=>{
    //         // console.log(typeof row);
    //         respnoseRecords.push(row);
    //         // console.log(records);

    //     })
        

        // res.render("list", {records:records});

        // res.json({"records":respnoseRecords})
        
    })



    // const body = req.body;
    // const id = body.deleteId;
    // let sqlDel = `DELETE FROM programming_train WHERE recordId=?`;
    // db.run(sqlDel, [id], (err)=>{
    //     if (err) return console.error(err.message);
    //     //res.redirect("/");
    // })



app.listen(PORT, ()=>{
    console.log("server running on port " + PORT);
})