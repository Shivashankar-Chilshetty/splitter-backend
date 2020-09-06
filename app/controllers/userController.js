const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib')
const response = require('./../libs/responseLib')
const validateInput = require('./../libs/paramsValidationLib')
const check = require('./../libs/checkLib')
const logger = require('./../libs/loggerLib')
const passwordLib = require('./../libs/generatePasswordLib')
const token = require('../libs/tokenLib')

const UserModel = mongoose.model('User');
const AuthModel = mongoose.model('Auth');


var nodemailer = require('nodemailer');



let getAllUser = (req, res) => {
    UserModel.find()
        .select('-__v-_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                for (var i in result) {
                    for (var j in result[i]) {
                        if (j === 'password') {
                            delete result[i][j];
                        }
                    }
                }
                console.log(result)
                let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })

}// end get all users


/* Get single user details */
let getSingleUser = (req, res) => {
    UserModel.findOne({ 'userId': req.params.userId }, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller: getSingleUser', 10)
            let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller:getSingleUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User Details Found', 200, result)
            res.send(apiResponse)
        }
    })

}// end get single user


let deleteUser = (req, res) => {

    UserModel.findOneAndRemove({ 'userId': req.params.userId }, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller: deleteUser', 10)
            let apiResponse = response.generate(true, 'Failed To delete user', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: deleteUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the user successfully', 200, result)
            res.send(apiResponse)
        }
    });// end user model find and remove


}// end delete user



let editUser = (req, res) => {
    let options = req.body;
    console.log(options)
    UserModel.update({ 'userId': req.params.userId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller:editUser', 10)
            let apiResponse = response.generate(true, 'Failed To edit user details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: editUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User details edited', 200, result)
            res.send(apiResponse)
        }
    });// end user model update


}// end edit user



let signUpFunction = (req, res) => {
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Email Does Not meet the requirement', 400, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, '"password" parameter is missing', 400, null);
                    reject(apiResponse);
                }
                else {
                    resolve(req);
                }
            }
            else {
                logger.error('Field Missing During User creation', 'userController : createUser()', 5)
                let apiResponse = response.generate(true, 'One or More Parameters is missing', 400, null)
                reject(apiResponse)
            }
        })
    }
    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email }, (err, retrievedUserDetails) => {
                if (err) {
                    logger.error(err.message, 'userController:createUser', 10)
                    let apiResponse = response.generate(true, 'failed to create User', 500, null)
                    reject(apiResponse)
                }
                else if (check.isEmpty(retrievedUserDetails)) {
                    let newUser = new UserModel({
                        userId: shortid.generate(),
                        firstName: req.body.firstName,
                        lastName: req.body.lastName || '',
                        email: req.body.email.toLowerCase(),
                        mobileNumber: req.body.mobileNumber,
                        password: passwordLib.hashpassword(req.body.password),
                        createdOn: time.now(),
                        countryCode: req.body.countryCode
                    })
                    newUser.save((err, newUser) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController:createUser', 10)
                            let apiResponse = response.generate(true, 'Failed to create new user', 500, null)
                            reject(apiResponse)
                        }
                        else {
                            let newUserObj = newUser.toObject();
                            //newUserObject contains details with password
                            resolve(newUserObj)
                        }
                    })

                }
                else {
                    logger.error('User Cannot Be created . User Already present', 'userController:createUser', 4)
                    let apiResponse = response.generate(true, 'User Already Present with this email', 403, null)
                    reject(apiResponse)
                }
            })
        })
    }//end create user function
    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'User created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })


}// end user signup function 

//start of login function
let loginFunction = (req, res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error('Failed to retrieve data', 'userController:findUser()', 10)
                        let apiResponse = response.generate(true, 'Failed to find user details', 500, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(userDetails)) {
                        logger.error('No  User Found', ' userController:findUser()', 7)
                        let apiResponse = response.generate(true, '"No User details found in DB, kindly signup', 400, null)
                        reject(apiResponse)
                    }
                    else {
                        logger.info('User Founnd', 'userController:findUser', 10)
                        resolve(userDetails)
                    }
                })
            }
            else {
                let apiResponse = response.generate(true, 'email Parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }
    let validatePassword = (retrievedUserDetails) => {
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController:validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                }
                else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                }
                else {
                    logger.info('Login Failed Due to Invalid Password', 'userController:validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Passsword.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }
    let generateToken = (userDetails) => {
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed to generate token', 500, null)
                    reject(apiResponse)
                }
                else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }

    let saveToken = (tokenDetails) => {
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    logger.error(err.message, 'userController:saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed to generate token', 500, null)
                    reject(apiResponse)
                }
                else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController:saveToken()', 10)
                            let apiResponse = response.generate(true, 'Failed to generate token', 500, null)
                            reject(apiResponse)
                        }
                        else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
                else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController:saveToken()', 10)
                            let apiResponse = response.generate(true, 'Failed to generate token', 500, null)
                            reject(apiResponse)
                        }
                        else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })

        })
    }


    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err)
            res.status(err.status)
            res.send(err)
        })
}



let logout = (req, res) => {
    AuthModel.findOneAndRemove({ userId: req.user.userId }, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'user Controller: logout', 10)
            let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
            res.send(apiResponse)
        }
    })
} // end of the logout function.


