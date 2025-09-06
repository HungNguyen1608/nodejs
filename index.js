require('dotenv').config()

const express = require('express')
const path = require("path")
var methodOverride = require('method-override')
const database = require('./config/database')
const route = require('./routes/client/index.route')
const routeAdmin = require('./routes/admin/index.route')
const systemConfig = require('./config/system')
const bodyParser = require("body-parser")
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require("express-session")
const moment = require("moment")

//connect db
database.connect()
  .then(() => {
      const app = express()

      // override with POST having ?_method=DELETE
      app.use(methodOverride('_method'))

      //flash
      app.use(cookieParser('GSHDGEUDVHS'));
      app.use(session({ cookie: { maxAge: 60000 }}));
      app.use(flash());

      //tinyMCE
      app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
      const port = process.env.PORT

      //view engine
      app.set('views', `${__dirname}/views`)
      app.set('view engine', 'pug')

      //set variable global
      app.locals.prefixAdmin = systemConfig.prefixAdmin;
      app.locals.moment = moment

      //static folder public
      app.use(express.static(`${__dirname}/public`))

      app.use(bodyParser.urlencoded({ extended: false }))
      app.use(bodyParser.json());

      //route
      route(app)
      routeAdmin(app)

      app.listen(port, () => {
          console.log('🚀 App start on port', port)
      })
  })
  .catch(err => {
      console.error("❌ Cannot connect to MongoDB:", err);
  });
