const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const ejs = require("ejs");
const path = require("path");
const fs = require('fs');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;


const bcrypt = require('bcrypt');
const saltRounds = 1;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


const app = express();
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static("public", {redirect: false}));

app.set("view engine", "ejs");

const PORT = 3000;

var currentUser;


const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) return console.error(err.message, "line 25");
})

let sqlCreate = `CREATE TABLE IF NOT EXISTS programming_train(
    recordId INTEGER PRIMARY KEY,
    date TEXT NOT NULL,
    language TEXT NOT NULL,
    time INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    description TEXT NOT NULL,
    userId INTEGER
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
    let userId = parseInt(req.query.id)
    // let userId = 4

    records = [];
    sqlSelect = "SELECT * FROM programming_train WHERE userId=?";
    db.all(sqlSelect, [userId], (err, rows) => {
        if (err) return console.error(err.message, "line 56");
        rows.forEach((row)=>{
            // console.log(typeof row);
            records.push(row);
            // console.log(records);

        })
        // console.log(records);

        res.render("list.ejs", {records:records, userId:userId});

        // res.json({"records":records})
        
    })
    
})


app.get("/records/:id", (req, res)=>{ //odpovídám načetním databáze, nakonci každého requestu znovu načíst
    let userId = parseInt(req.params.id)
    // let userId = 4

    records = [];
    sqlSelect = "SELECT * FROM programming_train WHERE userId=?";
    db.all(sqlSelect, [userId], (err, rows) => {
        if (err) return console.error(err.message, "line 56");
        rows.forEach((row)=>{
            // console.log(typeof row);
            records.push(row);
            // console.log(records);


        })
        // console.log(records);

        db.get("SELECT userName FROM users WHERE userId=?", [userId], (err, row) => {
        if (err) return console.error(err.message, "line 56");
            userName = row.userName
            res.render("list.ejs", {records:records, userId:userId, userName:userName});

        })


        // res.json({"records":records})
        
    })
    
})

app.post("/add/:id", (req, res)=> {  // přidávám do databáze
    const userId = parseInt(req.params.id)
    console.log(userId);
    const body = req.body;
    // console.log(body);

    
    const date = body.date;
    const language = body.language;
    const time = body.time;
    const rating = body.rating;
    const description = body.description;


    let sqlAdd = `INSERT INTO programming_train(date, language, time, rating, description, userId) VALUES (?,?,?,?,?,?)`;
    db.run(sqlAdd, [date, language, time, rating, description, userId]);
    // console.log("ADDED");
    // records.push(record)

    res.redirect("/records/" + userId);

  

    
})

app.post("/update/:id", (req, res)=>{   // upravuje
    let userId = parseInt(req.params.id)

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
        if (err) return console.error(err.message, "line 114");
    })

    res.redirect("/records/" + userId);





})

app.post("/delete/:id", (req, res)=>{ // smaže
    let userId = parseInt(req.params.id)


    const body = req.body;
    // console.log(body)
    const id = body.deleteId;

    let sqlDel = "DELETE FROM programming_train WHERE recordId=?";
    db.run(sqlDel, [id], (err) => {
        if (err) return console.error(err.message, "line 135");
    })

    res.redirect("/records/" + userId)
    
        
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
                console.error(err, "line 179")
            } else {
                // console.log(hass)
                let sqlAdd = `INSERT INTO users (userName, email, password) VALUES (?,?,?)`;

                db.run(sqlAdd, [userName, email, hass], (err) => {
                    if (err) return console.error(err.message, "line 185");
                    
                })
                let sqlLast = `SELECT userId FROM users ORDER BY userId DESC LIMIT 1;`
                db.get(sqlLast, [], (err, id) => {
                    if (err) return console.error(err.message, "line 190");
                    let paramId = id.userId
                    currentUser = paramId
                    console.log(currentUser)


                    res.redirect("/admin")

                })
                console.log("break point")
            }
        })


    }

})

app.get("/", (req, res) => {
    res.render("login", {success: true})
})

app.post("/login", (req, res) => {
    const nameEmail = req.body.nameEmail;
    const password = String(req.body.password);

    if (nameEmail == "Admin" && password == 123456) {
        res.redirect("/admin")
    } else {

    


    let sqlFind = "SELECT userId FROM users WHERE userName=? OR email=?";
    db.get(sqlFind, [nameEmail, nameEmail], (err, id) => {
        if (err) return console.error(err.message, "line 218");

        if (id !== undefined) {
            var user = id.userId;


                if (err) {
                    console.error(err, "line 225")
                } else {


                    let sqlCheck = "SELECT password FROM users WHERE userId=?";
                    db.get(sqlCheck, [user], (err, passCheck) => {
                        if (err) return console.error(err.message, "line 231");

                        bcrypt.compare(password, passCheck.password, function(err, result) {
                            if (err) return console.error(err.message, "line 234");

                            


                            if (result === true) {
                                currentUser = user
                                console.log(currentUser)


                                res.redirect("/records/" + user)
                            }
                            else {
                                res.render("login", {success: false})
                            }
                        })
                        
                    })
                }
            

        } else {
            res.render("login", {success: false})
        }
        

    })

}})

app.get("/admin", (req, res)=> {
    const sqlSelect = "SELECT * FROM users"
    db.all(sqlSelect, [], (err, rows) => {
        if (err) return console.error(err.message, "line 308");
        var users = []
        rows.forEach((row)=> {
            users.push(row)
            // console.log(row)
        })
        console.log(users)
    res.render("admin", {users:users})

    })
})


app.post("/deleteUser", (req, res) => {
    let userId = req.body.userId
    console.log(userId)

    let sqlDel = "DELETE FROM users WHERE userId=?";
    let recordsDel = "DELETE FROM programming_train WHERE userId=?"
    db.run(sqlDel, [userId], (err) => {
        if (err) return console.error(err.message, "line 327");
    })
    db.run(recordsDel, [userId], (err) => {
        if (err) return console.error(err.message, "line 330");
    })

    res.redirect("/admin")
    
        
})

app.post("/editUser", (req, res) => {
    let userId = req.body.userId

    const body = req.body;

    // console.log(body)

    const userName = body.userName;
    const email = body.email;
    const password = body.password;

    let rowsHandle;

    let sqliteCheck = "SELECT * FROM users WHERE userName=? OR email=?";
    db.all(sqliteCheck, [userName, email], (err, rows) => {
        if (err) return console.error(err.message);

        rowsHandle = rows;
       
    })
    if (rowsHandle !== undefined) {
        // check++;

        res.send("Already exists");
    } else {

    
        bcrypt.hash(password, saltRounds, function(err, hass) {
            if (err) {
                console.error(err, "line 179")
            } else {
                // console.log(hass)
                const sqlUpdate = "UPDATE users SET userName = ?, email = ?, password = ? WHERE userId = ?";
                

                db.run(sqlUpdate, [userName, email, hass], (err) => {
                    if (err) return console.error(err.message, "line 185");
                    res.redirect("/admin");
                    
                })
                
            }
        })




}})

app.post("/editUserName", (req, res) => {
    const userId = req.body.userId
    const userName = req.body.userName

    let rowsHandle;

    let sqliteCheck = "SELECT * FROM users WHERE userName=?";
    db.all(sqliteCheck, [userName], (err, rows) => {
        if (err) return console.error(err.message);

        rowsHandle = rows;
       
    })
    if (rowsHandle !== undefined) {
        // check++;

        res.send("Already exists");
    } else {
        const sqlUpdate = "UPDATE users SET userName=? WHERE userId=?"
        db.run(sqlUpdate, [userName, userId], (err) => {
            if (err) return console.error(err.message, "line 185");
            res.redirect("/admin")    
        })

    }
})

app.post("/editUserEmail", (req, res) => {
    const userId = req.body.userId
    const email = req.body.email

    let rowsHandle;

    let sqliteCheck = "SELECT * FROM users WHERE email=?";
    db.all(sqliteCheck, [email], (err, rows) => {
        if (err) return console.error(err.message);

        rowsHandle = rows;
       
    })
    if (rowsHandle !== undefined) {
        // check++;

        res.send("Already exists");
    } else {
        const sqlUpdate = "UPDATE users SET email=? WHERE userId=?"
        db.run(sqlUpdate, [email, userId], (err) => {
            if (err) return console.error(err.message, "line 185");
            res.redirect("/admin")    
        })

    }
})

app.post("/editUserPassword", (req, res) => {
    const userId = req.body.userId
    const password = req.body.password

    
    bcrypt.hash(password, saltRounds, function(err, hass) {
        if (err) {
            console.error(err, "line 179")
        } else {
            // console.log(hass)
            const sqlUpdate = "UPDATE users SET password = ? WHERE userId = ?";
            

            db.run(sqlUpdate, [hass, userId], (err) => {
                if (err) return console.error(err.message, "line 185");
                res.redirect("/admin");
                
            })
            
        }
    })
})


// rest api


app.get("/users/:user_id/records", (req, res) => {
    const user_id = req.params.user_id
    sqlSelect = "SELECT * FROM programming_train WHERE userId=?";
    db.all(sqlSelect, [user_id], (err, rows) => {
        if (err) return console.error(err.message, "line 56");
        var records = []

        if (rows.length === 0) {
            res.status(404).send("User does not exist.")
        } else {


        rows.forEach((row)=>{
            // console.log(typeof row);
            let obj = {
                "id": row.recordId,
                "date": row.date,
                "time-spent": row.time,
                "programming-language": row.language,
                "rating":row.rating,
                "description":row.description
            }
            records.push(obj);
            // console.log(records);

        })
        // console.log(records);


        res.send(records);

        // res.json({"records":records})
    }
        
    })
})

app.get("/users/:user_id/records/:record_id", (req, res) => {
    const user_id = req.params.user_id
    const record_id = req.params.record_id
    sqlSelect = "SELECT * FROM programming_train WHERE userId=? AND recordId=?";
    db.all(sqlSelect, [user_id, record_id], (err, rows) => {
        if (err) return console.error(err.message, "line 56");
        var records = []

        if (rows.length === 0) {
            res.status(404).send("Not Found")
        } else {


        rows.forEach((row)=>{
            // console.log(typeof row);
            let obj = {
                "id": row.recordId,
                "date": row.date,
                "time-spent": row.time,
                "programming-language": row.language,
                "rating":row.rating,
                "description":row.description
            }
            records.push(obj);
            // console.log(records);

        })
        // console.log(records);


        res.send(records);

        // res.json({"records":records})
    }
        
    })

})

app.post("/users/:user_id/records", (req, res) => {
    const user_id = req.params.user_id
    const body = req.body;
    console.log(req)

    // console.log(body);


    sqlCheckUser = "SELECT * FROM users WHERE userId=?"
    db.all(sqlCheckUser, [user_id], (err, rows) => {
        if (err) return console.error(err.message, "line 56");
        if (rows.length == 0) {
            res.status(404).send("Not Found")
        } else {
            const date = body.date;
            const language = body["programming-language"];
            const timeSpent = body["time-spent"];
            const rating = body.rating;
            const description = body.description;

        
        
        
        
        
            let sqlAdd = `INSERT INTO programming_train(date, language, time, rating, description, userId) VALUES (?,?,?,?,?,?)`;
            db.run(sqlAdd, [date, language, timeSpent, rating, description, user_id], (err) => {
                if (err) {
                    console.error(err)
                    res.status(404).send("Not Found")
                } else {

                    let sqlCreated = "SELECT * FROM programming_train ORDER BY recordId DESC LIMIT 1;"
                    db.get(sqlCreated, [], (err, row) => {
                        if (err) return console.error(err.message, "line 190");
    
                        let obj = {
                            "id": row.recordId,
                            "date": row.date,
                            "time-spent": row.time,
                            "programming-language": row.language,
                            "rating":row.rating,
                            "description":row.description
                        }
    
                    res.status(200).send(obj);
                        
    
                    })


                }
            });
            // console.log("ADDED");
            // records.push(record)
        
        }
    })
})

app.delete("/users/:user_id/records/:record_id", (req, res) => {
    let user_id = parseInt(req.params.user_id)
    let record_id = req.params.record_id

    let sqlDel = "DELETE FROM programming_train WHERE recordId=? AND userId=?";
    db.run(sqlDel, [record_id, user_id], (err) => {
        if (err) {
        res.status(404).send("Not Found")
            
            return console.error(err.message, "line 135")
    } else {
        res.status(200).send("OK")
    }
    })
    })

app.put("/users/:user_id/records/:record_id", (req, res) => {
    let user_id = parseInt(req.params.user_id)
    let record_id = req.params.record_id

    const body = req.body;

    // console.log(body)

    const date = body.date;
    const language = body["programming-language"];
    const time = body["time-spent"];
    const rating = body.rating;
    const description = body.description;
    const recordId = body.id

    let obj = {
        "id": record_id,
        "date": date,
        "time-spent": time,
        "programming-language": language,
        "rating":rating,
        "description":description
    }

    const sqlUpdate = "UPDATE programming_train SET date = ?, language = ?, time = ?, rating = ?, description = ? WHERE recordId = ? AND userId=?";
    db.run(sqlUpdate, [date, language, time, rating, description, record_id, user_id], (err) => {
        if (err) {
            res.status(404).send("Not Found")
            return console.error(err.message, "line 114");
        } else {
            res.status(200).send(obj)
        }
    })
})

app.get("/download/:userId", (req, res) => {
    const userId = req.params.userId

    const csvWriter = createCsvWriter({
        path:"public/records.csv",
        header:[
            {id: "recordId", tilte:"recordId"},
            {id: "date", title:"date"},
            {id: "time", title:"time-spent"},
            {id: "language", title:"programming-language"},
            {id: "rating", title:"rating"},
            {id:"description", title:"description"},
        ]
    })

    records = []

    const sqlSearch = "SELECT * FROM programming_train WHERE userId=?"
    db.all(sqlSearch, [userId], (err, rows) => {
        rows.forEach((row) => {
            delete row.userId
            records.push(row)
        })

        console.log(records)
        csvWriter.writeRecords(records).then(() => {
            res.download("./public/records.csv", (err) => {
                if (err) {
                    console.log(err)
                } 
                fs.unlink("./public/records.csv", () => {
                    console.log("deleted")
                });
                
            })
        })

    }) 


})

app.listen(PORT, ()=>{
    console.log("server running on port " + PORT);
})