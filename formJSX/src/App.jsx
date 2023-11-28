import { useState } from 'react'
import './App.css'

function App() {
  const [nameInput, setName] = useState('')
  const [ageInput, setAge] = useState('')

    function onSubmit(){

    const input = {
        id: 4,
        name: nameInput,
        age: ageInput,
    }

    fetch("http://localhost:3000/addStudent", {
        method: "POST",
        headers:{
            "Content-Type" : "application/json",
        },
        body: JSON.stringify (input)
    }).then((res)=>res.json()).then((resp)=>console.log(resp))

    }


    return(
      <>
        
      <input onChange = {(e)=>{setName(e.target.value)}}/>
      <input onChange = {(e)=>{setAge(e.target.value)}}/>
    
      <button onClick={onSubmit}>Submit</button>
        
      </>
    )
}

export default App
