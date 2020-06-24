const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const path = require("path");
const passport  = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");


//Load config file
dotenv.config({path: "./config/config.env"});

//Passport config
require("./config/passport")(passport);

//database connection
connectDB();

const app = express();

//body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

//logging
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
}
//handlebars helpers
const {formatDate, stripTags, truncate, editIcon, select}  = require("./helpers/helpers");
//handlebars setups
app.engine(".hbs", exphbs({defaultLayouts: "main", extname: ".hbs", helpers: {formatDate, select, stripTags, editIcon, truncate} }));
app.set("view engine", ".hbs");

//sessions
app.use(session({
    secret: "Sunny boy",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})

}));

//passport middlewares
app.use(passport.initialize());
app.use(passport.session());

//set global variables
app.use(function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

//static folder
app.use(express.static(path.join(__dirname, "public")))


//routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));



const PORT = process.env.PORT || 6000





app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));