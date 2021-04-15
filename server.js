// requiring express module
const express = require('express')
// assigning the express module object to app
const app = express()
// assigning MongoClient to mongodb MongoClient which is a module
const MongoClient = require('mongodb').MongoClient
// assigning PORT  2121
const PORT = 2121
//object Id 
const ObjectId = require('mongodb').ObjectID;
// reuiring dot env to env variables
require('dotenv').config()

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

// does what body parser did 
app.use(express.urlencoded({ extended: true }))

// send response as json format
app.use(express.json())

app.get('/', (request, response) => {
    db.collection('taskList').find().sort({ likes: -1 }).toArray()
        .then(data => {
            // rendering data from data base to ejs
            response.render('index.ejs', { info: data })
        })
        .catch(error => console.error(error))
    //response.send("hello")
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
    // look up stage name in the db and delete them 
    db.collection('taskList').deleteOne({ task: request.body.task })
        .then(result => {
            console.log('Task Deleted')
            response.json('Task Deleted')
        })
        .catch(error => console.error(error))

})

app.put('/editTask', (request, response) => {
    //looks in rappers collection for matching key value pairs in ascending order (time of creation "oldest one")
    db.collection('taskList').findOneAndUpdate({ _id: ObjectId(request.body.id) }, {
        // if it finds the fields it will updates with set
        $set: {
            task: request.body.task
        }
    }, {
        // sorting ids by descending order
        sort: { _id: -1 },
        upsert: false
    })
        .then(result => {
            // sends 'Like Added' to client
            response.json('Updated task')
        })
        .catch(error => console.error(error))
})

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