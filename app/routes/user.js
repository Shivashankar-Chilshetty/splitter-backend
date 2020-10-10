const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");

const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')


module.exports.setRouter = (app) => {

	let baseUrl = `${appConfig.apiVersion}/users`;


	app.get(`${baseUrl}/view/all/query`, auth.isAuthorized, userController.getAllUser);
	/**
	 * @api {get} /api/v1/users/view/all Get all users
	 * @apiVersion 0.1.0
	 * @apiGroup user
	 * @apiName getUser
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter)
	 *
	 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
	 * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
		 "error": false,
		 "message": "All User Details Found",
		 "status": 200,
		 "data": [
			 	 {
				   "userId": "ic4Wn5pPT",
				   "firstName": "some-user",
				   "lastName": "one-lastname",
				   "email": "someone@mail.com",
				 },
				 {
				   "userId": "gRvcZrjn_",
				   "firstName": "Suresh",
				   "lastName": "Raina",
				   "email": "suresh@gmail.com",
				 }
			]
	   }
	 *  @apiErrorExample {json} Error-Response:
	 * {
		"error": true,
		"message": "Failed To Find all user details",
		"status": 500,
		"data": null
	   }
	 */

	app.get(`${baseUrl}/:userId/details/query`, auth.isAuthorized, userController.getSingleUser);
	/**
	 * @api {get} /api/v1/users/:userId/details Get single users
	 * @apiVersion 0.1.0
	 * @apiGroup user
	 * @apiName getSingleUser
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter)
	 * @apiParam {String} userId The userId to find particular User.(Send userId as  route parameter)
	 *
	 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
	 * @apiSuccessExample {json} Success-Response:
	 *  {
		"error": false,
		"message": "User Details Found",
		"status": 200,
		"data": {
					"_id": "5f261a48e8d64627bcc28f4a",
					"userId": "gRvcZrjn_",
					"firstName": "Suresh",
					"lastName": "Raina",
					"email": "suresh@gmail.com",
					"mobileNumber": 857496321,
					"createdOn": "2020-08-02T01:43:36.000Z",
					"countryCode": "971",
					"__v": 0
				}
			
		}
	
	 * @apiErrorExample {json} Error-Response:
	 *
	 * {
		"error": true,
		"message": "Failed To Find single user details",
		"status": 500,
		"data": null
	   }
	 */



	// params: firstName, lastName, email, mobileNumber, countryCode, password.
	app.post(`${baseUrl}/signup`, userController.signUpFunction);
	/**
	 * @api {post} /api/v1/users/signup api for user signup.
	 * @apiVersion  0.1.0
	 * @apiGroup user
	 * @apiName signup
	 * 
	 * @apiParam {string} firstName firstName of the user. (body params) (required)
	 * @apiParam {string} lastName lastName of the user. (body params) (required)
	 * @apiParam {string} countryCode countryCode of the user. (body params) (required)
	 * @apiParam {number} mobileNumber mobileNumber of the user. (body params) (required)
	 * @apiParam {string} email email of the user. (body params) (required)
	 * @apiParam {string} password password of the user. (body params) (required)
	 *
	 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
	 * 
	 * @apiSuccessExample {object} Success-Response:
		 {
			"error": false,
			"message": "User created",
			"status": 200,
			"data": {
				"userId": "zeBnrgaYI",
				"firstName": "test",
				"lastName": "tlname",
				"validationToken": "",
				"email": "test@gmail.com",
				"mobileNumber": 889977889,
				"createdOn": "2020-10-03T13:50:07.000Z",
				"countryCode": "91",
				"_id": "5f78818ff688b2328869788b",
				"__v": 0
			}
		}

	 *  @apiErrorExample {json} Error-Response:

	 * {
		"error": true,
		"message": "Failed to create new user",
		"status": 500,
		"data": null
	   }

	*/



	app.post(`${baseUrl}/login`, userController.loginFunction);
	/**
	 * @api {post} /api/v1/users/login api for user login.
	 * @apiGroup user
	 * @apiVersion  0.1.0
	 * @apiName login
	 *
	 * @apiParam {string} email email of the user. (body params) (required)
	 * @apiParam {string} password password of the user. (body params) (required)
	 *
	 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
	 * 
	 * @apiSuccessExample {object} Success-Response:
		{
		    "error": false,
		    "message": "Login Successful",
		    "status": 200,
		    "data": {
				"authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6ImNsNklCU2ZlNiIsImlhdCI6MTYwMTczMzY1MDYxOSwiZXhwIjoxNjAxODIwMDUwLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJleHBlbnNlcyIsImRhdGEiOnsidXNlcklkIjoiemVCbnJnYVlJIiwiZmlyc3ROYW1lIjoidGVzdCIsImxhc3ROYW1lIjoidGxuYW1lIiwidmFsaWRhdGlvblRva2VuIjoiIiwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsIm1vYmlsZU51bWJlciI6ODg5OTc3ODg5LCJjb3VudHJ5Q29kZSI6IjkxIn19.65NcSD5dVAmIuLN1KiRbsP8FFhMBMmSboWBV3ESY3Rs",
				"userDetails": {
			      "userId": "zeBnrgaYI",
			      "firstName": "test",
			      "lastName": "tlname",
			      "validationToken": "",
			      "email": "test@gmail.com",
			      "mobileNumber": 889977889,
			      "countryCode": "91"
			    }
		    }
		}
	 *	@apiErrorExample {json} Error-Response:
	 * {
		"error": true,
		"message": "Wrong Passsword.Login Failed",
		"status": 400,
		"data": null
	   }
	*/

	app.put(`${baseUrl}/:userId/edit`, auth.isAuthorized, userController.editUser);
	/**
	 * @api {put} /api/v1/users/:userId/edit edit single users
	 * @apiVersion 0.1.0
	 * @apiGroup user
	 * @apiName editUserDetails
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 * @apiParam {String} userId The userId for editing.(Send userId as route parameter)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
		"error": false,
		"message": "User Edited successfully",
		"status": 200,
		"data": {
					"createdOn": "2018-03-06T13:11:35.000Z",
					"mobileNumber": 2233112233,
					"email": "someoneedited@mail.com",
					"lastName": "one edited",
					"firstName": "some-me",
					"userId": "ic4Wn5pPT"	
				}
			
		}
	
	 * @apiErrorExample {json} Error-Response:
	 * {
		"error": true,
		"message": "Failed To edit single user details",
		"status": 500,
		"data": null
	   }
	 */

	app.post(`${baseUrl}/:userId/delete`, auth.isAuthorized, userController.deleteUser);
	/**
	 * @api {post} /api/v1/users/:userId/delete delete single users
	 * @apiVersion 0.1.0
	 * @apiGroup user
	 * @apiName deleteUser
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 * @apiParam {String} userId The userId for deleting.(Send userId as route parameter)
	 *
	 * @apiSuccessExample {json} Success-Response:
	 *  {
		"error": false,
		"message": "User deleted successfully",
		"status": 200,
		"data": []
	
		}
	
	* @apiErrorExample {json} Error-Response:
	 
	 * {
		"error": true,
		"message": "Failed To delete the user",
		"status": 500,
		"data": null
	   }
	 */

	app.put(`${baseUrl}/forgotpassword`, userController.forgotPassword)
	/**
	 * @api {put} /api/v1/users/forgotpassword reset/forgot the password
	 * @apiVersion 0.1.0
	 * @apiGroup user
	 * @apiName reset-password
	 *
	 * @apiParam {String} email email of the user. (body params) (required)
	 * 
	 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
	 *
	 * @apiSuccessExample {json} Success-Response:
	 *  {
			"error": false,
			"message": "password reset link sent",
			"status": 200,
			"data": {
				"n": 1,
				"nModified": 1,
				"ok": 1
			}
		}
	
	 * @apiErrorExample {json} Error-Response:
	 
	 * {
		"error": true,
		"message": "Failed To reset user Password",
		"status": 500,
		"data": null
	   }
	 */



	app.post(`${baseUrl}/savepassword`, userController.savePassword)
	/**
	  * @api {post} /api/v1/users/savepassword save new password
	  * @apiVersion 0.1.0
	  * @apiGroup user
	  * @apiName save-new-password
	  *
	  * @apiParam {String} validationToken The token for authentication.(Send validationToken as body parameter)
	  * @apiParam {String} password The new password.(Send password as body parameter)
	  *
	  *  @apiSuccessExample {json} Success-Response:
	  *  {
		  "error": false,
		  "message": "Password Update Successfully",
		  "status": 200,
		  "data": {
			"n": 1,
			"nModified": 1,
			"ok": 1
		   }
		}
 	
	  * @apiErrorExample {json} Error-Response:
	  * {
		 "error": true,
		 "message": "Failed To reset user Password'",
		 "status": 500,
		 "data": null
		}
	  */






	app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);
	/**
	 * @api {post} /api/v1/users/logout user logout
	 * @apiVersion 0.1.0
	 * @apiGroup user
	 * @apiName logout
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 *
	 * @apiSuccessExample {json} Success-Response:
	 *  {
		"error": false,
		"message": "User LogedOut successfully",
		"status": 200,
		"data": null
			
		}
	
	 * @apiErrorExample {json} Error-Response:
	 * {
		"error": true,
		"message": "Failed To logout",
		"status": 500,
		"data": null
	   }
	 */

}
