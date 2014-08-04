define ( ["Q"], function ( Q ) {

  var DEBUG = true;

  /**
   * Construct a TimeoutError suitable for throwing; only thrown
   * when an XHR request exceeds the timeout setting
   * @constructor
   */
  function TimeoutError() {
    this.name = "TimeoutError";
    this.message = "Timeout";
    this.code = -20000;
  }
  TimeoutError.prototype = new Error();
  TimeoutError.prototype.constructor = TimeoutError;

  /**
   * Construct an HTTP Error suitable for throwing; only thrown
   * when an XHR request returns a result other than 200
   * @param status {number} the HTTP error status code
   * @param response {*} the XHR response (often has more details)
   * @constructor
   */
  function HTTPError( status, response ) {
    this.name = "HTTPError";
    this.message = "HTTP " + status;
    this.code = -1 * status;
    this.HTTPStatus = status;
    this.HTTPResponse = response;
  }
  HTTPError.prototype = new Error();
  HTTPError.prototype.constructor = HTTPError;

  /**
   * Construct an error suitable for throwing when an XHR
   * request has reached its maximum number of retry attempts
   * @constructor
   */
  function MaxRetryAttemptsReached() {
    this.name = "MaxRetryAttemptsReached";
    this.message = "The maximum number of retry attempts was reached.";
    this.code = -21000;
  }
  MaxRetryAttemptsReached.prototype = new Error();
  MaxRetryAttemptsReached.prototype.constructor = MaxRetryAttemptsReached;

  /**
   * Construct an error suitable for throwing when an XHR
   * JSON response cannot be parsed.
   * @param response {*} The malformed response
   * @constructor
   */
  function JSONParseError( response ) {
    this.name = "JSONParseError";
    this.message = "The JSON response could not be parsed";
    this.code = -30000;
  }
  JSONParseError.prototype = new Error();
  JSONParseError.prototype.constructor = JSONParseError;

  /**
   * Thrown when an XHR fires an onerror event
   * @constructor
   */
  function XHRError ( ) {
    this.name = "XHRError";
    this.message = "Encountered a non-HTTP error during XHR";
    this.code = -10000;
  }
  XHRError.prototype = new Error();
  XHRError.prototype.constructor = XHRError;

  /**
   * Sends an XHR using the specified method to the URI using the supplied options.
   * Returns a promise.
   *
   * @param method {string} GET, POST, PUT, DELETE, etc...
   * @param uri {string}    URI of the resource
   * @param options {*}     Options
   * @returns {*}           Promise
   * @private
   */
  function _xhr ( method, uri, options ) {

    if (DEBUG) { console.log ( method, uri, options ); }

    // get a deferred promise
    var deferred = Q.defer();

    // define our default options and merge the user options back in
    var opt = {
      data: null,                        // data to send
      sending: "application/json",       // mime type that we're sending
      receiving: "application/json",     // mime type we expect back
      async: true,                       // send asynchronously
      withCredentials: true,             // true to send cookies
      retryAutomatically: true,          // if a timeout occurs, retry
      retryOnXHRError: true,             // if an XHR error occurs, also retry
      timeout: 30000,                    // timeout after 30s, if no retry, TimeoutError
      initialRetryDelay: 1500,           // attempt a retry after 0.5s
      retryThrottle: 1.125,              // multiply each time round
      maximumRetryAttempts: 5,           // fail after 5 attempts -- MaxRetryAttemptsError
      headers: [],                       // headers to send on the request
      username: undefined,               // don't send a username (Basic Auth)
      password: undefined                // don't send a password (Basic Auth)
    };
    if (typeof options !== "undefined") {
      for ( var prop in options ) {
        if ( options.hasOwnProperty ( prop ) ) {
          opt[prop] = options[prop];
        }
      }
    }

    // private variables to track retry attempts
    var retryAttempts = 0,
      retryDelay = opt.initialRetryDelay;

    // If the data we're sending is JSON and sending is application/json, then
    // parse the data accordingly -- otherwise copy the value
    var sendingData;

    if ( opt.sending === "application/json" ||
         opt.sending === "text/json" ) {
      sendingData = JSON.stringify ( opt.data );
    } else {
      sendingData = opt.data;
    }

    /**
     * This is an private method that actually sends the request. It's a
     * function because we need to be able to resend the request should
     * an error or timeout occurs.
     */
    function sendRequest() {
      var xhr = new XMLHttpRequest();
      xhr.open( method, uri, opt.async, opt.username, opt.password );

      xhr.withCredentials = opt.withCredentials;
      xhr.timeout = opt.timeout;

      xhr.setRequestHeader ( "Accept", opt.receiving );
      xhr.setRequestHeader ( "Content-Type", opt.sending );

      // copy headers from options and emit
      opt.headers.forEach ( function ( header ) {
        xhr.setRequestHeader( header.headerName, header.headerValue );
      });

      /**
       * If the response times out, it will retry if retryAutomatically
       * is true. If not, a TimeoutError will be thrown immediately.
       */
      xhr.ontimeout = function() {
        if ( opt.retryAutomatically ) {
          if ( retryAttempts == opt.maximumRetryAttempts ) {
            if (DEBUG) { console.log ( "Max attempts" ); }
            deferred.reject ( new MaxRetryAttemptsReached() );
          } else {
            if (DEBUG) { console.log ( "Refire" ); }
            setTimeout ( function() {
              sendRequest();
            }, retryDelay );
            retryDelay = retryDelay * opt.retryThrottle;
            retryAttempts++;
          }
        } else {
          deferred.reject ( new TimeoutError() );
        }
      };

      /**
       * Similar to ontimeout handler; throws an XHRError immediately
       * if retryOnXHRError isn't true, otherwise it retries several
       * times.
       */
      xhr.onerror = function() {
        if ( opt.retryOnXHRError ) {
          if ( retryAttempts == opt.maximumRetryAttempts ) {
            if (DEBUG) { console.log ( "Max attempts" ); }
            deferred.reject ( new MaxRetryAttemptsReached() );
          } else {
            if (DEBUG) { console.log ( "Refire" ); }
            setTimeout ( function() {
              if (DEBUG) { console.log ( "Resend" ); }
              sendRequest();
            }, retryDelay );
            retryDelay = retryDelay * opt.retryThrottle;
            retryAttempts++;
          }
        } else {
          deferred.reject ( new XHRError() );
        }
      };

      /**
       * When the request has loaded, check the status value. If it's
       * 200, then pass the response to as a resolution to the promise.
       * If not, pass the response and HTTP error as an HTTPError.
       */
      xhr.onload = function() {
        if ( this.status === 200 ) {
          switch ( opt.receiving ) {
            case "application/json":
            case "text/json":
              try {
                deferred.resolve ( JSON.parse ( this.responseText ) );
              }
              catch (err) {
                deferred.reject ( new JSONParseError ( this.responseText ) );
              }
              break;
            case "application/xml":
            case "text/xml":
              deferred.resolve ( this.responseXML );
              break;
            default:
              deferred.resolve ( this.response );
          }
        } else {
          deferred.reject ( new HTTPError ( this.status, this.response ) );
        }
      };

      xhr.send ( sendingData );
    }
    sendRequest();

    return deferred.promise;
  }

  var REST = {
    baseURI: "https://localhost:4443",             // prepended to all URIs
    csrfTokenURI: "/auth",                         // URI that returns a CSRF token for GET
    /**
     * GET a URI
     * @param uri {string}  URI of resource
     * @param options {*}
     * @returns {*}
     */
    get: function ( uri, options ) {
      return _xhr( "GET", this.baseURI + uri, options );
    },

    /**
     * In order to send a PUT, DELETE, or POST, we need first to
     * request a CSRF token. This private method creates the first
     * portion of the promise chain that performs that request.
     *
     * @param method {string}    HTTP method
     * @param uri {string}       URI
     * @param data {*}           Data to send
     * @param options {*}        Options
     * @returns {*}              Promise
     * @private
     */
    _csrfMethod: function ( method, uri, data, options ) {
      var baseURI = this.baseURI;
      return this.get ( this.csrfTokenURI, options )
        .then ( function ( response ) {
        var csrfToken = response.token;
        var newOptions = options;
        if (typeof newOptions === "undefined") {
          newOptions = {};
        }
        newOptions.data = data;
        if (typeof newOptions.headers === "undefined") {
          newOptions.headers = [];
        }
        newOptions.headers.push ( { headerName: "x-csrf-token",
                                    headerValue: csrfToken } );
        return newOptions;
      })
        .then ( function ( options ) {
        return _xhr ( method, baseURI + uri, options );
      });
    },

    /**
     * Send a POST
     * @param uri {string}
     * @param data {*}
     * @param options {*}
     * @returns {*} Promise
     */
    post: function ( uri, data, options ) {
      return this._csrfMethod( "POST", uri, data, options );
    },

    /**
     * Send a PUT
     * @param uri {string}
     * @param data {*}
     * @param options {*}
     * @returns {*} Promise
     */
    put: function ( uri, data, options ) {
      return this._csrfMethod( "PUT", uri, data, options );
    },

    /**
     * Send a DELETE
     * @param uri {string}
     * @param data {*}
     * @param options {*}
     * @returns {*} Promise
     */
    del: function ( uri, data, options ) {
      return this._csrfMethod ( "DELETE", uri, data, options );
    }

  };

  // make sure we pass out the error types as well
  REST.TimeoutError = TimeoutError;
  REST.MaxRetryAttemptsReached = MaxRetryAttemptsReached;
  REST.HTTPError = HTTPError;
  REST.JSONParseError = JSONParseError;
  REST.XHRError = XHRError;
  return REST;
});