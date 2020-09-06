const mongoose = require('mongoose');
const time = require('./../libs/timeLib')
const response = require('./../libs/responseLib')
const check = require('./../libs/checkLib')
const logger = require('./../libs/loggerLib')
const UserModel = mongoose.model('User');
const GroupModel = mongoose.model('Group');
const ExpenseModel = mongoose.model('Expense');

let getAllExpense = (req, res) => {
    ExpenseModel.find({}, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Expense Controller: getAllExpense', 10)
            let apiResponse = response.generate(true, 'Failed To Find Expense Details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Expense Found', 'Expense Controller: getAllExpense')
            let apiResponse = response.generate(true, 'No Expense Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'All Expenses Details Found', 200, result)
            res.send(apiResponse)
        }
    })

}// end get all Expenses


let getExpenseById = (req, res) => {

    ExpenseModel.find({ '_id': req.params._id }, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Expense Controller:getExpensesById', 500, null)
            let apiResponse = response.generate(true, 'failed to find the Expense details', 500, null)
            res.send(apiResponse)
        }
        else if (check.isEmpty(result)) {
            logger.info('No Expense Found', 'Expense Controller:getAllExpensesByGroupId')
            let apiResponse = response.generate(true, 'No Expense Found', 404, null)
            res.send(apiResponse)
        }
        else {
            let apiResponse = response.generate(false, 'Expense details by Id found', 200, result)
            res.send(apiResponse)
        }
    })
}



let getAllExpenseByGroupId = (req, res) => {

    ExpenseModel.find({ 'groupId': req.params.groupId }, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Expense Controller:getAllExpensesByGroupId', 500, null)
            let apiResponse = response.generate(true, 'failed to find the Expense details', 500, null)
            res.send(apiResponse)
        }
        else if (check.isEmpty(result)) {
            logger.info('No Expense Found', 'Expense Controller:getAllExpensesByGroupId')
            let apiResponse = response.generate(true, 'No Expense Found', 404, null)
            res.send(apiResponse)
        }
        else {
            let apiResponse = response.generate(false, 'Expense details by Group Id found', 200, result)
            res.send(apiResponse)
        }
    })
}

let deleteExpense = (req, res) => {

    ExpenseModel.findOneAndRemove({ '_id': req.params._id }, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Expense Controller: deleteExpense', 10)
            let apiResponse = response.generate(true, 'Failed To delete the Expense', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Expense Found', 'Expense Controller: deleteExpense')
            let apiResponse = response.generate(true, 'No Expense Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the Expense successfully', 200, result)
            res.send(apiResponse)
        }
    });// end Expense model find and remove


}// end delete Expense



let editExpense = (req, res) => {

    req.body.updatedOn = time.now()
    req.body.updatedBy = req.body.updatedBy
    req.body.membersWithAmount = req.body.membersWithAmount
    console.log(req.body)
    console.log(req.body.membersWithAmount)
    let options = req.body;

    ExpenseModel.updateOne({ '_id': req.params._id }, options, { new: true }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Expense Controller:editExpense', 10)
            let apiResponse = response.generate(true, 'Failed To edit Expense details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Expense Found', 'Expense Controller: editExpense')
            let apiResponse = response.generate(true, 'No Expense Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Expense details edited', 200, result)
            res.send(apiResponse)
        }
    });// end Expense model update*/


}// end edit Expense










