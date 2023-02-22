const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const ejs = require("ejs");

const bcrypt = require('bcrypt');
const saltRounds = 1;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


const app = express();
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const PORT = 3000;

var user;


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

let sqlCreateUsers = `CREATE TABLE IF NOT EXISTS users(
    userId INTEGER PRIMARY KEY,
    userName TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
)`

db.run(sqlCreateUsers);
db.run(sqlCreate);


var records = [];

app.get("/records", (req, res)=>{ //odpovídám načetním databáze, nakonci každého requestu znovu načíst
    records = [];
    sqlSelect = "SELECT * FROM programming_train";
    db.all(sqlSelect, [], (err, rows) => {
        if (err) return console.error(err.message);
        rows.forEach((row)=>{
            // console.log(typeof row);
            records.push(row);
            // console.log(records);

        })
        // console.log(records);

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


    let sqlAdd = `INSERT INTO programming_train(date, language, time, rating, description) VALUES (?,?,?,?,?)`;
    db.run(sqlAdd, [date, language, time, rating, description]);
    // console.log("ADDED");
    // records.push(record)

    res.redirect("/records");

  

    
})

app.post("/update", (req, res)=>{   // upravuje
    const body = req.body;

    // console.log(body)

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

    res.redirect("/records");





})

app.post("/delete", (req, res)=>{ // smaže

    const body = req.body;
    // console.log(body)
    const id = body.deleteId;

    let sqlDel = "DELETE FROM programming_train WHERE recordId=?";
    db.run(sqlDel, [id], (err) => {
        if (err) return console.error(err.message);
    })

    res.redirect("/records")
    
        
    })


app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    const userName = req.body.userName;
    const email = req.body.email;
    const password = String(req.body.password);


    let rowsHandle;



    // console.log("break point")
    // let check = 0;

    let sqliteCheck = "SELECT * FROM users WHERE userName=? OR email=?";
    db.all(sqliteCheck, [userName, email], (err, rows) => {
        if (err) return console.error(err.message);

        rowsHandle = rows;
       
    })

     // console.log(rows)
    if (rowsHandle !== undefined) {
        // check++;

        res.send("Already exists");
    }

    else {
        bcrypt.hash(password, saltRounds, function(err, hass) {
            if (err) {
                console.error(err)
            } else {
                console.log(hass)
                let sqlAdd = `INSERT INTO users (userName, email, password) VALUES (?,?,?)`;

                db.run(sqlAdd, [userName, email, hass], (err) => {
                    if (err) return console.error(err.message);
                    res.redirect("/records")
                })
                console.log("break point")
            }
        })


    }

})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", (req, res) => {
    const nameEmail = req.body.nameEmail;
    const password = String(req.body.password);







    let sqlFind = "SELECT userId FROM users WHERE userName=? OR email=?";
    db.get(sqlFind, [nameEmail, nameEmail], (err, id) => {
        if (err) return console.error(err.message);

        if (id !== undefined) {
            var user = id.userId;


                if (err) {
                    console.error(err)
                } else {


                    let sqlCheck = "SELECT password FROM users WHERE userId=?";
                    db.get(sqlCheck, [user], (err, passCheck) => {
                        if (err) return console.error(err.message);

                        bcrypt.compare(password, passCheck.password, function(err, result) {
                            if (err) return console.error(err.message);

                            if (result === true) {
                                res.redirect("/records")
                            }
                            else {
                                res.send("Wrong user name or password!")
                            }
                        })
                        
                    })
                }
            

        } else {
            res.send("Wrong user name or password!")
        }
        

    })

})

app.get("/", (req, res) => {
    res.render("account")
})

app.post("/account", (req, res) => {
    const foo = req.body.foo;
    if (foo === "login") {
        res.redirect("/login")
    } else {
        res.redirect("/register")
    }
})


app.listen(PORT, ()=>{
    console.log("server running on port " + PORT);
})