import{useState} from 'react'

export default function App() {

  const[todos,setTodos]=useState([])//an empty array
  const[input,setInput]=useState('')//empty text area
  const[editingIndex,setEditingIndex]=useState(null)

function handleAdd(){

setTodos([...todos,{text:input,completed:false}])//Updating setTodos (appending "input" to the todos array)
setInput('')//Initializing the "input" (since you pressed the Add button)
console.log("todos=")
console.log(todos)
}


function removeTask(i){
setTodos(todos.filter((_,index)=>removeCurrentIndex(index)))

function removeCurrentIndex(index){
  console.log(`index!==${i}=${index!==todos[i]}`)
return index!==i

}
}

 function completeTask(i){

  setTodos(todos.map((todo,index)=>{
    if(index===i){
      return{...todo, completed:true}

    }
    return todo
  })


  )

  }

    function editTask(i){
      setEditingIndex(i)//編集インデックスをiへ更新
    }





  return (
  <div>
  <input value={input} onChange={(e)=>setInput(e.target.value)}/*setting an eventListener*/  />
  <button onClick={handleAdd}>Add</button>
  <ul>
  {todos.map((todo,i)=>{
      const striken={
    textDecoration:todos[i].completed?"line-through":"none"
  }

  
  
return( // the i is how index numbers should be called
  <li key={i} style={striken} onDoubleClick={()=>editTask(i)} onClick={()=>completeTask(i)}>{editingIndex===i?<input value={todo.text}></input>:todo.text}<button onClick={()=>removeTask(i)}>x</button></li>
  )
})}
  </ul>
    
    
    
    </div>
  )
}