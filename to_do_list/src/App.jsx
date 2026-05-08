import{useState} from 'react'

export default function App() {

  const[todos,setTodos]=useState([])//an empty array
  const[input,setInput]=useState('')//empty text area

function handleAdd(){

setTodos([...todos,input])//Updating setTodos (appending "input" to the todos array)
setInput('')//Initializing the "input" (since you pressed the Add button)
console.log("todos=")
console.log(todos)
}


  return (
  <div>
  <input value={input} onChange={(e)=>setInput(e.target.value)}/*setting an eventListener*/  />
  <button onClick={handleAdd}>Add</button>
  <ul>
  {todos.map((todo,i)=>( // the i is how index numbers should be called
  <li key={i}>{todo}</li>
  ))}
  </ul>
    
    
    
    </div>
  )
}