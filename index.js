
//import the expree inside index.js
const express = require('express')
//import cors
const cors = require('cors')

//import dataService
const dataService = require('./services/dataService')
//import jwt
const jwt=require('jsonwebtoken')

//create server app using express
const server = express()
//use cors
server.use(cors({
    origin: 'http://localhost:4200'
}))

//to parse json data
server.use(express.json())




//set up port for server app
server.listen(3000, () => {
    console.log('server started at 3000');
})

//appplicatin spectific middle ware
const appmiddleware= (req,res,next)=>{
    console.log("inside  appplicatin spectific middle ware");
    next()
   
}

server.use(appmiddleware)

//router spectific middle ware  that we need
const jwtmiddleware= (req,res,next)=>{
    console.log("inside  router spectific middle ware");
    //get the token from the headers to validate process
    const token=req.headers['access-token']
    console.log(token);
// verify token

try{
    const data=jwt.verify(token,'supersecreatkey123')
    console.log(data);
    fromAcno=data.currentAcno
    console.log(fromAcno);
    console.log('valid token');
    next()
}catch{

    console.log('invalid token');
    res.status(401).json({
        message:'please login!!'
    })

}



}
//bank app front end requset resolving
server.post('/register', (req, res) => {
    console.log("inside register functon");
    console.log(req.body);

    //asyncronus fuction is came from dataqservise register so only get in .then and use json to send to network and put  return in the dataservice acnd check 

    dataService.register(req.body.uname, req.body.acno, req.body.pswd).then((result) => {
        console.log(result);
        res.status(result.statusCode).json(result) 
    })
})
//for login page
server.post('/login',(req,res)=>{
    console.log('inside login function');
    console.log(req.body);

    dataService.login(req.body.acno, req.body.pswd).then((result) => {
        console.log(result);
        res.status(result.statusCode).json(result) 
    })
    })
    //get balance api call
    server.get('/getBalance/:acno',jwtmiddleware,(req,res)=>{
        console.log('inside getBalance function');
        console.log(req.params.acno);
    
        dataService.getBalance(req.params.acno).then((result) => {
            console.log(result);
            res.status(result.statusCode).json(result) 
        })
        })

        //post depositr api call
    server.post('/deposit',jwtmiddleware,(req,res)=>{
        console.log('inside postdeposite function');
        console.log(req.body);
    
        dataService.deposit(req.body.acno,req.body.amount).then((result) => {
            console.log(result);
            res.status(result.statusCode).json(result) 
        })
        })

        //post fundTransfer api call
    server.post('/fundTransfer',jwtmiddleware,(req,res)=>{
        console.log('inside fundTransfer function');
        console.log(req.body);
    
        dataService.fundTransfer(fromAcno,req.body.toAcno,req.body.pswd,req.body.amount).then((result) => {
        console.log(result);
       
    
        res.status(result.statusCode).json(result) 
          
        })
        })

        //getalltransaction
        server.get('/alltransactions',jwtmiddleware,(req,res)=>{
            console.log('inside getalltransaction function');
            dataService.getAllTransaction(fromAcno).then((result) => {
            res.status(result.statusCode).json(result) 
              
            })
            })  

           //delete account
            server.delete('/delete-account/:acno',jwtmiddleware,(req,res)=>{
                console.log('inside delete-acno function');
                console.log(req.params.acno);
            
                dataService.deleteMyAccount(req.params.acno).then((result) => {
                    console.log(result);
                    res.status(result.statusCode).json(result) 
                })
                })