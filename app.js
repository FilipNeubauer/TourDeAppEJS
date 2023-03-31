
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const ejs = require("ejs");
const path = require("path");
const session = require('express-session');
const fs = require('fs');
// const createCsvWriter = require("csv-writer").createObjectCsvWriter;


// const bcrypt = require('bcryptjs');
const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


const app = express();
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static("public", {redirect: false}));

// {redirect: false}

app.set("view engine", "ejs");

const PORT = 3000;

const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) return console.error(err.message, "line 25");
})


let sqlCreate = `CREATE TABLE IF NOT EXISTS notes(
    noteId INTEGER PRIMARY KEY,
    desc TEXT NOT NULL,
    sign TEXT NOT NULL
)`;


db.run(sqlCreate)






app.get("/poznamky", (req, res) => {
    const poznamky = []
    sqlSelect = "SELECT * FROM notes";
    db.all(sqlSelect, [], (err, rows) => {
        if (err) return console.error(err.message, "line 56");

        rows.forEach(el=>{
            console.log(el)
            poznamky.push(el)
        })
        
        console.log(poznamky)
        res.render("poznamky.ejs", {notes:poznamky})
    })

})


app.post("/poznamky", (req, res) => {
    const body = req.body
    console.log(body)

    sqlAdd = `INSERT INTO notes (desc, sign) VALUES (?,?)`
    db.run(sqlAdd, [body.desc, body.sign], (err)=>{
        if (err) return console.error(err.message, "line 75");
    })


    res.redirect("/poznamky")
})

app.post("/delete", (req, res) => {
    const body = req.body
    // console.log(body)
    console.log("you")


    sqlDel = `DELETE FROM notes WHERE noteId=?;`
    db.run(sqlDel, [body.noteId], (err) => {
        if (err) return console.error(err.message, "line 75");
        res.redirect("/poznamky")
    })

})

app.get("/statistika", (req, res) => {
    res.render("statistika.ejs")
})



app.listen(PORT, ()=>{
    console.log("server running on port " + PORT);
})

