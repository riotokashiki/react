//React Hookをインポート↓↓
import{useState,useEffect} from 'react'
//cssシートをインポート↓↓
import './App.css';

//大文字で始まってるのでリアクトコンポーネント↓↓
export default function App() {

  const[todos,setTodos]=useState(()=>{
    const restored_uncompleted_list=JSON.parse(localStorage.getItem("saved_uncompleted_list"))
    return restored_uncompleted_list?restored_uncompleted_list:[]
  })//an empty array
  const[input,setInput]=useState('')//empty text area
  const[editingIndex,setEditingIndex]=useState(null)

//Appマウント時に1回のみ実行↓↓
useEffect(()=>{
const restored_uncompleted_list=JSON.parse(localStorage.getItem("saved_uncompleted_list"))
console.log("restored_uncompleted_list is...");
console.log(restored_uncompleted_list);
if(restored_uncompleted_list){
  setTodos(restored_uncompleted_list);



}
},[])

  //todosに変化が生じた時だけ以下を実行↓↓(初回マウント時も実行される)
  useEffect(()=>{    
            localStorage.setItem("saved_uncompleted_list",JSON.stringify(todos));
            console.log("(at App() )localStorage Updated!");
            console.log(JSON.parse(localStorage.getItem("saved_uncompleted_list")));                
  },[todos])





  //Regular Function↓↓
function handleAdd(){
if(!input){
alert("タスクを入力してください！");
return
}
//状態変数を更新↓↓
setTodos(prev=>[{text:input,completed:false}, ...prev])//Updating setTodos Array (prepending "input" to the todos array)
setInput('')//Initializing the "input" (since you pressed the Add button)
console.log("(at handleAdd) todos=")
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
                          <input value={input} className="inputField" onKeyDown={(e)=>{if(e.key==="Enter") handleAdd()} } onChange={(e)=>{setInput(e.target.value)}}/*setting an eventListener*/  />
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