let forgotPassword = (req, res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                UserModel.findOne({ email: req.body.email }, (err, retrievedUserDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error('Failed to retrieve data', 'userController:findUser()-password reset', 10);
                        let apiResponse = response.generate(true, 'failed to find user details', 500, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(retrievedUserDetails)) {
                        logger.error('No User Found', 'userController:findUser()-email is not registered', 7)
                        let apiResponse = response.generate(true, 'No user details found, kindly register', 404, null)
                        reject(apiResponse)
                    }
                    else {
                        logger.info('User Found', 'userController:findUser()', 10)
                        console.log('---forgotpassword-finduser()')
                        console.log(retrievedUserDetails)
                        //op: {userId:'',firstName:'',lastName:'',password:'encrypted', email:'',mobileNum:'',permissions:,createdOn: ,_id:7,__v:}

                        let retrievedUserDetailsObj = retrievedUserDetails.toObject();
                        delete retrievedUserDetailsObj.password
                        delete retrievedUserDetailsObj._id
                        delete retrievedUserDetailsObj.__v
                        delete retrievedUserDetailsObj.createdOn
                        delete retrievedUserDetailsObj.modifiedOn
                        resolve(retrievedUserDetailsObj)

                    }
                })
            }
        })
    }

    let generateToken = (userDetails) => {
        console.log('generating token...')
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed to generate token', 500, null)
                    reject(apiResponse)
                }
                else {

                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    console.log('---new token details generrated')
                    console.log(tokenDetails)
                    //o/p: {token:'',tokenSecret:'',userId:'', userDetails:{userId:'',firstName:'',lastName:'',email:'',mobileNumber:''}}
                    resolve(tokenDetails)
                }
            })
        })
    }
    let generateMail = (tokenDetails) => {
        return new Promise((resolve, reject) => {
            if (tokenDetails) {
                let data = {
                    userId: tokenDetails.userId,
                    authToken: tokenDetails.token,
                    userDetails: tokenDetails.userDetails
                }
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'sushantss9151@gmail.com',
                        pass: 'sushantrj@007'

                    }
                });

                var emailOptions = {
                    from: 'Expenses, sushantss9151@gmail.com',
                    //to: tokenDetails.userDetails.email,
                    to: 'chilshetty77@gmail.com',
                    subject: 'Forgot Password Request',
                    //html: 'Hello <strong>' + data.userDetails.firstName + '</strong>,<br><br>You requested for the forgot password. Please find the below link<br><br><a href="www.shivashankarchillshetty.com/newpassword/' + data.userId + '/' + data.authToken + '">Reset password</a><br><br>Thank you<br>Shivashankar<br>CEO, Expense'
                    html: 'Hello <strong>' + data.userDetails.firstName + '</strong>,<br><br>You requested for the forgot password. Please find the below link<br><br><a href="http://localhost:4200/newpassword/' + data.userId + '/' + data.authToken + '">Reset password</a><br><br>Thank you<br>Shivashankar<br>CEO, Expense'
                };

                transporter.sendMail(emailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                resolve(data)

            }
        })
    }



    findUser(req, res)
        .then(generateToken)
        .then(generateMail)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'password reset link sent', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log('error handler');
            console.log(err);
            res.status(err.status)
            res.send(err)
        })

}

let savePassword = (req, res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            if (req.body.password) {
                UserModel.findOne({ userId: req.body.userId }, (err, retrievedUser) => {
                    if (err) {
                        console.log(err);
                        logger.error('failed to retrieve data', 'userController:findUser()', 10)
                        let apiResponse = response.generate(true, 'failed to find user', 500, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(retrievedUser)) {
                        logger.error('No user Found', 'userController:findUser()', 7)
                        let apiResponse = response.generate(true, 'no user found', 404, null)
                        reject(apiResponse)
                    }
                    else {
                        logger.info('User Found', 'userController:findUser()', 10)
                        console.log('------inside savePassword')
                        console.log(retrievedUser)
                        //o/p:{userId:'',firstName:'',lastName:'',password:'',email:'',mobileNumber:,createdOn:,_id,__v}

                        delete retrievedUser._id
                        delete retrievedUser.__v
                        delete retrievedUser.password;
                        retrievedUser.password = passwordLib.hashpassword(req.body.password)
                        retrievedUser.save((err, newPass) => {
                            if (err) {
                                console.log(err)
                                let apiResponse = response.generate(true, 'falied to save password', 500, null)
                                reject(apiResponse);
                            }
                            else {
                                let newObj = newPass.toObject();
                                delete newObj.password;
                                delete newObj._id;
                                delete newObj.__v;

                                resolve(newObj)
                            }
                        })
                    }
                })
            }
            else {
                let apiResponse = response.generate(true, 'password is missing', 400, null);
                reject(apiResponse)
            }
        })
    }

    findUser(req, res)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'new password saved', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
}

module.exports = {
    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    getAllUser: getAllUser,
    getSingleUser: getSingleUser,
    deleteUser: deleteUser,
    editUser: editUser,
    logout: logout,
    forgotPassword: forgotPassword,
    savePassword: savePassword

}