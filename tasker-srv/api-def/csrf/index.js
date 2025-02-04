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

var apiUtils = require( "../../api-utils" ),
  security = require( "../security" ),
  resUtils = require( "../../res-utils" ),
  getCSRFAction = {
    "title":       "Get CSRF Token",
    "action":      "get-csrf-token",
    "description": ["Returns a token suitable for use in a POST, PUT, or DELETE as part of the `x-csrf-token` " ,
                    "header. Response is in `token`."],
    "example":     {
      "body": {
        "token": "csrf-token"
      }
    },
    "returns":     {
      200: "OK; use token for next mutable request."
    },
    "verb":        "get",
    "href":        "/csrf",
    "base-href":   "/csrf",
    "accepts":     [ "application/hal+json", "application/json", "text/json" ],
    "sends":       [ "application/hal+json", "application/json", "text/json" ],
    "store":       { "body": [
      { "name": "csrf-token", "key": "token" }
    ]
    },
    "handler":     function ( req, res, next ) {

      var o = {
        token:     res.locals.csrftoken,
        _links:    {},
        _embedded: {}
      };

      apiUtils.generateHypermediaForAction( getCSRFAction, o._links, security, "self" );
      [ require( "../auth/login" ), require( "../auth/logout" ) ].forEach( function ( apiAction ) {
        apiUtils.generateHypermediaForAction( apiAction, o._links, security );
      } );

      resUtils.json( res, 200, o );
    }
  };

var routes = [
  {
    "route":   "/csrf",
    "actions": [ getCSRFAction ]
  }
];

module.exports = routes;
