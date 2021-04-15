// requiring express module
const express = require('express')
// assigning the express module object to app
const app = express()
// assigning MongoClient to mongodb MongoClient which is a module
const MongoClient = require('mongodb').MongoClient
//object Id 
const ObjectId = require('mongodb').ObjectID
// assigning PORT  2121
const PORT = 2121
// requiring dot env 
require('dotenv').config()
//salting passwords for hashing
const bcrypt = require('bcrypt')
//
const passport = require('passport')
//session
const session = require('express-session')
//passport 
// const intializePassport = require('./passport-config')
// intializePassport(
//     passport,
//     email => users.find(user => user.email === email)
// )

let db,
    // getting connection string from env file 
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'task'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')

// tells express to render the public folder
app.use(express.static('./public'))

// does what body parser does 
app.use(express.urlencoded({ extended: true }))
//session
// app.use(session({
//     secret: process.env.SESSION_SECRET
// }))

// send response as json format
app.use(express.json())

app.get('/login', (request, response) => {
    response.render('login.ejs')
})
app.get('/register', (request, response) => {
    response.render('register.ejs')
})

app.get('/', (request, response) => {
    db.collection('taskList').find().sort({ likes: -1 }).toArray()
        .then(data => {
            // rendering data from database to ejs
            response.render('index.ejs', { info: data })
        })
        .catch(error => console.error(error))
    //response.send("hello")
})

app.post('/register', async (request, response) => {
    console.log("started")
    const passwordHash = await bcrypt.hash(request.body.password, 10)
    console.log('request.body.name,', request.body.name)
    try {
        db.collection('users').insertOne({
            name: request.body.name,
            email: request.body.email,
            password: passwordHash
        })
        console.log('task Added')
        response.redirect('/login')
    } catch (error) {
        console.error(error)
        response.redirect('/register')
    }
})

app.post('/addTask', (request, response) => {
    request.body.task === '' ? null :
        db.collection('taskList').insertOne({
            task: request.body.task,
        })
            .then(result => {
                console.log('Task Added')
                response.redirect('/')
            })
            .catch(error => console.error(error))
})

app.delete('/deleteTask', (request, response) => {
    // look up a task in the db and deletes it 
    db.collection('taskList').deleteOne({ task: request.body.task })
        .then(result => {
            console.log('Task Deleted')
            response.json('Task Deleted')
        })
        .catch(error => console.error(error))

})

app.put('/editTask', (request, response) => {
    //looks in taskList collection for matching key value pairs in ascending order (time of creation "oldest one")
    db.collection('taskList').findOneAndUpdate({ _id: ObjectId(request.body.id) }, {
        // if it finds the fields it will update with set
        $set: {
            task: request.body.task
        }
    }, {
        // sorting ids by descending order
        sort: { _id: -1 },
        upsert: false
    })
        .then(result => {
            // sends 'Updated task' to client
            response.json('Updated task')
        })
        .catch(error => console.error(error))
})

//
app.delete('/clearAllTasks', (request, response) => {
    console.log('working?')

    db.collection('taskList').deleteMany({

    })
        .then(result => {
            console.log('All Tasks deleted')
            response.redirect('/')
        })
        .catch(error => console.error(error))
})


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})