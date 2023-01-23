const userModel = require("../models/userModel")
// const jwt = require("jsonwebtoken")
const emailValidator = require("email-validator")
const passwordValidator = require("password-validator")

const createUser = async function(req, res){
    try{
        let userData = req.body
        const{title, name, phone, email, password, address} = req.body
        if(!title) return res.status(400).send({status: false, msg:"title is required"})
        if(!name) return res.status(400).send({status: false, msg:"name is required"})
        if(!phone) return res.status(400).send({status: false, msg:"phone is required"})
        if(!email) return res.status(400).send({status: false, msg:"email is required"})
        if(!password) return res.status(400).send({status: false, msg:"password is required"})

        const validName = (/^[a-zA-Z_ ]{3,20}$/)
        const isValidMobile = (/^[6-9]{1}[0-9]{9}$/);
    
        let schema = new passwordValidator();
            schema
                .is().min(8)  //Must be of minimum length 8
                .is().max(15)  //Maximum length should not be more than 100
                .has().uppercase()  //Must contain one uppercase
                .has().lowercase()  //Must contain one lowercase
                .has().digits(2)  //Must have atleast 2 digits

    if(!validName.test(name)) return res.status(400).send({status: false, msg: "Numbers Not Allowed & Must be of minimum 3 characters"})
    if(!(["Mr", "Mrs", "Miss"].includes(title))) return res.status(400).send({status: false, msg: "Can only use Mr, Mrs and Miss"})
    if(!emailValidator.validate(email)) return res.status(400).send({status:false, msg:"Invalid Email"})
    if(!schema.validate(password)) return res.status(400).send({status: false, msg: "Password requirements didn't match"})
    if(!isValidMobile.test(phone)) return res.status(400).send({status: false, msg: "Phone Number is not Valid"})

        let savedData = await userModel.create(userData)
        res.status(201).send({status: true, message: "Success", data: savedData})
    }
    catch(err){
    res.status(500).send(err.message)
    }
}



module.exports.createUser = createUser





