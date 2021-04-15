const form = document.querySelector('#task-form') //form
const taskInput = document.querySelector('#task') //input
const taskList = document.querySelector('.collection') //a submit button
const clearButton = document.querySelector('.clear-tasks')// clear button
const filter = document.querySelector('#filter')// input
const deleteText = document.querySelectorAll('.delete-item') // button
const edit = document.querySelectorAll('.edit')
const editInput = document.querySelector('.editInput')

Array.from(deleteText).forEach((element) => {
    element.addEventListener('click', deleteTask)
})

async function deleteTask() {
    console.log('this.parentNode.childNodes[1]', this.parentNode.childNodes[1])
    const task = this.parentNode.childNodes[1].innerText
    console.log('testing delete')
    try {
        const response = await fetch('deleteTask', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'task': task,
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()

    } catch (err) {
        console.log(err)
    }
}
clearButton.addEventListener('click', deleteTask)

const clearTask = () => {
    //as long as the ul has any child in it
    while (taskList.firstChild) {
        //delete all of them
        taskList.removeChild(taskList.firstChild)
    }
}

const filterTasks = e => {
    //keep track of ht ekeys usng 
    const text = e.target.value.toLowerCase()
    //loop through all the li's
    document.querySelectorAll('.collection-item').forEach(task => {
        //extract the phrase(string) from each li
        const phrase = task.firstChild.textContent
        //if the text the user is tryping doesn't exist in the phrase
        if (phrase.toLowerCase().indexOf(text) === -1) {
            //then make li diseapper
            task.style.display = 'none'
        } else {
            //else make li appear
            task.style.display = 'block'
        }
    })
}

async function editTask() {
    console.log('task', this.parentNode.parentNode.childNodes[1].innerText)
    const text = this.parentNode.childNodes[3].value
    const id = this.parentNode.parentNode.childNodes[1].dataset.id
    console.log('my id', id)
    try {
        // fetch the put request
        const response = await fetch('editTask', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            // send text as  json 
            body: JSON.stringify({
                'task': text,
                'id' : id
            })
        })
        // response from the server
        const data = await response.json()
        // "like added"
        console.log(data)
        //window.location.reload()

    } catch (err) {
        console.log(err)
    }
}
Array.from(edit).forEach((element) => {
    element.addEventListener('click', editTask)
})

async function deleteAll() {
    try {
        const response = await fetch('clearAllTasks', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
        })
        const data = await response.json()
        console.log(data)
        location.reload()

    } catch (err) {
        console.log(err)
    }
}

clearButton.addEventListener('click', deleteAll)

//loads all event listeners
const loadEventListeners = () => {
    //
    filter.addEventListener('keydown', filterTasks)

}

loadEventListeners()