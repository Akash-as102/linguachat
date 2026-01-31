const express=require('express')
const app=express();
const router=require('./router/authRouter');

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use((req,res,next)=>{
    res.set('Cache-Control','no-store')
    next()
})

app.use('/auth',router)

const PORT=process.env.AUTH_PORT || 5000

app.listen(PORT,"0.0.0.0",()=>{
    console.log(`listening on port ${PORT}`)
})