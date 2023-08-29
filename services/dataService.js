//import the db.js
const db = require('./db')

//import json webtoken
const jwt = require('jsonwebtoken')

//register
const register = (uname, acno, pswd) => {
    //check acno is in mongoodb
    return db.User.findOne({
        acno
    }).then((result) => {
        console.log(result);

        //if result present
        if (result) {
            return {
                statusCode: 403,
                message: 'Account already exist!!'
            }
        } else {
            const newUser = new db.User({
                username: uname,
                acno,                                   //acno in key and value same in model and the data come in register
                password: pswd,
                balance: 0,
                transaction: []
            })
            //to save new user in mongop db use save()
            newUser.save()
            return {
                statusCode: 200,
                message: 'Registration Successful'
            }
        }
    })
}

const login = (acno, pswd) => {

    //generate token
    const token = jwt.sign({ currentAcno: acno }, 'supersecreatkey123')


    //check acno is in mongoodb for login

    return db.User.findOne({
        acno
    }).then((result) => {
        console.log(result);


        //if result present
        if (result) {
            return {
                statusCode: 200,
                message: 'Login successful!!',
                username: result.username,
                currentAcno: acno,
                token

            }
        } else {

            return {
                statusCode: 404,
                message: 'Invalid account number/password'
            }
        }   
    })

}

//for balance enq
const getBalance = (acno) => {
    return db.User.findOne({
        acno
    }).then((result) => {
        console.log(result);


        //if result present
        if (result) {
            return {
                statusCode: 200,
                balance: result.balance

            }
        } else {

            return {
                statusCode: 404,
                message: 'Invalid account number'
            }
        }
    })

}

//deposit
const deposit = (acno, amt) => {
    let amount = Number(amt)       //from html to ts amt is string so change to number
    return db.User.findOne({
        acno
    }).then((result) => {
        if (result) {
            //acno present
            result.balance += amount
            //to update in mongodb
            result.save()
//FOR STATEMENT push
            result.transaction.push({
                type:"CREDIT",
                fromAcno:acno,
                toAcno:acno,
                amount
            })
            return {
                statusCode: 200,
                message: `${amount} successfully deposited...`
            }
        } else {
            return {
                statusCode: 404,
                message: "Invalid acccount"
            }
        }
    })

}

//fundTransfer
const fundTransfer = (req, toAcno, pswd, amt) => {

    let amount = Number(amt)
    let fromAcno = req
    return db.User.findOne({
        acno: fromAcno,
        password: pswd
    }).then((result) => {
        console.log(result);
// if for check from acno and to acno same or not
        if(fromAcno==toAcno){
            return {
                statusCode: 401,
                message: "Permission denaid due to own account transfer!!"
            }
        }
            
//if for acnt and pswd of from acnt present
        if (result) {
            //debit accnt details
            let fromAcnoBalance = result.balance
//if from acnt bal is grater taht amount type
            if (fromAcnoBalance >= amount) {
                result.balance = fromAcnoBalance - amount
                console.log(result.balance);
            

                //         //creadit account details
                return db.User.findOne({
                    acno: toAcno
                }).then(creaditdata => {
                    console.log(creaditdata);
// if fund to acnt number is presnt
                    if (creaditdata) {
                        creaditdata.balance += amount
                  //FOR CREDIT 
                        creaditdata.transaction.push({

                            type:"CREDIT",
                            fromAcno,
                            toAcno,
                            amount
                            
                        })


                        creaditdata.save();
                        console.log(creaditdata);
                 //FOR DEBIT 
                        result.transaction.push({

                            type:"DEBIT",
                            fromAcno,
                            toAcno,
                            amount
                            
                        })


                        result.save()

                        console.log(result);
                        return {
                            statusCode: 200,
                            message: "Amount transfer successfully"
                        }

                    } else {
                        return {
                            statusCode: 401,
                            message: "Invalid credit Account number"
                        }
                    }

                })

            } else {
                return {
                    statusCode: 403,
                    message: "Insufficient Balance"
                }
            }




        } else {
            return {
                statusCode: 401,
                message: "Invalid Debit account number/password"
            }
        }
           
        


    })

}

//get all transcation  [alredy taken from token during transcation req]
const getAllTransaction=(fromAcno)=>{
let acno=fromAcno
return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            return{
                statusCode:200,
                transaction:result.transaction
            }

        }else{
            return{
                statusCode:401,
                message:"Invalid Account Number"
            } 
        }
    })}

    //DELETE MY ACCOUNT
    const deleteMyAccount=(acno)=>{
        return db.User.deleteOne({
            acno
        }).then((result)=>{
            if(result){
                return {
                    statusCode:200,
                message:"Account deleted successfully"  }

            }else{
                return{
                    statusCode:401,
                    message:"Invalid Account Number"
                }
                
            }
        })

    }



//export
module.exports = {
    register,
    login,
    getBalance,
    deposit,
    fundTransfer,
    getAllTransaction,
    deleteMyAccount
}