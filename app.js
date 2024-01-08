const express =require('express');
const app=express();
const cors=require('cors')
const path = require('path'); // Require the path module
const session = require('express-session');
const cookieParser = require('cookie-parser');
const clientRoutes=require('./routes/clientRoutes')
const userRoutes=require('./routes/userRoutes')
const authRoutes=require("./routes/authRoutes")
app.use(cookieParser());
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.use(cors());
app.use(express.json());// json post body data
app.use(express.urlencoded({extended:true})) // www /urlencoded data
app.use(session({
    secret: 'hisecret', // Use a random, secure string here
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' } // 'auto' sets it based on the nature of the connection (HTTP/HTTPS)
}));

//api routes
app.use("/client",clientRoutes)
app.use("/user",userRoutes)
app.use("/oauth",authRoutes)




module.exports=app;