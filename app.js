import express from 'express'; // import express module
import compression from 'compression';
import dbUrl from './config/config.js';

const app = express();
app.use(compression());

//setting url of MongoDb

const uri= dbUrl.database.connectionString;

app.get('/api/test',(req, res, next)=>{
    res.status(200).json({
        message:'Hi! Welcome to Ticket Master API'
    })
});

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