const express = require('express')
var methodOverride = require('method-override')
const database = require('./config/database')
const route = require('./routes/client/index.route')
const routeAdmin = require('./routes/admin/index.route')
const systemConfig = require('./config/system')
const bodyParser = require("body-parser")
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require("express-session")

require('dotenv').config()

database.connect();
const app = express()

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

//flash
app.use(cookieParser('GSHDGEUDVHS'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

const port = process.env.PORT

app.set('views','./views')
app.set('view engine','pug')

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static('public'))

app.use(bodyParser.urlencoded( { extended: false}))
app.use(bodyParser.json());

route(app)
routeAdmin(app)

app.listen(port, () => {
    console.log('App start')
})