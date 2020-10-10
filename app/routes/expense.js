const express = require('express');
const router = express.Router();
const expenseController = require("./../../app/controllers/expenseController")
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')


module.exports.setRouter = (app) => {

	let baseUrl = `${appConfig.apiVersion}/users`;

	app.post(`${baseUrl}/createexpense/:authToken`, auth.isAuthorized, expenseController.createExpense);
	/**
   * @api {post} /api/v1/users/createexpense/:authToken api to create a expense.
   * @apiVersion  0.1.0
   * @apiGroup expense
   * @apiName createExpense
   * 
   * @apiParam {String} expenseName Name of the expense. (body params) (required)
   * @apiParam {Number} expenseAmount Amount for the expense. (body params) (required)
   * @apiParam {String} groupId group Id for the expense. (body params) (required)
   * @apiParam {Object} paidArray This array contains the list of paid user details along with their paid share(body params) (required)
   * @apiParam {Object} owedArray This array contains the list of owed user details along with their owed share(body params) (required)
   * @apiParam {String} authToken The token for authentication.(Send authToken as route parameter)
   * 
   * @apiSuccess {object} myResponse shows error status, message, http status code, result.
   * 
   * @apiSuccessExample {json} Success-Response:
   * {
		"error": false,
		"message": "Expense created",
		"status": 200,
		"data": {
			"createdBy": {
				"userId": "Rhtqust67",
				"name": "user 1",
				"email": "user1@gmail.com"
			},
			"updatedBy": {
				"userId": "Rhtqust67",
				"name": "user 1",
				"email": "user1@gmail.com"
			},
			"deletedBy": {
				"name": "",
				"userId": "",
				"email": ""
			},
			"expenseName": "test",
			"groupId": "5f7961a57cd5e43a00537cd3",
			"createdOn": "2020-10-05T03:32:05.000Z",
			"updatedOn": "2020-10-05T03:32:05.000Z",
			"deletedOn": null,
			"expenseAmount": 700,
			"_id": "5f7a93b5b1f47a52b8360f98",
			"paidArray": [
				{
				"userId": "Rhtqust67",
				"name": "user1",
				"email": "user1@gmail.com",
				"amount": 700,
				"_id": "5f7a93b5b1f47a52b8360f99"
				}
			],
			"owedArray": [
				{
				"userId": "Rhtqus2ss7",
				"name": "user2",
				"email": "user2@gmail.com",
				"amount": 700,
				"_id": "5f7a93b5b1f47a52b8360f9a"
				}
			],
			"__v": 0
		}	
	}
   * 
   *
   * @apiErrorExample {json} Error-Response:
   * {
		"error": true,
		"message": "faied to create expense",
		"status": 500,
		"data": null
	 }
   * 
   */



	app.get(`${baseUrl}/:_id/getExpenseById/:authToken`, auth.isAuthorized, expenseController.getExpenseById);
	/**
   * @api {get} /api/v1/users/:_id/getExpenseById/:authToken get particular expense by expenseId
   * @apiVersion 0.1.0
   * @apiGroup expense
   * @apiName getExpenseById
   *
   * @apiParam {String} _id The expense Id to fetch the particular expense details.(Send expense Id as a route parameter)
   * @apiParam {String} authToken The token for authentication.(Send authToken as a router parameter)
   *
   * @apiSuccessExample {json} Success-Response:
   * {
			"error": false,
			"message": "Expense details by Id found",
			"status": 200,
			"data": {
				"createdBy": {
				"name": "user1",
				"userId": "Rhtqust67",
				"email": "user1@gmail.com"
				},
				"updatedBy": {
				"name": "user1",
				"userId": "Rhtqust67",
				"email": "user1@gmail.com"
				},
				"deletedBy": {
				"name": "",
				"userId": "",
				"email": ""
				},
				"expenseName": "test",
				"groupId": "5f7961a57cd5e43a00537cd3",
				"createdOn": "2020-10-05T05:04:21.000Z",
				"updatedOn": "2020-10-05T05:04:21.000Z",
				"deletedOn": null,
				"expenseAmount": 100,
				"_id": "5f7aa955b1f47a52b8360f9b",
				"paidArray": [
				{
				"userId": "Rhtqust67",
				"name": "user1",
				"email": "user1@gmail.com",
				"amount": 3000,
				"_id": "5f7aa955b1f47a52b8360f9c"
				}
				],
				"owedArray": [
				{
				"userId": "Rhtqus2ss7",
				"name": "user2",
				"email": "user2@gmail.com",
				"amount": 200,
				"_id": "5f7aa955b1f47a52b8360f9d"
				}
				],
				"__v": 0
			}
	}
   * 
   * @apiErrorExample {json} Error-Response:
   * {
		"error": true,
		"message": "failed to find the Expense details",
		"status": 500,
		"data": null
	 }
   * 
   * 
   */


	app.get(`${baseUrl}/:groupId/getAllExpenseByGroupId/:authToken`, auth.isAuthorized, expenseController.getAllExpenseByGroupId)
	/**
   * @api {get} /api/v1/users/:groupId/getAllExpenseByGroupId/:authToken get all expense details by particular group Id
   * @apiVersion 0.1.0
   * @apiGroup expense
   * @apiName getExpenseByGroupId
   *
   * @apiParam {String} groupId The group Id to fetch all expense details which belongs to that particular group.(Send group Id as a route parameter)
   * @apiParam {String} authToken The token for authentication.(Send authToken as a router parameter)
   *
   * @apiSuccessExample {json} Success-Response:
   * {
		"error": false,
		"message": "All Expense details by Group Id found",
		"status": 200,
		"data": [
		{
			"createdBy": {
				"name": "user1",
				"userId": "Rhtqust67",
				"email": "user1@gmail.com"
			},
			"updatedBy": {
				"name": "user1",
				"userId": "Rhtqust67",
				"email": "user1@gmail.com"
			},
			"deletedBy": {
				"name": "",
				"userId": "",
				"email": ""
			},
			"expenseName": "expense 1",
			"groupId": "5f7482943e8a7e25dc1bf1f5",
			"createdOn": "2020-09-30T13:06:45.000Z",
			"updatedOn": "2020-10-03T05:46:54.000Z",
			"deletedOn": null,
			"expenseAmount": 150,
			"_id": "5f7482e53e8a7e25dc1bf1fe",
			"paidArray": [
				{
					"userId": "Rhtqust67",
					"name": "user1",
					"email": "user1@gmail.com",
					"amount": 0,
					"_id": "5f78104e52031112542131a4"
				},
				{
					"userId": "gRvcZrjn_",
					"name": "user2",
					"email": "user2@gmail.com",
					"amount": 0,
					"_id": "5f78104e52031112542131a5"
				},
				{
					"userId": "j_ojpBrVH",
					"name": "user3",
					"email": "user3@gmail.com",
					"amount": 150,
					"_id": "5f78104e52031112542131a6"
				}
			],
			"owedArray": [
				{
					"userId": "Rhtqust67",
					"name": "user1",
					"email": "user1@gmail.com",
					"amount": 50,
					"_id": "5f78104e52031112542131a7"
				},
				{
					"userId": "gRvcZrjn_",
					"name": "user2",
					"email": "user2@gmail.com",
					"amount": 50,
					"_id": "5f78104e52031112542131a8"
				},
				{
					"userId": "j_ojpBrVH",
					"name": "user3",
					"email": "user3@gmail.com",
					"amount": 50,
					"_id": "5f78104e52031112542131a9"
				}
			],
			"__v": 0
		},
		{
			"createdBy": {
				"name": "user1",
				"userId": "Rhtqust67",
				"email": "user1@gmail.com"
			},
			"updatedBy": {
				"name": "user1",
				"userId": "Rhtqust67",
				"email": "user1@gmail.com"
			},
			"deletedBy": {
				"name": "",
				"userId": "",
				"email": ""
			},
			"expenseName": "expense 2",
			"groupId": "5f7482943e8a7e25dc1bf1f5",
			"createdOn": "2020-09-30T13:07:23.000Z",
			"updatedOn": "2020-09-30T13:07:23.000Z",
			"deletedOn": null,
			"expenseAmount": 200,
			"_id": "5f74830b3e8a7e25dc1bf206",
			"paidArray": [
				{
					"userId": "Rhtqust67",
					"name": "user1",
					"email": "user1@gmail.com",
					"amount": 0,
					"_id": "5f74830b3e8a7e25dc1bf207"
				},
				{
					"userId": "gRvcZrjn_",
					"name": "user2",
					"email": "user2@gmail.com",
					"amount": 200,
					"_id": "5f74830b3e8a7e25dc1bf208"
				},
				{
					"userId": "j_ojpBrVH",
					"name": "user3",
					"email": "user3@gmail.com",
					"amount": 0,
					"_id": "5f74830b3e8a7e25dc1bf209"
				}
			],
			"owedArray": [
				{
					"userId": "Rhtqust67",
					"name": "user1",
					"email": "user1@gmail.com",
					"amount": 66.66,
					"_id": "5f74830b3e8a7e25dc1bf20a"
				},
				{
					"userId": "gRvcZrjn_",
					"name": "user2",
					"email": "user2@gmail.com",
					"amount": 66.66,
					"_id": "5f74830b3e8a7e25dc1bf20b"
				},
				{
					"userId": "j_ojpBrVH",
					"name": "user3",
					"email": "user3@gmail.com",
					"amount": 66.66,
					"_id": "5f74830b3e8a7e25dc1bf20c"
				}
			],
			"__v": 0
		}
		]
	}
   * 
   * @apiErrorExample {json} Error-Response:
   * {
		"error": true,
		"message": "failed to find the Expense details",
		"status": 500,
		"data": null
	}
   * 
   */

	app.get(`${baseUrl}/getAllExpensesByGroupIdsArray/query`, auth.isAuthorized, expenseController.getAllExpensesByGroupIds)
	/**
   * @api {get} /api/v1/users/getAllExpensesByGroupIdsArray/query  gets all the expense details, by matching all groupId present in an array
   * @apiVersion 0.1.0
   * @apiGroup expense
   * @apiName getExpenseByGroupIdArray
   *
   * @apiParam {Object} groupArray The array containing the groupId's.(Send group array as a query parameter)
   * @apiParam {String} authToken The token for authentication.(Send authToken as a router or query or headers)
   *
   * @apiSuccessExample {json} Success-Response:
   * 
   * {
	 "error": false,
	 "message": "Expense details by Group Id's array found",
	 "status": 200,
	 "data": [
		{
			"groupId": "5f7482943e8a7e25dc1bf1f5",
			"paidArray": [
				{
					"userId": "Rhtqust67",
					"name": "user1",
					"email": "user1@gmail.com",
					"amount": 0,
					"_id": "5f78104e52031112542131a4"
				},
				{
					"userId": "gRvcZrjn_",
					"name": "user2",
					"email": "user2@gmail.com",
					"amount": 0,
					"_id": "5f78104e52031112542131a5"
				},
				{
					"userId": "j_ojpBrVH",
					"name": "user3",
					"email": "user3@gmail.com",
					"amount": 150,
					"_id": "5f78104e52031112542131a6"
				}
			],
			"owedArray": [
				{
					"userId": "Rhtqust67",
					"name": "user1",
					"email": "user1@gmail.com",
					"amount": 50,
					"_id": "5f78104e52031112542131a7"
				},
				{
					"userId": "gRvcZrjn_",
					"name": "user2",
					"email": "user2@gmail.com",
					"amount": 50,
					"_id": "5f78104e52031112542131a8"
				},
				{
					"userId": "j_ojpBrVH",
					"name": "user3",
					"email": "user3@gmail.com",
					"amount": 50,
					"_id": "5f78104e52031112542131a9"
				}
			]
		},
		{
			"groupId": "5f7482943e8a7e25dc1bf1f5",
			"paidArray": [
				{
					"userId": "Rhtqust67",
					"name": "user1",
					"email": "user1@gmail.com",
					"amount": 0,
					"_id": "5f74830b3e8a7e25dc1bf207"
				},
				{
					"userId": "gRvcZrjn_",
					"name": "user2",
					"email": "user2h@gmail.com",
					"amount": 200,
					"_id": "5f74830b3e8a7e25dc1bf208"
				},
				{
					"userId": "j_ojpBrVH",
					"name": "user3",
					"email": "user3@gmail.com",
					"amount": 0,
					"_id": "5f74830b3e8a7e25dc1bf209"
				}
			],
			"owedArray": [
				{
					"userId": "Rhtqust67",
					"name": "user1",
					"email": "user1@gmail.com",
					"amount": 66.66,
					"_id": "5f74830b3e8a7e25dc1bf20a"
				},
				{
					"userId": "gRvcZrjn_",
					"name": "user2",
					"email": "user2@gmail.com",
					"amount": 66.66,
					"_id": "5f74830b3e8a7e25dc1bf20b"
				},
				{
					"userId": "j_ojpBrVH",
					"name": "user3",
					"email": "user3@gmail.com",
					"amount": 66.66,
					"_id": "5f74830b3e8a7e25dc1bf20c"
				}
			]
		},
		{
			"groupId": "5f7961a57cd5e43a00537cd3",
			"paidArray": [
				{
					"userId": "Rhtqust67",
					"name": "user1",
					"email": "user1@gmail.com",
					"amount": 3000,
					"_id": "5f7a93b5b1f47a52b8360f99"
				}
			],
			"owedArray": [
				{
					"userId": "Rhtqus2ss7",
					"name": "user2",
					"email": "user2@gmail.com",
					"amount": 3000,
					"_id": "5f7a93b5b1f47a52b8360f9a"
				}
			]
		 }
		]
	}
   * 
   *  @apiErrorExample {json} Error-Response:
   * {
		"error": true,
		"message": "failed to find the Expense details",
		"status": 500,
		"data": null
	 }
   * 
   */




	app.put(`${baseUrl}/editExpense/:_id/:authToken`, auth.isAuthorized, expenseController.editExpense)
	/**
	 * @api {put} /api/v1/users/editExpense/:_id/:authToken api to edit a expense
	 * @apiVersion 0.1.0
	 * @apiGroup expense
	 * @apiName editExpenseDetails
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as route parameter)
	 * @apiParam {String} _id The expenseId for editing.(Send expenseId as route parameter)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 * 
	 * {
		"error": false,
		"message": "Expense details edited successfully",
		"status": 200,
		"data": {
			"createdBy": {
				"name": "user1",
				"userId": "Rhtqust67",
				"email": "user177@gmail.com"
			},
			"updatedBy": {
				"name": "user1",
				"userId": "Rhtqust67",
				"email": "user1@gmail.com"
			},
			"deletedBy": {
				"name": "",
				"userId": "",
				"email": ""
			},
			"expenseName": "test",
			"groupId": "5f7961a57cd5e43a00537cd3",
			"createdOn": "2020-10-05T03:32:05.000Z",
			"updatedOn": "2020-10-05T08:45:16.000Z",
			"deletedOn": null,
			"expenseAmount": 100,
			"_id": "5f7a93b5b1f47a52b8360f98",
			"paidArray": [
				{
				"userId": "Rhtqust67",
				"name": "user1",
				"email": "user1@gmail.com",
				"amount": 2000,
				"_id": "5f7add1cff70e12df8db41bd"
				}
			],
			"owedArray": [
				{
				"userId": "Rhtqus2ss7",
				"name": "user3",
				"email": "user3@gmail.com",
				"amount": 200,
				"_id": "5f7add1cff70e12df8db41be"
				}
			],
			"__v": 0
		  }
		}
	 * 
	 * @apiErrorExample {json} Error-Response:
	 * {
		"error": true,
		"message": "Failed To edit Expense details",
		"status": 500,
		"data": null
	   }
	 * 
	 * 
	 * 
	 * 
	 */


	app.post(`${baseUrl}/:_id/expenseDelete/:authToken`, auth.isAuthorized, expenseController.deleteExpense)
	/**
	 * @api {post} /api/v1/users/:_id/expenseDelete/:authToken delete the expense
	 * @apiVersion 0.1.0
	 * @apiGroup expense
	 * @apiName deleteExpense
	 * @apiParam {String} authToken The token for authentication.(Send authToken as route parameter)
	 * @apiParam {String} _id The expenseId for deleting the expense.(Send _id as route parameter)
	 * 
	 * @apiSuccessExample {json} Success-Response:
	 * {
		"error": false,
		"message": "Deleted the Expense successfully",
		"status": 200,
		"data": {
			"createdBy": {
				"name": "user1",
				"userId": "Rhtqust67",
				"email": "user1@gmail.com"
			},
			"updatedBy": {
				"name": "user1",
				"userId": "Rhtqust67",
				"email": "user1@gmail.com"
			},
			"deletedBy": {
				"name": "user3",
				"userId": "Shtqust67",
				"email": "user3@gmail.com"
			},
			"expenseName": "test-edited",
			"groupId": "5f7961a57cd5e43a00537cd3",
			"createdOn": "2020-10-05T03:32:05.000Z",
			"updatedOn": "2020-10-05T08:45:39.000Z",
			"deletedOn": "2020-10-05T09:18:17.000Z",
			"expenseAmount": 100,
			"_id": "5f7a93b5b1f47a52b8360f98",
			"paidArray": [
				{
				"userId": "Rhtqust67",
				"name": "user1",
				"email": "user1@gmail.com",
				"amount": 2000,
				"_id": "5f7add33ff70e12df8db41bf"
				}
			],
			"owedArray": [
				{
				"userId": "Rhtqus2ss7",
				"name": "user3",
				"email": "user3@gmail.com",
				"amount": 200,
				"_id": "5f7add33ff70e12df8db41c0"
				}
			],
			"__v": 0
		  }
		}
	 * 
	 * @apiErrorExample {json} Error-Response:
	 * {
		"error": true,
		"message": "Failed To delete the Expense",
		"status": 500,
		"data": null
	   }
	 * 
	 * 
	 */


}