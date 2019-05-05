import express from 'express'; // import express module
import compression from 'compression';
import dbUrl from './config/config.js';
import bodyParser from 'body-parser';
import { MongoClient, ObjectID } from 'mongodb'
import cors from 'cors';

const app = express();
app.use(compression());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json())
app.use(cors());

//setting url of MongoDb

const uri= dbUrl.database.connectionString;

// listing of allowed status of ticket
const allowedStatus = [
    'IN-PROGRESS',
    'DONE',
    'CLOSE'
]

app.get('/api/test',(req, res, next)=>{
    res.status(200).json({
        message:'Hi! Welcome to Ticket Master API'
    })
});


// Post - Name to add new ticket and get New Ticket as response
app.post('/api/ticket',(req, res, next)=>{
    let { name } = req.body;

    //Checking if name is empty or not
    if(name=="" || name == undefined) throw new Error("Name is mandatory it can't be empty")
        MongoClient.connect(uri, {useNewUrlParser: true}, (err, db) => {
            if (err) throw err;
            var dbo = db.db("ticket_master");
            var ticket = {
                name,
                status: 'IN-PROGRESS'
            };

            //Inserting new record
            dbo.collection("ticket").insertOne(ticket, (err, result) => {
                if (err) throw err;
                db.close();
                res.status(200).json({
                    success: true,
                    payload: result.ops
                })
            });
        });
})

// Patch - Update Status Of The Ticket
app.patch('/api/ticket', (req, res, next) => {
    let {
        id,
        status
    } = req.body;
    if (allowedStatus.indexOf(status)<0) throw new Error("Please Provide a valid status to update")
    MongoClient.connect(uri, {useNewUrlParser:true}, (err, db)=>{
        if (err) throw err;
        var dbo = db.db("ticket_master");
        var query = {
            _id: ObjectID(id)
        };
        var updateData = {
            $set: {
                status
            }
        };

        //Updating one record find by Id
        dbo.collection("ticket").updateOne(query, updateData, {
                    returnOriginal: false
                }, (err, result) => {
            if (err) throw err;
            db.close();
            res.status(200).json({
                success: true,
                payload: result
            })
        });
    });
})


// Patch - Update Name Of The Ticket
app.patch('/api/ticket/edit', (req, res, next) => {
    let {
        id,
        name
    } = req.body;

    if (name==""||name==undefined) throw new Error("Please Provide a valid name to update")
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;

        var dbo = db.db("ticket_master");
        var query = {
            _id: ObjectID(id)
        };
        var updateData = {
            $set: {
                name
            }
        };

        //Updating one record find by Id
        dbo.collection("ticket").updateOne(query, updateData, {
            returnOriginal: false
        }, (err, result) => {
            if (err) throw err;
            db.close();
            res.status(200).json({
                success: true,
                payload: result
            })
        });
    });
})


// Get - Get All Ticket
app.get('/api/ticket', (req, res, next) => {
    MongoClient.connect(uri, {
        useNewUrlParser: true
    }, (err, db) => {
        if (err) throw err;
        var dbo = db.db("ticket_master");
        dbo.collection("ticket").find({}).toArray((err, result)=>{
            if (err) throw err;
            db.close();
            if (result.length < 1){
                res.status(404).json({
                    payload:[]
                })
            }else{
                res.status(200).json({
                    success: true,
                    payload: result
                })
            }
        });
    });
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("No Matching Route Please Check Again...!!");
    err.status = 404;
    next(err);
 });
 // error handler
 // define as the last app.use callback
 app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
       Error: {
          message: err.message
       }
    });
 });
module.exports = app;
 

// export default app;