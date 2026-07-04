export default function ResetButton(props){

 function reset(props){
    localStorage.clear();
    props.completed([]);
    props.uncompleted([]);
  }

return(

  <button onClick={()=>{reset(props)}}>Reset</button>
)

}