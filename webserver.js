
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const ws = express();
const mysqlCredentials = require('./mysqlCredentials');

const db = mysql.createConnection(mysqlCredentials);

ws.use(express.static(path.join(__dirname, 'html')));
//GET
ws.get('/users', (req, res) => {
    db.connect(function() {
        console.log("this hit");
        db.query('SELECT * FROM students', function(error, rows, fields) {
            console.log("this also hit");
            console.log(error);

            const output = {
                success: true,
                data: rows
            }
            const json_output = JSON.stringify(output);
            res.send(json_output);
            
        })
    })
})
//POST
// we.post('/users', (req, res, next) => {
//     const { name, course, grade} = req.body;
//     let query = 'INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)';
//     let inserts = ['studnets', 'name', 'course', 'grade', name, course, grade];

//     let sql = mysql.format(qauery, inserts);
//     connection
// })

//DELETE


ws.listen(3000, function() {
    console.log("ITS HAPPENING");
    
});