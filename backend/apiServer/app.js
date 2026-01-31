const express= require('express')
const http= require('http')
const {Server}=require('socket.io')
//socketHandler function
const socketHandler = require('./lib/Socket')
const chatRouter=require('./router/chatRouter')
const searchRouter=require('./router/searchRouter')
require('dotenv').config()

const app=express()
app.use(require('cors')({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/search',searchRouter)

const server=http.createServer(app)

const io=new Server(server,{
    cors:{origin:'*'}
})

socketHandler(io)

server.listen(process.env.PORT || 5000,"0.0.0.0",()=>{
    console.log("connected to port ",process.env.PORT || 5000)
})