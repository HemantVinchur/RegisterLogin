const functions = require('../function')
const mongoose = require('mongoose')
const mongodb = require('mongodb');
const register = require('../models/register')
const auth = require('../models/auth')
const jwt = require('jsonwebtoken');



//Registration

const userRegister = async (req, res) => {
    console.log("userRegister")
    try {
        console.log("userRegister")
        let payLoad = req.body;
        console.log(payLoad)
        let findData = await register.findOne({ email: payLoad.email });
        if (findData) {
            return res.status(200).json({
                statusCode: 400,
                message: "User already exists",
                data: {}
            })
        }
        let hashObj = functions.hashPassword(payLoad.password)
        console.log(hashObj)
        delete payLoad.password
        payLoad.salt = hashObj.salt
        payLoad.password = hashObj.hash
        let userData = await register.create(payLoad);
        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: userData
        })
    } catch (error) {
        console.log(error)
        res.status(200).json({
            statusCode: 400,
            message: "Something went wrong",
            data: {}
        })
    }
}



//Login

const userLogin = async (req, res) => {
    console.log("Login.................")
    try {
        let payLoad = req.body;
        console.log(payLoad)
        let data = await register.findOne({ email: payLoad.email });
        console.log(data)
        if (!data) {
            return res.status(200).json({
                statusCode: 401,
                message: "User not found",
                data: {}
            })
        }
        let isPasswordValid = functions.validatePassword(data.salt, payLoad.password, data.password);
        console.log(isPasswordValid)
        if (!isPasswordValid) {
            return res.status(200).json({
                statusCode: 400,
                message: "invalid email or password",
                data: {}
            })
        }
       let token = jwt.sign({ email: payLoad.email }, 's3cr3t');
        console.log("Token-:",token)
        let userData = await auth.create({email:payLoad.email,accessToken:token});
        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: {data,userData}
        })
    } catch (error) {
        console.log(error)
        res.status(200).json({
            statusCode: 400,
            message: "Something went wrong",
            data: {}
        })
    }
}

//Logout

const userLogout = async (req, res) => {
    console.log("Logout.................")
    let payLoad = req.body;
    try {
        
        if(!req.headers.authorization){
            return res.status(200).json({
                statusCode:400,
                message:"Access Token not found",
                data:{}
            })
        }
        let token = req.headers.authorization.split(' ')[1];
        console.log(token)
        let decodeCode = await functions.authenticate(token)
        if(!decodeCode){
            return res.status(200).json({
                statusCode:400,
                message:"Something went wrong",
                data:{}
            })
        }

        token.accessToken=decodeCode.accessToken
        
        let data = await register.findOne({ email:payLoad.email });
        if (!data) { 
            return res.status(200).json({
                statusCode: 401,
                message: "User not found",
                data: {}
            })
        }
         

        let deletetoken = await auth.deleteOne(token.accessToken)
        return res.status(200).json({
            statusCode: 200, 
            message: "Successfully logout",
            data: deletetoken
        })
    } catch (error) {
        console.log(error)
        res.status(200).json({
            statusCode: 400,
            message: "Something went wrong",
            data: {}
        })
    }
}


module.exports = { userRegister, userLogin, userLogout }