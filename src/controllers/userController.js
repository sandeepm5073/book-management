const UserModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const { isValid, isValidISBN, isValidTitle, isValidMobileNo, isValidPassword, isValidPincode,
  isValidEmail, isValidName, isValidObjectId, isValidReleasedAt } = require("../Validations/Validator");

const createUser = async function (req, res) {
  try {
    let userData = req.body

    const { title, name, phone, email, password, address } = req.body
    if (!title)
      return res.status(400).send({ status: false, msg: "title is required" })
    if (!name)
      return res.status(400).send({ status: false, msg: "name is required" })
    if (!phone)
      return res.status(400).send({ status: false, msg: "phone is required" })
    if (!email)
      return res.status(400).send({ status: false, msg: "email is required" })
    if (!password)
      return res.status(400).send({ status: false, msg: "password is required" })


    if (!isValidName(name)) {
      return res.status(400).send({ status: false, msg: "Numbers Not Allowed & Must be of minimum 3 characters" })
    }

    if (!(["Mr", "Mrs", "Miss"].includes(title)))
      return res.status(400).send({ status: false, msg: "Can only use Mr, Mrs and Miss" })

    if (!isValidEmail(email))
      return res.status(400).send({ status: false, msg: "Invalid Email" })

    if (!isValidMobileNo(phone))
      return res.status(400).send({ status: false, msg: "Phone Number is not Valid" })

    if (!isValidPassword(password))
      return res.status(400).send({ status: false, msg: "Password requirements didn't match" })

    if (!isValidPincode(address.pincode))
      return res.status(400).send({ status: false, msg: "Pincode requirements didn't match" })

    let savedData = await UserModel.create(userData)
    res.status(201).send({ status: true, message: "Success", data: savedData })
  }
  catch (err) {
    res.status(500).send(err.message)
  }
}

//---------------------------------------  Login User    -------------------------------------------------

const loginUser = async function (req, res) {
  try {
    let { email, password } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ status: false, msg: "please input user Details" });
    }

    if (!email) {
      return res.status(400).send({ status: false, message: "EmailId is mandatory" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).send({ status: false, message: "EmailId should be Valid" });
    }
    if (!password) {
      return res.status(400).send({ status: false, message: "Password is mandatory" });
    }
    if (password.length < 8 || password.length > 15) {
      return res.status(400).send({ status: false, message: "the length of password must be min:- 8 or max: 15" });
    }

    let verifyUser = await UserModel.findOne({ email: email, password: password });
    if (!verifyUser)
      return res.status(400).send({ status: false, message: "Invalid Login Credential" });

    let payload = { userId: verifyUser._id, iat: Date.now(), };

    let token = jwt.sign(payload, "Group16", { expiresIn: "30min" });

    res.setHeader("x-auth-key", token);
    res.status(200).send({ status: true, message: "login successful", data: { token } });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { loginUser, createUser }






