const express = require('express');
const router = express.Router();
const appConfig = require("./../../config/appConfig")
const groupController = require("./../../app/controllers/groupController")
const auth = require('./../middlewares/auth')


module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    app.post(`${baseUrl}/creategroup`, auth.isAuthorized, groupController.createGroup);
    /**
     * @apiGroup Groups
     * @apiVersion  0.1.0
     * @api {post} /api/v1/users/creategroup api for creating new group.
     *
     * @apiParam {string} groupName groupName of the new group. (body params) (required)
     * @apiParam {string} createdBy who created the group taken from the cookie details 
     * @apiParam {number} createdOn time of creation of the group. 
     * @apiParam {string} email email of the user who is creating the group. 
     * @apiParam {Object} members array containing members in the form of userId. (body params) (required)
     *
     
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Group Created",
            "status": 200,
            "data": {
                    createdBy: "ms"
                    createdOn: "2020-07-07T13:20:09.000Z"
                    email: "dhoni@gmail.com"
                    groupName: "api"
                    members: [
                        0: "lpM7TPI1J"
                        1: "TwkyXNb4p"
                    ]
                    updatedBy: "ms"
                    updatedOn: "2020-07-07T13:20:09.000Z"
                    _id: "5f047689e1df1624a881ee18"
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



    app.get(`${baseUrl}/:_id/getSingleGroup/:authToken`, auth.isAuthorized, groupController.getSingleGroup)
    /**
     * @api {get} /api/v1/users/:Id/getSingleGroup/:authToken Get single group information
     * @apiVersion 0.1.0
     * @apiGroup read
     *
     * @apiParam {String} authToken The token for authentication.(Send authToken as route parameter, body parameter or as a header)
     * @apiParam {String} groupId The groupId to find particular group.(Send groupId as  route parameter)
     *
     *  @apiSuccessExample {json} Success-Response:
     *  {
        "error": false,
        "message": "Group Details Found",
        "status": 200,
        "data": [
                  {
                    _id: 5f047689e1df1624a881ee18,
                    groupName: 'api',
                    email: 'dhoni@gmail.com',
                    createdOn: 2020-07-07T13:20:09.000Z,
                    createdBy: 'ms',
                    updatedOn: 2020-07-07T13:20:09.000Z,
                    members: [ 'lpM7TPI1J', 'TwkyXNb4p' ],
                    updatedBy: 'ms',
                    __v: 0,
                    groupMembers: [ 
                        {
                        createdOn: "2020-07-06T00:26:26.000Z"
                        email: "dhoni@gmail.com"
                        firstName: "ms"
                        lastName: "Dhoni"
                        mobileNumber: 911122336655
                        userId: "TwkyXNb4p"					 ]
                        },
                        {
                        createdOn: "2020-07-06T00:26:26.000Z"
                        email: "suresh@gmail.com"
                        firstName: "suresh"
                        lastName: "Raina"
                        mobileNumber: 911122336655
                        userId: "Xmusdjnf"					 ]
                          }
                    ]
                }
            ]
        }
    
      @apiErrorExample {json} Error-Response:
     *
     * {
        "error": true,
        "message": "Failed To Find single Group details",
        "status": 500,
        "data": null
       }
     */



    app.put(`${baseUrl}/:_id/groupEdit`, auth.isAuthorized, groupController.editGroup)
    /**
     * @api {put} /api/v1/users/:_id/groupEdit edit single group
     * @apiVersion 0.1.0
     * @apiGroup put
     *
     * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
     * @apiParam {String} groupId The groupId for editing.(Send groupId as route parameter)
     *
     *  @apiSuccessExample {json} Success-Response:
     *  {
        "error": false,
        "message": "Group Details Edited",
        "status": 200,
        "data": [
                  {
                    _id: 5f047689e1df1624a881ee18,
                    groupName: 'api-edited',
                    email: 'dhoni@gmail.com',
                    createdOn: 2020-07-07T13:20:09.000Z,
                    createdBy: 'ms',
                    updatedOn: 2020-07-07T13:20:09.000Z,
                    members: [ 'lpM7TPI1J', 'TwkyXNb4p' ],
                    updatedBy: 'suresh',
                    __v: 0,
                    groupMembers: [ 
                        {
                        createdOn: "2020-07-06T00:26:26.000Z"
                        email: "dhoni@gmail.com"
                        firstName: "ms"
                        lastName: "Dhoni"
                        mobileNumber: 911122336655
                        userId: "TwkyXNb4p"					 ]
                        },
                        {
                        createdOn: "2020-07-06T00:26:26.000Z"
                        email: "suresh@gmail.com"
                        firstName: "suresh"
                        lastName: "Raina"
                        mobileNumber: 911122336655
                        userId: "Xmusdjnf"					 ]
                          }
                    ]
                }
            ]
        }
    
     * @apiErrorExample {json} Error-Response:
     * {
        "error": true,
        "message": "Failed To edit Group details",
        "status": 500,
        "data": null
       }
     */


    app.post(`${baseUrl}/:_id/groupDelete/:authToken`, auth.isAuthorized, groupController.deleteGroup)
    /**
     * @api {post} /api/v1/users/:_id/groupDelete/:authToken delete single group
     * @apiVersion 0.1.0
     * @apiGroup post
     *
     * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
     * @apiParam {String} _id The groupId for deleting.(Send _id as route parameter)
     *
     *  @apiSuccessExample {json} Success-Response:
     *  {
        "error": false,
        "message": "Group deleted successfully",
        "status": 200,
        "data": []
    
        }
    
    *  @apiErrorExample {json} Error-Response:
     
     * {
        "error": true,
        "message": "Failed To delete the Group",
        "status": 500,
        "data": null
       }
     */


    app.get(`${baseUrl}/getAllGroupByUser/:authToken`, auth.isAuthorized, groupController.getAllGroupByUser)
    /**
     * @api {get} /api/v1/users/getALlGroupByUser/:authToken Get all group information
     * @apiVersion 0.1.0
     * @apiGroup read
     *
     * @apiParam {String} authToken The token for authentication.(Send authToken as route parameter, body parameter or as a header)
     *
     *  @apiSuccessExample {json} Success-Response:
     *  {
        "error": false,
        "message": "All Group Details Found",
        "status": 200,
        "data": [
                  {
                    _id: 5f047689e1df1624a881ee18,
                    groupName: 'api',
                    email: 'dhoni@gmail.com',
                    createdOn: 2020-07-07T13:20:09.000Z,
                    createdBy: 'ms',
                    updatedOn: 2020-07-07T13:20:09.000Z,
                    members: [ 'lpM7TPI1J', 'TwkyXNb4p' ],
                    updatedBy: 'ms',
                    __v: 0,
                    groupMembers: [ 
                        {
                        createdOn: "2020-07-06T00:26:26.000Z"
                        email: "dhoni@gmail.com"
                        firstName: "ms"
                        lastName: "Dhoni"
                        mobileNumber: 911122336655
                        userId: "TwkyXNb4p"					 ]
                        },
                        {
                        createdOn: "2020-07-06T00:26:26.000Z"
                        email: "suresh@gmail.com"
                        firstName: "suresh"
                        lastName: "Raina"
                        mobileNumber: 911122336655
                        userId: "Xmusdjnf"					 ]
                          }
                    ]
                }
            ]
        }
    
      @apiErrorExample {json} Error-Response:
     *
     * {
        "error": true,
        "message": "Failed To Find single Group details",
        "status": 500,
        "data": null
       }
     */
}