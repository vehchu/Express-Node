const express = require('express')
var cors = require('cors')
const mysql = require('mysql2')
var jwt = require('jsonwebtoken')
const res = require('express/lib/response')
const req = require('express/lib/request')
const e = require('express')

//---------------------------------------//
const app = express()
const port = 3000
//---------------------------------------//
app.use(express.json()) //translates all data into readable json format every time an endpoint is called
app.use(cors())

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'webdevtest'
})

const userList=[
  {id:1, username:"troy1129", password:"123456789"},
  {id:2, username:"nmg69", password:"987654321"}
] //dont use get req for login

//---------------------------------------//

//no need hard code if using mysql2 
// const list = [ 
//     {id:36, name:"Patrick", age:27},
//     {id:37, name:"Ean", age:27},
//     {id:21, name:"Vi", age:19},
//     {id:13, name:"Mary", age:20}
// ]

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//JSON WEB TOKEN
//sign - generate (encrypts in non redable format)

app.post('/login', (req, res)=>{
  //USERNAME AND PASS ARE STORED INSIDE REQ.BODY
  var user = userList.find((x)=>username == req.body.username)

  if(user == null){
    return res.send({message: "User does nto exist"})
  }else{
    if(user.password==req.body.password){
      //create token
      var token = jwt.sign(user, "123456789")
      res.send({message:"User logged in", token:token})
    }else{
      return res.send({message: "Incorrect Password"})
    }
  }
})

//Middle wear
const authenticateToken=(req, res, next)=>{
  const authHeader = req.headers["authorization"]
  var token = null

  if(authHeader!=undefined && authHeader!=null){
      token = authHeader.split(" ")[1]
  }
  console.log(authHeader)
  console.log(token)

  if(token == null){
    res.send({message:"Unauthorized"})
    return
  }else{
    jwt.verify(token,"123456789", (error, user)=>{
      if(error){
        res.send({message: "Unauthorized"})
        return
      }
      req.user=user
    })

    next()
  }
  // BEARER TOKEN
}
//end of middle wear


app.get('/person',authenticateToken, (req, res) => {
  //res.send(list)

  if(req.user.role=="admin"){
  conn.query("SELECT * FROM persons",(error, data)=>{
    if(error == null){
      res.send(data)
    }
    else{
      res.send(error)
    }
  })
}


  console.log(req)
})


app.get('/person2/:id', (req, res) => {

  conn.query("SELECT id, name, age FROM persons WHERE id=?",[req.params.id],(error, data)=>{
    console.log(error)
    if(error == null){
      res.send(data)
    }
    else{
      res.send(error)
    }
  })

})

// app.get('/person/1', (req, res) => {
//   //res.send(list[0])

//   let findUser = list.find((person)=>person.id == 37 )

//   res.send(findUser)
// })

// app.get('/person/:idNum', (req, res) => {
//     res.send({
//         id: 23,
//         name:"Fabiola",
//         age:20
//     })
// })

app.get('/person/:name', (req, res) => {
    const userToFind = list.filter((x)=>x.name==req.params.name)
    res.send(userToFind)
})

// app.post('/addStudent', (req, res) => {

//   list.push(req.body)
//   res.send({message:"Successfully called Endpoint"})

// })


app.post('/addStudent',(req,res)=>{
  
  // if(req.body.age!=undefined && req.body.name!=undefined){
  //   list.push(req.body)
  //   console.log(req.body)
  //   res.send({message:"Successfully called Added"})
  // }else{
  //   res.send({message:"Could not add, lacking data"})
  // }

  conn.query("INSERT INTO persons (`name`, `age`) VALUES (?,?)", [req.body.name, req.body.age], (error, data)=>{
    console.log(error)
    if(error == null){
      res.send({message:"Successfully called Added"})
    }
    else{
      res.send({message:"Could not add, lacking data"})
    }
  })


 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}
)