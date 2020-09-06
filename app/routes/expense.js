const express = require('express');
const router = express.Router();
const expenseController = require("./../../app/controllers/expenseController")
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')


module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;
	//app.post(`${baseUrl}/createexpense/:groupId/:expenseName/:createdBy/:updatedBy/:expenseAmount/:members`, expenseController.createExpense);
	app.post(`${baseUrl}/createexpense`, expenseController.createExpense);
	
    /**
     * @apiGroup Expenses
     * @apiVersion  0.1.0
     * @api {post} /api/v1/users/createexpense/:groupId/:expenseName/:createdBy/:updatedBy api for creating new expense.
     *
     * @apiParam {string} groupId groupId-in which group this expense is created, passed as route parameter (required)
     * @apiParam {string} createdBy who created the group passed as route parameter
     * @apiParam {string} updatedBy who updated the group passed as route parameter
     * @apiParam {string} expenseName ExpenseName of the expense passed as route parameter
     * @apiParam {Object} membersWithAmount array of objects containing member name and amount. (body params) (required)
     *
     
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Expense Created",
            "status": 200,
            "data": {
                	createdBy: "ms"
                    createdOn: "2020-07-07T14:13:01.000Z"
                    expenseName: "for api"
                    groupId: "5f047689e1df1624a881ee18"
                    membersWithAmount: [
                        {
                            amount: 11,
                            name: "ms"
                        }
                        {
                            amount: 22, 
                            name: "Suresh"
                        }

                    ]
                    updatedBy: "ms"
                    updatedOn: "2020-07-07T14:13:01.000Z"
            	}

		}
	* @apiErrorExample {json} Error-Response:
	* {
	    "error": true,
	    "message": "Error Occured.,
	    "status": 500,
	    "data": null
	   }
	*/


    app.get(`${baseUrl}/:_id/getExpenseById`, expenseController.getExpenseById);
    /**
	 * @api {get} /api/v1/users/:_id/getExpenseById Get single Expense information
	 * @apiVersion 0.1.0
	 * @apiGroup read
	 *
     * @apiParam {String} _id The expenseId to find particular Expense details.(Send expenseId as  route parameter)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Expense Details Found",
	    "status": 200,
	    "data": {
                	createdBy: "ms"
                    createdOn: "2020-07-07T14:13:01.000Z"
                    expenseName: "Movie expenses"
                    groupId: "5f047689e1df1624a881ee18"
                    membersWithAmount: [
                        {
                            amount: 11,
                            name: "ms"
                        }
                        {
                            amount: 22, 
                            name: "Suresh"
                        }

                    ]
                    updatedBy: "ms"
                    updatedOn: "2020-07-07T14:13:01.000Z"
            	}
		}
	
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Find single Expense details",
	    "status": 500,
	    "data": null
	   }
	 */



    app.get(`${baseUrl}/:groupId/getAllExpenseByGroupId`, expenseController.getAllExpenseByGroupId)
    /**
	 * @api {get} /api/v1/users/:groupId/getAllExpenseByGroupId Get all Expense information by particular groupId
	 * @apiVersion 0.1.0
	 * @apiGroup read
	 *
     * @apiParam {String} groupId The groupId to find particular Expense details.(Send expenseId as route parameter)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Expense Details Found",
	    "status": 200,
	    "data": [{
                	createdBy: "ms"
                    createdOn: "2020-07-07T14:13:01.000Z"
                    expenseName: "Movie expenses"
                    groupId: "5f047689e1df1624a881ee18"
                    membersWithAmount: [
                        {
                            amount: 11,
                            name: "ms"
                        }
                        {
                            amount: 22, 
                            name: "Suresh"
                        }

                    ]
                    updatedBy: "ms"
                    updatedOn: "2020-07-07T14:13:01.000Z"
            	}
		}]
	
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Find all Expense details with groupId",
	    "status": 500,
	    "data": null
	   }
	 */



    app.put(`${baseUrl}/editExpense/:_id`, expenseController.editExpense)
    /**
	 * @api {put} /api/v1/users/editExpense/:_id edit single Expense
	 * @apiVersion 0.1.0
	 * @apiGroup put
	 *
     * @apiParam {String} _id The expenseId for editing particular expense(Send groupId as route parameter)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Expense Details Edited",
	    "status": 200,
	    "data": {
    			expenseName: "for api-edited",
                membersWithAmount:[
                    {
                        name: "ms", amount: "111"
                    }
                    {
                         name: "Suresh", amount: "222"
                    }
                ],
                updatedBy: "ms",
                updatedOn: '2020-07-07T14:31:21Z'	
		}
	
	 * @apiErrorExample {json} Error-Response:
	 * {
	    "error": true,
	    "message": "Failed To edit Expense details",
	    "status": 500,
	    "data": null
	   }
	 */

    app.post(`${baseUrl}/:_id/expenseDelete`, expenseController.deleteExpense)
    /**
	 * @api {post} /api/v1/users/:_id/expenseDelete  delete single expense
	 * @apiVersion 0.1.0
	 * @apiGroup post
	 *
     * @apiParam {String} _id The expenseId for deleting.(Send _id as route parameter)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Expense deleted successfully",
	    "status": 200,
	    "data": []
	
		}
	
	*  @apiErrorExample {json} Error-Response:
	 
	 * {
	    "error": true,
	    "message": "Failed To delete the Expense",
	    "status": 500,
	    "data": null
	   }
	 */
}