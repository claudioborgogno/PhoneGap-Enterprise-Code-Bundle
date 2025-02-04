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
  Task = require( "../../models/task" ),
  getTaskAction = require( "./getTask" ),
  DBUtils = require( "../../db-utils" ),
  resUtils = require( "../../res-utils" ),
  objUtils = require( "../../obj-utils" ),

  action = {
    "title":            "Tasks",
    "action":           "get-tasks",
    "verb":             "get",
    "secured-by":       "tasker-auth",
    "hmac":             "tasker-256",
    "description":      ["Returns the tasks that the authenticated user is authorized to see.",
                         "Task ids are returned in `tasks`, while the individual tasks are attached in `_embedded`."],
    "returns":          {
      200: "OK",
      401: "Unauthorized; user not logged in.",
      403: "Authenticated, but user has no access to this resource.",
      404: "Task not found.",
      500: "Internal Server Error"
    },
    "example":          {
      "headers": {
        "x-next-token": "next-auth-token"
      },
      "body":    {
        "tasks": [ 2, 21, 94 ]
      }
    },
    "href":             "/tasks",
    "templated":        false,
    "base-href":        "/tasks",
    "accepts":          [ "application/hal+json", "application/json", "text/json" ],
    "sends":            [ "application/hal+json", "application/json", "text/json" ],
    "store":            {
      "body": [
        { "name": "tasks", key: "tasks" }
      ]
    },
    "query-parameters": {
      "owned-by":           { "title": "Owner", "key": "ownedBy", "type": "number", "required": false },
      "assigned-to":        { "title": "Assigned to", "key": "assignedTo", "type": "number", "required": false },
      "with-status":        {
        "title":     "Status", "key": "withStatus", "type": "string", "required": false,
        "maxLength": 1, "minLength": 1,
        "enum":      Task.ENUM
      },
      "min-completion-pct": {
        "title": "Minimum Completion Percentage", "key": "minCompletion",
        "type":  "number", "min": 0, "max": 100, "required": false
      },
      "max-completion-pct": {
        "title": "Maximum Completion Percentage", "key": "maxCompletion",
        "type":  "number", "min": 0, "max": 100, "required": false
      }
    },
    "handler":          function ( req, res, next ) {

      // If the user isn't authenticated, bail!
      if ( !req.user ) { return next( Errors.HTTP_Unauthorized() ); }

      // if the hmac doesn't check, let the client know.
      if ( !security["hmac-defs"]["tasker-256"].handler( req ) ) { return next( Errors.HTTP_Forbidden( "Invalid or missing HMAC." ) ); }

      // store next token
      res.set( "x-next-token", req.user.nextToken );

      var o = {
        tasks:  [],
        _links: {}, _embedded: {}
      };

      // does our input validate?
      var validationResults = objUtils.validate( req.query, action["query-parameters"] );
      if ( !validationResults.validates ) {
        return next( Errors.HTTP_Bad_Request( validationResults.message ) );
      }

      // get the potential parameters
      var assignedTo = (typeof req.query.assignedTo !== "undefined") ? req.query.assignedTo : null,
        ownedBy = (typeof req.query.ownedBy !== "undefined") ? req.query.ownedBy : null,
        withStatus = (typeof req.query.withStatus !== "undefined") ? req.query.withStatus : null,
        minCompletion = (typeof req.query.minCompletion !== "undefined") ? req.query.minCompletion : 0,
        maxCompletion = (typeof req.query.maxCompletion !== "undefined") ? req.query.maxCompletion : 100;

      var dbUtil = new DBUtils( req.app.get( "client-pool" ) );
      dbUtil.query( "SELECT * FROM table(tasker.task_mgmt.get_tasks(:1,:2,:3,:4,:5,:6))",
                    [ assignedTo, ownedBy, withStatus, minCompletion, maxCompletion, req.user.userId ] )
        .then( function ( results ) {

                 // for each result, we want to add the task as an embedded element and generate
                 // the appropriate hypermedia. For the body of our response, we just generate
                 // an array and push the task IDs on that array
                 results.forEach( function ( row ) {
                   // new task, based on result
                   var task = new Task( row );
                   // add id to body
                   o.tasks.push( task.id );
                   // add the task to the embedded section, along with _links
                   o._embedded[task.id] = apiUtils.mergeAndClone( task, { "_links": {} } );
                   // And add the hypermedia to the embedded element
                   apiUtils.generateHypermediaForAction( getTaskAction, o._embedded[task.id]["_links"], security, "self" );
                   // update the href and templated parameters in _links
                   o._embedded[task.id]["_links"].self = apiUtils.mergeAndClone(
                     o._embedded[task.id]["_links"].self,
                     { "href": "/task/" + task.id,
                       "templated": false } );
                 } );

                 // add hypermedia
                 apiUtils.generateHypermediaForAction( action, o._links, security, "self" );
                 [ getTaskAction, require( "../auth/logout" ) ].forEach( function ( apiAction ) {
                   apiUtils.generateHypermediaForAction( apiAction, o._links, security );
                 } );
                 resUtils.json( res, 200, o );
               } )
        .catch( function ( err ) {
                  return next( new Error( err ) );
                } )
        .done();

    }
  };

module.exports = action;
