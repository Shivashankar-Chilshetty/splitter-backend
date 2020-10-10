const express = require('express');
const router = express.Router();
const appConfig = require("./../../config/appConfig")
const groupController = require("./../../app/controllers/groupController")
const historyController = require("./../../app/controllers/historyController")
const auth = require('./../middlewares/auth')


module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/users`;

  app.post(`${baseUrl}/creategroup`, auth.isAuthorized, groupController.createGroup);
  /**
   * @api {post} /api/v1/users/creategroup api to create a group.
   * @apiVersion  0.1.0
   * @apiGroup group
   * @apiName createGoup
   * 
   * @apiParam {string} groupName groupName of the group. (body params) (required)
   * @apiParam {string} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
   * @apiParam {Object} members array containing userId's of users present in the group. (body params) 
   * 
   * @apiSuccess {object} myResponse shows error status, message, http status code, result.
   * 
   * @apiSuccessExample {json} Success-Response:
   * {
      "error": false,
      "message": "Group Created",
      "status": 200,
      "data": {
        "groupName": "testing",
        "email": "test@gmail.com",
        "createdOn": "2020-10-04T05:46:13.000Z",
        "createdBy": "test",
        "members": ['Rhtqust67','BKOpFKEAk'],
        "_id": "5f7961a57cd5e43a00537cd3",
        "__v": 0
      }
    }
   * 
   * @apiErrorExample {json} Error-Response:
   * {
   *  "error": true,
   *  "message" :"failed to create new group",
   *  "status": 500,
   *  "data: null"
   * }
   * 
   */



  app.post(`${baseUrl}/:_id/groupDelete/:authToken`, auth.isAuthorized, groupController.deleteGroup)
  /**
   * @api {post} /api/v1/users/:_id/groupDelete/:authToken delete a group
   * @apiVersion 0.1.0
   * @apiGroup group
   * @apiName deleteGroup
   * 
   * @apiParam {String} authToken The token for authentication.(Send authToken as route parameter)
   * @apiParam {String} _id The groupId for deleting a group.(Send _id as route parameter)
   * 
   * @apiSuccessExample {json} Success-Response:
   * {
      "error": false,
      "message": "Group deleted successfully",
      "status": 200,
      "data": {
        "groupName": "testing",
        "email": "test@gmail.com",
        "createdOn": "2020-10-04T06:02:49.000Z",
        "createdBy": "test",
        "members": ['Rhtqust67', 'aRmzJdo8d'],  
        "_id": "5f7965897cd5e43a00537cd4",
        "__v": 0
        }
   *  }
   * @apiErrorExample {json} Error-Response:
   * {
      "error": true,
      "message": "Failed To delete the group",
      "status": 500,
      "data": null
     }
   * 
   */


  app.get(`${baseUrl}/:groupId/getHistory/:skip/:authToken`, auth.isAuthorized, historyController.getHistoryByGroupId)
  /**
   * @api {get} /api/v1/users/:groupId/getHistory/:skip/:authToken get history by groupId
   * @apiVersion 0.1.0
   * @apiGroup history
   * @apiName getHistory
   *
   * @apiParam {String} authToken The token for authentication.(Send authToken as a router parameter)
   * @apiParam {String} groupId The groupId to find all histories present in the group(Send groupId as route parameter)
   * @apiParam {Number} skip The skip number - to display that limited number of records
   *
   * @apiSuccessExample {json} Success-Response:
   * 
   * {
    "error": false,
    "message": "All History Listed",
    "status": 200,
    "data": [
        {
            "userId": "Rhtqust67",
            "groupId": "5f7482943e8a7e25dc1bf1f5",
            "expenseId": "5f78040b5203111254213101",
            "message": "shivashankar has changed the expense title from:-'exp1' to exp1-edited",
            "createdOn": "2020-10-03T05:56:50.000Z",
            "historyId": "GOrcApTmM"
        },
        {
            "userId": "Rhtqust67",
            "groupId": "5f7482943e8a7e25dc1bf1f5",
            "expenseId": "5f78040b5203111254213101",
            "message": "shivashankar updated the expense:-'exp2'",
            "createdOn": "2020-10-03T05:56:50.000Z",
            "historyId": "kAzYNmXS5M"
        },
    ]
  }
   * 
   * @apiErrorExample {json} Error-Response:
   * {
    "error": true,
    "message": "No History Found",
    "status": 404,
    "data": null
     }
   */

  app.get(`${baseUrl}/getAllGroupsByUserId/:authToken`, auth.isAuthorized, groupController.getAllGroupsByUserId)
  /**
   * @api {get} /api/v1/users/getAllGroupsByUserId/:authToken get all groups of the user
   * @apiVersion 0.1.0
   * @apiGroup group
   * @apiName getGroups
   *
   * @apiParam {String} authToken The token for authentication.(Send authToken as a router parameter)
   *
   * @apiSuccessExample {json} Success-Response:
   * {
      "error": false,
      "message": "All Group Details Found",
      "status": 200,
      "data": [
          {
            "groupName": "Group A",
            "email": "some@gmail.com",
            "createdOn": "2020-09-30T13:05:24.000Z",
            "createdBy": "shivashankar",
            "members": [
                "Rhtqust67",
                "j_ojpBrVH",
                "gRvcZrjn_"
            ],
            "_id": "5f7482943e8a7e25dc1bf1f5",
            "updatedOn": "2020-10-02T09:08:49.000Z",
            "updatedBy": "shivashankar",
            "__v": 0
          }
      ]
    }
   *
   *
   * @apiErrorExample {json} Error-Response:
   * {
      "error": true,
      "message": "Failed To Find Group Details",
      "status": 500,
      "data": null
     }
   */



  app.get(`${baseUrl}/:_id/getSingleGroup/query`, auth.isAuthorized, groupController.getSingleGroup)
  /**
   * @api {get} /api/v1/users/:_id/getSingleGroup/query get group by groupId with user details
   * @apiVersion 0.1.0
   * @apiGroup group
   * @apiName getGroupById
   *
   * @apiParam {String} authToken The token for authentication.(Send authToken as a router parameter)
   * @apiParam {String} _id The groupId to find the group details
   *
   * @apiSuccessExample {json} Success-Response:
   * {
      "error": false,
      "message": "Group Details Found",
      "status": 200,
      "data": [
                {
                "_id": "5f7482943e8a7e25dc1bf1f5",
                "groupName": "Group-A",
                "email": "some@gmail.com",
                "createdOn": "2020-09-30T13:05:24.000Z",
                "createdBy": "some",
                "updatedOn": "2020-10-02T09:08:49.000Z",
                "members": ["Rhtqust67","gRvcZrjn_"],
                "updatedBy": "some-other",
                "__v": 0,
                "groupMembers":[
                                {
                                  "userId": "Rhtqust67",
                                  "firstName": "some",
                                  "lastName": "one",
                                  "email": "some@gmail.com",
                                },
                                {
                                  "userId": "gRvcZrjn_",
                                  "firstName": "Suresh",
                                  "lastName": "Raina",
                                  "email": "suresh@gmail.com",
                                }
                              ]
                  }
              ]
      }
   * @apiErrorExample {json} Error-Response:
   * {
      "error": true,
      "message": "Some parameters are Invalid / missing",
      "status": 400,
      "data": null
    }
   * 
   */



}