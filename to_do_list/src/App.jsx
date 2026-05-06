import{useState} from 'react'

export default function App() {

  const[todos,setTodos]=useState([])
  const[input,setInput]=useState('')


  return (
  <div>
   <input value={input} onChange={(e)=>setInput(e.target.value)} />
   <button>Add</button>
   <ul>
   {todos.map((todo,i)=>(
    <li key={i}>{todo}</li>
   ))}

    
   </ul>
    
    
    
    </div>
  )
}