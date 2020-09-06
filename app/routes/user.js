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
	 * @apiGroup read
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "All User Details Found",
	    "status": 200,
	    "data": [
				{
					"createdOn": "2018-03-06T13:11:35.000Z",
                    "mobileNumber": 2233112233,
                    "email": "someone@mail.com",
                    "lastName": "one",
                    "firstName": "some-me",
                    "userId": "ic4Wn5pPT"					
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
	 * @apiGroup read
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
     * @apiParam {String} userId The userId to find particular User.(Send userId as  route parameter)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "User Details Found",
	    "status": 200,
	    "data": {
					"createdOn": "2018-03-06T13:11:35.000Z",
                    "mobileNumber": 2233112233,
                    "email": "someone@mail.com",
                    "lastName": "one",
                    "firstName": "some-me",
                    "userId": "ic4Wn5pPT"	
				}
	    	
		}
	
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Find single user details",
	    "status": 500,
	    "data": null
	   }
	 */



	// params: firstName, lastName, email, mobileNumber, password, apiKey.
	app.post(`${baseUrl}/signup`, userController.signUpFunction);
    /**
     * @apiGroup users
     * @apiVersion  0.1.0
     * @api {post} /api/v1/users/signup api for user signup.
     *
     * @apiParam {string} firstName firstName of the user. (body params) (required)
     * @apiParam {string} lastName lastName of the user. (body params) (required)
     * @apiParam {number} mobileNumber mobileNumber of the user. (body params) (required)
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User Created",
            "status": 200,
            "data": {
                "userDetails": {
                "mobileNumber": 2234435524,
                "email": "someone@mail.com",
                "lastName": "Sengar",
                "firstName": "Rishabh",
                "userId": "-E9zxTYA8"
            }

        }
    */



	app.post(`${baseUrl}/login`, userController.loginFunction);
    /**
     * @apiGroup users
     * @apiVersion  0.1.0
     * @api {post} /api/v1/users/login api for user login.
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
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "userDetails": {
                "mobileNumber": 2234435524,
                "email": "someone@mail.com",
                "lastName": "Sengar",
                "firstName": "Rishabh",
                "userId": "-E9zxTYA8"
            }

        }
    */

	app.put(`${baseUrl}/:userId/edit`, auth.isAuthorized, userController.editUser);
    /**
	 * @api {put} /api/v1/users/:userId/edit edit single users
	 * @apiVersion 0.1.0
	 * @apiGroup put
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
	 * @apiGroup post
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
     * @apiParam {String} userId The userId for deleting.(Send userId as route parameter)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "User deleted successfully",
	    "status": 200,
	    "data": []
	
		}
	
	*  @apiErrorExample {json} Error-Response:
	 
	 * {
	    "error": true,
	    "message": "Failed To delete the user",
	    "status": 500,
	    "data": null
	   }
	 */

	app.put(`${baseUrl}/forgotpassword`, userController.forgotPassword)
    /**
	 * @api {put} /api/v1/users/forgotpassowrd forgot the password
	 * @apiVersion 0.1.0
	 * @apiGroup put
	 *
     * @apiParam {String} email email of the user. (body params) (required)
     * 
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": " password reset link is sent to the your mailId, kindlycheck",
	    "status": 200,
	    "data": {
                "userId": "TwkyXNb4p",
        		"authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6ImtJMVk3aHkydyIsImlhdCI6MTU5NDEyNDU3Mzk4MSwiZXhwIjoxNTk0MjEwOTczLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJleHBlbnNlcyIsImRhdGEiOnsidXNlcklkIjoiVHdreVhOYjRwIiwiZmlyc3ROYW1lIjoibXMiLCJsYXN0TmFtZSI6IkRob25pIiwiZW1haWwiOiJkaG9uaUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjkxMTEyMjMzNjY1NX19.W_wmRq32PIDe7KGrh56ICa0kCGDsI5PHZT5hRLQlH04",
        		"userDetails": {
            		"userId": "TwkyXNb4p",
            		"firstName": "ms",
            		"lastName": "Dhoni",
            		"email": "dhoni@gmail.com",
            		"mobileNumber": 911122336655
        		}
	    	
		}
	
	 * @apiErrorExample {json} Error-Response:
	 
	 * {
	    "error": true,
	    "message": "Failed To send forgot password link",
	    "status": 500,
	    "data": null
	   }
	 */

	app.post(`${baseUrl}/savepassword`, userController.savePassword)
	/**
	  * @api {post} /api/v1/users/savepassword save new password
	  * @apiVersion 0.1.0
	  * @apiGroup post
	  *
	  * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	  * @apiParam {String} userId The userId for saving new password.(Send userId as body parameter)
	  * @apiParam {String} newpassword The password for saving new password.(Send password ,body parameter)
	  *
	  *  @apiSuccessExample {json} Success-Response:
	  *  {
		 "error": false,
		 "message": "New Password saved successfully",
		 "status": 200,
		 "data": {
					 "userId": "TwkyXNb4p",
					 "firstName": "ms",
					 "lastName": "Dhoni",
					 "email": "dhoni@gmail.com",
					 "mobileNumber": 911122336655,
					 "createdOn": "2020-07-06T00:26:26.000Z"	
				 }
		 	
		 }
 	
	  * @apiErrorExample {json} Error-Response:
	  * {
		 "error": true,
		 "message": "Failed To save new password",
		 "status": 500,
		 "data": null
		}
	  */






	app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);
    /**
	 * @api {post} /api/v1/users/logout user logout
	 * @apiVersion 0.1.0
	 * @apiGroup post
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "User LogedOut successfully",
	    "status": 200,
	    "data": null
	    	
		}
	
	 *  @apiErrorExample {json} Error-Response:
	 
	 * {
	    "error": true,
	    "message": "Failed To logout",
	    "status": 500,
	    "data": null
	   }
	 */





	




}
