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

//
// Dependencies
//
var fs           = require('fs');
var express      = require('express');
var helmet       = require('helmet');
var morgan       = require('morgan');
var winston      = require('winston');
var path         = require('path');
var favicon      = require('static-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var bodyParser   = require('body-parser');
var csrf         = require('csurf');
var oracle       = require('oracle');
var pool         = require('generic-pool');
var passport     = require('passport');
var ReqStrategy  = require('passport-req').Strategy;

var DBUtils      = require('./db-utils');
var Session      = require('./models/session');
var Errors       = require('./errors');
//
// routes are defined by our API definition
//
var apiDef = require ("./api-def");
var apiUtils = require ("./api-utils");

// create new Express app and link the configuration
var app = express();
var config = require('./config/config');

// are in a dev mode or production?
// export NODE_ENV=development (or production)
var dev = config.env === 'development';

// log all access; if development to stdout, else to a `logs/server.log`
if (dev) {
    app.use(logger('dev'));
} else {
    app.use(logger({ stream: fs.createWriteStream (config.get('morgan:target'))}));
}

// set up Winston's transport for logging, if available (otherwise we are on the console only)
var winstonOptions = config.get('winston');
if (winstonOptions) {
    winston.add(winston.transports.File, winstonOptions);
}

// general security enhancements
app.disable ( "x-powered-by" ); // Showing what powers our service just makes the attacker's
                                // job easier.

// security enhancements via helmet

// Only trust content from self and our application server
app.use(helmet.csp({
    defaultSrc: ["'self'", "pge-as.acmecorp.com"],
    safari5: false  // safari5 has buggy behavior
}));                          

app.use(helmet.xframe()); // no framing our content!
app.use(helmet.xssFilter()); // old IE won't get this, since some implementations are buggy
app.use(helmet.hsts({maxAge: 15552000, includeSubDomains: true})); // force SSL for six months
app.use(helmet.ienoopen()); // keep IE from executing downloads
app.use(helmet.nosniff()); // keep IE from sniffing mime types
app.use(helmet.nocache()); // no caching

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware setup
app.use(favicon());                // handle favicons
app.use(bodyParser.json());        // we need to be able to parse JSON
app.use(bodyParser.urlencoded());  // and url-encoded content
app.use(cookieParser());           // we need cookies for CSRF on the browser

// set up a session
app.use(session( {
    secret: "a(3hvs23fhOHvi3hwouhS_vh24fuhefoh89Q#",
    key: "sessionId",
    cookie: { httpOnly: true, secure: true},
    resave: true,
    saveUninitialized: true 
}));

// csrf security
app.use(csrf());
app.use(function (req, res, next) {  
    res.locals.csrftoken = req.csrfToken();  
    next();  
  });
  
// static content
app.use(express.static(path.join(__dirname, 'public')));

//
// set up our database pool and connections
//
var clientPool = pool.Pool( {
  name: "oracle",
  create: function ( cb ) {
    return new oracle.connect( config.get("oracle"), function ( err, client ) {
      cb ( err, client );  
    })
  },
  destroy: function ( client ) {
    client.close();
  },
  max: 5,
  min: 1,
  idleTimeoutMillis: 30000
});

// need to ensure that the pool can drain
process.on("exit", function () {
  clientPool.drain( function () {
    clientPool.destroyAllNow();
  });
});

app.set ( "client-pool", clientPool );

passport.use ( new ReqStrategy ( 
  function ( req, done ) {
    var clientAuthToken = req.headers["x-auth-token"];

    var session = new Session ( new DBUtils ( clientPool ) );
    session.findSession ( clientAuthToken, function ( err, results) {
      if (err) {
        return done(err);
      }
      if (!results) {
        return done(null, false);
      }
      done(null, results);
    });
  }
));

passport.serializeUser(function( user, done ) {
  done (null, user);
});

// set up passport and our athentication strategy
app.use ( passport.initialize() );
// app.use ( passport.session() ); // we don't use persistent passport sessions simply because
                                   // tokens are continually regenerated, and must be verified on
                                   // each request. If you don't use this strategy, leave session
                                   // support on.

/**
 * Checks if we are authenticated (if a resource is secured), and if not
 * it calls passport to authenticate us.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function checkAuth ( req, res, next ) {
  if (req.isAuthenticated()) {
    return next();
  }
  passport.authenticate ( "req" )(req, res, next);
}

// tie our API to / and enable secured resources to use the above method
app.use ( "/", apiUtils.createRouterForApi(apiDef, checkAuth));

// and set the pretty API as a global variable so our discover method can find it.
app.set ( "x-api-discovery", apiUtils.generateHypermediaForApi(apiDef));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (dev) {
    app.use(function(err, req, res, next) {
        winston.error ("message: ", err.message, err.stack);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    winston.error ("message: ", err.message, err.stack);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
