//the things we "require" are coming from node modules folder (the string is the name of the module from the node modules folder, the code of which is returned by "require")
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()

app.use(bodyParser.json())

//"__dirname" is given to us by node

//this is where public app components (html/js) live
app.use(express.static(path.join(__dirname, 'public')))

//this is where the express/node stuff lives
app.use(express.static(path.join(__dirname, '/../', 'node_modules')))

app.use('/api/posts', require('./routes/posts'))

app.use((req, res) => {
  res.sendStatus(404);
});

module.exports = app
