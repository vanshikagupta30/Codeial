const mongoose = require('mongoose');
const env = require('./environment');

//connect// in this I need to provide a connection to database and it take only one requirement which is our database.So, I'll 
//do mongodb which is running in the background, localhost bcoz it is running in the same system, codeial_development we write 
//developmental bcz we are creating the project that's why we called it as developmental database(db) 
mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

//comment// whenever there is an error while connecting to the database, console.error does is displays my console.log like an error
db.on('error', console.error.bind(console, "Error Connecting to mongodb"));
//..we can alse write like this the above statement
// db.on('error', function(){
//     console.log('Error Connecting to mongodb');
// });


//comments//in case db is connected, this means connection is open then i'll call a callback function
db.once('open', function(){
    console.log('Connected to Database:: Mongodb');
});

//comment// to make this module or file usable
module.exports = db;