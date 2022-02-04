import logo from './logo.svg'
import Alert from './Alert'
import List from './List'
import { useState, useEffect, useRef } from 'react'

const getLocalStorage = () => {
  let list = localStorage.getItem('list')
  if (list) {
    return JSON.parse(list);
  }
  else{
    return [];
  }
}

function App() {
  const [name, setName] = useState('')
  const [alert, setAlert] = useState({ show: false, type: '', msg: '' })
  const [list, setList] = useState(getLocalStorage())
  const [editId, setEditId] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const refContainer = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name) {
      giveAlert(true, 'danger', 'task cannot be empty')
    } else if (isEdit) {
      const edittedTask = list.map((task) => {
        if (task.id === editId) {
          return { ...task, title: name }
        }
        return task
      })
      setList(edittedTask)
      setName('')
      setIsEdit(false)
      setEditId(null)
      giveAlert(true, 'success', 'Task Editted!')
    } else {
      giveAlert(true, 'success', 'Task Added Successfully')
      const newTask = { id: new Date().getTime().toString(), title: name }
      setList([...list, newTask])
      setName('')
    }
  }

  const giveAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg })
  }

  const deleteTask = (id) => {
    giveAlert(true, 'danger', 'Task Removed!')
    setList(list.filter((task) => task.id !== id))
  }

  const editTask = (id) => {
    const task = list.find((task) => task.id === id)
    setIsEdit(true)
    setEditId(id)
    setName(task.title)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      giveAlert(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [alert])

  useEffect(() => {
    refContainer.current.focus()
  })

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return (
    <>
      <section className="section-center">
        <form className="grocery-form" onSubmit={handleSubmit}>
          {alert.show && <Alert {...alert} />}
          <h3>Your Tasks</h3>
          <div className="form-control">
            <input
              type="text"
              className="grocery"
              placeholder="eg. Learn React"
              value={name}
              onChange={(e) => setName(e.target.value)}
              ref={refContainer}
            />
            <button type="submit" className="submit-btn">
              {isEdit ? 'Edit' : 'Add'}
            </button>
          </div>
        </form>
        {list.length > 0 && (
          <div className="grocery-container">
            <List items={list} deleteTask={deleteTask} editTask={editTask} />
            <button
              className="clear-btn"
              onClick={() => {
                giveAlert(true, 'danger', 'All Tasks Removed!')
                setList([])
              }}
            >
              Clear All Tasks
            </button>
          </div>
        )}
      </section>
    </>
  )
}

export default App
