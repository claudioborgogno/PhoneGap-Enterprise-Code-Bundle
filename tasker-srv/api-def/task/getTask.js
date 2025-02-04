/******************************************************************************
 *
 * Tasker Server (PhoneGap Enterprise Book)
 * ----------------------------------------
 *
 * @author Kerri Shotts
 * @version 0.1.0
 * @license MIT
 *
 * Copyright (c) 2014 Packt Publishing
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 ******************************************************************************/
"use strict";

//
// dependencies
//
var apiUtils = require( "../../api-utils" ),
  security = require( "../security" ),
  Errors = require( "../../errors" ),
  resUtils = require( "../../res-utils" ),
// get a specific task
  getTaskAction = {
    "title":       "Task",
    "action":      "get-task",
    "description": [ "Return a task with a specific ID. Returns 403 Forbidden if the user doesn't have access",
                     "to the resource. If no task is found, 404 Not Found is returned."],
    "returns":     {
      200: "OK",
      401: "Unauthorized; user not logged in.",
      403: "Authenticated, but user has no access to this resource.",
      404: "Task not found.",
      500: "Internal Server Error"
    },
    "example":     {
      "headers": {
        "x-next-token": "next-auth-token"
      },
      "body":    {
        "id":          21,
        "title":       "A sample task",
        "description": "Sample task description",
        "ownedBy":     2,
        "assignedTo":  3,
        "pctComplete": 50,
        "status":      "I",
        "changeDate":  (new Date()),
        "changeUser":  "BSMITH"
      }
    },
    "verb":        "get",
    "href":        "/task/{taskId}",
    "templated":   true,
    "base-href":   "/task",
    "accepts":     [ "application/hal+json", "application/json", "text/json" ],
    "sends":       [ "application/hal+json", "application/json", "text/json" ],
    "secured-by":  "tasker-auth",
    "hmac":        "tasker-256",
    "store":       {
      "body": [
        { name: "task-id", key: "id" },
        { name: "title", key: "title" },
        { name: "description", key: "description" },
        { name: "owned-by", key: "owner" },
        { name: "assigned-to", key: "assignedTo" },
        { name: "pct-complete", key: "pctComplete" },
        { name: "status", key: "status" },
        { name: "change-date", key: "changeDate" },
        { name: "change-user", key: "changeUser" }
      ]
    },
    "handler":     function ( req, res, next ) {

      // if we don't have a user, fail
      if ( !req.user ) { return next( Errors.HTTP_Unauthorized() ); }

      // make sure hmac lines up
      if ( !security["hmac-defs"]["tasker-256"].handler( req ) ) { return next( Errors.HTTP_Forbidden( "Missing or invalid HMAC" ) ); }

      // store next token
      res.set( "x-next-token", req.user.nextToken );

      // Create response based on the task (this is found via getTaskId) and pass the next token
      var o = apiUtils.mergeAndClone( { _links: {}, _embedded: {} }, req.task );

      // generate hypermedia, also updating the href and templated properties
      o._links.self = apiUtils.mergeAndClone(
        apiUtils.generateHypermediaForAction( getTaskAction, o._links, security, "self" ), {
          "href": "/task/" + req.task.ID,
          "templated": false
        } );

      // TODO: send what we can do next..
      /*  [ require("../task/getTask") ].forEach ( function ( apiAction ) {
       o._links[ apiAction.action ] = JSON.parse ( JSON.stringify ( apiAction ) );
       } ); */

      resUtils.json( res, 200, o );
    }
  };

module.exports = getTaskAction;
