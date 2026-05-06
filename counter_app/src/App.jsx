import{useState} from 'react'

export default function App() {

  const [count,setCount]=useState(0)
  if(setCount<-10| setCount>10){
    return
  }

  

  return( 
  <div>
   <h1>{count}</h1>
   <button onClick={()=>{if(count<  10)setCount(count+1)}}>+</button>
   <button onClick={()=>{if(count>-10)setCount(count-1)}}>-</button>
   <button onClick={()=>{setCount(0)}}>Reset</button> 
  
    
    </div>
  )
}