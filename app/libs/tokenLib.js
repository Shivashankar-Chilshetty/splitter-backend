const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const secretKey = 'expensesplittersecretcode';

let generateToken = (data, cb)=>{
    try{
        let claims = {
            jwtid : shortid.generate(),
            iat : Date.now(),
            exp : Math.floor(Date.now()/1000)+(60*60*24),
            sub : 'authToken',
            iss : 'expenses',
            data : data
        }
        let tokenDetails = {
            token : jwt.sign(claims,secretKey),
            tokenSecret : secretKey
        }
        cb(null, tokenDetails)
    }
    catch(err){
        console.log(err)
        cb(err, null)
    }
}

let verifyClaim = (token, secretKey, cb)=>{
    jwt.verify(token, secretKey, function(err, decoded){
        if(err){
            console.log("error while verify token");
            console.log(err);
            cb(err, null)
        }
        else{
            console.log("User verified");
            //console.log(decoded);
            cb(null, decoded);
        }
    })
}

let verifyClaimsWithoutSecret = (token, cb)=>{
    jwt.verify(token, secretKey, (err, decoded)=>{
        if(err){
            console.log('error while verifying token')
            console.log(err)
            cb(err, data)
        }
        else{
            console.log('User-verified')
            //console.log(decoded)
            cb(null, decoded)
        }
    })
}

module.exports={
    generateToken : generateToken,
    verifyToken : verifyClaim,
    verifyClaimsWithoutSecret : verifyClaimsWithoutSecret
}