/*let createExpense = (req, res) => {

    
    let x = req.body
    console.log('--body--')
    console.log(Array.isArray(x))
    let newExpenseDetails = new ExpenseModel({
        expenseName: req.params.expenseName,
        groupId: req.params.groupId,
        createdOn: time.now(),
        createdBy: req.params.createdBy,
        updatedOn: time.now(),
        updatedBy: req.params.updatedBy,
        expenseAmount: req.params.expenseAmount,
        members : req.params.members
    })
    let obj = []
    let mem=(req.params.members!=undefined && req.params.members!=null && req.params.members!='')?req.params.members.split(','):[]
    newExpenseDetails.members = mem

    /*for (i in x) {
        let resobj = {
            name: `${i}`,
            amount: x[i]
        }
        obj.push(resobj)
        console.log(obj)
    }*/
    /*for(let i in x){
        let resObj = {
            from : `${x[i].from}`,
            to : `${x[i].to}`,
            amount : x[i].amount
        }
        obj.push(resObj)
        
    }
    console.log('savng obj')
    console.log(obj)
    newExpenseDetails.membersWithAmount = obj
    newExpenseDetails.save((err, newExpenseDetails) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'expenseController:createExpense()', 10)
            let apiResponse = response.generate(true, 'failed to create new group', 500, null)
            reject(apiResponse)
        }
        else {
            let apiResponse = response.generate(false, 'Expense Created', 200, newExpenseDetails)
            console.log(apiResponse)
            res.send(apiResponse)


        }
    })
}*/






let createExpense = (req, res) => {


    console.log(req.body)
    let x = JSON.stringify(req.body.membersWithAmount)
    console.log(x)               
    console.log(typeof(x))      

    let y = JSON.parse(x)
    console.log(y)            
    console.log(typeof(y))    
    console.log(y[0])        
    console.log(y[1]) 


    let a = JSON.stringify(req.body.users)
    console.log(a)               //o/p : "[object Object],[object Object],[object Object],[object Object]"
    console.log(typeof(a))      //string

    let b = JSON.parse(a)
    console.log(b)            //[object Object],[object Object],[object Object],[object Object]
    console.log(typeof(b))    //string
    console.log(b[0])        // o/p : [
    console.log(b[1])        // o/p : o


    /*let newExpenseDetails = new ExpenseModel({
        expenseName: req.body.expenseName,
        groupId: req.body.groupId,
        createdOn: time.now(),
        createdBy: req.body.createdBy,
        updatedOn: time.now(),
        updatedBy: req.body.updatedBy,
        expenseAmount: req.body.expenseAmount,
        membersWithAmount : req.body.membersWithAmount,
        users : req.params.users
    })*/






    /*let some = req.body.users.split(',')
    console.log(some)
    console.log(Array.isArray(some))*/

    //approach 1
   /* var str= some[0]
    console.log(str)
    console.log(typeof(str))
    console.log(JSON.stringify(str))*/


    /*
    var parsed = JSON.parse(str[0]); 
    console.log(parsed)
    var user = parsed[0];         
    console.log(parsed.name); */
    
    
    //console.log(req.body.users[0][1])

    //console.log(req.body.groupId[0])
    //let a=req.body.users.split(',')
    /*a.forEach(element => { 
        let r = element.split('}')
        console.log(r[0].split(':'))
        console.log(typeof(r[0]))
        //console.log(element.length)
        console.log(typeof(element)); 
      }); */
    

    /*console.log(req.body)
    console.log(req.body.expenseName)
    console.log(req.body.membersWithAmount)
    console.log(""+req.body.users) 
    console.log("request: "+JSON.stringify(req.body.users));
    console.log(req.body.users)*/
    
    
    
    

    
    
    
    /*for(let i in d){

        let a=d[i].split(',')
        console.log(a)
        console.log(a.name)
        //console.log(d[i])
    }*/
   

    /*for(let i in data){
        //console.log(i)
        //console.log(data[i])
        for(let j in data[i]){
            let mem=data[i][j].split(',')

            console.log(data[i][j])
        }
    }
    
    console.log("request: "+JSON.stringify(req.body.users));
    console.log("request: "+JSON.stringify(req.body.membersWithAmount));
     let  d=req.body.users.split(',')
    console.log(d)*/
    
    
    


    

    
}









module.exports = {
    createExpense: createExpense,
    getAllExpense: getAllExpense,
    getAllExpenseByGroupId: getAllExpenseByGroupId,
    editExpense: editExpense,
    deleteExpense: deleteExpense,
    getExpenseById: getExpenseById
}