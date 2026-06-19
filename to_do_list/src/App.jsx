import{useState} from 'react'
import './App.css';

export default function App() {

  const[todos,setTodos]=useState([])//an empty array
  const[input,setInput]=useState('')//empty text area
  const[editingIndex,setEditingIndex]=useState(null)

function handleAdd(){
if(!input){
alert("タスクを入力してください！");
return

}
setTodos([{text:input,completed:false}, ...todos])//Updating setTodos Array (appending "input" to the todos array)
setInput('')//Initializing the "input" (since you pressed the Add button)
console.log("todos=")
console.log(todos)
}


function removeTask(i,e){
  console.log("The remove button clicked!");
  e.stopPropagation();
setTodos(todos.filter((_,index)=>removeCurrentIndex(index)))
// .filterはcallbackにtrueを返すもののみを残す

// the callback関数↓↓
function removeCurrentIndex(index){
  console.log(`index!==${i}=${index!==todos[i]}`)
return index!==i
// index が i じゃないものをtrueとして残す(indexがiのアイテムを削除)
}
}

 function completeTask(i){
  
if(todos[i].completed){
  console.log("completeTask() executed! and strikethrough removed!");
setTodos(todos.map((todo,index)=>{
if(index===i){
  return{...todo,completed:false}
}
return todo

}))
}else{
  console.log("completeTask() executed! and strikethrough applied!");
  setTodos(todos.map((todo,index)=>{
    if(index===i){
      return{...todo, completed:true}

    }
    return todo
  })


  )
}

  }

    function editTask(i){
      setEditingIndex(i)//編集インデックスをiへ更新
    }





  return (
        
        <div className='container'>
                  <div className="input_container">
                          <input value={input} onChange={(e)=>setInput(e.target.value)}/*setting an eventListener*/  />
                          <button onClick={handleAdd} className='add_button'>Add</button>
                </div>
                <ul>
                {todos.map((todo,i)=>{
                    const striken={
                  textDecoration:todos[i].completed?"line-through":"none"
                }

              return( // the i is how index numbers should be called
                <li key={i} style={striken}  onClick={()=>completeTask(i)}>{editingIndex===i?<input value={todo.text}></input>:todo.text}<button className="del_button" onClick={(e)=>removeTask(i,e)}>x</button></li>
                )
              })}
                </ul>
                  
          
          
        </div>
  )
}