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

function removeCurrentIndex(_,i){
return i!==todos[i]

}

function removeTask(i){
setTodos(todos.filter(removeCurrentIndex(_,i)))

}


  return (
  <div>
  <input value={input} onChange={(e)=>setInput(e.target.value)}/*setting an eventListener*/  />
  <button onClick={handleAdd}>Add</button>
  <ul>
  {todos.map((todo,i)=>( // the i is how index numbers should be called
  <li key={i}>{todo}<button onClick={()=>removeTask(i)}>x</button></li>
  ))}
  </ul>
    
    
    
    </div>
  )
}