(function ( global, define ) {
// check for amd loader on global namespace
  var globalDefine = global.define;
/////////START

var library =

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = window.Q;

},{}],2:[function(require,module,exports){
/**
 *
 * # YASMF-Next (Yet Another Simple Mobile Framework Next Gen)
 *
 * YASMF-Next is the successor to the YASMF framework. While that framework was useful
 * and usable even in a production environment, as my experience has grown, it became
 * necessary to re-architect the entire framework in order to provide a modern
 * mobile framework.
 *
 * YASMF-Next is the result. It's young, under active development, and not at all
 * compatible with YASMF v0.2. It uses all sorts of more modern technologies such as
 * SASS for CSS styling, AMD, etc.
 *
 * YASMF-Next is intended to be a simple and fast framework for mobile and desktop
 * devices. It provides several utility functions and also provides a UI framework.
 *
 * @module _y
 * @author Kerri Shotts
 * @version 0.4
 *
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 */
/*global module, require*/
"use strict";

/* UTIL */
var _y = require( "./yasmf/util/core" );
_y.datetime = require( "./yasmf/util/datetime" );
_y.filename = require( "./yasmf/util/filename" );
_y.misc = require( "./yasmf/util/misc" );
_y.device = require( "./yasmf/util/device" );
_y.BaseObject = require( "./yasmf/util/object" );
_y.FileManager = require( "./yasmf/util/fileManager" );
_y.h = require( "./yasmf/util/h" );
_y.Router = require( "./yasmf/util/router" );

/* UI */
_y.UI = require( "./yasmf/ui/core" );
_y.UI.event = require( "./yasmf/ui/event" );
_y.UI.ViewContainer = require( "./yasmf/ui/viewContainer" );
_y.UI.NavigationController = require( "./yasmf/ui/navigationController" );
_y.UI.SplitViewController = require( "./yasmf/ui/splitViewController" );
_y.UI.TabViewController = require( "./yasmf/ui/tabViewController" );
_y.UI.Alert = require( "./yasmf/ui/alert" );
_y.UI.Spinner = require( "./yasmf/ui/spinner" );
module.exports = _y;

},{"./yasmf/ui/alert":3,"./yasmf/ui/core":4,"./yasmf/ui/event":5,"./yasmf/ui/navigationController":6,"./yasmf/ui/spinner":7,"./yasmf/ui/splitViewController":8,"./yasmf/ui/tabViewController":9,"./yasmf/ui/viewContainer":10,"./yasmf/util/core":11,"./yasmf/util/datetime":12,"./yasmf/util/device":13,"./yasmf/util/fileManager":14,"./yasmf/util/filename":15,"./yasmf/util/h":16,"./yasmf/util/misc":17,"./yasmf/util/object":18,"./yasmf/util/router":19}],3:[function(require,module,exports){
/**
 *
 * Provides native-like alert methods, including prompts and messages.
 *
 * @module alert.js
 * @author Kerri Shotts
 * @version 0.4
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
var _y = require( "../util/core" ),
  theDevice = require( "../util/device" ),
  BaseObject = require( "../util/object" ),
  UI = require( "./core" ),
  Q = require( "../../q" ),
  event = require( "./event" ),
  h = require( "../util/h" );
"use strict";
var _className = "Alert";
var Alert = function () {
  var self = new BaseObject();
  self.subclass( _className );
  /*
   * # Notifications
   *
   * * `buttonTapped` indicates which button was tapped when the view is dismissing
   * * `dismissed` indicates that the alert was dismissed (by user or code)
   */
  self.registerNotification( "buttonTapped" );
  self.registerNotification( "dismissed" );
  /**
   * The title to show in the alert.
   * @property title
   * @type {String}
   */
  self._titleElement = null; // the corresponding DOM element
  self.setTitle = function ( theTitle ) {
    self._title = theTitle;
    if ( self._titleElement !== null ) {
      if ( typeof self._titleElement.textContent !== "undefined" ) {
        self._titleElement.textContent = theTitle;
      } else {
        self._titleElement.innerHTML = theTitle;
      }
    }
  };
  self.defineProperty( "title", {
    read:    true,
    write:   true,
    default: _y.T( "ALERT" )
  } );
  /**
   * The body of the alert. Leave blank if you don't need to show
   * anything more than the title.
   * @property text
   * @type {String}
   */
  self._textElement = null;
  self.setText = function ( theText ) {
    self._text = theText;
    if ( self._textElement !== null ) {
      if ( typeof theText !== "object" ) {
        if ( typeof self._textElement.textContent !== "undefined" ) {
          self._textElement.textContent = ( "" + theText ).replace( /\<br\w*\/\>/g, "\r\n" );
        } else {
          self._textElement.innerHTML = theText;
        }
      } else {
        h.renderTo( theText, self._textElement, 0 );
      }
    }
  };
  self.defineProperty( "text", {
    read:  true,
    write: true
  } );
  /**
   * The alert's buttons are specified in this property. The layout
   * is expected to be: `[ { title: title [, type: type] [, tag: tag] } [, {} ...] ]`
   *
   * Each button's type can be "normal", "bold", "destructive". The tag may be
   * null; if it is, it is assigned the button index. If a tag is specifed (common
   * for cancel buttons), that is the return value.
   * @property buttons
   * @type {Array}
   */
  self._buttons = [];
  self._buttonContainer = null;
  self.defineProperty( "wideButtons", {
    default: "auto"
  } );
  self.setButtons = function ( theButtons ) {
    function touchStart( e ) {
      if ( e.touches !== undefined ) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
      } else {
        this.startX = e.clientX;
        this.startY = e.clientY;
      }
      this.moved = false;
    }

    function handleScrolling( e ) {
      var newX = ( e.touches !== undefined ) ? e.touches[0].clientX : e.clientX,
        newY = ( e.touches !== undefined ) ? e.touches[0].clientY : e.clientY,
        dX = Math.abs( this.startX - newX ),
        dY = Math.abs( this.startY - newY );
      console.log( dX, dY );
      if ( dX > 20 || dY > 20 ) {
        this.moved = true;
      }
    }

    function dismissWithIndex( idx ) {
      return function ( e ) {
        e.preventDefault();
        if ( this.moved ) {
          return;
        }
        self.dismiss( idx );
      };
    }

    var i;
    // clear out any previous buttons in the DOM
    if ( self._buttonContainer !== null ) {
      for ( i = 0; i < self._buttons.length; i++ ) {
        self._buttonContainer.removeChild( self._buttons[i].element );
      }
    }
    self._buttons = theButtons;
    // determine if we need wide buttons or not
    var wideButtons = false;
    if ( self.wideButtons === "auto" ) {
      wideButtons = !( ( self._buttons.length >= 2 ) && ( self._buttons.length <= 3 ) );
    } else {
      wideButtons = self.wideButtons;
    }
    if ( wideButtons ) {
      self._buttonContainer.classList.add( "wide" );
    }
    // add the buttons back to the DOM if we can
    if ( self._buttonContainer !== null ) {
      for ( i = 0; i < self._buttons.length; i++ ) {
        var e = document.createElement( "div" );
        var b = self._buttons[i];
        // if the tag is null, give it (i)
        if ( b.tag === null ) {
          b.tag = i;
        }
        // class is ui-alert-button normal|bold|destructive [wide]
        // wide buttons are for 1 button or 4+ buttons.
        e.className = "ui-alert-button " + b.type + " " + ( wideButtons ? "wide" : "" );
        // title
        e.innerHTML = b.title;
        if ( !wideButtons ) {
          // set the width of each button to fill out the alert equally
          // 3 buttons gets 33.333%; 2 gets 50%.
          e.style.width = "" + ( 100 / self._buttons.length ) + "%";
        }
        // listen for a touch
        if ( Hammer ) {
          Hammer( e ).on( "tap", dismissWithIndex( i ) );
        } else {
          event.addListener( e, "touchstart", touchStart );
          event.addListener( e, "touchmove", handleScrolling );
          event.addListener( e, "touchend", dismissWithIndex( i ) );
        }
        b.element = e;
        // add the button to the DOM
        self._buttonContainer.appendChild( b.element );
      }
    }
  };
  self.defineProperty( "buttons", {
    read:    true,
    write:   true,
    default: []
  } );
  // other DOM elements we need to construct the alert
  self._rootElement = null; // root element contains the container
  self._alertElement = null; // points to the alert itself
  self._vaElement = null; // points to the DIV used to vertically align us
  self._deferred = null; // stores a promise
  /**
   * If true, show() returns a promise.
   * @property usePromise
   * @type {boolean}
   */
  self.defineProperty( "usePromise", {
    read:    true,
    write:   false,
    default: false
  } );
  /**
   * Indicates if the alert is veisible.
   * @property visible
   * @type {Boolean}
   */
  self.defineProperty( "visible", {
    read:    true,
    write:   false,
    default: false
  } );
  /**
   * Creates the DOM elements for an Alert. Assumes the styles are
   * already in the style sheet.
   * @method _createElements
   * @private
   */
  self._createElements = function () {
    self._rootElement = document.createElement( "div" );
    self._rootElement.className = "ui-alert-container";
    self._vaElement = document.createElement( "div" );
    self._vaElement.className = "ui-alert-vertical-align";
    self._alertElement = document.createElement( "div" );
    self._alertElement.className = "ui-alert";
    self._titleElement = document.createElement( "div" );
    self._titleElement.className = "ui-alert-title";
    self._textElement = document.createElement( "div" );
    self._textElement.className = "ui-alert-text";
    self._buttonContainer = document.createElement( "div" );
    self._buttonContainer.className = "ui-alert-button-container";
    self._alertElement.appendChild( self._titleElement );
    self._alertElement.appendChild( self._textElement );
    self._alertElement.appendChild( self._buttonContainer );
    self._vaElement.appendChild( self._alertElement );
    self._rootElement.appendChild( self._vaElement );
  };
  /**
   * Called when the back button is pressed. Dismisses with a -1 index. Effectively a Cancel.
   * @method backButtonPressed
   */
  self.backButtonPressed = function () {
    self.dismiss( -1 );
  };
  /**
   * Hide dismisses the alert and dismisses it with -1. Effectively a Cancel.
   * @method hide
   * @return {[type]} [description]
   */
  self.hide = function () {
    self.dismiss( -1 );
  };
  /**
   * Shows an alert.
   * @method show
   * @return {Promise} a promise if usePromise = true
   */
  self.show = function () {
    if ( self.visible ) {
      if ( self.usePromise && self._deferred !== null ) {
        return self._deferred;
      }
      return void 0; // can't do anything more.
    }
    // listen for the back button
    UI.backButton.addListenerForNotification( "backButtonPressed", self.backButtonPressed );
    // add to the body
    document.body.appendChild( self._rootElement );
    // animate in
    UI.styleElement( self._alertElement, "transform", "scale3d(2.00, 2.00,1)" );
    setTimeout( function () {
      self._rootElement.style.opacity = "1";
      self._alertElement.style.opacity = "1";
      UI.styleElement( self._alertElement, "transform", "scale3d(1.00, 1.00,1)" )
    }, 10 );
    self._visible = true;
    if ( self.usePromise ) {
      self._deferred = Q.defer();
      return self._deferred.promise;
    }
  };
  /**
   * Dismisses the alert with the sepcified button index
   *
   * @method dismiss
   * @param {Number} idx
   */
  self.dismiss = function ( idx ) {
    if ( !self.visible ) {
      return;
    }
    // drop the listener for the back button
    UI.backButton.removeListenerForNotification( "backButtonPressed", self.backButtonPressed );
    // remove from the body
    setTimeout( function () {
      self._rootElement.style.opacity = "0";
      UI.styleElement( self._alertElement, "transform", "scale3d(0.75, 0.75,1)" )
    }, 10 );
    setTimeout( function () {
      document.body.removeChild( self._rootElement );
    }, 610 );
    // get notification tag
    var tag = -1;
    if ( ( idx > -1 ) && ( idx < self._buttons.length ) ) {
      tag = self._buttons[idx].tag;
    }
    // send our notifications as appropriate
    self.notify( "dismissed" );
    self.notify( "buttonTapped", [tag] );
    self._visible = false;
    // and resolve/reject the promise
    if ( self.usePromise ) {
      if ( tag > -1 ) {
        self._deferred.resolve( tag );
      } else {
        self._deferred.reject( new Error( tag ) );
      }
    }
  };
  /**
   * Initializes the Alert and calls _createElements.
   * @method init
   * @return {Object}
   */
  self.override( function init() {
    self.super( _className, "init" );
    self._createElements();
    return self;
  } );
  /**
   * Initializes the Alert. Options includes title, text, buttons, and promise.
   * @method overrideSuper
   * @return {Object}
   */
  self.override( function initWithOptions( options ) {
    self.init();
    if ( typeof options !== "undefined" ) {
      if ( typeof options.title !== "undefined" ) {
        self.title = options.title;
      }
      if ( typeof options.text !== "undefined" ) {
        self.text = options.text;
      }
      if ( typeof options.wideButtons !== "undefined" ) {
        self.wideButtons = options.wideButtons
      }
      if ( typeof options.buttons !== "undefined" ) {
        self.buttons = options.buttons;
      }
      if ( typeof options.promise !== "undefined" ) {
        self._usePromise = options.promise;
      }
    }
    return self;
  } );
  /**
   * Clean up after ourselves.
   * @method destroy
   */
  self.overrideSuper( self.class, "destroy", self.destroy );
  self.destroy = function destroy() {
    if ( self.visible ) {
      self.hide();
      setTimeout( destroy, 600 ); // we won't destroy immediately.
      return;
    }
    self._rootElement = null;
    self._vaElement = null;
    self._alertElement = null;
    self._titleElement = null;
    self._textElement = null;
    self._buttonContainer = null;
    self.super( _className, "destroy" );
  };
  // handle auto-init
  self._autoInit.apply( self, arguments );
  return self;
};
/**
 * Creates a button suitable for an Alert
 * @method button
 * @param  {String} title   The title of the button
 * @param  {Object} options The additional options: type and tag
 * @return {Object}         A button
 */
Alert.button = function ( title, options ) {
  var button = {};
  button.title = title;
  button.type = "normal"; // normal, bold, destructive
  button.tag = null; // assign for a specific tag
  button.enabled = true; // false = disabled.
  button.element = null; // attached DOM element
  if ( typeof options !== "undefined" ) {
    if ( typeof options.type !== "undefined" ) {
      button.type = options.type;
    }
    if ( typeof options.tag !== "undefined" ) {
      button.tag = options.tag;
    }
    if ( typeof options.enabled !== "undefined" ) {
      button.enabled = options.enabled;
    }
  }
  return button;
};
/**
 * Creates an OK-style Alert. It only has an OK button.
 * @method OK
 * @param {Object} options Specify the title, text, and promise options if desired.
 */
Alert.OK = function ( options ) {
  var anOK = new Alert();
  var anOKOptions = {
    title:   _y.T( "OK" ),
    text:    "",
    buttons: [Alert.button( _y.T( "OK" ), {
      type: "bold"
    } )]
  };
  if ( typeof options !== "undefined" ) {
    if ( typeof options.title !== "undefined" ) {
      anOKOptions.title = options.title;
    }
    if ( typeof options.text !== "undefined" ) {
      anOKOptions.text = options.text;
    }
    if ( typeof options.promise !== "undefined" ) {
      anOKOptions.promise = options.promise;
    }
  }
  anOK.initWithOptions( anOKOptions );
  return anOK;
};
/**
 * Creates an OK/Cancel-style Alert. It only has an OK and CANCEL button.
 * @method Confirm
 * @param {Object} options Specify the title, text, and promise options if desired.
 */
Alert.Confirm = function ( options ) {
  var aConfirmation = new Alert();
  var confirmationOptions = {
    title:   _y.T( "Confirm" ),
    text:    "",
    buttons: [Alert.button( _y.T( "OK" ) ),
              Alert.button( _y.T( "Cancel" ), {
                type: "bold",
                tag:  -1
              } )
    ]
  };
  if ( typeof options !== "undefined" ) {
    if ( typeof options.title !== "undefined" ) {
      confirmationOptions.title = options.title;
    }
    if ( typeof options.text !== "undefined" ) {
      confirmationOptions.text = options.text;
    }
    if ( typeof options.promise !== "undefined" ) {
      confirmationOptions.promise = options.promise;
    }
  }
  aConfirmation.initWithOptions( confirmationOptions );
  return aConfirmation;
};
module.exports = Alert;

},{"../../q":1,"../util/core":11,"../util/device":13,"../util/h":16,"../util/object":18,"./core":4,"./event":5}],4:[function(require,module,exports){
/**
 *
 * Core of YASMF-UI; defines the version and basic UI  convenience methods.
 *
 * @module core.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
var theDevice = require( "../util/device" );
var BaseObject = require( "../util/object" );
var prefixes = ["-webkit-", "-moz-", "-ms-", "-o-", ""],
  jsPrefixes = ["webkit", "moz", "ms", "o", ""],
  /**
   * @method Animation
   * @constructor
   * @param {Array} els             elements to animate
   * @param {number} timing         seconds to animate over (0.3 default)
   * @param {string} timingFunction timing function (ease-in-out default)
   * @return {Animation}
   */
  Animation = function ( els, timing, timingFunction ) {
    this._el = document.createElement( "div" );
    this._els = els;
    this._animations = [];
    this._transitions = [];
    this.timingFunction = "ease-in-out";
    this.timing = 0.3;
    this._maxTiming = 0;
    if ( typeof timing !== "undefined" ) {
      this.timing = timing;
    }
    if ( typeof timingFunction !== "undefined" ) {
      this.timingFunction = timingFunction;
    }
  };
/**
 * @method _pushAnimation
 * @private
 * @param {string} property         style property
 * @param {string} value            value to assign to property
 * @param {number} timing           seconds for animation (optional)
 * @param {string} timingFunction   timing function (optional)
 * @return {Animation}              self, for chaining
 */
function _pushAnimation( property, value, timing, timingFunction ) {
  var newProp, newValue, prefix, jsPrefix, newJsProp;
  for ( var i = 0, l = prefixes.length; i < l; i++ ) {
    prefix = prefixes[i];
    jsPrefix = jsPrefixes[i];
    newProp = prefix + property;
    if ( jsPrefix !== "" ) {
      newJsProp = jsPrefix + property.substr( 0, 1 ).toUpperCase() + property.substr( 1 );
    } else {
      newJsProp = property;
    }
    newValue = value.replace( "{-}", prefix );
    if ( typeof this._el.style[newJsProp] !== "undefined" ) {
      this._animations.push( [newProp, newValue] );
      this._transitions.push( [newProp, ( typeof timing !== "undefined" ? timing : this.timing ) + "s", ( typeof timingFunction !==
                                                                                                          "undefined" ? timingFunction : this.timingFunction )] );
    }
    this._maxTiming = Math.max( this._maxTiming, ( typeof timing !== "undefined" ? timing : this.timing ) );
  }
  return this;
}
/**
 * Set the default timing function for following animations
 * @method setTimingFunction
 * @param {string} timingFunction      the timing function to assign, like "ease-in-out"
 * @return {Animation}                 self
 */
Animation.prototype.setTimingFunction = function setTimingFunction( timingFunction ) {
  this.timingFunction = timingFunction;
  return this;
};
/**
 * Set the timing for the following animations, in seconds
 * @method setTiming
 * @param {number} timing              the length of the animation, in seconds
 * @return {Animation}                 self
 */
Animation.prototype.setTiming = function setTiming( timing ) {
  this.timing = timing;
  return this;
};
/**
 * Move the element to the specific position (using left, top)
 *
 * @method move
 * @param {string} x           the x position (px or %)
 * @param {string} y           the y position (px or %)
 * @return {Animation} self
 */
Animation.prototype.move = function ( x, y ) {
  _pushAnimation.call( this, "left", x );
  return _pushAnimation.call( this, "top", y );
};
/**
 * Resize the element (using width, height)
 *
 * @method resize
 * @param {string} w           the width (px or %)
 * @param {string} h           the height (px or %)
 * @return {Animation} self
 */
Animation.prototype.resize = function ( w, h ) {
  _pushAnimation.call( this, "width", w );
  return _pushAnimation.call( this, "height", h );
};
/**
 * Change opacity
 * @method opacity
 * @param {string} o           opacity
 * @return {Animation} self
 */
Animation.prototype.opacity = function ( o ) {
  return _pushAnimation.call( this, "opacity", o );
};
/**
 * Transform the element using translate x, y
 * @method translate
 * @param {string} x       x position (px or %)
 * @param {string} y       y position (px or %)
 * @return {Animation} self
 */
Animation.prototype.translate = function ( x, y ) {
  return _pushAnimation.call( this, "transform", ["translate(", [x, y].join( ", " ), ")"].join( "" ) );
};
/**
 * Transform the element using translate3d x, y, z
 * @method translate3d
 * @param {string} x       x position (px or %)
 * @param {string} y       y position (px or %)
 * @param {string} z       z position (px or %)
 * @return {Animation} self
 */
Animation.prototype.translate3d = function ( x, y, z ) {
  return _pushAnimation.call( this, "transform", ["translate3d(", [x, y, z].join( ", " ), ")"].join( "" ) );
};
/**
 * Transform the element using scale
 * @method scale
 * @param {string} p       percent (0.00-1.00)
 * @return {Animation} self
 */
Animation.prototype.scale = function ( p ) {
  return _pushAnimation.call( this, "transform", ["scale(", p, ")"].join( "" ) );
};
/**
 * Transform the element using scale
 * @method rotate
 * @param {string} d       degrees
 * @return {Animation} self
 */
Animation.prototype.rotate = function ( d ) {
  return _pushAnimation.call( this, "transform", ["rotate(", d, "deg)"].join( "" ) );
};
/**
 * end the animation definition and trigger the sequence. If a callback method
 * is supplied, it is called when the animation is over
 * @method endAnimation
 * @alias then
 * @param {function} fn       function to call when animation is completed;
 *                            it is bound to the Animation method so that
 *                            further animations can be triggered.
 * @return {Animation} self
 */
Animation.prototype.endAnimation = function endAnimation( fn ) {
  // create the list of transitions we need to put on the elements
  var transition = this._transitions.map( function ( t ) {
      return t.join( " " );
    } ).join( ", " ),
    that = this;
  // for each element, assign this list of transitions
  that._els.forEach( function initializeEl( el ) {
    var i, l, prefixedTransition;
    for ( i = 0, l = prefixes.length; i < l; i++ ) {
      prefixedTransition = prefixes[i] + "transition";
      el.style.setProperty( prefixedTransition, transition );
    }
  } );
  // wait a few ms to let the DOM settle, and then start the animations
  setTimeout( function startAnimations() {
    var i, l, prop, value;
    // for each element, assign the desired property and value to the element
    that._els.forEach( function animateEl( el ) {
      for ( i = 0, l = that._animations.length; i < l; i++ ) {
        prop = that._animations[i][0];
        value = that._animations[i][1];
        el.style.setProperty( prop, value );
      }
    } );
    // when the animation is complete, remove the transition property from
    // the elements and call the callback function (if specified)
    setTimeout( function afterAnimationCallback() {
      var prefixedTransition;
      that._animations = [];
      that._transitions = [];
      that._els.forEach( function animateEl( el ) {
        for ( var i = 0, l = prefixes.length; i < l; i++ ) {
          prefixedTransition = prefixes[i] + "transition";
          el.style.setProperty( prefixedTransition, "" );
        }
      } );
      if ( typeof fn === "function" ) {
        fn.call( that );
      }
    }, that._maxTiming * 1000 );
  }, 50 );
  return this;
};
Animation.prototype.then = Animation.prototype.endAnimation;
var UI = {};
/**
 * Version of the UI Namespace
 * @property version
 * @type Object
 **/
UI.version = "0.5.100";
/**
 * Styles the element with the given style and value. Adds in the browser
 * prefixes to make it easier. Also available as `$s` on nodes.
 *
 * @method styleElement
 * @alias $s
 * @param  {Node} theElement
 * @param  {CssStyle} theStyle   Don't camelCase these, use dashes as in regular styles
 * @param  {value} theValue
 * @returns {void}
 */
UI.styleElement = function ( theElement, theStyle, theValue ) {
  if ( typeof theElement !== "object" ) {
    if ( !( theElement instanceof Node ) ) {
      theValue = theStyle;
      theStyle = theElement;
      theElement = this;
    }
  }
  for ( var i = 0; i < prefixes.length; i++ ) {
    var thePrefix = prefixes[i],
      theNewStyle = thePrefix + theStyle,
      theNewValue = theValue.replace( "%PREFIX%", thePrefix ).replace( "{-}", thePrefix );
    theElement.style.setProperty( theNewStyle, theNewValue );
  }
};
/**
 * Style the list of elements with the style and value using `styleElement`
 * @method styleElements
 * @param  {Array}  theElements
 * @param  {CssStyle} theStyle
 * @param {value} theValue
 * @returns {void}
 */
UI.styleElements = function ( theElements, theStyle, theValue ) {
  var i;
  for ( i = 0; i < theElements.length; i++ ) {
    UI.styleElement( theElements[i], theStyle, theValue );
  }
};
/**
 * Begin an animation definition and apply it to the specific
 * elements defined by selector. If parent is supplied, the selector
 * is relative to the parent, otherwise it is relative to document
 * @method beginAnimation
 * @param {string|Array|Node} selector      If a string, animation applies to all
 *                                          items that match the selector. If an
 *                                          Array, animation applies to all nodes
 *                                          in the array. If a node, the animation
 *                                          applies only to the node.
 * @param {Node} parent                     Optional; if provided, selector is
 *                                          relative to this node
 * @return {Animation}                      Animation object
 */
UI.beginAnimation = function ( selector, parent ) {
  var els = [];
  if ( typeof selector === "string" ) {
    if ( typeof parent === "undefined" ) {
      parent = document;
    }
    els = els.concat( Array.prototype.splice.call( parent.querySelectorAll( selector ), 0 ) );
  }
  if ( typeof selector === "object" && selector instanceof Array ) {
    els = els.concat( selector );
  }
  if ( typeof selector === "object" && selector instanceof Node ) {
    els = els.concat( [selector] );
  }
  return new Animation( els );
};
/**
 *
 * Converts a color object to an rgba(r,g,b,a) string, suitable for applying to
 * any number of CSS styles. If the color's alpha is zero, the return value is
 * "transparent". If the color is null, the return value is "inherit".
 *
 * @method colorToRGBA
 * @static
 * @param {color} theColor - theColor to convert.
 * @returns {string} a CSS value suitable for color properties
 */
UI.colorToRGBA = function ( theColor ) {
  if ( !theColor ) {
    return "inherit";
  }
  //noinspection JSUnresolvedVariable
  if ( theColor.alpha !== 0 ) {
    //noinspection JSUnresolvedVariable
    return "rgba(" + theColor.red + "," + theColor.green + "," + theColor.blue + "," + theColor.alpha + ")";
  } else {
    return "transparent";
  }
};
/**
 * @typedef {{red: Number, green: Number, blue: Number, alpha: Number}} color
 */
/**
 *
 * Creates a color object of the form `{red:r, green:g, blue:b, alpha:a}`.
 *
 * @method makeColor
 * @static
 * @param {Number} r - red component (0-255)
 * @param {Number} g - green component (0-255)
 * @param {Number} b - blue component (0-255)
 * @param {Number} a - alpha component (0.0-1.0)
 * @returns {color}
 *
 */
UI.makeColor = function ( r, g, b, a ) {
  return {
    red:   r,
    green: g,
    blue:  b,
    alpha: a
  };
};
/**
 *
 * Copies a color and returns it suitable for modification. You should copy
 * colors prior to modification, otherwise you risk modifying the original.
 *
 * @method copyColor
 * @static
 * @param {color} theColor - the color to be duplicated
 * @returns {color} a color ready for changes
 *
 */
UI.copyColor = function ( theColor ) {
  //noinspection JSUnresolvedVariable
  return UI.makeColor( theColor.red, theColor.green, theColor.blue, theColor.alpha );
};
/**
 * UI.COLOR
 * @namespace UI
 * @class COLOR
 */
UI.COLOR = UI.COLOR || {};
/** @static
 * @method blackColor
 * @returns {color} a black color.
 */
UI.COLOR.blackColor = function () {
  return UI.makeColor( 0, 0, 0, 1.0 );
};
/** @static
 * @method darkGrayColor
 * @returns {color} a dark gray color.
 */
UI.COLOR.darkGrayColor = function () {
  return UI.makeColor( 85, 85, 85, 1.0 );
};
/** @static
 * @method GrayColor
 * @returns {color} a gray color.
 */
UI.COLOR.GrayColor = function () {
  return UI.makeColor( 127, 127, 127, 1.0 );
};
/** @static
 * @method lightGrayColor
 * @returns {color} a light gray color.
 */
UI.COLOR.lightGrayColor = function () {
  return UI.makeColor( 170, 170, 170, 1.0 );
};
/** @static
 * @method whiteColor
 * @returns {color} a white color.
 */
UI.COLOR.whiteColor = function () {
  return UI.makeColor( 255, 255, 255, 1.0 );
};
/** @static
 * @method blueColor
 * @returns {color} a blue color.
 */
UI.COLOR.blueColor = function () {
  return UI.makeColor( 0, 0, 255, 1.0 );
};
/** @static
 * @method greenColor
 * @returns {color} a green color.
 */
UI.COLOR.greenColor = function () {
  return UI.makeColor( 0, 255, 0, 1.0 );
};
/** @static
 * @method redColor
 * @returns {color} a red color.
 */
UI.COLOR.redColor = function () {
  return UI.makeColor( 255, 0, 0, 1.0 );
};
/** @static
 * @method cyanColor
 * @returns {color} a cyan color.
 */
UI.COLOR.cyanColor = function () {
  return UI.makeColor( 0, 255, 255, 1.0 );
};
/** @static
 * @method yellowColor
 * @returns {color} a yellow color.
 */
UI.COLOR.yellowColor = function () {
  return UI.makeColor( 255, 255, 0, 1.0 );
};
/** @static
 * @method magentaColor
 * @returns {color} a magenta color.
 */
UI.COLOR.magentaColor = function () {
  return UI.makeColor( 255, 0, 255, 1.0 );
};
/** @static
 * @method orangeColor
 * @returns {color} a orange color.
 */
UI.COLOR.orangeColor = function () {
  return UI.makeColor( 255, 127, 0, 1.0 );
};
/** @static
 * @method purpleColor
 * @returns {color} a purple color.
 */
UI.COLOR.purpleColor = function () {
  return UI.makeColor( 127, 0, 127, 1.0 );
};
/** @static
 * @method brownColor
 * @returns {color} a brown color.
 */
UI.COLOR.brownColor = function () {
  return UI.makeColor( 153, 102, 51, 1.0 );
};
/** @static
 * @method lightTextColor
 * @returns {color} a light text color suitable for display on dark backgrounds.
 */
UI.COLOR.lightTextColor = function () {
  return UI.makeColor( 240, 240, 240, 1.0 );
};
/** @static
 * @method darkTextColor
 * @returns {color} a dark text color suitable for display on light backgrounds.
 */
UI.COLOR.darkTextColor = function () {
  return UI.makeColor( 15, 15, 15, 1.0 );
};
/** @static
 * @method clearColor
 * @returns {color} a transparent color.
 */
UI.COLOR.clearColor = function () {
  return UI.makeColor( 0, 0, 0, 0.0 );
};
/**
 * Manages the root element
 *
 * @property _rootContainer
 * @private
 * @static
 * @type Node
 */
UI._rootContainer = null;
/**
 * Creates the root element that contains the view hierarchy
 *
 * @method _createRootContainer
 * @static
 * @protected
 */
UI._createRootContainer = function () {
  UI._rootContainer = document.createElement( "div" );
  UI._rootContainer.className = "ui-container";
  UI._rootContainer.id = "rootContainer";
  document.body.appendChild( UI._rootContainer );
};
/**
 * Manages the root view (topmost)
 *
 * @property _rootView
 * @private
 * @static
 * @type ViewContainer
 * @default null
 */
UI._rootView = null;
/**
 * Assigns a view to be the top view in the hierarchy
 *
 * @method setRootView
 * @static
 * @param {ViewContainer} theView
 */
UI.setRootView = function ( theView ) {
  if ( UI._rootContainer === null ) {
    UI._createRootContainer();
  }
  if ( UI._rootView !== null ) {
    UI.removeRootView();
  }
  UI._rootView = theView;
  UI._rootView.parentElement = UI._rootContainer;
};
/**
 * Removes a view from the root view
 *
 * @method removeRootView
 * @static
 */
UI.removeRootView = function () {
  if ( UI._rootView !== null ) {
    UI._rootView.parentElement = null;
  }
  UI._rootView = null;
};
/**
 *
 * Returns the root view
 *
 * @method getRootView
 * @static
 * @returns {ViewContainer}
 */
UI.getRootView = function () {
  return UI._rootView;
};
/**
 * The root view
 * @property rootView
 * @static
 * @type Node
 */
Object.defineProperty( UI, "rootView", {
  get: UI.getRootView,
  set: UI.setRootView
} );
/**
 * Private back button handler class
 * @private
 * @class _BackButtonHandler
 * @returns {BaseObject}
 * @private
 */
UI._BackButtonHandler = function () {
  var self = new BaseObject();
  self.subclass( "BackButtonHandler" );
  self.registerNotification( "backButtonPressed" );
  self._lastBackButtonTime = -1;
  self.handleBackButton = function () {
    var currentTime = ( new Date() ).getTime();
    if ( self._lastBackButtonTime < currentTime - 1000 ) {
      self._lastBackButtonTime = ( new Date() ).getTime();
      self.notifyMostRecent( "backButtonPressed" );
    }
  };
  document.addEventListener( "backbutton", self.handleBackButton, false );
  return self;
};
/**
 *
 * Global Back Button Handler Object
 *
 * Register a listener for the backButtonPressed notification in order
 * to be notified when the back button is pressed.
 *
 * Applies only to a physical back button, not one on the screen.
 *
 * @property backButton
 * @static
 * @final
 * @type _BackButtonHandler
 */
UI.backButton = new UI._BackButtonHandler();
/**
 * Private orientation handler class
 * @class _OrientationHandler
 * @returns {BaseObject}
 * @private
 */
UI._OrientationHandler = function () {
  var self = new BaseObject();
  self.subclass( "OrientationHandler" );
  self.registerNotification( "orientationChanged" );
  self.handleOrientationChange = function () {
    var curOrientation,
      curFormFactor,
      curScale,
      curConvenience,
      curDevice = theDevice.platform(),
      OSLevel;
    switch ( curDevice ) {
      case "mac":
        try {
          OSLevel = "" + parseFloat( ( navigator.userAgent.match( /OS X ([0-9_]+)/ )[1] ).replace( /_/g, "." ) );
        }
        catch ( e ) {}
        if ( OSLevel !== undefined ) {
          curDevice += " mac" + ( OSLevel.length < 5 ? "C" : "M" );
        }
        break;
      case "ios":
        try {
          OSLevel = navigator.userAgent.match( /OS ([0-9]+)/ )[1];
        }
        catch ( e ) {}
        if ( OSLevel !== undefined ) {
          curDevice += " ios" + OSLevel + " ios" + ( OSLevel < 7 ? "C" : "M" );
        }
        break;
      case "android":
        try {
          OSLevel = parseFloat( navigator.userAgent.match( /Android ([0-9.]+)/ )[1] );
        }
        catch ( e ) {}
        if ( OSLevel !== undefined ) {
          curDevice += " android" + ( "" + OSLevel ).replace( /\./g, "-" ) + " android" + ( ( OSLevel < 4.4 ) ? "C" : ( (
                                                                                                                        OSLevel >= 5 ) ? "M" : "K" ) )
        }
        break;
      default:
    }
    /*
     if ( curDevice === "ios" ) {
     if ( navigator.userAgent.indexOf( "OS 9" ) > -1 ) {
     curDevice += " ios9 iosM";
     }
     if ( navigator.userAgent.indexOf( "OS 8" ) > -1 ) {
     curDevice += " ios8 iosM";
     }
     if ( navigator.userAgent.indexOf( "OS 7" ) > -1 ) {
     curDevice += " ios7 iosM";
     }
     if ( navigator.userAgent.indexOf( "OS 6" ) > -1 ) {
     curDevice += " ios6 iosC";
     }
     if ( navigator.userAgent.indexOf( "OS 5" ) > -1 ) {
     curDevice += " ios5 iosC";
     }
     } */
    curFormFactor = theDevice.formFactor();
    curOrientation = theDevice.isPortrait() ? "portrait" : "landscape";
    curScale = theDevice.isRetina() ? "hiDPI" : "loDPI";
    curScale += " scale" + window.devicePixelRatio + "x";
    curConvenience = "";
    if ( theDevice.iPad() ) {
      curConvenience = "ipad";
    }
    if ( theDevice.iPhone() ) {
      curConvenience = "iphone";
    }
    if ( theDevice.droidTablet() ) {
      curConvenience = "droid-tablet";
    }
    if ( theDevice.droidPhone() ) {
      curConvenience = "droid-phone";
    }
    if ( typeof document.body !== "undefined" && document.body !== null ) {
      document.body.setAttribute( "class", [curDevice, curFormFactor, curOrientation, curScale, curConvenience].join(
        " " ) );
    }
    self.notify( "orientationChanged" );
  };
  window.addEventListener( "orientationchange", self.handleOrientationChange, false );
  if ( typeof document.body !== "undefined" && document.body !== null ) {
    self.handleOrientationChange();
  } else {
    setTimeout( self.handleOrientationChange, 0 );
  }
  return self;
};
/**
 *
 * Global Orientation Handler Object
 *
 * Register a listener for the orientationChanged notification in order
 * to be notified when the orientation changes.
 *
 * @property orientationHandler
 * @static
 * @final
 * @type _OrientationHandler
 */
UI.orientationHandler = new UI._OrientationHandler();
/**
 *
 * Global Notification Object -- used for sending and receiving global notifications
 *
 * @property globalNotifications
 * @static
 * @final
 * @type BaseObject
 */
UI.globalNotifications = new BaseObject();
/**
 * Create the root container
 */
if ( typeof document.body !== "undefined" && document.body !== null ) {
  UI._createRootContainer();
} else {
  setTimeout( UI._createRootContainer, 0 );
}
// helper methods on Nodes
Node.prototype.$s = UI.styleElement;
module.exports = UI;

},{"../util/device":13,"../util/object":18}],5:[function(require,module,exports){
/**
 *
 * Basic cross-platform mobile Event Handling for YASMF
 *
 * @module events.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global define*/
"use strict";
var theDevice = require( "../util/device" );
/**
 * Translates touch events to mouse events if the platform doesn't support
 * touch events. Leaves other events unaffected.
 *
 * @method _translateEvent
 * @static
 * @private
 * @param {String} theEvent - the event name to translate
 */
var _translateEvent = function ( theEvent ) {
  var theTranslatedEvent = theEvent;
  if ( !theTranslatedEvent ) {
    return theTranslatedEvent;
  }
  var platform = theDevice.platform();
  var nonTouchPlatform = ( platform === "wince" || platform === "unknown" || platform === "mac" || platform === "windows" ||
                           platform === "linux" );
  if ( nonTouchPlatform && theTranslatedEvent.toLowerCase().indexOf( "touch" ) > -1 ) {
    theTranslatedEvent = theTranslatedEvent.replace( "touch", "mouse" );
    theTranslatedEvent = theTranslatedEvent.replace( "start", "down" );
    theTranslatedEvent = theTranslatedEvent.replace( "end", "up" );
  }
  return theTranslatedEvent;
};
var event = {};
/**
 * @typedef {{_originalEvent: Event, touches: Array, x: number, y: number, avgX: number, avgY: number, element: (EventTarget|Object), target: Node}} NormalizedEvent
 */
/**
 *
 * Creates an event object from a DOM event.
 *
 * The event returned contains all the touches from the DOM event in an array of {x,y} objects.
 * The event also contains the first touch as x,y properties and the average of all touches
 * as avgX,avgY. If no touches are in the event, these values will be -1.
 *
 * @method makeEvent
 * @static
 * @param {Node} that - `this`; what fires the event
 * @param {Event} e - the DOM event
 * @returns {NormalizedEvent}
 *
 */
event.convert = function ( that, e ) {
  if ( typeof e === "undefined" ) {
    e = window.event;
  }
  var newEvent = {
    _originalEvent: e,
    touches:        [],
    x:              -1,
    y:              -1,
    avgX:           -1,
    avgY:           -1,
    element:        e.target || e.srcElement,
    target:         that
  };
  if ( e.touches ) {
    var avgXTotal = 0;
    var avgYTotal = 0;
    for ( var i = 0; i < e.touches.length; i++ ) {
      newEvent.touches.push( {
                               x: e.touches[i].clientX,
                               y: e.touches[i].clientY
                             } );
      avgXTotal += e.touches[i].clientX;
      avgYTotal += e.touches[i].clientY;
      if ( i === 0 ) {
        newEvent.x = e.touches[i].clientX;
        newEvent.y = e.touches[i].clientY;
      }
    }
    if ( e.touches.length > 0 ) {
      newEvent.avgX = avgXTotal / e.touches.length;
      newEvent.avgY = avgYTotal / e.touches.length;
    }
  } else {
    if ( event.pageX ) {
      newEvent.touches.push( {
                               x: e.pageX,
                               y: e.pageY
                             } );
      newEvent.x = e.pageX;
      newEvent.y = e.pageY;
      newEvent.avgX = e.pageX;
      newEvent.avgY = e.pageY;
    }
  }
  return newEvent;
};
/**
 *
 * Cancels an event that's been created using {@link event.convert}.
 *
 * @method cancelEvent
 * @static
 * @param {NormalizedEvent} e - the event to cancel
 *
 */
event.cancel = function ( e ) {
  if ( e._originalEvent.cancelBubble ) {
    e._originalEvent.cancelBubble();
  }
  if ( e._originalEvent.stopPropagation ) {
    e._originalEvent.stopPropagation();
  }
  if ( e._originalEvent.preventDefault ) {
    e._originalEvent.preventDefault();
  } else {
    e._originalEvent.returnValue = false;
  }
};
/**
 * Adds a touch listener to theElement, converting touch events for WP7.
 *
 * @method addEventListener
 * @param {Node} theElement  the element to attach the event to
 * @param {String} theEvent  the event to handle
 * @param {Function} theFunction  the function to call when the event is fired
 *
 */
event.addListener = function ( theElement, theEvent, theFunction ) {
  var theTranslatedEvent = _translateEvent( theEvent.toLowerCase() );
  theElement.addEventListener( theTranslatedEvent, theFunction, false );
};
/**
 * Removes a touch listener added by addTouchListener
 *
 * @method removeEventListener
 * @param {Node} theElement  the element to remove an event from
 * @param {String} theEvent  the event to remove
 * @param {Function} theFunction  the function to remove
 *
 */
event.removeListener = function ( theElement, theEvent, theFunction ) {
  var theTranslatedEvent = _translateEvent( theEvent.toLowerCase() );
  theElement.removeEventListener( theTranslatedEvent, theFunction );
};
module.exports = event;

},{"../util/device":13}],6:[function(require,module,exports){
/**
 *
 * Navigation Controllers provide basic support for view stack management (as in push, pop)
 *
 * @module navigationController.js
 * @author Kerri Shotts
 * @version 0.5
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
var UI = require( "./core" ),
  ViewContainer = require( "./viewContainer" ),
  UTIL = require( "../util/core" );
var _className = "NavigationController",
  NavigationController = function () {
    var self = new ViewContainer();
    self.subclass( _className );
    // # Notifications
    //
    // * `viewPushed` is fired when a view is pushed onto the view stack. The view pushed is passed as a parameter.
    // * `viewPopped` is fired when a view is popped off the view stack. The view popped is passed as a parameter.
    //
    self.registerNotification( "viewPushed" );
    self.registerNotification( "viewPopped" );
    /**
     * The array of views that this navigation controller manages.
     * @property subviews
     * @type {Array}
     */
    self.defineProperty( "subviews", {
      read:    true,
      write:   false,
      default: []
    } );
    /**
     * Indicates the current top view
     * @property topView
     * @type {Object}
     */
    self.getTopView = function () {
      if ( self._subviews.length > 0 ) {
        return self._subviews[self._subviews.length - 1];
      } else {
        return null;
      }
    };
    self.defineProperty( "topView", {
      read:            true,
      write:           false,
      backingVariable: false
    } );
    /**
     * Returns the initial view in the view stack
     * @property rootView
     * @type {Object}
     */
    self.getRootView = function () {
      if ( self._subviews.length > 0 ) {
        return self._subviews[0];
      } else {
        return null;
      }
    };
    self.setRootView = function ( theNewRoot ) {
      if ( self._subviews.length > 0 ) {
        // must remove all the subviews from the DOM
        for ( var i = 0; i < self._subviews.length; i++ ) {
          var thePoppingView = self._subviews[i];
          thePoppingView.notify( "viewWillDisappear" );
          if ( i === 0 ) {
            thePoppingView.element.classList.remove( "ui-root-view" );
          }
          thePoppingView.parentElement = null;
          thePoppingView.notify( "viewDidDisappear" );
          thePoppingView.notify( "viewWasPopped" );
          delete thePoppingView.navigationController;
        }
        self._subviews = [];
      }
      self._subviews.push( theNewRoot ); // add it to our views
      theNewRoot.navigationController = self;
      theNewRoot.notify( "viewWasPushed" );
      theNewRoot.notify( "viewWillAppear" ); // notify the view
      theNewRoot.parentElement = self.element; // and make us the parent
      theNewRoot.element.classList.add( "ui-root-view" );
      theNewRoot.notify( "viewDidAppear" ); // and notify it that it's actually there.
    };
    self.defineProperty( "rootView", {
      read:            true,
      write:           true,
      backingVariable: false
    } );
    self.defineProperty( "modal", {
      read:    true,
      write:   false,
      default: false
    } );
    self.defineProperty( "modalView", {
      read:    true,
      write:   false,
      default: null
    } );
    self.defineProperty( "modalViewType", {
      read:    true,
      write:   false,
      default: ""
    } );
    self._modalClickPreventer = null;
    self._preventClicks = null;
    /**
     * Creates a click-prevention element -- essentially a transparent DIV that
     * fills the screen.
     * @method _createClickPreventionElement
     * @private
     */
    self._createClickPreventionElement = function () {
      self.createElementIfNotCreated();
      self._preventClicks = document.createElement( "div" );
      self._preventClicks.className = "ui-prevent-clicks";
      self.element.appendChild( self._preventClicks );
    };
    /**
     * Create a click-prevention element if necessary
     * @method _createClickPreventionElementIfNotCreated
     * @private
     */
    self._createClickPreventionElementIfNotCreated = function () {
      if ( self._preventClicks === null ) {
        self._createClickPreventionElement();
      }
    };
    /**
     * push a view onto the view stack.
     *
     * @method pushView
     * @param {ViewContainer} aView
     * @param {Boolean} [withAnimation] Determine if the view should be pushed with an animation, default is `true`
     * @param {Number} [withDelay] Number of seconds for the animation, default is `0.3`
     * @param {String} [withType] CSS Animation, default is `ease-in-out`
     */
    self.pushView = function ( aView, withAnimation, withDelay, withType ) {
      var theHidingView = self.topView,
        theShowingView = aView,
        usingAnimation = true,
        animationDelay = 0.3,
        animationType = "ease-in-out";
      if ( typeof withAnimation !== "undefined" ) {
        usingAnimation = withAnimation;
      }
      if ( typeof withDelay !== "undefined" ) {
        animationDelay = withDelay;
      }
      if ( typeof withType !== "undefined" ) {
        animationType = withType;
      }
      if ( !usingAnimation ) {
        animationDelay = 0;
      }
      // add the view to our array, at the end
      self._subviews.push( theShowingView );
      theShowingView.navigationController = self;
      theShowingView.notify( "viewWasPushed" );
      // get each element's z-index, if specified
      var theHidingViewZ = parseInt( getComputedStyle( theHidingView.element ).getPropertyValue( "z-index" ) || "0", 10 ),
        theShowingViewZ = parseInt( getComputedStyle( theShowingView.element ).getPropertyValue( "z-index" ) || "0", 10 );
      if ( theHidingViewZ >= theShowingViewZ ) {
        theShowingViewZ = theHidingViewZ + 10;
      }
      // then position the view so as to be off-screen, with the current view on screen
      UI.styleElement( theHidingView.element, "transform", "translate3d(0,0," + theHidingViewZ + "px)" );
      UI.styleElement( theShowingView.element, "transform", "translate3d(100%,0," + theShowingViewZ + "px)" );
      // set up an animation
      if ( usingAnimation ) {
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "-webkit-transform " +
                                                                                         animationDelay + "s " + animationType );
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "-moz-transform " +
                                                                                         animationDelay + "s " + animationType );
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "-ms-transform " +
                                                                                         animationDelay + "s " + animationType );
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "transform " + animationDelay +
                                                                                         "s " + animationType );
        UI.styleElements( theHidingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "opacity " +
                                                                                                          animationDelay + "s " + animationType );
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "opacity " +
                                                                                                           animationDelay + "s " + animationType );
        UI.styleElements( theHidingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "0" );
      } else {
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "inherit" );
        UI.styleElements( theHidingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "inherit" );
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "inherit" );
      }
      // and add the element with us as the parent
      theShowingView.parentElement = self.element;
      // display the click prevention element
      self._preventClicks.style.display = "block";
      setTimeout( function () {
        // tell the topView to move over to the left
        UI.styleElement( theHidingView.element, "transform", "translate3d(-50%,0," + theHidingViewZ + "px)" );
        // and tell our new view to move as well
        UI.styleElement( theShowingView.element, "transform", "translate3d(0,0," + theShowingViewZ + "px)" );
        if ( usingAnimation ) {
          UI.styleElements( theHidingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "0" );
          UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
        }
        // the the view it's about to show...
        theHidingView.notify( "viewWillDisappear" );
        theShowingView.notify( "viewWillAppear" );
        // tell anyone who is listening who got pushed
        self.notify( "viewPushed", [theShowingView] );
        // tell the view it's visible after the delay has passed
        setTimeout( function () {
          theHidingView.element.style.display = "none";
          theHidingView.notify( "viewDidDisappear" );
          theShowingView.notify( "viewDidAppear" );
          // hide click preventer
          self._preventClicks.style.display = "none";
        }, animationDelay * 1000 );
      }, 50 );
    };
    /**
     * pops the top view from the view stack
     *
     * @method popView
     * @param {Boolean} withAnimation Use animation when popping, default `true`
     * @param {String} withDelay Duration of animation in seconds, Default `0.3`
     * @param {String} withType CSS Animation, default is `ease-in-out`
     */
    self.popView = function ( withAnimation, withDelay, withType ) {
      var usingAnimation = true,
        animationDelay = 0.3,
        animationType = "ease-in-out";
      if ( typeof withAnimation !== "undefined" ) {
        usingAnimation = withAnimation;
      }
      if ( typeof withDelay !== "undefined" ) {
        animationDelay = withDelay;
      }
      if ( typeof withType !== "undefined" ) {
        animationType = withType;
      }
      if ( !usingAnimation ) {
        animationDelay = 0;
      }
      // only pop if we have views to pop (Can't pop the first!)
      if ( self._subviews.length <= 1 ) {
        return;
      }
      // pop the top view off the stack
      var thePoppingView = self._subviews.pop(),
        theShowingView = self.topView,
        thePoppingViewZ = parseInt( getComputedStyle( thePoppingView.element ).getPropertyValue( "z-index" ) || "0", 10 ),
        theShowingViewZ = parseInt( getComputedStyle( theShowingView.element ).getPropertyValue( "z-index" ) || "0", 10 );
      if ( theShowingViewZ >= thePoppingViewZ ) {
        thePoppingViewZ = theShowingViewZ + 10;
      }
      theShowingView.element.style.display = "inherit";
      // make sure that theShowingView is off screen to the left, and the popping
      // view is at 0
      UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "inherit" );
      UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "inherit" );
      UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "inherit" );
      UI.styleElement( theShowingView.element, "transform", "translate3d(-50%,0," + theShowingViewZ + "px)" );
      UI.styleElement( thePoppingView.element, "transform", "translate3d(0,0," + thePoppingViewZ + "px" );
      if ( usingAnimation ) {
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "0" );
        UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
      } else {
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
        UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
      }
      // set up an animation
      if ( usingAnimation ) {
        UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "-webkit-transform " +
                                                                                          animationDelay + "s " + animationType );
        UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "-moz-transform " +
                                                                                          animationDelay + "s " + animationType );
        UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "-ms-transform " +
                                                                                          animationDelay + "s " + animationType );
        UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "transform " + animationDelay +
                                                                                          "s " + animationType );
        UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "opacity " +
                                                                                                           animationDelay + "s " + animationType );
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "opacity " +
                                                                                                           animationDelay + "s " + animationType );
      }
      // display the click prevention element
      self._preventClicks.style.display = "block";
      setTimeout( function () {
        // and move everyone
        UI.styleElement( theShowingView.element, "transform", "translate3d(0,0," + theShowingViewZ + "px)" );
        UI.styleElement( thePoppingView.element, "transform", "translate3d(100%,0," + thePoppingViewZ + "px)" );
        if ( usingAnimation ) {
          UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "0" );
          UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
        }
        // the the view it's about to show...
        thePoppingView.notify( "viewWillDisappear" );
        theShowingView.notify( "viewWillAppear" );
        // tell the view it's visible after the delay has passed
        setTimeout( function () {
          thePoppingView.notify( "viewDidDisappear" );
          thePoppingView.notify( "viewWasPopped" );
          theShowingView.notify( "viewDidAppear" );
          // tell anyone who is listening who got popped
          self.notify( "viewPopped", [thePoppingView] );
          // hide click preventer
          self._preventClicks.style.display = "none";
          // and remove the popping view from the hierarchy
          thePoppingView.parentElement = null;
          delete thePoppingView.navigationController;
        }, ( animationDelay * 1000 ) );
      }, 50 );
    };
    /**
     * Presents the navigation controller as a modal navigation controller. It sits
     * adjacent to `fromView` in the DOM, not within, and as such can prevent it
     * from receiving any events. The rendering is rougly the same as any other
     * navigation controller, save that an extra class added to the element's
     * `ui-container` that ensures that on larger displays the modal doesn't
     * fill the entire screen. If desired, this class can be controlled by the second
     * parameter (`options`).
     *
     * if `options` are specified, it must be of the form:
     * ```
     * { displayType: "modalWindow|modalPage|modalFill",   // modal display type
       *   withAnimation: true|false,                        // should animation be used?
       *   withDelay: 0.3,                                   // if animation is used, time in seconds
       *   withTimingFunction: "ease-in-out|..."             // timing function to use for animation
       * }
     * ```
     *
     * @method presentModalController
     * @param {Node} fromView                      the top-level view to cover (typically rootContainer)
     * @param {*} options                          options to apply
     */
    self.presentModalController = function presentModelController( fromView, options ) {
      var defaultOpts = {
        displayType:        "modalWindow",
        withAnimation:      true,
        withDelay:          0.3,
        withTimingFunction: "ease-in-out"
      };
      if ( typeof options !== "undefined" ) {
        if ( typeof options.displayType !== "undefined" ) {
          defaultOpts.displayType = options.displayType;
        }
        if ( typeof options.withAnimation !== "undefined" ) {
          defaultOpts.withAnimation = options.withAnimation;
        }
        if ( typeof options.withDelay !== "undefined" ) {
          defaultOpts.withDelay = options.withDelay;
        }
        if ( typeof options.withTimingFunction !== "undefined" ) {
          defaultOpts.withTimingFunction = options.withTimingFunction;
        }
      }
      if ( !defaultOpts.withAnimation ) {
        defaultOpts.withDelay = 0;
      }
      // check our form factor class; if we're a phone, only permit modalFill
      if ( document.body.classList.contains( "phone" ) ) {
        defaultOpts.displayType = "modalFill";
      }
      self._modalView = fromView;
      self._modal = true;
      self._modalViewType = defaultOpts.displayType;
      self._modalClickPreventer = document.createElement( "div" );
      self._modalClickPreventer.className = "ui-container ui-transparent";
      // we need to calculate the z indices of the adjacent view and us
      var theAdjacentViewZ = parseInt( getComputedStyle( fromView ).getPropertyValue( "z-index" ) || "0", 10 ),
        theModalViewZ = parseInt( getComputedStyle( self.element ).getPropertyValue( "z-index" ) || "0", 10 );
      if ( theModalViewZ <= theAdjacentViewZ ) {
        theModalViewZ = theAdjacentViewZ + 10; // the modal should always be above the adjacent view
      }
      // make sure our current view is off-screen so that when it is added, it won't flicker
      self.element.$s( "transform", UTIL.template( "translate3d(%X%,%Y%,%Z%)", {
        x: "0",
        y: "150%",
        z: "" + theModalViewZ + "px"
      } ) );
      self.element.classList.add( defaultOpts.displayType );
      // and attach the element
      self._modalClickPreventer.appendChild( self.element );
      fromView.parentNode.appendChild( self._modalClickPreventer );
      // send any notifications we need
      self.emit( "viewWasPushed" );
      self.emit( "viewWillAppear" );
      setTimeout( function () {
        fromView.classList.add( "ui-disabled" );
        UI.beginAnimation( fromView ).setTiming( defaultOpts.withDelay ).setTimingFunction( defaultOpts.withTimingFunction )
          .scale( "0.9" ).opacity( "0.9" ).endAnimation();
        UI.beginAnimation( self.element ).setTiming( defaultOpts.withDelay ).setTimingFunction( defaultOpts.withTimingFunction )
          .translate3d( "0", "0", "" + theModalViewZ + "px" ).endAnimation( function sendNotifications() {
                                                                              self.emit( "viewDidAppear" );
                                                                            } );
      }, 50 );
    };
    /**
     * Dismiss a controller presented with `presentModelController`. Options can be
     *
     * ```
     * { withAnimation: true|false,         // if false, no animation occurs
       *   withDelay: 0.3,                    // time in seconds
       *   withTimingFunction: "ease-in-out"  // easing function to use
       * }
     * ```
     *
     * @method dismissModalController
     * @param {*} options
     */
    self.dismissModalController = function dismissModelController( options ) {
      var defaultOpts = {
        withAnimation:      true,
        withDelay:          0.3,
        withTimingFunction: "ease-in-out"
      };
      if ( typeof options !== "undefined" ) {
        if ( typeof options.withAnimation !== "undefined" ) {
          defaultOpts.withAnimation = options.withAnimation;
        }
        if ( typeof options.withDelay !== "undefined" ) {
          defaultOpts.withDelay = options.withDelay;
        }
        if ( typeof options.withTimingFunction !== "undefined" ) {
          defaultOpts.withTimingFunction = options.withTimingFunction;
        }
      }
      if ( !defaultOpts.withAnimation ) {
        defaultOpts.withDelay = 0;
      }
      // we need to calculate the z indices of the adjacent view and us
      var theAdjacentViewZ = parseInt( getComputedStyle( self.modalView ).getPropertyValue( "z-index" ) || "0", 10 ),
        theModalViewZ = parseInt( getComputedStyle( self.element ).getPropertyValue( "z-index" ) || "0", 10 );
      if ( theModalViewZ <= theAdjacentViewZ ) {
        theModalViewZ = theAdjacentViewZ + 10; // the modal should always be above the adjacent view
      }
      // send any notifications we need
      self.emit( "viewWillDisappear" );
      setTimeout( function () {
        self.modalView.classList.remove( "ui-disabled" );
        UI.beginAnimation( self.modalView ).setTiming( defaultOpts.withDelay ).setTimingFunction( defaultOpts.withTimingFunction )
          .scale( "1" ).opacity( "1" ).endAnimation();
        UI.beginAnimation( self.element ).setTiming( defaultOpts.withDelay ).setTimingFunction( defaultOpts.withTimingFunction )
          .translate3d( "0", "150%", "" + theModalViewZ + "px" ).endAnimation(
          function sendNotifications() {
            self.emit( "viewDidDisappear" );
            self.emit( "viewWasPopped" );
            self.element.classList.remove( self.modalViewType );
            self._modalClickPreventer.parentNode.removeChild( self._modalClickPreventer );
            self._modalClickPreventer.removeChild( self.element );
            self._modal = false;
            self._modalView = null;
            self._modalViewType = "";
            self._modalClickPreventer = null;
          } );
      }, 50 );
    };
    /**
     * @method render
     * @abstract
     */
    self.override( function render() {
      return ""; // nothing to render!
    } );
    /**
     * Create elements and click prevention elements if necessary; otherwise there's nothing to do
     * @method renderToElement
     */
    self.override( function renderToElement() {
      self.createElementIfNotCreated();
      self._createClickPreventionElementIfNotCreated();
      return; // nothing to do.
    } );
    /**
     * Initialize the navigation controller
     * @method init
     * @return {Object}
     */
    self.override( function init( theRootView, theElementId, theElementTag, theElementClass, theParentElement ) {
      if ( typeof theRootView === "undefined" ) {
        throw new Error( "Can't initialize a navigation controller without a root view." );
      }
      // do what a normal view container does
      self.$super( theElementId, theElementTag, theElementClass, theParentElement );
      //self.super( _className, "init", [theElementId, theElementTag, theElementClass, theParentElement ] );
      // now add the root view
      self.rootView = theRootView;
      return self;
    } );
    /**
     * Initialize the navigation controller
     * @method initWithOptions
     * @return {Object}
     */
    self.override( function initWithOptions( options ) {
      var theRootView, theElementId, theElementTag, theElementClass,
        theParentElement;
      if ( typeof options !== "undefined" ) {
        if ( typeof options.id !== "undefined" ) {
          theElementId = options.id;
        }
        if ( typeof options.tag !== "undefined" ) {
          theElementTag = options.tag;
        }
        if ( typeof options.class !== "undefined" ) {
          theElementClass = options.class;
        }
        if ( typeof options.parent !== "undefined" ) {
          theParentElement = options.parent;
        }
        if ( typeof options.rootView !== "undefined" ) {
          theRootView = options.rootView;
        }
      }
      return self.init( theRootView, theElementId, theElementTag, theElementClass, theParentElement );
    } );
    // handle auto initialization
    self._autoInit.apply( self, arguments );
    return self;
  };
module.exports = NavigationController;

},{"../util/core":11,"./core":4,"./viewContainer":10}],7:[function(require,module,exports){
/**
 *
 * Provides native-like alert methods, including prompts and messages.
 *
 * @module alert.js
 * @author Kerri Shotts
 * @version 0.4
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
var _y = require( "../util/core" ),
  BaseObject = require( "../util/object" ),
  UI = require( "./core" ),
  h = require( "../util/h" );
var _className = "Spinner";

function Spinner() {
  var self = new BaseObject();
  self.subclass( _className );
  self._element = null;
  self.defineObservableProperty( "text" );
  self.defineProperty( "visible", {
    default: false
  } );
  self.setObservableTintedBackground = function setObservableTintedBackground( v ) {
    if ( v ) {
      self._element.classList.add( "obscure-background" );
    } else {
      self._element.classList.remove( "obscure-background" );
    }
    return v;
  }
  self.defineObservableProperty( "tintedBackground", {
    default: false
  } );
  self.show = function show() {
    if ( !self.visible ) {
      UI._rootContainer.parentNode.appendChild( self._element );
      self.visible = true;
      setTimeout( function () {
        self._element.style.opacity = "1";
      }, 0 );
    }
  };
  self.hide = function hide( cb ) {
    if ( self.visible ) {
      self._element.style.opacity = "0";
      self.visible = false;
      setTimeout( function () {
        UI._rootContainer.parentNode.removeChild( self._element );
        if ( typeof cb === "function" ) {
          setTimeout( cb, 0 );
        }
      }, 250 );
    }
  };
  self.override( function init() {
    self.super( _className, "init" );
    self._element = h.el( "div.ui-spinner-outer-container",
                          h.el( "div.ui-spinner-inner-container",
                                [h.el( "div.ui-spinner-inner-spinner" ),
                                 h.el( "div.ui-spinner-inner-text", {
                                   bind: {
                                     object:  self,
                                     keyPath: "text"
                                   }
                                 } )
                                ] ) );
    return self;
  } );
  self.initWithOptions = function initWithOptions( options ) {
    self.init();
    self.text = options.text;
    self.tintedBackground = ( options.tintedBackground !== undefined ) ? options.tintedBackground : false;
    return self;
  };
  self.override( function destroy() {
    if ( self.visible ) {
      UI._rootContainer.parentNode.removeChild( self._element );
      self.visible = false;
    }
    self._element = null;
    self.super( _className, "destroy" );
  } )
  self._autoInit.apply( self, arguments );
  return self;
}
module.exports = Spinner;

},{"../util/core":11,"../util/h":16,"../util/object":18,"./core":4}],8:[function(require,module,exports){
/**
 *
 * Split View Controllers provide basic support for side-by-side views
 *
 * @module splitViewController.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
var UI = require( "./core" ),
  ViewContainer = require( "./viewContainer" );
var _className = "SplitViewController";
var SplitViewController = function () {
  var self = new ViewContainer();
  self.subclass( _className );
  // # Notifications
  //
  // * `viewsChanged` - fired when the left or right side view changes
  //
  self.registerNotification( "viewsChanged" );
  self._preventClicks = null;
  /**
   * Creates a click-prevention element -- essentially a transparent DIV that
   * fills the screen.
   * @method _createClickPreventionElement
   * @private
   */
  self._createClickPreventionElement = function () {
    self.createElementIfNotCreated();
    self._preventClicks = document.createElement( "div" );
    self._preventClicks.className = "ui-prevent-clicks";
    self.element.appendChild( self._preventClicks );
  };
  /**
   * Create a click-prevention element if necessary
   * @method _createClickPreventionElementIfNotCreated
   * @private
   */
  self._createClickPreventionElementIfNotCreated = function () {
    if ( self._preventClicks === null ) {
      self._createClickPreventionElement();
    }
  };
  /**
   * Indicates the type of split canvas:
   *
   * * `split`: typical split-view - left and right side shares space on screen
   * * `off-canvas`: off-canvas view AKA Facebook split view. Left side is off screen and can slide in
   * * `split-overlay`: left side slides over the right side when visible
   *
   * @property viewType
   * @type {String}
   */
  self.setViewType = function ( theViewType ) {
    self.element.classList.remove( "ui-" + self._viewType + "-view" );
    self._viewType = theViewType;
    self.element.classList.add( "ui-" + theViewType + "-view" );
    self.leftViewStatus = "invisible";
  };
  self.defineProperty( "viewType", {
    read:    true,
    write:   true,
    default: "split"
  } );
  /**
   * Indicates whether or not the left view is `visible` or `invisible`.
   *
   * @property leftViewStatus
   * @type {String}
   */
  self.setLeftViewStatus = function ( viewStatus ) {
    self._preventClicks.style.display = "block";
    self.element.classList.remove( "ui-left-side-" + self._leftViewStatus );
    self._leftViewStatus = viewStatus;
    self.element.classList.add( "ui-left-side-" + viewStatus );
    setTimeout( function () {
      self._preventClicks.style.display = "none";
    }, 600 );
  };
  self.defineProperty( "leftViewStatus", {
    read:    true,
    write:   true,
    default: "invisible"
  } );
  /**
   * Toggle the visibility of the left side view
   * @method toggleLeftView
   */
  self.toggleLeftView = function () {
    if ( self.leftViewStatus === "visible" ) {
      self.leftViewStatus = "invisible";
    } else {
      self.leftViewStatus = "visible";
    }
  };
  /**
   * The array of views that this split view controller manages.
   * @property subviews
   * @type {Array}
   */
  self.defineProperty( "subviews", {
    read:    true,
    write:   false,
    default: [null, null]
  } );
  // internal elements
  self._leftElement = null;
  self._rightElement = null;
  /**
   * Create the left and right elements
   * @method _createElements
   * @private
   */
  self._createElements = function () {
    if ( self._leftElement !== null ) {
      self.element.removeChild( self._leftElement );
    }
    if ( self._rightElement !== null ) {
      self.element.removeChild( self._rightElement );
    }
    self._leftElement = document.createElement( "div" );
    self._rightElement = document.createElement( "div" );
    self._leftElement.className = "ui-container left-side";
    self._rightElement.className = "ui-container right-side";
    self.element.appendChild( self._leftElement );
    self.element.appendChild( self._rightElement );
  };
  /**
   * Create the left and right elements if necessary
   * @method _createElementsIfNecessary
   * @private
   */
  self._createElementsIfNecessary = function () {
    if ( self._leftElement !== null && self._rightElement !== null ) {
      return;
    }
    self._createElements();
  };
  /**
   * Assigns a view to a given side
   * @method _assignViewToSide
   * @param {DOMElement} whichElement
   * @param {ViewContainer} aView
   * @private
   */
  self._assignViewToSide = function ( whichElement, aView ) {
    self._createElementsIfNecessary();
    aView.splitViewController = self;
    aView.notify( "viewWasPushed" ); // notify the view it was "pushed"
    aView.notify( "viewWillAppear" ); // notify the view it will appear
    aView.parentElement = whichElement; // and make us the parent
    aView.notify( "viewDidAppear" ); // and notify it that it's actually there.
  };
  /**
   * Unparents a view on a given side, sending all the requisite notifications
   *
   * @method _unparentSide
   * @param {Number} sideIndex
   * @private
   */
  self._unparentSide = function ( sideIndex ) {
    if ( self._subviews.length >= sideIndex ) {
      var aView = self._subviews[sideIndex];
      if ( aView !== null ) {
        aView.notify( "viewWillDisappear" ); // notify the view that it is going to disappear
        aView.parentElement = null; // remove the view
        aView.notify( "viewDidDisappear" ); // notify the view that it did disappear
        aView.notify( "viewWasPopped" ); // notify the view that it was "popped"
        delete aView.splitViewController;
      }
    }
  };
  /**
   * Allows access to the left view
   * @property leftView
   * @type {ViewContainer}
   */
  self.getLeftView = function () {
    if ( self._subviews.length > 0 ) {
      return self._subviews[0];
    } else {
      return null;
    }
  };
  self.setLeftView = function ( aView ) {
    self._unparentSide( 0 ); // send disappear notices
    if ( self._subviews.length > 0 ) {
      self._subviews[0] = aView;
    } else {
      self._subviews.push( aView );
    }
    self._assignViewToSide( self._leftElement, aView );
    self.notify( "viewsChanged" );
  };
  self.defineProperty( "leftView", {
    read:            true,
    write:           true,
    backingVariable: false
  } );
  /**
   * Allows access to the right view
   * @property rightView
   * @type {ViewContainer}
   */
  self.getRightView = function () {
    if ( self._subviews.length > 1 ) {
      return self._subviews[1];
    } else {
      return null;
    }
  };
  self.setRightView = function ( aView ) {
    self._unparentSide( 1 ); // send disappear notices for right side
    if ( self._subviews.length > 1 ) {
      self._subviews[1] = aView;
    } else {
      self._subviews.push( aView );
    }
    self._assignViewToSide( self._rightElement, aView );
    self.notify( "viewsChanged" );
  };
  self.defineProperty( "rightView", {
    read:            true,
    write:           true,
    backingVariable: false
  } );
  /**
   * @method render
   * @abstract
   */
  self.override( function render() {
    return ""; // nothing to render!
  } );
  /**
   * Creates the left and right elements if necessary
   * @method renderToElement
   */
  self.override( function renderToElement() {
    self._createElementsIfNecessary();
    self._createClickPreventionElementIfNotCreated();
    return; // nothing to do.
  } );
  /**
   * Initialize the split view controller
   * @method init
   * @param {ViewContainer} theLeftView
   * @param {ViewContainer} theRightView
   * @param {String} [theElementId]
   * @param {String} [theElementClass]
   * @param {String} [theElementTag]
   * @param {DOMElement} [theParentElement]
   */
  self.override( function init( theLeftView, theRightView, theElementId, theElementTag, theElementClass, theParentElement ) {
    if ( typeof theLeftView === "undefined" ) {
      throw new Error( "Can't initialize a navigation controller without a left view." );
    }
    if ( typeof theRightView === "undefined" ) {
      throw new Error( "Can't initialize a navigation controller without a right view." );
    }
    // do what a normal view container does
    self.$super( theElementId, theElementTag, theElementClass, theParentElement );
//    self.super( _className, "init", [theElementId, theElementTag, theElementClass, theParentElement ] );
    // now add the left and right views
    self.leftView = theLeftView;
    self.rightView = theRightView;
    return self;
  } );
  /**
   * Initialize the split view controller
   * @method initWithOptions
   */
  self.override( function initWithOptions( options ) {
    var theLeftView, theRightView, theElementId, theElementTag, theElementClass,
      theParentElement;
    if ( typeof options !== "undefined" ) {
      if ( typeof options.id !== "undefined" ) {
        theElementId = options.id;
      }
      if ( typeof options.tag !== "undefined" ) {
        theElementTag = options.tag;
      }
      if ( typeof options.class !== "undefined" ) {
        theElementClass = options.class;
      }
      if ( typeof options.parent !== "undefined" ) {
        theParentElement = options.parent;
      }
      if ( typeof options.leftView !== "undefined" ) {
        theLeftView = options.leftView;
      }
      if ( typeof options.rightView !== "undefined" ) {
        theRightView = options.rightView;
      }
    }
    self.init( theLeftView, theRightView, theElementId, theElementTag, theElementClass, theParentElement );
    if ( typeof options !== "undefined" ) {
      if ( typeof options.viewType !== "undefined" ) {
        self.viewType = options.viewType;
      }
      if ( typeof options.leftViewStatus !== "undefined" ) {
        self.leftViewStatus = options.leftViewStatus;
      }
    }
    return self;
  } );
  /**
   * Destroy our elements and clean up
   *
   * @method destroy
   */
  self.override( function destroy() {
    self._unparentSide( 0 );
    self._unparentSide( 1 );
    if ( self._leftElement !== null ) {
      self.element.removeChild( self._leftElement );
    }
    if ( self._rightElement !== null ) {
      self.element.removeChild( self._rightElement );
    }
    self._leftElement = null;
    self._rightElement = null;
    self.$super();
    //self.super( _className, "destroy" );
  } );
  // auto initialize
  self._autoInit.apply( self, arguments );
  return self;
};
module.exports = SplitViewController;

},{"./core":4,"./viewContainer":10}],9:[function(require,module,exports){
/**
 *
 * Tab View Controllers provide basic support for tabbed views
 *
 * @module tabViewController.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
var UI = require( "./core" ),
  ViewContainer = require( "./viewContainer" ),
  event = require( "./event" );
var _className = "TabViewController";
var TabViewController = function () {
  var self = new ViewContainer();
  self.subclass( _className );
  // # Notifications
  //
  // * `viewsChanged` - Fired when the views change
  self.registerNotification( "viewsChanged" );
  // internal elements
  self._tabElements = []; // each tab on the tab bar
  self._tabBarElement = null; // contains our bar button group
  self._barButtonGroup = null; // contains all our tabs
  self._viewContainer = null; // contains all our subviews
  /**
   * Create the tab bar element
   * @method _createTabBarElement
   * @private
   */
  self._createTabBarElement = function () {
    self._tabBarElement = document.createElement( "div" );
    self._tabBarElement.className = "ui-tab-bar ui-tab-default-position";
    self._barButtonGroup = document.createElement( "div" );
    self._barButtonGroup.className = "ui-bar-button-group ui-align-center";
    self._tabBarElement.appendChild( self._barButtonGroup );
  };
  /**
   * Create the tab bar element if necessary
   * @method _createTabBarElementIfNecessary
   * @private
   */
  self._createTabBarElementIfNecessary = function () {
    if ( self._tabBarElement === null ) {
      self._createTabBarElement();
    }
  };
  /**
   * create the view container that will hold all the views this tab bar owns
   * @method _createViewContainer
   * @private
   */
  self._createViewContainer = function () {
    self._viewContainer = document.createElement( "div" );
    self._viewContainer.className = "ui-container ui-avoid-tab-bar ui-tab-default-position";
  };
  /**
   * @method _createViewContainerIfNecessary
   * @private
   */
  self._createViewContainerIfNecessary = function () {
    if ( self._viewContainer === null ) {
      self._createViewContainer();
    }
  };
  /**
   * Create all the elements and the DOM structure
   * @method _createElements
   * @private
   */
  self._createElements = function () {
    self._createTabBarElementIfNecessary();
    self._createViewContainerIfNecessary();
    self.element.appendChild( self._tabBarElement );
    self.element.appendChild( self._viewContainer );
  };
  /**
   * @method _createElementsIfNecessary
   * @private
   */
  self._createElementsIfNecessary = function () {
    if ( self._tabBarElement !== null || self._viewContainer !== null ) {
      return;
    }
    self._createElements();
  };
  /**
   * Create a tab element and attach the appropriate event listener
   * @method _createTabElement
   * @private
   */
  self._createTabElement = function ( aView, idx ) {
    var e = document.createElement( "div" );
    e.className = "ui-bar-button ui-tint-color";
    e.innerHTML = aView.title;
    e.setAttribute( "data-tag", idx )
    event.addListener( e, "touchstart", function () {
      self.selectedTab = parseInt( this.getAttribute( "data-tag" ), 10 );
    } );
    return e;
  };
  /**
   * The position of the the tab bar
   * Valid options include: `default`, `top`, and `bottom`
   * @property barPosition
   * @type {TabViewController.BAR\_POSITION}
   */
  self.setObservableBarPosition = function ( newPosition, oldPosition ) {
    self._createElementsIfNecessary();
    self._tabBarElement.classList.remove( "ui-tab-" + oldPosition + "-position" );
    self._tabBarElement.classList.add( "ui-tab-" + newPosition + "-position" );
    self._viewContainer.classList.remove( "ui-tab-" + oldPosition + "-position" );
    self._viewContainer.classList.add( "ui-tab-" + newPosition + "-position" );
    return newPosition;
  };
  self.defineObservableProperty( "barPosition", {
    default: "default"
  } );
  /**
   * The alignment of the bar items
   * Valid options are: `left`, `center`, `right`
   * @property barAlignment
   * @type {TabViewController.BAR\_ALIGNMENT}
   */
  self.setObservableBarAlignment = function ( newAlignment, oldAlignment ) {
    self._createElementsIfNecessary();
    self._barButtonGroup.classList.remove( "ui-align-" + oldAlignment );
    self._barButtonGroup.classList.add( "ui-align-" + newAlignment );
    return newAlignment;
  };
  self.defineObservableProperty( "barAlignment", {
    default: "center"
  } );
  /**
   * The array of views that this tab view controller manages.
   * @property subviews
   * @type {Array}
   */
  self.defineProperty( "subviews", {
    read:    true,
    write:   false,
    default: []
  } );
  /**
   * Add a subview to the tab bar.
   * @method addSubview
   * @property {ViewContainer} view
   */
  self.addSubview = function ( view ) {
    self._createElementsIfNecessary();
    var e = self._createTabElement( view, self._tabElements.length );
    self._barButtonGroup.appendChild( e );
    self._tabElements.push( e );
    self._subviews.push( view );
    view.tabViewController = self;
    view.notify( "viewWasPushed" );
  };
  /**
   * Remove a specific view from the tab bar.
   * @method removeSubview
   * @property {ViewContainer} view
   */
  self.removeSubview = function ( view ) {
    self._createElementsIfNecessary();
    var i = self._subviews.indexOf( view );
    if ( i > -1 ) {
      var hidingView = self._subviews[i];
      var hidingViewParent = hidingView.parentElement;
      if ( hidingViewParent !== null ) {
        hidingView.notify( "viewWillDisappear" );
      }
      hidingView.parentElement = null;
      if ( hidingViewParent !== null ) {
        hidingView.notify( "viewDidDisappear" );
      }
      self._subviews.splice( i, 1 );
      self._barButtonGroup.removeChild( self._tabElements[i] );
      self._tabElements.splice( i, 1 );
      var curSelectedTab = self.selectedTab;
      if ( curSelectedTab > i ) {
        curSelectedTab--;
      }
      if ( curSelectedTab > self._tabElements.length ) {
        curSelectedTab = self._tabElements.length;
      }
      self.selectedTab = curSelectedTab;
    }
    view.notify( "viewWasPopped" );
    delete view.tabViewController;
  };
  /**
   * Determines which tab is selected; changing will display the appropriate
   * tab.
   *
   * @property selectedTab
   * @type {Number}
   */
  self.setObservableSelectedTab = function ( newIndex, oldIndex ) {
    var oldView, newView;
    self._createElementsIfNecessary();
    if ( oldIndex > -1 ) {
      oldView = self._subviews[oldIndex];
      if ( newIndex > -1 ) {
        newView = self._subviews[newIndex];
      }
      oldView.notify( "viewWillDisappear" );
      if ( newIndex > -1 ) {
        newView.notify( "viewWillAppear" );
      }
      oldView.parentElement = null;
      if ( newIndex > -1 ) {
        self._subviews[newIndex].parentElement = self._viewContainer;
      }
      oldView.notify( "viewDidDisappear" );
      if ( newIndex > -1 ) {
        newView.notify( "viewDidAppear" );
      }
    } else {
      newView = self._subviews[newIndex];
      newView.notify( "viewWillAppear" );
      self._subviews[newIndex].parentElement = self._viewContainer;
      newView.notify( "viewDidAppear" );
    }
    return newIndex;
  };
  self.defineObservableProperty( "selectedTab", {
    default:      -1,
    notifyAlways: true
  } );
  /**
   * @method render
   */
  self.override( function render() {
    return ""; // nothing to render!
  } );
  /**
   * @method renderToElement
   */
  self.override( function renderToElement() {
    self._createElementsIfNecessary();
    return; // nothing to do.
  } );
  /**
   * Initialize the tab controller
   * @method init
   * @param {String} [theElementId]
   * @param {String} [theElementTag]
   * @param {String} [theElementClass]
   * @param {DOMElement} [theParentElement]
   * @return {Object}
   */
  self.override( function init( theElementId, theElementTag, theElementClass, theParentElement ) {
    // do what a normal view container does
    self.$super( theElementId, theElementTag, theElementClass, theParentElement );
    //self.super( _className, "init", [theElementId, theElementTag, theElementClass, theParentElement ] );
    return self;
  } );
  /**
   * Initialize the tab controller
   * @method initWithOptions
   * @param {Object} options
   * @return {Object}
   */
  self.override( function initWithOptions( options ) {
    var theElementId, theElementTag, theElementClass, theParentElement;
    if ( typeof options !== "undefined" ) {
      if ( typeof options.id !== "undefined" ) {
        theElementId = options.id;
      }
      if ( typeof options.tag !== "undefined" ) {
        theElementTag = options.tag;
      }
      if ( typeof options.class !== "undefined" ) {
        theElementClass = options.class;
      }
      if ( typeof options.parent !== "undefined" ) {
        theParentElement = options.parent;
      }
    }
    self.init( theElementId, theElementTag, theElementClass, theParentElement );
    if ( typeof options !== "undefined" ) {
      if ( typeof options.barPosition !== "undefined" ) {
        self.barPosition = options.barPosition;
      }
      if ( typeof options.barAlignment !== "undefined" ) {
        self.barAlignment = options.barAlignment;
      }
    }
    return self;
  } );
  // auto init
  self._autoInit.apply( self, arguments );
  return self;
};
TabViewController.BAR_POSITION = {
  default: "default",
  top:     "top",
  bottom:  "bottom"
};
TabViewController.BAR_ALIGNMENT = {
  center: "center",
  left:   "left",
  right:  "right"
};
module.exports = TabViewController;

},{"./core":4,"./event":5,"./viewContainer":10}],10:[function(require,module,exports){
/**
 *
 * View Containers are simple objects that provide very basic view management with
 * a thin layer over the corresponding DOM element.
 *
 * @module viewContainer.js
 * @author Kerri Shotts
 * @version 0.5
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
var BaseObject = require( "../util/object" ),
  h = require( "../util/h" );
var _className = "ViewContainer";
var ViewContainer = function () {
  var self = new BaseObject();
  self.subclass( _className );
  // # Notifications
  // * `viewWasPushed` is fired by a containing `ViewController` when the view is added
  //   to the view stack
  // * `viewWasPopped` is fired by a container when the view is removed from the view stack
  // * `viewWillAppear` is fired by a container when the view is about to appear (one should avoid
  //   any significant DOM changes or calculations during this time, or animations may stutter)
  // * `viewWillDisappear` is fired by a container when the view is about to disappear
  // * `viewDidAppear` is fired by a container when the view is on screen.
  // * `viewDidDisappear` is fired by a container when the view is off screen.
  self.registerNotification( "viewWasPushed" );
  self.registerNotification( "viewWasPopped" );
  self.registerNotification( "viewWillAppear" );
  self.registerNotification( "viewWillDisappear" );
  self.registerNotification( "viewDidAppear" );
  self.registerNotification( "viewDidDisappear" );
  self.registerNotification( "willRender" );
  self.registerNotification( "didRender" );
  // private properties used to manage the corresponding DOM element
  self._element = null;
  self._elementClass = "ui-container"; // default; can be changed to any class for styling purposes
  self._elementId = null; // bad design decision -- probably going to mark this as deprecated soon
  self._elementTag = "div"; // some elements might need to be something other than a DIV
  self._parentElement = null; // owning element
  /**
   * The title isn't displayed anywhere (unless you use it yourself in `renderToElement`, but
   * is useful for containers that want to know the title of their views.
   * @property title
   * @type {String}
   * @observable
   */
  self.defineObservableProperty( "title" );
  /**
   * Creates the internal elements.
   * @method createElement
   */
  self.createElement = function () {
    self._element = document.createElement( self._elementTag );
    if ( self.elementClass !== null ) {
      self._element.className = self.elementClass;
    }
    if ( self.elementId !== null ) {
      self._element.id = self.elementId;
    }
  };
  /**
   * Creates the internal elements if necessary (that is, if they aren't already in existence)
   * @method createElementIfNotCreated
   */
  self.createElementIfNotCreated = function () {
    if ( self._element === null ) {
      self.createElement();
    }
  };
  /**
   * The `element` property allow direct access to the DOM element backing the view
   * @property element
   * @type {DOMElement}
   */
  self.getElement = function () {
    self.createElementIfNotCreated();
    return self._element;
  };
  self.defineProperty( "element", {
    read:    true,
    write:   true,
    default: null
  } );
  /**
   * The `elementClass` property indicates the class of the DOM element. Changing
   * the class will alter the backing DOM element if created.
   * @property elementClass
   * @type {String}
   * @default "ui-container"
   */
  self.setElementClass = function ( theClassName ) {
    self._elementClass = theClassName;
    if ( self._element !== null ) {
      self._element.className = theClassName;
    }
  };
  self.defineProperty( "elementClass", {
    read:    true,
    write:   true,
    default: "ui-container"
  } );
  /**
   * Determines the `id` for the backing DOM element. Not the best choice to
   * use, since this must be unique within the DOM. Probably going to become
   * deprecated eventually
   */
  self.setElementId = function ( theElementId ) {
    self._elementId = theElementId;
    if ( self._element !== null ) {
      self._element.id = theElementId;
    }
  };
  self.defineProperty( "elementId", {
    read:    true,
    write:   true,
    default: null
  } );
  /**
   * Determines the type of DOM Element; by default this is a DIV.
   * @property elementTag
   * @type {String}
   * @default "div"
   */
  self.defineProperty( "elementTag", {
    read:    true,
    write:   true,
    default: "div"
  } );
  /**
   * Indicates the parent element, if it exists. This is a DOM element
   * that owns this view (parent -> child). Changing the parent removes
   * this element from the parent and reparents to another element.
   * @property parentElement
   * @type {DOMElement}
   */
  self.setParentElement = function ( theParentElement ) {
    if ( self._parentElement !== null && self._element !== null ) {
      // remove ourselves from the existing parent element first
      self._parentElement.removeChild( self._element );
      self._parentElement = null;
    }
    self._parentElement = theParentElement;
    if ( self._parentElement !== null && self._element !== null ) {
      self._parentElement.appendChild( self._element );
    }
  };
  self.defineProperty( "parentElement", {
    read:    true,
    write:   true,
    default: null
  } );
  /**
   * @method render
   * @return {String|DOMElement|DocumentFragment}
   * `render` is called by `renderToElement`. The idea behind this is to generate
   * a return value consisting of the DOM tree necessary to create the view's
   * contents.
   **/
  self.render = function () {
    // right now, this doesn't do anything, but it's here for inheritance purposes
    return "Error: Abstract Method";
  };
  /**
   * Renders the content of the view. Can be called more than once, but more
   * often is called once during `init`. Calls `render` immediately and
   * assigns it to `element`'s `innerHTML` -- this implicitly creates the
   * DOM elements backing the view if they weren't already created.
   * @method renderToElement
   */
  self.renderToElement = function () {
    self.emit( "willRender" );
    var renderOutput = self.render();
    if ( typeof renderOutput === "string" ) {
      self.element.innerHTML = self.render();
    } else if ( typeof renderOutput === "object" ) {
      h.renderTo( renderOutput, self.element );
    }
    self.emit( "didRender" );
  };
  /**
   * Initializes the view container; returns `self`
   * @method init
   * @param {String} [theElementId]
   * @param {String} [theElementTag]
   * @param {String} [theElementClass]
   * @param {DOMElement} [theParentElement]
   * @returns {Object}
   */
  self.override( function init( theElementId, theElementTag, theElementClass, theParentElement ) {
    self.$super();
    //self.super( _className, "init" ); // super has no parameters
    // set our Id, Tag, and Class
    if ( typeof theElementId !== "undefined" ) {
      self.elementId = theElementId;
    }
    if ( typeof theElementTag !== "undefined" ) {
      self.elementTag = theElementTag;
    }
    if ( typeof theElementClass !== "undefined" ) {
      self.elementClass = theElementClass;
    }
    // render ourselves to the element (via render); this implicitly creates the element
    // with the above properties.
    self.renderToElement();
    // add ourselves to our parent.
    if ( typeof theParentElement !== "undefined" ) {
      self.parentElement = theParentElement;
    }
    return self;
  } );
  /**
   * Initializes the view container. `options` can specify any of the following properties:
   *
   *  * `id` - the `id` of the element
   *  * `tag` - the element tag to use (`div` is the default)
   *  * `class` - the class name to use (`ui-container` is the default)
   *  * `parent` - the parent DOMElement
   *
   * @method initWithOptions
   * @param {Object} options
   * @return {Object}
   */
  self.initWithOptions = function ( options ) {
    var theElementId, theElementTag, theElementClass, theParentElement;
    if ( typeof options !== "undefined" ) {
      if ( typeof options.id !== "undefined" ) {
        theElementId = options.id;
      }
      if ( typeof options.tag !== "undefined" ) {
        theElementTag = options.tag;
      }
      if ( typeof options.class !== "undefined" ) {
        theElementClass = options.class;
      }
      if ( typeof options.parent !== "undefined" ) {
        theParentElement = options.parent;
      }
    }
    self.init( theElementId, theElementTag, theElementClass, theParentElement );
    if ( typeof options !== "undefined" ) {
      if ( typeof options.title !== "undefined" ) {
        self.title = options.title;
      }
    }
    return self;
  };
  /**
   * Clean up
   * @method destroy
   */
  self.override( function destroy() {
    // remove ourselves from the parent view, if attached
    if ( self._parentElement !== null && self._element !== null ) {
      // remove ourselves from the existing parent element first
      self._parentElement.removeChild( self._element );
      self._parentElement = null;
    }
    // and let our super know that it can clean up
    self.$super();
    //self.super( _className, "destroy" );
  } );
  // handle auto-initialization
  self._autoInit.apply( self, arguments );
  // return the new object
  return self;
};
// return the new factory
module.exports = ViewContainer;

},{"../util/h":16,"../util/object":18}],11:[function(require,module,exports){
/**
 *
 * Core of YASMF-UTIL; defines the version, DOM, and localization convenience methods.
 *
 * @module core.js
 * @author Kerri Shotts
 * @version 0.5
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global define, Globalize, device, document, window, setTimeout, navigator, console, Node*/
"use strict";
/**
 * @method getComputedStyle
 * @private
 * @param {Node} element      the element to request the computed style from
 * @param {string} property   the property to request (like `width`); optional
 * @returns {*}               Either the property requested or the entire CSS style declaration
 */
function getComputedStyle( element, property ) {
  if ( !( element instanceof Node ) && typeof element === "string" ) {
    property = element;
    element = this;
  }
  var computedStyle = window.getComputedStyle( element );
  if ( typeof property !== "undefined" ) {
    return computedStyle.getPropertyValue( property );
  }
  return computedStyle;
}
/**
 * @method _arrayize
 * @private
 * @param {NodeList} list     the list to convert
 * @returns {Array}           the converted array
 */
function _arrayize( list ) {
  return Array.prototype.splice.call( list, 0 );
}
/**
 * @method getElementById
 * @private
 * @param {Node} parent      the parent to execute getElementById on
 * @param {string} elementId the element ID to search for
 * @returns {Node}           the element or null if not found
 */
function getElementById( parent, elementId ) {
  if ( typeof parent === "string" ) {
    elementId = parent;
    parent = document;
  }
  return ( parent.getElementById( elementId ) );
}
/**
 * @method querySelector
 * @private
 * @param {Node} parent       the parent to execute querySelector on
 * @param {string} selector   the CSS selector to use
 * @returns {Node}            the located element or null if not found
 */
function querySelector( parent, selector ) {
  if ( typeof parent === "string" ) {
    selector = parent;
    parent = document;
  }
  return ( parent.querySelector( selector ) );
}
/**
 * @method querySelectorAll
 * @private
 * @param {Node} parent     the parent to execute querySelectorAll on
 * @param {string} selector the selector to use
 * @returns {Array}         the found elements; if none: []
 */
function querySelectorAll( parent, selector ) {
  if ( typeof parent === "string" ) {
    selector = parent;
    parent = document;
  }
  return _arrayize( parent.querySelectorAll( selector ) );
}
/**
 * @method $
 * @private
 * @param {string} selector   the CSS selector to use
 * @returns {Node}            The located element, relative to `this`
 */
function $( selector ) {
  return querySelector( this, selector );
}
/**
 * @method $$
 * @private
 * @param {string} selector   the CSS selector to use
 * @returns {Array}           the located elements, relative to `this`
 */
function $$( selector ) {
  return querySelectorAll( this, selector );
}
/**
 * @method $id
 * @private
 * @param {string} id         the id of the element
 * @returns {Node}            the located element or null if not found
 */
function $id( id ) {
  return getElementById( this, id );
}
// modify Node's prototype to provide useful additional shortcuts
var proto = Node.prototype;
[
  ["$", $],
  ["$$", $$],
  ["$1", $],
  ["$id", $id],
  ["gsc", getComputedStyle],
  ["gcs", getComputedStyle],
  ["getComputedStyle", getComputedStyle]
].forEach( function ( i ) {
             if ( typeof proto[i[0]] === "undefined" ) {
               proto[i[0]] = i[1];
             }
           } );
/**
 * Returns a value for the specified keypath. If any intervening
 * values evaluate to undefined or null, the entire result is
 * undefined or null, respectively.
 *
 * If you need a default value to be returned in such an instance,
 * specify it after the keypath.
 *
 * Note: if `o` is not an object, it is assumed that the function
 * has been bound to `this`. As such, all arguments are shifted by
 * one position to the right.
 *
 * Key paths are of the form:
 *
 *    object.field.field.field[index]
 *
 * @param {object} o        the object to search
 * @param {string} k        the keypath
 * @param {*} d             (optional) the default value to return
 *                          should the keypath evaluate to null or
 *                          undefined.
 * @return {*}              the value at the keypath
 *
 * License MIT: Copyright 2014 Kerri Shotts
 */
function valueForKeyPath( o, k, d ) {
  if ( o === undefined || o === null ) {
    return ( d !== undefined ) ? d : o;
  }
  if ( !( o instanceof Object ) ) {
    d = k;
    k = o;
    o = this;
  }
  var v = o;
  // There's a million ways that this regex can go wrong
  // with respect to JavaScript identifiers. Splits will
  // technically work with just about every non-A-Za-z\$-
  // value, so your keypath could be "field/field/field"
  // and it would work like "field.field.field".
  v = k.match( /([\w\$\\\-]+)/g ).reduce( function ( v, keyPart ) {
    if ( v === undefined || v === null ) {
      return v;
    }
    try {
      return v[keyPart];
    }
    catch ( err ) {
      return undefined;
    }
  }, v );
  return ( ( v === undefined || v === null ) && ( d !== undefined ) ) ? d : v;
}
/**
 * Interpolates values from the context into the string. Placeholders are of the
 * form {...}. If values within {...} do not exist within context, they are
 * replaced with undefined.
 * @param  {string} str     string to interpolate
 * @param  {*} context      context to use for interpolation
 * @return {string}}        interpolated string
 */
function interpolate( str, context ) {
  var newStr = str;
  if ( typeof context === "undefined" ) {
    return newStr;
  }
  str.match( /\{([^\}]+)\}/g ).forEach( function ( match ) {
    var prop = match.substr( 1, match.length - 2 ).trim();
    newStr = newStr.replace( match, valueForKeyPath( context, prop ) );
  } );
  return newStr;
}
/**
 * Merges the supplied objects together and returns a copy containin the merged objects. The original
 * objects are untouched, and a new object is returned containing a relatively deep copy of each object.
 *
 * Important Notes:
 *   - Items that exist in any object but not in any other will be added to the target
 *   - Should more than one item exist in the set of objects with the same key, the following rules occur:
 *     - If both types are arrays, the result is a.concat(b)
 *     - If both types are objects, the result is merge(a,b)
 *     - Otherwise the result is b (b overwrites a)
 *   - Should more than one item exist in the set of objects with the same key, but differ in type, the
 *     second value overwrites the first.
 *   - This is not a true deep copy! Should any property be a reference to another object or array, the
 *     copied result may also be a reference (unless both the target and the source share the same item
 *     with the same type). In other words: DON'T USE THIS AS A DEEP COPY METHOD
 *
 * It's really meant to make this kind of work easy:
 *
 * var x = { a: 1, b: "hi", c: [1,2] },
 *     y = { a: 3, c: [3, 4], d: 0 },
 *     z = merge (x,y);
 *
 * z is now { a: 3, b: "hi", c: [1,2,3,4], d:0 }.
 *
 * License MIT. Copyright Kerri Shotts 2014
 */
function merge() {
  var t = {},
    args = Array.prototype.slice.call( arguments, 0 );
  args.forEach( function ( s ) {
    Object.keys( s ).forEach( function ( prop ) {
      var e = s[prop];
      if ( e instanceof Array ) {
        if ( t[prop] instanceof Array ) {
          t[prop] = t[prop].concat( e );
        } else if ( !( t[prop] instanceof Object ) || !( t[prop] instanceof Array ) ) {
          t[prop] = e;
        }
      } else if ( e instanceof Object && t[prop] instanceof Object ) {
        t[prop] = merge( t[prop], e );
      } else {
        t[prop] = e;
      }
    } );
  } );
  return t;
}
/**
 * Validates a source against the specified rules. `source` can look like this:
 *
 *     { aString: "hi", aNumber: { hi: 294.12 }, anInteger: 1944.32 }
 *
 * `rules` can look like this:
 *
 *     {
     *       "a-string": {
     *         title: "A String",     -- optional; if not supplied, key is used
     *         key: "aString",        -- optional: if not supplied the name of this rule is used as the key
     *         required: true,        -- optional: if not supplied, value is not required
     *         type: "string",        -- string, number, integer, array, date, boolean, object, *(any)
     *         minLength: 1,          -- optional: minimum length (string, array)
     *         maxLength: 255         -- optional: maximum length (string, array)
     *       },
     *       "a-number": {
     *         title: "A Number",
     *         key: "aNumber.hi",     -- keys can have . and [] to reference properties within objects
     *         required: false,
     *         type: "number",
     *         min: 0,                -- if specified, number/integer can't be smaller than this number
     *         max: 100               -- if specified, number/integer can't be larger than this number
     *       },
     *       "an-integer": {
     *         title: "An Integer",
     *         key: "anInteger",
     *         required: true,
     *         type: "integer",
     *         enum: [1, 2, 4, 8]     -- if specified, the value must be a part of the array
     *                                -- may also be specified as an array of objects with title/value properties
     *       }
     *     }
 *
 * @param {*} source       source to validate
 * @param {*} rules        validation rules
 * @returns {*}            an object with two fields: `validates: true|false` and `message: validation message`
 *
 * LICENSE: MIT
 * Copyright Kerri Shotts, 2014
 */
function validate( source, rules ) {
  var r = {
    validates: true,
    message:   ""
  };
  if ( !( rules instanceof Object ) ) {
    return r;
  }
  // go over each rule in `rules`
  Object.keys( rules ).forEach( function ( prop ) {
    if ( r.validates ) {
      // get the rule
      var rule = rules[prop],
        v = source,
      // and get the value in source
        k = ( rule.key !== undefined ) ? rule.key : prop,
        title = ( rule.title !== undefined ) ? rule.title : prop;
      k = k.replace( "[", "." ).replace( "]", "" ).replace( "\"", "" );
      k.split( "." ).forEach( function ( keyPart ) {
        try {
          v = v[keyPart];
        }
        catch ( err ) {
          v = undefined;
        }
      } );
      // is it required?
      if ( ( ( rule.required !== undefined ) ? rule.required : false ) && v === undefined ) {
        r.validates = false;
        r.message = "Missing required value " + title;
        return;
      }
      // can it be null?
      if ( !( ( rule.nullable !== undefined ) ? rule.nullable : false ) && v === null ) {
        r.validates = false;
        r.message = "Unexpected null in " + title;
        return;
      }
      // is it of the right type?
      if ( v !== null && v !== undefined && v != "" ) {
        r.message = "Type Mismatch; expected " + rule.type + " not " + ( typeof v ) + " in " + title;
        switch ( rule.type ) {
          case "float":
          case "number":
            if ( v !== undefined ) {
              if ( isNaN( parseFloat( v ) ) ) {
                r.validates = false;
                return;
              }
              if ( v != parseFloat( v ) ) {
                r.validates = false;
                return;
              }
            }
            break;
          case "integer":
            if ( v !== undefined ) {
              if ( isNaN( parseInt( v, 10 ) ) ) {
                r.validates = false;
                return;
              }
              if ( v != parseInt( v, 10 ) ) {
                r.validates = false;
                return;
              }
            }
            break;
          case "array":
            if ( v !== undefined && !( v instanceof Array ) ) {
              r.validates = false;
              return;
            }
            break;
          case "date":
            if ( v instanceof Object ) {
              if ( !( v instanceof Date ) ) {
                r.validates = false;
                return;
              } else if ( v instanceof Date && isNaN( v.getTime() ) ) {
                r.validates = false;
                r.message = "Invalid date in " + title;
                return;
              }
            } else if ( typeof v === "string" ) {
              if ( isNaN( ( new Date( v ) ).getTime() ) ) {
                r.validates = false;
                r.message = "Invalid date in " + title;
                return;
              }
            } else if ( !( v instanceof "object" ) && v !== undefined ) {
              r.validates = false;
              return;
            }
            break;
          case "object":
            if ( !( v instanceof Object ) && v !== undefined ) {
              r.validates = false;
              return;
            }
            break;
          case "*":
            break;
          default:
            if ( !( typeof v === rule.type || v === undefined || v === null ) ) {
              r.validates = false;
              return;
            }
        }
        r.message = "";
        // if we're still here, types are good. Now check length, range, and enum
        // check range
        r.message = "Value out of range " + v + " in " + title;
        if ( typeof rule.min === "number" && v < rule.min ) {
          r.validates = false;
          return;
        }
        if ( typeof rule.max === "number" && v > rule.max ) {
          r.validates = false;
          return;
        }
        r.message = "";
        // check length
        if ( ( typeof rule.minLength === "number" && v !== undefined && v.length !== undefined && v.length < rule.minLength ) ||
             ( typeof rule.maxLength === "number" && v !== undefined && v.length !== undefined && v.length > rule.maxLength )
        ) {
          r.message = "" + title + " out of length range";
          r.validates = false;
          return;
        }
        // check enum
        if ( rule.enum instanceof Object && v !== undefined ) {
          if ( rule.enum.filter( function ( e ) {
              if ( e.value !== undefined ) {
                return e.value == v;
              } else {
                return e == v;
              }
            } ).length === 0 ) {
            r.message = "" + title + " contains unexpected value " + v + " in " + title;
            r.validates = false;
            return;
          }
        }
        // check pattern
        if ( rule.pattern instanceof Object && v !== undefined ) {
          if ( v.match( rule.pattern ) === null ) {
            r.message = "" + title + " doesn't match pattern in " + title;
            r.validates = false;
            return;
          }
        }
      }
    }
  } );
  return r;
}
var _y = {
  VERSION:                "0.5.142",
  valueForKeyPath:        valueForKeyPath,
  interpolate:            interpolate,
  merge:                  merge,
  validate:               validate,
  /**
   * Returns an element from the DOM with the specified
   * ID. Similar to (but not like) jQuery's $(), except
   * that this is a pure DOM element.
   * @method ge
   * @alias $id
   * @param  {String} elementId     id to search for, relative to document
   * @return {Node}                 null if no node found
   */
  ge:                     $id.bind( document ),
  $id:                    $id.bind( document ),
  /**
   * Returns an element from the DOM using `querySelector`.
   * @method qs
   * @alias $
   * @alias $1
   * @param {String} selector       CSS selector to search, relative to document
   * @returns {Node}                null if no node found that matches search
   */
  $:                      $.bind( document ),
  $1:                     $.bind( document ),
  qs:                     $.bind( document ),
  /**
   * Returns an array of all elements matching a given
   * selector. The array is processed to be a real array,
   * not a nodeList.
   * @method gac
   * @alias $$
   * @alias qsa
   * @param  {String} selector      CSS selector to search, relative to document
   * @return {Array} of Nodes       Array of nodes; [] if none found
   */
  $$:                     $$.bind( document ),
  gac:                    $$.bind( document ),
  qsa:                    $$.bind( document ),
  /**
   * Returns a Computed CSS Style ready for interrogation if
   * `property` is not defined, or the actual property value
   * if `property` is defined.
   * @method gcs
   * @alias gsc
   * @alias getComputedStyle
   * @param {Node} element  A specific DOM element
   * @param {String} [property]  A CSS property to query
   * @returns {*}
   */
  getComputedStyle:       getComputedStyle,
  gcs:                    getComputedStyle,
  gsc:                    getComputedStyle,
  /**
   * Returns a parsed template. The template can be a simple
   * string, in which case the replacement variable are replaced
   * and returned simply, or the template can be a DOM element,
   * in which case the template is assumed to be the DOM Element's
   * `innerHTML`, and then the replacement variables are parsed.
   *
   * Replacement variables are of the form `%VARIABLE%`, and
   * can occur anywhere, not just within strings in HTML.
   *
   * The replacements array is of the form
   * ```
   *     { "VARIABLE": replacement, "VARIABLE2": replacement, ... }
   * ```
   *
   * If `addtlOptions` is specified, it may override the default
   * options where `%` is used as a substitution marker and `toUpperCase`
   * is used as a transform. For example:
   *
   * ```
   * template ( "Hello, {{name}}", {"name": "Mary"},
   *            { brackets: [ "{{", "}}" ],
     *              transform: "toLowerCase" } );
   * ```
   *
   * @method template
   * @param  {Node|String} templateElement
   * @param  {Object} replacements
   * @return {String}
   */
  template:               function ( templateElement, replacements, addtlOptions ) {
    var brackets = ["%", "%"],
      transform = "toUpperCase",
      templateHTML, theVar, thisVar;
    if ( typeof addtlOptions !== "undefined" ) {
      if ( typeof addtlOptions.brackets !== "undefined" ) {
        brackets = addtlOptions.brackets;
      }
      if ( typeof addtlOptions.transform === "string" ) {
        transform = addtlOptions.transform;
      }
    }
    if ( templateElement instanceof Node ) {
      templateHTML = templateElement.innerHTML;
    } else {
      templateHTML = templateElement;
    }
    for ( theVar in replacements ) {
      if ( replacements.hasOwnProperty( theVar ) ) {
        thisVar = brackets[0];
        if ( transform !== "" ) {
          thisVar += theVar[transform]();
        } else {
          thisVar += theVar;
        }
        thisVar += brackets[1];
        while ( templateHTML.indexOf( thisVar ) > -1 ) {
          templateHTML = templateHTML.replace( thisVar, replacements[theVar] );
        }
      }
    }
    return templateHTML;
  },
  /**
   * Indicates if the app is running in a Cordova container.
   * Only valid if `executeWhenReady` is used to start an app.
   * @property underCordova
   * @default false
   */
  underCordova:           false,
  /**
   * Handles the conundrum of executing a block of code when
   * the mobile device or desktop browser is ready. If running
   * under Cordova, the `deviceready` event will fire, and
   * the `callback` will execute. Otherwise, after 1s, the
   * `callback` will execute *if it hasn't already*.
   *
   * @method executeWhenReady
   * @param {Function} callback
   */
  executeWhenReady:       function ( callback ) {
    var executed = false;
    document.addEventListener( "deviceready", function () {
      if ( !executed ) {
        executed = true;
        _y.underCordova = true;
        if ( typeof callback === "function" ) {
          callback();
        }
      }
    }, false );
    setTimeout( function () {
      if ( !executed ) {
        executed = true;
        _y.underCordova = false;
        if ( typeof callback === "function" ) {
          callback();
        }
      }
    }, 1000 );
  },
  /**
   * > The following functions are related to globalization and localization, which
   * > are now considered to be core functions (previously it was broken out in
   * > PKLOC)
   */
  /**
   * @typedef {String} Locale
   */
  /**
   * Indicates the user's locale. It's only valid after
   * a call to `getUserLocale`, but it can be written to
   * at any time in order to override `getUserLocale`'s
   * calculation of the user's locale.
   *
   * @property currentUserLocale
   * @default (empty string)
   * @type {Locale}
   */
  currentUserLocale:      "",
  /**
   * A translation matrix. Used by `addTranslation(s)` and `T`.
   *
   * @property localizedText
   * @type {Object}
   */
  localizedText:          {},
  /**
   * Given a locale string, normalize it to the form of `la-RE` or `la`, depending on the length.
   * ```
   *     "enus", "en_us", "en_---__--US", "EN-US" --> "en-US"
   *     "en", "en-", "EN!" --> "en"
   * ```
   * @method normalizeLocale
   * @param {Locale} theLocale
   */
  normalizeLocale:        function ( theLocale ) {
    var theNewLocale = theLocale;
    if ( theNewLocale.length < 2 ) {
      throw new Error( "Fatal: invalid locale; not of the format la-RE." );
    }
    var theLanguage = theNewLocale.substr( 0, 2 ).toLowerCase(),
      theRegion = theNewLocale.substr( -2 ).toUpperCase();
    if ( theNewLocale.length < 4 ) {
      theRegion = ""; // there can't possibly be a valid region on a 3-char string
    }
    if ( theRegion !== "" ) {
      theNewLocale = theLanguage + "-" + theRegion;
    } else {
      theNewLocale = theLanguage;
    }
    return theNewLocale;
  },
  /**
   * Sets the current locale for jQuery/Globalize
   * @method setGlobalizationLocale
   * @param {Locale} theLocale
   */
  setGlobalizationLocale: function ( theLocale ) {
    var theNewLocale = _y.normalizeLocale( theLocale );
    Globalize.culture( theNewLocale );
  },
  /**
   * Add a translation to the existing translation matrix
   * @method addTranslation
   * @param {Locale} locale
   * @param {String} key
   * @param {String} value
   */
  addTranslation:         function ( locale, key, value ) {
    var self = _y,
    // we'll store translations with upper-case locales, so case never matters
      theNewLocale = self.normalizeLocale( locale ).toUpperCase();
    // store the value
    if ( typeof self.localizedText[theNewLocale] === "undefined" ) {
      self.localizedText[theNewLocale] = {};
    }
    self.localizedText[theNewLocale][key.toUpperCase()] = value;
  },
  /**
   * Add translations in batch, as follows:
   * ```
   *   {
     *     "HELLO":
     *     {
     *       "en-US": "Hello",
     *       "es-US": "Hola"
     *     },
     *     "GOODBYE":
     *     {
     *       "en-US": "Bye",
     *       "es-US": "Adios"
     *     }
     *   }
   * ```
   * @method addTranslations
   * @param {Object} o
   */
  addTranslations:        function ( o ) {
    var self = _y;
    for ( var key in o ) {
      if ( o.hasOwnProperty( key ) ) {
        for ( var locale in o[key] ) {
          if ( o[key].hasOwnProperty( locale ) ) {
            self.addTranslation( locale, key, o[key][locale] );
          }
        }
      }
    }
  },
  /**
   * Returns the user's locale (e.g., `en-US` or `fr-FR`). If one
   * can't be found, `en-US` is returned. If `currentUserLocale`
   * is already defined, it won't attempt to recalculate it.
   * @method getUserLocale
   * @return {Locale}
   */
  getUserLocale:          function () {
    var self = _y;
    if ( self.currentUserLocale ) {
      return self.currentUserLocale;
    }
    var currentPlatform = "unknown";
    if ( typeof device !== "undefined" ) {
      currentPlatform = device.platform;
    }
    var userLocale = "en-US";
    // a suitable default
    if ( currentPlatform === "Android" ) {
      // parse the navigator.userAgent
      var userAgent = navigator.userAgent,
      // inspired by http://stackoverflow.com/a/7728507/741043
        tempLocale = userAgent.match( /Android.*([a-zA-Z]{2}-[a-zA-Z]{2})/ );
      if ( tempLocale ) {
        userLocale = tempLocale[1];
      }
    } else {
      userLocale = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage;
    }
    self.currentUserLocale = self.normalizeLocale( userLocale );
    return self.currentUserLocale;
  },
  /**
   * Gets the device locale, if available. It depends on the
   * Globalization plugin provided by Cordova, but if the
   * plugin is not available, it assumes the device locale
   * can't be determined rather than throw an error.
   *
   * Once the locale is determined one way or the other, `callback`
   * is called.
   *
   * @method getDeviceLocale
   * @param {Function} callback
   */
  getDeviceLocale:        function ( callback ) {
    var self = _y;
    if ( typeof navigator.globalization !== "undefined" ) {
      if ( typeof navigator.globalization.getLocaleName !== "undefined" ) {
        navigator.globalization.getLocaleName( function ( locale ) {
          self.currentUserLocale = self.normalizeLocale( locale.value );
          if ( typeof callback === "function" ) {
            callback();
          }
        }, function () {
          // error; go ahead and call the callback, but don't set the locale
          console.log( "WARN: Couldn't get user locale from device." );
          if ( typeof callback === "function" ) {
            callback();
          }
        } );
        return;
      }
    }
    if ( typeof callback === "function" ) {
      callback();
    }
  },
  /**
   * Looks up a translation for a given `key` and locale. If
   * the translation does not exist, `undefined` is returned.
   *
   * The `key` is converted to uppercase, and the locale is
   * properly normalized and then converted to uppercase before
   * any lookup is attempted.
   *
   * @method lookupTranslation
   * @param {String} key
   * @param {Locale} [theLocale]
   * @returns {*}
   */
  lookupTranslation:      function ( key, theLocale ) {
    var self = _y,
      upperKey = key.toUpperCase(),
      userLocale = theLocale || self.getUserLocale();
    userLocale = self.normalizeLocale( userLocale ).toUpperCase();
    // look it up by checking if userLocale exists, and then if the key (uppercased) exists
    if ( typeof self.localizedText[userLocale] !== "undefined" ) {
      if ( typeof self.localizedText[userLocale][upperKey] !== "undefined" ) {
        return self.localizedText[userLocale][upperKey];
      }
    }
    // if not found, we don't return anything
    return void( 0 );
  },
  /**
   * @property localeOfLastResort
   * @default "en-US"
   * @type {Locale}
   */
  localeOfLastResort:     "en-US",
  /**
   * @property languageOfLastResort
   * @default "en"
   * @type {Locale}
   */
  languageOfLastResort:   "en",
  /**
   * Convenience function for translating text. Key is the only
   * required value and case doesn't matter (it's uppercased). Replacement
   * variables can be specified using replacement variables of the form `{ "VAR":"VALUE" }`,
   * using `%VAR%` in the key/value returned. If `locale` is specified, it
   * takes precedence over the user's current locale.
   *
   * @method T
   * @param {String} key
   * @param {Object} [parms] replacement variables
   * @param {Locale} [locale]
   */
  T:                      function ( key, parms, locale ) {
    var self = _y,
      userLocale = locale || self.getUserLocale(),
      currentValue;
    if ( typeof ( currentValue = self.lookupTranslation( key, userLocale ) ) === "undefined" ) {
      // we haven't found it under the given locale (of form: xx-XX), try the fallback locale (xx)
      userLocale = userLocale.substr( 0, 2 );
      if ( typeof ( currentValue = self.lookupTranslation( key, userLocale ) ) === "undefined" ) {
        // we haven't found it under any of the given locales; try the language of last resort
        if ( typeof ( currentValue = self.lookupTranslation( key, self.languageOfLastResort ) ) === "undefined" ) {
          // we haven't found it under any of the given locales; try locale of last resort
          if ( typeof ( currentValue = self.lookupTranslation( key, self.localeOfLastResort ) ) === "undefined" ) {
            // we didn't find it at all... we'll use the key
            currentValue = key;
          }
        }
      }
    }
    return self.template( currentValue, parms );
  },
  /**
   * Convenience function for localizing numbers according the format (optional) and
   * the locale (optional). theFormat is typically the number of places to use; "n" if
   * not specified.
   *
   * @method N
   * @param {Number} theNumber
   * @param {Number|String} theFormat
   * @param {Locale} [theLocale]
   */
  N:                      function ( theNumber, theFormat, theLocale ) {
    var self = _y,
      iFormat = "n" + ( ( typeof theFormat === "undefined" ) ? "0" : theFormat ),
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theNumber, iFormat );
  },
  /**
   * Convenience function for localizing currency. theFormat is the number of decimal places
   * or "2" if not specified. If there are more places than digits, padding is added; if there
   * are fewer places, rounding is performed.
   *
   * @method C
   * @param {Number} theNumber
   * @param {String} theFormat
   * @param {Locale} [theLocale]
   */
  C:                      function ( theNumber, theFormat, theLocale ) {
    var self = _y,
      iFormat = "c" + ( ( typeof theFormat === "undefined" ) ? "2" : theFormat ),
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theNumber, iFormat );
  },
  /**
   * Convenience function for localizing percentages. theFormat specifies the number of
   * decimal places; two if not specified.
   * @method PCT
   * @param {Number} theNumber
   * @param {Number} theFormat
   * @param {Locale} [theLocale]
   */
  PCT:                    function ( theNumber, theFormat, theLocale ) {
    var self = _y,
      iFormat = "p" + ( ( typeof theFormat === "undefined" ) ? "2" : theFormat ),
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theNumber, iFormat );
  },
  /**
   * Convenience function for localizing dates.
   *
   * theFormat specifies the format; "d" is assumed if not provided.
   *
   * @method D
   * @param {Date} theDate
   * @param {String} theFormat
   * @param {Locale} [theLocale]
   */
  D:                      function ( theDate, theFormat, theLocale ) {
    var self = _y,
      iFormat = theFormat || "d",
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theDate, iFormat );
  },
  /**
   * Convenience function for jQuery/Globalize's `format` method
   * @method format
   * @param {*} theValue
   * @param {String} theFormat
   * @param {Locale} [theLocale]
   * @returns {*}
   */
  format:                 function ( theValue, theFormat, theLocale ) {
    var self = _y,
      iFormat = theFormat,
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theValue, iFormat );
  }
};
module.exports = _y;

},{}],12:[function(require,module,exports){
/**
 *
 * Provides date/time convenience methods
 *
 * @module datetime.js
 * @author Kerri Shotts
 * @version 0.4
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
module.exports = {
  /**
   * Returns the current time in the Unix time format
   * @method getUnixTime
   * @return {UnixTime}
   */
  getUnixTime:         function () {
    return ( new Date() ).getTime();
  },
  /**
   * # PRECISION_x Constants
   * These specify the amount of precision required for `getPartsFromSeconds`.
   * For example, if `PRECISION_DAYS` is specified, the number of parts obtained
   * consist of days, hours, minutes, and seconds.
   */
  PRECISION_SECONDS:   1,
  PRECISION_MINUTES:   2,
  PRECISION_HOURS:     3,
  PRECISION_DAYS:      4,
  PRECISION_WEEKS:     5,
  PRECISION_YEARS:     6,
  /**
   * @typedef {{fractions: number, seconds: number, minutes: number, hours: number, days: number, weeks: number, years: number}} TimeParts
   */
  /**
   * Takes a given number of seconds and returns an object consisting of the number of seconds, minutes, hours, etc.
   * The value is limited by the precision parameter -- which must be specified. Which ever value is specified will
   * be the maximum limit for the routine; that is `PRECISION_DAYS` will never return a result for weeks or years.
   * @method getPartsFromSeconds
   * @param {number} seconds
   * @param {number} precision
   * @returns {TimeParts}
   */
  getPartsFromSeconds: function ( seconds, precision ) {
    var partValues = [0, 0, 0, 0, 0, 0, 0],
      modValues = [1, 60, 3600, 86400, 604800, 31557600];
    for ( var i = precision; i > 0; i-- ) {
      if ( i === 1 ) {
        partValues[i - 1] = seconds % modValues[i - 1];
      } else {
        partValues[i - 1] = Math.floor( seconds % modValues[i - 1] );
      }
      partValues[i] = Math.floor( seconds / modValues[i - 1] );
      seconds = seconds - partValues[i] * modValues[i - 1];
    }
    return {
      fractions: partValues[0],
      seconds:   partValues[1],
      minutes:   partValues[2],
      hours:     partValues[3],
      days:      partValues[4],
      weeks:     partValues[5],
      years:     partValues[6]
    };
  }
};

},{}],13:[function(require,module,exports){
/**
 *
 * Provides basic device-handling convenience functions for determining if the device
 * is an iDevice or a Droid Device, and what the orientation is.
 *
 * @module device.js
 * @author Kerri Shotts
 * @version 0.5
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module, define, device, navigator, window */
"use strict";
/**
 *
 * PKDEVICE provides simple methods for getting device information, such as platform,
 * form factor, and orientation.
 *
 * @class PKDEVICE
 */
var PKDEVICE = {
  /**
   * The version of the class with major, minor, and rev properties.
   *
   * @property version
   * @type Object
   *
   */
  version:            "0.5.100",
  /**
   * Permits overriding the platform for testing. Leave set to `false` for
   * production applications.
   *
   * @property platformOverride
   * @type boolean
   * @default false
   */
  platformOverride:   false,
  /**
   * Permits overriding the form factor. Usually used for testing.
   *
   * @property formFactorOverride
   * @type boolean
   * @default false
   */
  formFactorOverride: false,
  /**
   *
   * Returns the device platform, lowercased. If PKDEVICE.platformOverride is
   * other than "false", it is returned instead.
   *
   * See PhoneGap's documentation on the full range of platforms that can be
   * returned; without PG available, the method will attemt to determine the
   * platform from `navigator.platform` and the `userAgent`, but only supports
   * iOS and Android in that capacity.
   *
   * @method platform
   * @static
   * @returns {String} the device platform, lowercase.
   */
  platform:           function () {
    if ( PKDEVICE.platformOverride ) {
      return PKDEVICE.platformOverride.toLowerCase();
    }
    if ( typeof device === "undefined" || !device.platform ) {
      // detect mobile devices first
      if ( navigator.platform === "iPad" || navigator.platform === "iPad Simulator" || navigator.platform === "iPhone" ||
           navigator.platform === "iPhone Simulator" || navigator.platform === "iPod" ) {
        return "ios";
      }
      if ( navigator.userAgent.toLowerCase().indexOf( "android" ) > -1 ) {
        return "android";
      }
      // no reason why we can't return other information
      if ( navigator.platform.indexOf( "Mac" ) > -1 ) {
        return "mac";
      }
      if ( navigator.platform.indexOf( "Win" ) > -1 ) {
        return "windows";
      }
      if ( navigator.platform.indexOf( "Linux" ) > -1 ) {
        return "linux";
      }
      return "unknown";
    }
    var thePlatform = device.platform.toLowerCase();
    //
    // turns out that for Cordova > 2.3, deivceplatform now returns iOS, so the
    // following is really not necessary on those versions. We leave it here
    // for those using Cordova <= 2.2.
    if ( thePlatform.indexOf( "ipad" ) > -1 || thePlatform.indexOf( "iphone" ) > -1 ) {
      thePlatform = "ios";
    }
    return thePlatform;
  },
  /**
   *
   * Returns the device's form factor. Possible values are "tablet" and
   * "phone". If PKDEVICE.formFactorOverride is not false, it is returned
   * instead.
   *
   * @method formFactor
   * @static
   * @returns {String} `tablet` or `phone`, as appropriate
   */
  formFactor:         function () {
    if ( PKDEVICE.formFactorOverride ) {
      return PKDEVICE.formFactorOverride.toLowerCase();
    }
    if ( navigator.platform === "iPad" ) {
      return "tablet";
    }
    if ( ( navigator.platform === "iPhone" ) || ( navigator.platform === "iPhone Simulator" ) ) {
      return "phone";
    }
    var ua = navigator.userAgent.toLowerCase();
    if ( ua.indexOf( "android" ) > -1 ) {
      // android reports if it is a phone or tablet based on user agent
      if ( ua.indexOf( "mobile safari" ) > -1 ) {
        return "phone";
      }
      if ( ua.indexOf( "mobile safari" ) < 0 && ua.indexOf( "safari" ) > -1 ) {
        return "tablet";
      }
      if ( ( Math.max( window.screen.width, window.screen.height ) / window.devicePixelRatio ) >= 900 ) {
        return "tablet";
      } else {
        return "phone";
      }
    }
    // the following is hacky, and not guaranteed to work all the time,
    // especially as phones get bigger screens with higher DPI.
    if ( ( Math.max( window.screen.width, window.screen.height ) ) >= 900 ) {
      return "tablet";
    }
    return "phone";
  },
  /**
   * Determines if the device is a tablet (or tablet-sized, more accurately)
   * @return {Boolean}
   */
  isTablet:           function () {
    return PKDEVICE.formFactor() === "tablet";
  },
  /**
   * Determines if the device is a tablet (or tablet-sized, more accurately)
   * @return {Boolean}
   */
  isPhone:            function () {
    return PKDEVICE.formFactor() === "phone";
  },
  /**
   *
   * Determines if the device is in Portrait orientation.
   *
   * @method isPortrait
   * @static
   * @returns {boolean} `true` if the device is in a Portrait orientation; `false` otherwise
   */
  isPortrait:         function () {
    return window.orientation === 0 || window.orientation === 180 || window.location.href.indexOf( "?portrait" ) > -1;
  },
  /**
   *
   * Determines if the device is in Landscape orientation.
   *
   * @method isLandscape
   * @static
   * @returns {boolean} `true` if the device is in a landscape orientation; `false` otherwise
   */
  isLandscape:        function () {
    if ( window.location.href.indexOf( "?landscape" ) > -1 ) {
      return true;
    }
    return !PKDEVICE.isPortrait();
  },
  /**
   *
   * Determines if the device is a hiDPI device (aka retina)
   *
   * @method isRetina
   * @static
   * @returns {boolean} `true` if the device has a `window.devicePixelRatio` greater than `1.0`; `false` otherwise
   */
  isRetina:           function () {
    return window.devicePixelRatio > 1;
  },
  /**
   * Returns `true` if the device is an iPad.
   *
   * @method iPad
   * @static
   * @returns {boolean}
   */
  iPad:               function () {
    return PKDEVICE.platform() === "ios" && PKDEVICE.formFactor() === "tablet";
  },
  /**
   * Returns `true` if the device is an iPhone (or iPod).
   *
   * @method iPhone
   * @static
   * @returns {boolean}
   */
  iPhone:             function () {
    return PKDEVICE.platform() === "ios" && PKDEVICE.formFactor() === "phone";
  },
  /**
   * Returns `true` if the device is an Android Phone.
   *
   * @method droidPhone
   * @static
   * @returns {boolean}
   */
  droidPhone:         function () {
    return PKDEVICE.platform() === "android" && PKDEVICE.formFactor() === "phone";
  },
  /**
   * Returns `true` if the device is an Android Tablet.
   *
   * @method droidTablet
   * @static
   * @returns {boolean}
   */
  droidTablet:        function () {
    return PKDEVICE.platform() === "android" && PKDEVICE.formFactor() === "tablet";
  }
};
module.exports = PKDEVICE;

},{}],14:[function(require,module,exports){
/**
 *
 * FileManager implements methods that interact with the HTML5 API
 *
 * @module fileManager.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*globals module, define, Q, LocalFileSystem, console, window, navigator, FileReader*/
var Q = require( "../../q" );
var BaseObject = require( "./object.js" );
"use strict";
var IN_YASMF = true;
return (function ( Q, BaseObject, globalContext, module ) {
  /**
   * Defined by Q, actually, but defined here to make type handling nicer
   * @typedef {{}} Promise
   */
  var DEBUG = false;

  /**
   * Requests a quota from the file system
   * @method _requestQuota
   * @private
   * @param  {*} fileSystemType    PERSISTENT or TEMPORARY
   * @param  {Number} requestedDataSize The quota we're asking for
   * @return {Promise}                   The promise
   */
  function _requestQuota( fileSystemType, requestedDataSize ) {
    var deferred = Q.defer();
    if ( DEBUG ) {
      console.log( ["_requestQuota: ", fileSystemType, requestedDataSize].join( " " ) );
    }
    try {
      // attempt to ask for a quota
      var PERSISTENT = ( typeof LocalFileSystem !== "undefined" ) ? LocalFileSystem.PERSISTENT : window.PERSISTENT,
      // Chrome has `webkitPersistentStorage` and `navigator.webkitTemporaryStorage`
        storageInfo = fileSystemType === PERSISTENT ? navigator.webkitPersistentStorage : navigator.webkitTemporaryStorage;
      if ( storageInfo ) {
        // now make sure we can request a quota
        if ( storageInfo.requestQuota ) {
          // request the quota
          storageInfo.requestQuota( requestedDataSize, function success( grantedBytes ) {
            if ( DEBUG ) {
              console.log( ["_requestQuota: quota granted: ", fileSystemType,
                            grantedBytes
                           ].join( " " ) );
            }
            deferred.resolve( grantedBytes );
          }, function failure( anError ) {
            if ( DEBUG ) {
              console.log( ["_requestQuota: quota rejected: ", fileSystemType,
                            requestedDataSize, anError
                           ].join( " " ) );
            }
            deferred.reject( anError );
          } );
        } else {
          // not everything supports asking for a quota -- like Cordova.
          // Instead, let's assume we get permission
          if ( DEBUG ) {
            console.log( ["_requestQuota: couldn't request quota -- no requestQuota: ",
                          fileSystemType, requestedDataSize
                         ].join( " " ) );
          }
          deferred.resolve( requestedDataSize );
        }
      } else {
        if ( DEBUG ) {
          console.log( ["_requestQuota: couldn't request quota -- no storageInfo: ",
                        fileSystemType, requestedDataSize
                       ].join( " " ) );
        }
        deferred.resolve( requestedDataSize );
      }
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Request a file system with the requested size (obtained first by getting a quota)
   * @method _requestFileSystem
   * @private
   * @param  {*} fileSystemType    TEMPORARY or PERSISTENT
   * @param  {Number} requestedDataSize The quota
   * @return {Promise}                   The promise
   */
  function _requestFileSystem( fileSystemType, requestedDataSize ) {
    var deferred = Q.defer();
    if ( DEBUG ) {
      console.log( ["_requestFileSystem: ", fileSystemType, requestedDataSize].join( " " ) );
    }
    try {
      // fix issue #2 by chasen where using `webkitRequestFileSystem` was having problems
      // on Android 4.2.2
      var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
      requestFileSystem( fileSystemType, requestedDataSize, function success( theFileSystem ) {
        if ( DEBUG ) {
          console.log( ["_requestFileSystem: got a file system", theFileSystem].join( " " ) );
        }
        deferred.resolve( theFileSystem );
      }, function failure( anError ) {
        if ( DEBUG ) {
          console.log( ["_requestFileSystem: couldn't get a file system",
                        fileSystemType
                       ].join( " " ) );
        }
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Resolves theURI to a fileEntry or directoryEntry, if possible.
   * If `theURL` contains `private` or `localhost` as its first element, it will be removed. If
   * `theURL` does not have a URL scheme, `file://` will be assumed.
   * @method _resolveLocalFileSystemURL
   * @private
   * @param  {String} theURL the path, should start with file://, but if it doesn't we'll add it.
   */
  function _resolveLocalFileSystemURL( theURL ) {
    var deferred = Q.defer();
    if ( DEBUG ) {
      console.log( ["_resolveLocalFileSystemURL: ", theURL].join( " " ) );
    }
    try {
      // split the parts of the URL
      var parts = theURL.split( ":" ),
        protocol, path;
      // can only have two parts
      if ( parts.length > 2 ) {
        throw new Error( "The URI is not well-formed; missing protocol: " + theURL );
      }
      // if only one part, we assume `file` as the protocol
      if ( parts.length < 2 ) {
        protocol = "file";
        path = parts[0];
      } else {
        protocol = parts[0];
        path = parts[1];
      }
      // split the path components
      var pathComponents = path.split( "/" ),
        newPathComponents = [];
      // iterate over each component and trim as we go
      pathComponents.forEach( function ( part ) {
        part = part.trim();
        if ( part !== "" ) { // remove /private if it is the first item in the new array, for iOS sake
          if ( !( ( part === "private" || part === "localhost" ) && newPathComponents.length === 0 ) ) {
            newPathComponents.push( part );
          }
        }
      } );
      // rejoin the path components
      var theNewURI = newPathComponents.join( "/" );
      // add the protocol
      theNewURI = protocol + ":///" + theNewURI;
      // and resolve the URL.
      window.resolveLocalFileSystemURL( theNewURI, function ( theEntry ) {
        deferred.resolve( theEntry );
      }, function ( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * @typedef {{}} DirectoryEntry
   * HTML5 File API Directory Type
   */
  /**
   * Returns a directory entry based on the path from the parent using
   * the specified options, if specified. `options` takes the form:
   * ` {create: true/false, exclusive true/false }`
   * @method _getDirectoryEntry
   * @private
   * @param  {DirectoryEntry} parent  The parent that path is relative from (or absolute)
   * @param  {String} path    The relative or absolute path or a {DirectoryEntry}
   * @param  {Object} options The options (that is, create the directory if it doesn't exist, etc.)
   * @return {Promise}         The promise
   */
  function _getDirectoryEntry( parent, path, options ) {
    if ( DEBUG ) {
      console.log( ["_getDirectoryEntry:", parent, path, options].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      if ( typeof path === "object" ) {
        deferred.resolve( path );
      } else {
        parent.getDirectory( path, options || {}, function success( theDirectoryEntry ) {
          deferred.resolve( theDirectoryEntry );
        }, function failure( anError ) {
          deferred.reject( anError );
        } );
      }
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Returns a file entry based on the path from the parent using
   * the specified options. `options` takes the form of `{ create: true/false, exclusive: true/false}`
   * @method getFileEntry
   * @private
   * @param  {DirectoryEntry} parent  The parent that path is relative from (or absolute)
   * @param  {String} path    The relative or absolute path
   * @param  {Object} options The options (that is, create the file if it doesn't exist, etc.)
   * @return {Promise}         The promise
   */
  function _getFileEntry( parent, path, options ) {
    if ( DEBUG ) {
      console.log( ["_getFileEntry:", parent, path, options].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      if ( typeof path === "object" ) {
        deferred.resolve( path );
      } else {
        parent.getFile( path, options || {}, function success( theFileEntry ) {
          deferred.resolve( theFileEntry );
        }, function failure( anError ) {
          deferred.reject( anError );
        } );
      }
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * @typedef {{}} FileEntry
   * HTML5 File API File Entry
   */
  /**
   * Returns a file object based on the file entry.
   * @method _getFileObject
   * @private
   * @param  {FileEntry} fileEntry The file Entry
   * @return {Promise}           The Promise
   */
  function _getFileObject( fileEntry ) {
    if ( DEBUG ) {
      console.log( ["_getFileObject:", fileEntry].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      fileEntry.file( function success( theFile ) {
        deferred.resolve( theFile );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Reads the file contents from a file object. readAsKind indicates how
   * to read the file ("Text", "DataURL", "BinaryString", "ArrayBuffer").
   * @method _readFileContents
   * @private
   * @param  {File} fileObject File to read
   * @param  {String} readAsKind "Text", "DataURL", "BinaryString", "ArrayBuffer"
   * @return {Promise}            The Promise
   */
  function _readFileContents( fileObject, readAsKind ) {
    if ( DEBUG ) {
      console.log( ["_readFileContents:", fileObject, readAsKind].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      var fileReader = new FileReader();
      fileReader.onloadend = function ( e ) {
        deferred.resolve( e.target.result );
      };
      fileReader.onerror = function ( anError ) {
        deferred.reject( anError );
      };
      fileReader["readAs" + readAsKind]( fileObject );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Creates a file writer for the file entry; `fileEntry` must exist
   * @method _createFileWriter
   * @private
   * @param  {FileEntry} fileEntry The file entry to write to
   * @return {Promise}           the Promise
   */
  function _createFileWriter( fileEntry ) {
    if ( DEBUG ) {
      console.log( ["_createFileWriter:", fileEntry].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      var fileWriter = fileEntry.createWriter( function success( theFileWriter ) {
        deferred.resolve( theFileWriter );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * @typedef {{}} FileWriter
   * HTML5 File API File Writer Type
   */
  /**
   * Write the contents to the fileWriter; `contents` should be a Blob.
   * @method _writeFileContents
   * @private
   * @param  {FileWriter} fileWriter Obtained from _createFileWriter
   * @param  {*} contents   The contents to write
   * @return {Promise}            the Promise
   */
  function _writeFileContents( fileWriter, contents ) {
    if ( DEBUG ) {
      console.log( ["_writeFileContents:", fileWriter, contents].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      fileWriter.onwrite = function ( e ) {
        fileWriter.onwrite = function ( e ) {
          deferred.resolve( e );
        };
        fileWriter.write( contents );
      };
      fileWriter.onError = function ( anError ) {
        deferred.reject( anError );
      };
      fileWriter.truncate( 0 ); // clear out the contents, first
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Copy the file to the specified parent directory, with an optional new name
   * @method _copyFile
   * @private
   * @param  {FileEntry} theFileEntry            The file to copy
   * @param  {DirectoryEntry} theParentDirectoryEntry The parent directory to copy the file to
   * @param  {String} theNewName              The new name of the file ( or undefined simply to copy )
   * @return {Promise}                         The Promise
   */
  function _copyFile( theFileEntry, theParentDirectoryEntry, theNewName ) {
    if ( DEBUG ) {
      console.log( ["_copyFile:", theFileEntry, theParentDirectoryEntry,
                    theNewName
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theFileEntry.copyTo( theParentDirectoryEntry, theNewName, function success( theNewFileEntry ) {
        deferred.resolve( theNewFileEntry );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Move the file to the specified parent directory, with an optional new name
   * @method _moveFile
   * @private
   * @param  {FileEntry} theFileEntry            The file to move or rename
   * @param  {DirectoryEntry} theParentDirectoryEntry The parent directory to move the file to (or the same as the file in order to rename)
   * @param  {String} theNewName              The new name of the file ( or undefined simply to move )
   * @return {Promise}                         The Promise
   */
  function _moveFile( theFileEntry, theParentDirectoryEntry, theNewName ) {
    if ( DEBUG ) {
      console.log( ["_moveFile:", theFileEntry, theParentDirectoryEntry,
                    theNewName
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theFileEntry.moveTo( theParentDirectoryEntry, theNewName, function success( theNewFileEntry ) {
        deferred.resolve( theNewFileEntry );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Remove the file from the file system
   * @method _removeFile
   * @private
   * @param  {FileEntry} theFileEntry The file to remove
   * @return {Promise}              The Promise
   */
  function _removeFile( theFileEntry ) {
    if ( DEBUG ) {
      console.log( ["_removeFile:", theFileEntry].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theFileEntry.remove( function success() {
        deferred.resolve();
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Copies a directory to the specified directory, with an optional new name. The directory
   * is copied recursively.
   * @method _copyDirectory
   * @private
   * @param  {DirectoryEntry} theDirectoryEntry       The directory to copy
   * @param  {DirectoryEntry} theParentDirectoryEntry The parent directory to copy the first directory to
   * @param  {String} theNewName              The optional new name for the directory
   * @return {Promise}                         A promise
   */
  function _copyDirectory( theDirectoryEntry, theParentDirectoryEntry, theNewName ) {
    if ( DEBUG ) {
      console.log( ["_copyDirectory:", theDirectoryEntry,
                    theParentDirectoryEntry,
                    theNewName
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theDirectoryEntry.copyTo( theParentDirectoryEntry, theNewName, function success( theNewDirectoryEntry ) {
        deferred.resolve( theNewDirectoryEntry );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Moves a directory to the specified directory, with an optional new name. The directory
   * is moved recursively.
   * @method _moveDirectory
   * @private
   * @param  {DirectoryEntry} theDirectoryEntry       The directory to move
   * @param  {DirectoryEntry} theParentDirectoryEntry The parent directory to move the first directory to
   * @param  {String} theNewName              The optional new name for the directory
   * @return {Promise}                         A promise
   */
  function _moveDirectory( theDirectoryEntry, theParentDirectoryEntry, theNewName ) {
    if ( DEBUG ) {
      console.log( ["_moveDirectory:", theDirectoryEntry,
                    theParentDirectoryEntry,
                    theNewName
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theDirectoryEntry.moveTo( theParentDirectoryEntry, theNewName, function success( theNewDirectoryEntry ) {
        deferred.resolve( theNewDirectoryEntry );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Removes a directory from the file system. If recursively is true, the directory is removed
   * recursively.
   * @method _removeDirectory
   * @private
   * @param  {DirectoryEntry} theDirectoryEntry The directory to remove
   * @param  {Boolean} recursively       If true, remove recursively
   * @return {Promise}                   The Promise
   */
  function _removeDirectory( theDirectoryEntry, recursively ) {
    if ( DEBUG ) {
      console.log( ["_removeDirectory:", theDirectoryEntry, "recursively",
                    recursively
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      if ( !recursively ) {
        theDirectoryEntry.remove( function success() {
          deferred.resolve();
        }, function failure( anError ) {
          deferred.reject( anError );
        } );
      } else {
        theDirectoryEntry.removeRecursively( function success() {
          deferred.resolve();
        }, function failure( anError ) {
          deferred.reject( anError );
        } );
      }
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Reads the contents of a directory
   * @method _readDirectoryContents
   * @private
   * @param  {DirectoryEntry} theDirectoryEntry The directory to list
   * @return {Promise}                   The promise
   */
  function _readDirectoryContents( theDirectoryEntry ) {
    if ( DEBUG ) {
      console.log( ["_readDirectoryContents:", theDirectoryEntry].join( " " ) );
    }
    var directoryReader = theDirectoryEntry.createReader(),
      entries = [],
      deferred = Q.defer();

    function readEntries() {
      directoryReader.readEntries( function success( theEntries ) {
        if ( !theEntries.length ) {
          deferred.resolve( entries );
        } else {
          entries = entries.concat( Array.prototype.slice.call( theEntries || [], 0 ) );
          readEntries();
        }
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }

    try {
      readEntries();
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * @class FileManager
   */
  var _className = "UTIL.FileManager",
    FileManager = function () {
      var self,
      // determine if we have a `BaseObject` available or not
        hasBaseObject = ( typeof BaseObject !== "undefined" );
      if ( hasBaseObject ) {
        // if we do, subclass it
        self = new BaseObject();
        self.subclass( _className );
        self.registerNotification( "changedCurrentWorkingDirectory" );
      } else {
        // otherwise, base off {}
        self = {};
      }
      // get the persistent and temporary filesystem constants
      self.PERSISTENT = ( typeof LocalFileSystem !== "undefined" ) ? LocalFileSystem.PERSISTENT : window.PERSISTENT;
      self.TEMPORARY = ( typeof LocalFileSystem !== "undefined" ) ? LocalFileSystem.TEMPORARY : window.TEMPORARY;
      // determine the various file types we support
      self.FILETYPE = {
        TEXT:         "Text",
        DATA_URL:     "DataURL",
        BINARY:       "BinaryString",
        ARRAY_BUFFER: "ArrayBuffer"
      };
      /**
       * Returns the value of the global `DEBUG` variable.
       * @method getGlobalDebug
       * @returns {Boolean}
       */
      self.getGlobalDebug = function () {
        return DEBUG;
      };
      /**
       * Sets the global DEBUG variable. If `true`, debug messages are logged to the console.
       * @method setGlobalDebug
       * @param {Boolean} debug
       */
      self.setGlobalDebug = function ( debug ) {
        DEBUG = debug;
      };
      /**
       * @property globalDebug
       * @type {Boolean} If `true`, logs messages to console as operations occur.
       */
      Object.defineProperty( self, "globalDebug", {
        get:          self.getGlobalDebug,
        set:          self.setGlobalDebug,
        configurable: true
      } );
      /**
       * the fileSystemType can either be `self.PERSISTENT` or `self.TEMPORARY`, and is only
       * set during an `init` operation. It cannot be set at any other time.
       * @property fileSystemType
       * @type {FileSystem}
       */
      self._fileSystemType = null; // can only be changed during INIT
      self.getFileSystemType = function () {
        return self._fileSystemType;
      };
      Object.defineProperty( self, "fileSystemType", {
        get:          self.getFileSystemType,
        configurable: true
      } );
      /**
       * The requested quota -- stored for future reference, since we ask for it
       * specifically during an `init` operation. It cannot be changed.
       * @property requestedQuota
       * @type {Number}
       */
      self._requestedQuota = 0; // can only be changed during INIT
      self.getRequestedQuota = function () {
        return self._requestedQuota;
      };
      Object.defineProperty( self, "requestedQuota", {
        get:          self.getRequestedQuota,
        configurable: true
      } );
      /**
       * The actual quota obtained from the system. It cannot be changed, and is
       * only obtained during `init`. The result does not have to match the
       * `requestedQuota`. If it doesn't match, it may be representative of the
       * actual space available, depending on the platform
       * @property actualQuota
       * @type {Number}
       */
      self._actualQuota = 0;
      self.getActualQuota = function () {
        return self._actualQuota;
      };
      Object.defineProperty( self, "actualQuota", {
        get:          self.getActualQuota,
        configurable: true
      } );
      /**
       * @typedef {{}} FileSystem
       * HTML5 File API File System
       */
      /**
       * The current filesystem -- either the temporary or persistent one; it can't be changed
       * @property fileSystem
       * @type {FileSystem}
       */
      self._fileSystem = null;
      self.getFileSystem = function () {
        return self._fileSystem;
      };
      Object.defineProperty( self, "fileSystem", {
        get:          self.getFileSystem,
        configurable: true
      } );
      /**
       * Current Working Directory Entry
       * @property cwd
       * @type {DirectoryEntry}
       */
      self._root = null;
      self._cwd = null;
      self.getCurrentWorkingDirectory = function () {
        return self._cwd;
      };
      self.setCurrentWorkingDirectory = function ( theCWD ) {
        self._cwd = theCWD;
        if ( hasBaseObject ) {
          self.notify( "changedCurrentWorkingDirectory" );
        }
      };
      Object.defineProperty( self, "cwd", {
        get:          self.getCurrentWorkingDirectory,
        set:          self.setCurrentWorkingDirectory,
        configurable: true
      } );
      Object.defineProperty( self, "currentWorkingDirectory", {
        get:          self.getCurrentWorkingDirectory,
        set:          self.setCurrentWorkingDirectory,
        configurable: true
      } );
      /**
       * Current Working Directory stack
       * @property _cwds
       * @private
       * @type {Array}
       */
      self._cwds = [];
      /**
       * Push the current working directory on to the stack
       * @method pushCurrentWorkingDirectory
       */
      self.pushCurrentWorkingDirectory = function () {
        self._cwds.push( self._cwd );
      };
      /**
       * Pop the topmost directory on the stack and change to it
       * @method popCurrentWorkingDirectory
       */
      self.popCurrentWorkingDirectory = function () {
        self.setCurrentWorkingDirectory( self._cwds.pop() );
      };
      /**
       * Resolves a URL to a local file system. If the URL scheme is not present, `file`
       * is assumed.
       * @param {String} theURI The URI to resolve
       */
      self.resolveLocalFileSystemURL = function ( theURI ) {
        var deferred = Q.defer();
        _resolveLocalFileSystemURL( theURI ).then( function gotEntry( theEntry ) {
          deferred.resolve( theEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns the file entry for the given path (useful for
       * getting the full path of a file). `options` is of the
       * form `{create: true/false, exclusive: true/false}`
       * @method getFileEntry
       * @param {String} theFilePath The file path or FileEntry object
       * @param {*} options creation options
       */
      self.getFileEntry = function ( theFilePath, options ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options ).then( function gotFileEntry( theFileEntry ) {
          deferred.resolve( theFileEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns the file object for a given file (useful for getting
       * the size of a file); `option` is of the form `{create: true/false, exclusive: true/false}`
       * @method getFile
       * @param {String} theFilePath
       * @param {*} option
       */
      self.getFile = function ( theFilePath, options ) {
        return self.getFileEntry( theFilePath, options ).then( _getFileObject );
      };
      /**
       * Returns the directory entry for a given path
       * @method getDirectoryEntry
       * @param {String} theDirectoryPath
       * @param {*} options
       */
      self.getDirectoryEntry = function ( theDirectoryPath, options ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theDirectoryPath, options ).then( function gotDirectoryEntry( theDirectoryEntry ) {
          deferred.resolve( theDirectoryEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * returns the URL for a given file
       * @method getFileURL
       * @param {String} theFilePath
       * @param {*} options
       */
      self.getFileURL = function ( theFilePath, options ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options ).then( function gotFileEntry( theFileEntry ) {
          deferred.resolve( theFileEntry.toURL() );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns a URL for the given directory
       * @method getDirectoryURL
       * @param {String} thePath
       * @param {*} options
       */
      self.getDirectoryURL = function ( thePath, options ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, thePath || ".", options ).then( function gotDirectoryEntry( theDirectoryEntry ) {
          deferred.resolve( theDirectoryEntry.toURL() );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns the native URL for an entry by combining the `fullPath` of the entry
       * with the `nativeURL` of the `root` directory if absolute or of the `current`
       * directory if not absolute.
       * @method getNativeURL
       * @param {String} theEntry Path of the file or directory; can also be a File/DirectoryEntry
       */
      self.getNativeURL = function ( theEntry ) {
        var thePath = theEntry;
        if ( typeof theEntry !== "string" ) {
          thePath = theEntry.fullPath();
        }
        var isAbsolute = ( thePath.substr( 0, 1 ) === "/" ),
          theRootPath = isAbsolute ? self._root.nativeURL : self.cwd.nativeURL;
        return theRootPath + ( isAbsolute ? "" : "/" ) + thePath;
      };
      /**
       * returns the native file path for a given file
       * @method getNativeFileURL
       * @param {String} theFilePath
       * @param {*} options
       */
      self.getNativeFileURL = function ( theFilePath, options ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options ).then( function gotFileEntry( theFileEntry ) {
          deferred.resolve( theFileEntry.nativeURL );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns a URL for the given directory
       * @method getNativeDirectoryURL
       * @param {String} thePath
       * @param {*} options
       */
      self.getNativeDirectoryURL = function ( thePath, options ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, thePath || ".", options ).then( function gotDirectoryEntry( theDirectoryEntry ) {
          deferred.resolve( theDirectoryEntry.nativeURL );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Change to an arbitrary directory
       * @method changeDirectory
       * @param  {String} theNewPath The path to the directory, relative to cwd
       * @return {Promise}            The Promise
       */
      self.changeDirectory = function ( theNewPath ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theNewPath, {} ).then( function gotDirectory( theNewDirectory ) {
          self.cwd = theNewDirectory;
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Read an arbitrary file's contents.
       * @method readFileContents
       * @param  {String} theFilePath The path to the file, relative to cwd
       * @param  {Object} options     The options to use when opening the file (such as creating it)
       * @param  {String} readAsKind  How to read the file -- best to use self.FILETYPE.TEXT, etc.
       * @return {Promise}             The Promise
       */
      self.readFileContents = function ( theFilePath, options, readAsKind ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options || {} ).then( function gotTheFileEntry( theFileEntry ) {
          return _getFileObject( theFileEntry );
        } ).then( function gotTheFileObject( theFileObject ) {
          return _readFileContents( theFileObject, readAsKind || "Text" );
        } ).then( function getTheFileContents( theFileContents ) {
          deferred.resolve( theFileContents );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Read an arbitrary directory's entries.
       * @method readDirectoryContents
       * @param  {String} theDirectoryPath The path to the directory, relative to cwd; "." if not specified
       * @param  {Object} options          The options to use when opening the directory (such as creating it)
       * @return {Promise}             The Promise
       */
      self.readDirectoryContents = function ( theDirectoryPath, options ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theDirectoryPath || ".", options || {} ).then( function gotTheDirectoryEntry( theDirectoryEntry ) {
          return _readDirectoryContents( theDirectoryEntry );
        } ).then( function gotTheDirectoryEntries( theEntries ) {
          deferred.resolve( theEntries );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Write data to an arbitrary file
       * @method writeFileContents
       * @param  {String} theFilePath The file name to write to, relative to cwd
       * @param  {Object} options     The options to use when opening the file
       * @param  {*} theData     The data to write
       * @return {Promise}             The Promise
       */
      self.writeFileContents = function ( theFilePath, options, theData ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options || {
          create:    true,
          exclusive: false
        } ).then( function gotTheFileEntry( theFileEntry ) {
          return _createFileWriter( theFileEntry );
        } ).then( function gotTheFileWriter( theFileWriter ) {
          return _writeFileContents( theFileWriter, theData );
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Creates an arbitrary directory
       * @method createDirectory
       * @param  {String} theDirectoryPath The path, relative to cwd
       * @return {Promise}                  The Promise
       */
      self.createDirectory = function ( theDirectoryPath ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theDirectoryPath, {
          create:    true,
          exclusive: false
        } ).then( function gotDirectory( theNewDirectory ) {
          deferred.resolve( theNewDirectory );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Copies a file to a new directory, with an optional new name
       * @method copyFile
       * @param  {String} sourceFilePath      Path to file, relative to cwd
       * @param  {String} targetDirectoryPath Path to new directory, relative to cwd
       * @param  {String} withNewName         New name, if desired
       * @return {Promise}                     The Promise
       */
      self.copyFile = function ( sourceFilePath, targetDirectoryPath, withNewName ) {
        var deferred = Q.defer(),
          theFileToCopy;
        _getFileEntry( self._cwd, sourceFilePath, {} ).then( function gotFileEntry( aFileToCopy ) {
          theFileToCopy = aFileToCopy;
          return _getDirectoryEntry( self._cwd, targetDirectoryPath, {} );
        } ).then( function gotDirectoryEntry( theTargetDirectory ) {
          return _copyFile( theFileToCopy, theTargetDirectory, withNewName );
        } ).then( function allDone( theNewFileEntry ) {
          deferred.resolve( theNewFileEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Copies a directory to a new directory, with an optional new name
       * @method copyDirectory
       * @param  {String} sourceDirectoryPath Path to directory, relative to cwd
       * @param  {String} targetDirectoryPath Path to new directory, relative to cwd
       * @param  {String} withNewName         New name, if desired
       * @return {Promise}                     The Promise
       */
      self.copyDirectory = function ( sourceDirectoryPath, targetDirectoryPath, withNewName ) {
        var deferred = Q.defer(),
          theDirectoryToCopy;
        _getDirectoryEntry( self._cwd, sourceDirectoryPath, {} ).then( function gotSourceDirectoryEntry( sourceDirectoryEntry ) {
          theDirectoryToCopy = sourceDirectoryEntry;
          return _getDirectoryEntry( self._cwd, targetDirectoryPath, {} );
        } ).then( function gotTargetDirectoryEntry( theTargetDirectory ) {
          return _copyDirectory( theDirectoryToCopy, theTargetDirectory, withNewName );
        } ).then( function allDone( theNewDirectoryEntry ) {
          deferred.resolve( theNewDirectoryEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * @method moveFile
       * Moves a file to a new directory, with an optional new name
       * @param  {String} sourceFilePath      Path to file, relative to cwd
       * @param  {String} targetDirectoryPath Path to new directory, relative to cwd
       * @param  {String} withNewName         New name, if desired
       * @return {Promise}                     The Promise
       */
      self.moveFile = function ( sourceFilePath, targetDirectoryPath, withNewName ) {
        var deferred = Q.defer(),
          theFileToMove;
        _getFileEntry( self._cwd, sourceFilePath, {} ).then( function gotFileEntry( aFileToMove ) {
          theFileToMove = aFileToMove;
          return _getDirectoryEntry( self._cwd, targetDirectoryPath, {} );
        } ).then( function gotDirectoryEntry( theTargetDirectory ) {
          return _moveFile( theFileToMove, theTargetDirectory, withNewName );
        } ).then( function allDone( theNewFileEntry ) {
          deferred.resolve( theNewFileEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Moves a directory to a new directory, with an optional new name
       * @method moveDirectory
       * @param  {String} sourceDirectoryPath Path to directory, relative to cwd
       * @param  {String} targetDirectoryPath Path to new directory, relative to cwd
       * @param  {String} withNewName         New name, if desired
       * @return {Promise}                     The Promise
       */
      self.moveDirectory = function ( sourceDirectoryPath, targetDirectoryPath, withNewName ) {
        var deferred = Q.defer(),
          theDirectoryToMove;
        _getDirectoryEntry( self._cwd, sourceDirectoryPath, {} ).then( function gotSourceDirectoryEntry( sourceDirectoryEntry ) {
          theDirectoryToMove = sourceDirectoryEntry;
          return _getDirectoryEntry( self._cwd, targetDirectoryPath, {} );
        } ).then( function gotTargetDirectoryEntry( theTargetDirectory ) {
          return _moveDirectory( theDirectoryToMove, theTargetDirectory, withNewName );
        } ).then( function allDone( theNewDirectoryEntry ) {
          deferred.resolve( theNewDirectoryEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Renames a file to a new name, in the cwd
       * @method renameFile
       * @param  {String} sourceFilePath      Path to file, relative to cwd
       * @param  {String} withNewName         New name
       * @return {Promise}                     The Promise
       */
      self.renameFile = function ( sourceFilePath, withNewName ) {
        return self.moveFile( sourceFilePath, ".", withNewName );
      };
      /**
       * Renames a directory to a new name, in the cwd
       * @method renameDirectory
       * @param  {String} sourceDirectoryPath Path to directory, relative to cwd
       * @param  {String} withNewName         New name
       * @return {Promise}                     The Promise
       */
      self.renameDirectory = function ( sourceDirectoryPath, withNewName ) {
        return self.moveDirectory( sourceDirectoryPath, ".", withNewName );
      };
      /**
       * Deletes a file
       * @method deleteFile
       * @param  {String} theFilePath Path to file, relative to cwd
       * @return {Promise}             The Promise
       */
      self.deleteFile = function ( theFilePath ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, {} ).then( function gotTheFileToDelete( theFileEntry ) {
          return _removeFile( theFileEntry );
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Removes a directory, possibly recursively
       * @method removeDirectory
       * @param  {String} theDirectoryPath path to directory, relative to cwd
       * @param  {Boolean} recursively      If true, recursive remove
       * @return {Promise}                  The promise
       */
      self.removeDirectory = function ( theDirectoryPath, recursively ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theDirectoryPath, {} ).then( function gotTheDirectoryToDelete( theDirectoryEntry ) {
          return _removeDirectory( theDirectoryEntry, recursively );
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Asks the browser for the requested quota, and then requests the file system
       * and sets the cwd to the root directory.
       * @method _initializeFileSystem
       * @private
       * @return {Promise} The promise
       */
      self._initializeFileSystem = function () {
        var deferred = Q.defer();
        _requestQuota( self.fileSystemType, self.requestedQuota ).then( function gotQuota( theQuota ) {
          self._actualQuota = theQuota;
          return _requestFileSystem( self.fileSystemType, self.actualQuota );
        } ).then( function gotFS( theFS ) {
          self._fileSystem = theFS;
          //self._cwd = theFS.root;
          return _getDirectoryEntry( theFS.root, "", {} );
        } ).then( function gotRootDirectory( theRootDirectory ) {
          self._root = theRootDirectory;
          self._cwd = theRootDirectory;
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      if ( self.overrideSuper ) {
        self.overrideSuper( self.class, "init", self.init );
      }
      /**
       * Initializes the file manager with the requested file system type (self.PERSISTENT or self.TEMPORARY)
       * and requested quota size. Both must be specified.
       * @method init
       * @param {FileSystem} fileSystemType
       * @param {Number} requestedQuota
       */
      self.init = function ( fileSystemType, requestedQuota ) {
        if ( self.super ) {
          self.super( _className, "init" );
        }
        if ( typeof fileSystemType === "undefined" ) {
          throw new Error( "No file system type specified; specify PERSISTENT or TEMPORARY." );
        }
        if ( typeof requestedQuota === "undefined" ) {
          throw new Error( "No quota requested. If you don't know, specify ZERO." );
        }
        self._requestedQuota = requestedQuota;
        self._fileSystemType = fileSystemType;
        return self._initializeFileSystem(); // this returns a promise, so we can .then after.
      };
      /**
       * Initializes the file manager with the requested file system type (self.PERSISTENT or self.TEMPORARY)
       * and requested quota size. Both must be specified.
       * @method initWithOptions
       * @param {*} options
       */
      self.initWithOptions = function ( options ) {
        if ( typeof options === "undefined" ) {
          throw new Error( "No options specified. Need type and quota." );
        }
        if ( typeof options.fileSystemType === "undefined" ) {
          throw new Error( "No file system type specified; specify PERSISTENT or TEMPORARY." );
        }
        if ( typeof options.requestedQuota === "undefined" ) {
          throw new Error( "No quota requested. If you don't know, specify ZERO." );
        }
        return self.init( options.fileSystemType, options.requestedQuota );
      };
      return self;
    };
  // meta information
  FileManager.meta = {
    version:           "00.04.450",
    class:             _className,
    autoInitializable: false,
    categorizable:     false
  };
  // assign to `window` if stand-alone
  if ( globalContext ) {
    globalContext.FileManager = FileManager;
  }
  if ( module ) {
    module.exports = FileManager;
  }
})( Q, BaseObject, ( typeof IN_YASMF !== "undefined" ) ? undefined : window, module );

},{"../../q":1,"./object.js":18}],15:[function(require,module,exports){
/**
 *
 * Provides convenience methods for parsing unix-style path names. If the
 * path separator is changed from "/" to "\", it should parse Windows paths as well.
 *
 * @module filename.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
var PKFILE = {
  /**
   * @property Version
   * @type {String}
   */
  version:              "00.04.100",
  /**
   * Specifies the characters that are not allowed in file names.
   * @property invalidCharacters
   * @default ["/","\",":","|","<",">","*","?",";","%"]
   * @type {Array}
   */
  invalidCharacters:    "/,\\,:,|,<,>,*,?,;,%".split( "," ),
  /**
   * Indicates the character that separates a name from its extension,
   * as in "filename.ext".
   * @property extensionSeparator
   * @default "."
   * @type {String}
   */
  extensionSeparator:   ".",
  /**
   * Indicates the character that separates path components.
   * @property pathSeparator
   * @default "/"
   * @type {String}
   */
  pathSeparator:        "/",
  /**
   * Indicates the character used when replacing invalid characters
   * @property replacementCharacter
   * @default "-"
   * @type {String}
   */
  replacementCharacter: "-",
  /**
   * Converts a potential invalid filename to a valid filename by replacing
   * invalid characters (as specified in "invalidCharacters") with "replacementCharacter".
   *
   * @method makeValid
   * @param  {String} theFileName
   * @return {String}
   */
  makeValid:            function ( theFileName ) {
    var self = PKFILE;
    var theNewFileName = theFileName;
    for ( var i = 0; i < self.invalidCharacters.length; i++ ) {
      var d = 0;
      while ( theNewFileName.indexOf( self.invalidCharacters[i] ) > -1 && ( d++ ) < 50 ) {
        theNewFileName = theNewFileName.replace( self.invalidCharacters[i], self.replacementCharacter );
      }
    }
    return theNewFileName;
  },
  /**
   * Returns the name+extension portion of a full path.
   *
   * @method getFilePart
   * @param  {String} theFileName
   * @return {String}
   */
  getFilePart:          function ( theFileName ) {
    var self = PKFILE;
    var theSlashPosition = theFileName.lastIndexOf( self.pathSeparator );
    if ( theSlashPosition < 0 ) {
      return theFileName;
    }
    return theFileName.substr( theSlashPosition + 1, theFileName.length - theSlashPosition );
  },
  /**
   * Returns the path portion of a full path.
   * @method getPathPart
   * @param  {String} theFileName
   * @return {String}
   */
  getPathPart:          function ( theFileName ) {
    var self = PKFILE;
    var theSlashPosition = theFileName.lastIndexOf( self.pathSeparator );
    if ( theSlashPosition < 0 ) {
      return "";
    }
    return theFileName.substr( 0, theSlashPosition + 1 );
  },
  /**
   * Returns the filename, minus the extension.
   * @method getFileNamePart
   * @param  {String} theFileName
   * @return {String}
   */
  getFileNamePart:      function ( theFileName ) {
    var self = PKFILE;
    var theFileNameNoPath = self.getFilePart( theFileName );
    var theDotPosition = theFileNameNoPath.lastIndexOf( self.extensionSeparator );
    if ( theDotPosition < 0 ) {
      return theFileNameNoPath;
    }
    return theFileNameNoPath.substr( 0, theDotPosition );
  },
  /**
   * Returns the extension of a filename
   * @method getFileExtensionPart
   * @param  {String} theFileName
   * @return {String}
   */
  getFileExtensionPart: function ( theFileName ) {
    var self = PKFILE;
    var theFileNameNoPath = self.getFilePart( theFileName );
    var theDotPosition = theFileNameNoPath.lastIndexOf( self.extensionSeparator );
    if ( theDotPosition < 0 ) {
      return "";
    }
    return theFileNameNoPath.substr( theDotPosition + 1, theFileNameNoPath.length - theDotPosition - 1 );
  }
};
module.exports = PKFILE;

},{}],16:[function(require,module,exports){
/**
 *
 * # h - simple DOM templating
 *
 * @module h.js
 * @author Kerri Shotts
 * @version 0.1
 *
 * ```
 * Copyright (c) 2014 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 *
 * Generates a DOM tree (or just a single node) based on a series of method calls
 * into **h**. **h** has one root method (`el`) that creates all DOM elements, but also has
 * helper methods for each HTML tag. This means that a UL can be created simply by
 * calling `h.ul`.
 *
 * Technically there's no such thing as a template using this library, but functions
 * encapsulating a series of h calls function as an equivalent if properly decoupled
 * from their surrounds.
 *
 * Templates are essentially methods attached to the DOM using `h.renderTo(templateFn(context,...))`
 * and return DOM node elements or arrays. For example:
 *
 * ```
 * function aTemplate ( context ) {
 *   return h.div (
 *     [ h.span ( context.title ), h.span ( context.description ) ]
 *   );
 * };
 * ```
 *
 * The resulting DOM tree looks like this (assuming `context` is defined as
 * `{title: "Title", description: "Description"}`:
 *
 * ```
 * <div>
 *   <span>Title</span>
 *   <span>Description</span>
 * </div>
 * ```
 *
 * Template results are added to the DOM using `h.renderTo`:
 *
 * ```
 * h.renderTo ( aDOMElement, aTemplate ( context ) );
 * ```
 *
 * Technically `appendChild` could be used, but it's possible that an attribute
 * might just return an array of DOM nodes, in which case `appendChild` fails.
 *
 * There are also a variety of utility methods defined in **h**, such as:
 * - `forEach ( arr, fn )` -- this executes `arr.map(fn)`.
 * - `forIn ( object, fn )` -- iterates over each property owned by `object` and calls `fn`
 * - `ifdef ( expr, a, b )` -- determines if `expr` is defined, and if so, returns `a`, otherwise `b`
 * - `iif ( expr, a, b )` -- returns `a` if `expr` evaluates to true, otherwise `b`
 *
 * When constructing Node elements using `h`, it's important to recognize that an underlying
 * function called `el` is being called (and can be called directly). The order parameters here is
 * somewhat malleable - only the first parameter must be the tag name (when using `el`). Otherwise,
 * the options for the tag must be within the first three parameters. The text content or value content
 * for the tag must be in the same first three parameters. For example:
 *
 * ```
 * return h.el("div", { attrs: { id: "anElement" } }, "Text content");
 * ```
 *
 * is equivalent to:
 *
 * ```
 * return h.el("div", "Text Content", { attrs: { id: "anElement" } } );
 * ```
 *
 * which is also in turn equivalent to:
 *
 * ```
 * return h.div("Text Content", { attrs: { id: "anElement" } } );
 * ```
 *
 * If an object has both text and value content (like buttons), the first string or number is used
 * as the `value` and the second is used as `textContent`:
 *
 * ```
 * return h.button("This goes into value attribute", "This is in textContent");
 * ```
 *
 * So why `el` and `h.div` equivalents? If you need to specify a custom tag OR want to use shorthand
 * you'll want to use `el`. If you don't need to specify shorthand properties, use the easier-to-read
 * `h.tagName`. For example:
 *
 * ```
 * return h.p ( "paragraph content" );
 * return h.el ( "p", "paragraph content" );
 *
 * return h.el ( "input#txtUsername.bigField?type=text&size=20", "starting value" );
 * return h.input ( { attrs: { type: "text", size: "20", class: "bigField", id: "txtUserName" } },
 *                  "starting value" );
 * ```
 *
 * When specifying tag options, you have several options that can be specified:
 * * attributes using `attrs` object
 * * styles using `styles` object
 * * event handlers using `on` object
 * * hammer handlers using `hammer` object
 * * data binding using `bind` object
 * * store element references to a container object using `storeTo` object
 *
 *
 */
/*global module, Node, document*/
"use strict";
var BaseObject = require( "./object" );
/**
 *
 * internal private method to handle parsing children
 * and attaching them to their parents
 *
 * If the child is a `Node`, it is attached directly to the parent as a child
 * If the child is a `function`, the *resuts* are re-parsed, ultimately to be attached to the parent
 *   as children
 * If the child is an `Array`, each element within the array is re-parsed, ultimately to be attached
 *   to the parent as children
 *
 * @method handleChild
 * @private
 * @param {Array|Function|Node} child       child to handle and attach
 * @param {Node} parent                     parent
 *
 */
function handleChild( child, parent ) {
  if ( typeof child === "object" ) {
    if ( child instanceof Array ) {
      for ( var i = 0, l = child.length; i < l; i++ ) {
        handleChild( child[i], parent );
      }
    }
    if ( child instanceof Node ) {
      parent.appendChild( child );
    }
  }
  if ( typeof child === "function" ) {
    handleChild( child(), parent );
  }
}
/**
 * parses an incoming tag into its tag `name`, `id`, and `class` constituents
 * A tag is of the form `tagName.class#id` or `tagName#id.class`. The `id` and `class`
 * are optional.
 *
 * If attributes need to be supplied, it's possible via the `?` query string. Attributes
 * are of the form `?attr=value&attr=value...`.
 *
 * @method parseTag
 * @private
 * @param {string} tag      tag to parse
 * @return {*} Object of the form `{ tag: tagName, id: id, class: class, query: query, queryPars: Array }`
 */
function parseTag( tag ) {
  var tagParts = {
      tag:        "",
      id:         undefined,
      class:      undefined,
      query:      undefined,
      queryParts: []
    },
    hashPos = tag.indexOf( "#" ),
    dotPos = tag.indexOf( "." ),
    qmPos = tag.indexOf( "?" );
  if ( qmPos >= 0 ) {
    tagParts.query = tag.substr( qmPos + 1 );
    tagParts.queryParts = tagParts.query.split( "&" );
    tag = tag.substr( 0, qmPos );
  }
  if ( hashPos < 0 && dotPos < 0 ) {
    tagParts.tag = tag;
    return tagParts;
  }
  if ( hashPos >= 0 && dotPos < 0 ) {
    tagParts.tag = tag.substr( 0, hashPos );
    tagParts.id = tag.substr( hashPos + 1 );
    return tagParts;
  }
  if ( dotPos >= 0 && hashPos < 0 ) {
    tagParts.tag = tag.substr( 0, dotPos );
    tagParts.class = tag.substr( dotPos + 1 );
    return tagParts;
  }
  if ( dotPos >= 0 && hashPos >= 0 && hashPos < dotPos ) {
    tagParts.tag = tag.substr( 0, hashPos );
    tagParts.id = tag.substr( hashPos + 1, ( dotPos - hashPos ) - 1 );
    tagParts.class = tag.substr( dotPos + 1 );
    return tagParts;
  }
  if ( dotPos >= 0 && hashPos >= 0 && dotPos < hashPos ) {
    tagParts.tag = tag.substr( 0, dotPos );
    tagParts.class = tag.substr( dotPos + 1, ( hashPos - dotPos ) - 1 );
    tagParts.id = tag.substr( hashPos + 1 );
    return tagParts;
  }
  return tagParts;
}
var globalEvents = {},
  renderEvents = {};
var globalSequence = 0;

function getAndSetElementId( e ) {
  var id = e.getAttribute( "id" );
  if ( id === undefined || id === null ) {
    globalSequence++;
    id = "h-y-" + globalSequence;
    e.setAttribute( "id", id );
  }
  return id;
}
/**
 * h templating engine
 */
var h = {
    VERSION:       "0.1.100",
    useDomMerging: false,
    debug:         false,
    _globalEvents: globalEvents,
    _renderEvents: renderEvents,
    /* experimental! */
    /**
     * Returns a DOM tree containing the requested element and any further child
     * elements (as extra parameters)
     *
     * `tagOptions` should be an object consisting of the following optional segments:
     *
     * ```
     * {
       *    attrs: {...}                     attributes to add to the element
       *    styles: {...}                    style attributes to add to the element
       *    on: {...}                        event handlers to attach to the element
       *    hammer: {...}                    hammer handlers
       *    bind: { object:, keyPath:, keyType: }      data binding
       *    store: { object:, keyPath:, idOnly: }     store element to object.keyPath
       * }
     * ```
     *
     * @method el
     * @param {string} tag                 tag of the form `tagName.class#id` or `tagName#id.class`
     *                                     tag can also specify attributes:
     *                                        `input?type=text&size=20`
     * @param {*} tagOptions               options for the tag (see above)
     * @param {Array|Function|String} ...  children that should be attached
     * @returns {Node}                     DOM tree
     *
     */
    el:            function ( tag ) {
      var e, i, l, f, evt,
        options,
        content = [],
        contentTarget = [],
        bindValue,
        tagParts = parseTag( tag ),
        elid,
        events = [];

      // parse tag; it should be of the form `tag[#id][.class][?attr=value[&attr=value...]`
      // create the element; if `@DF` is used, a document fragment is used instead
      if ( tagParts.tag !== "@DF" ) {
        e = document.createElement( tagParts.tag );
      } else {
        e = document.createDocumentFragment();
      }
      // attach the `class` and `id` from the tag name, if available
      if ( tagParts.class !== undefined ) {
        e.className = tagParts.class;
      }
      if ( tagParts.id !== undefined ) {
        elid = tagParts.id;
        e.setAttribute( "id", tagParts.id );
      }
      // get the arguments as an array, ignoring the first parameter
      var args = Array.prototype.slice.call( arguments, 1 );
      // determine what we've passed in the second/third parameter
      // if it is an object (but not a node or array), it's a list of
      // options to attach to the element. If it is a string, it's text
      // content that should be added using `textContent` or `value`
      // > note: we could parse the entire argument list, but that would
      // > a bit absurd.
      for ( i = 0; i < 3; i++ ) {
        if ( typeof args[0] !== "undefined" ) {
          if ( typeof args[0] === "object" ) {
            // could be a DOM node, an array, or tag options
            if ( !( args[0] instanceof Node ) && !( args[0] instanceof Array ) ) {
              options = args.shift();
            }
          }
          if ( typeof args[0] === "string" || typeof args[0] === "number" ) {
            // this is text content
            content.push( args.shift() );
          }
        }
      }
      // copy over any `queryParts` attributes
      if ( tagParts.queryParts.length > 0 ) {
        var arr;
        for ( i = 0, l = tagParts.queryParts.length; i < l; i++ ) {
          arr = tagParts.queryParts[i].split( "=" );
          if ( arr.length === 2 ) {
            e.setAttribute( arr[0].trim(), arr[1].trim() );
          }
        }
      }
      // copy over any attributes and styles in `options.attrs` and `options.style`
      if ( typeof options === "object" && options !== null ) {
        // add attributes
        if ( options.attrs ) {
          for ( var attr in options.attrs ) {
            if ( options.attrs.hasOwnProperty( attr ) ) {
              if ( options.attrs[attr] !== undefined && options.attrs[attr] !== null ) {
                e.setAttribute( attr, options.attrs[attr] );
              }
            }
          }
        }
        // add styles
        if ( options.styles ) {
          for ( var style in options.styles ) {
            if ( options.styles.hasOwnProperty( style ) ) {
              if ( options.styles[style] !== undefined && options.styles[style] !== null ) {
                e.style[style] = options.styles[style];
              }
            }
          }
        }
        // add event handlers; handler property is expected to be a valid DOM
        // event, i.e. `{ "change": function... }` or `{ change: function... }`
        // if the handler is an object, it must be of the form
        // ```
        //   { handler: function ...,
        //     capture: true/false }
        // ```
        if ( options.on ) {
          for ( evt in options.on ) {
            if ( options.on.hasOwnProperty( evt ) ) {
              if ( typeof options.on[evt] === "function" ) {
                f = options.on[evt].bind( e );
                /*events.push( {
                 type: "on",
                 evt: evt,
                 handler: f,
                 capture: false
                 } ); */
                e.addEventListener( evt, f, false );
              } else {
                f = options.on[evt].handler.bind( e );
                /*events.push( {
                 type: "on",
                 evt: evt,
                 handler: f,
                 capture: typeof options.on[ evt ].capture !== "undefined" ? options.on[ evt ].capture : false
                 } ); */
                e.addEventListener( evt, f, typeof options.on[evt].capture !== "undefined" ? options.on[evt].capture :
                                            false );
              }
            }
          }
        }
        // we support hammer too, assuming we're given a reference
        // it must be of the form `{ hammer: { gesture: { handler: fn, options: }, hammer: hammer } }`
        if ( options.hammer ) {
          var hammer = options.hammer.hammer;
          for ( evt in options.hammer ) {
            if ( options.hammer.hasOwnProperty( evt ) && evt !== "hammer" ) {
              /*events.push( {
               type: "hammer",
               evt: evt,
               hammer: hammer,
               options: options.hammer[ evt ]
               } );*/
              hammer( e, options.hammer[evt].options ).on( evt, options.hammer[evt].handler );
            }
          }
        }
        // allow elements to be stored into a context
        // store must be an object of the form `{object:objectRef, keyPath: "keyPath", [idOnly:true|false] }`
        // if idOnly is true, only the element's id is stored
        if ( options.store ) {
          if ( options.store.idOnly ) {
            elid = getAndSetElementId( e );
            options.store.object[options.store.keyPath] = elid;
          } else {
            options.store.object[options.store.keyPath] = e;
          }
        }
      }
      // if we have content, go ahead and add it;
      // if we're an element that has a `value`, we attach it to the value
      // property instead of `textContent`. If `textContent` is not available
      // we use `innerText`; if that's not available, we complain and do
      // nothing. Falling back to `innerHTML` isn't an option, as that's what
      // we are explicitly trying to avoid.
      //
      // First, determine if we have `value` and `textContent` options or only
      // `textContent` (buttons have both) If both are present, the first
      // content item is applied to `value`, and the second is applied to
      // `textContent`|`innerText`
      if ( typeof e.value !== "undefined" ) {
        contentTarget.push( "value" );
      }
      if ( ( typeof e.textContent !== "undefined" ) || ( typeof e.innerText !== "undefined" ) ) {
        contentTarget.push( typeof e.textContent !== "undefined" ? "textContent" : "innerText" );
      }
      for ( i = 0, l = contentTarget.length; i < l; i++ ) {
        var x = content.shift();
        if ( typeof x !== "undefined" ) {
          e[contentTarget[i]] = x;
        }
      }
      // Handle children; `handleChild` appends each one to the parent
      var child;
      for ( i = 0, l = args.length; i < l; i++ ) {
        child = args[i];
        handleChild( child, e );
      }
      if ( typeof options === "object" && options !== null ) {
        // Data binding only occurs if using YASMF's BaseObject for now (built-in pubsub/observables)
        // along with observable properties
        // the binding object is of the form `{ object: objectRef, keyPath: "keyPath", [keyType:"string"] }`
        if ( options.bind ) {
          if ( typeof BaseObject !== "undefined" ) {
            if ( options.bind.object instanceof BaseObject ) {
              elid = getAndSetElementId( e );
              // we have an object that has observable properties
              options.bind.object.dataBindOn( e, options.bind.keyPath, options.bind.keyType );
              options.bind.object.notifyDataBindingElementsForKeyPath( options.bind.keyPath );
            }
          }
        }
      }
      //renderEvents[elid] = events;
      // return the element (and associated tree)
      return e;
    },
    /**
     * mapTo - Maps a keypath to another keypath based on `map`. `map` should look like this:
     *
     * ```
     * {
       *   "mapping_key": "target_key", ...
       * }
     * ```
     *
     * For example, let's assume that some object `o` has the properties `id` and `name`. We
     * want to map these to consistent values like `value` and `description` for a component.
     * `map` should look like this: `{ "value": "id", "description": "name" }`. In this case
     * calling `mapTo("value", map)` would return `id`, which could then be indexed on `o`
     * like so: `o[mapTo("value",map)]`.
     *
     * @method mapTo
     * @param  {String}    keyPath to map
     * @param  {*} map     map description
     * @return {String}    mapped keyPath
     */
    mapTo:         function mapTo( keyPath, map ) {
      if ( typeof map === "undefined" ) {
        return keyPath;
      }
      if ( typeof map[keyPath] !== "undefined" ) {
        return map[keyPath];
      } else {
        return keyPath;
      }
    },
    /**
     * iif - evaluate `expr` and if it is `true`, return `a`. If it is false,
     * return `b`. If `a` is not supplied, `true` is the return result if `a`
     * would have been returned. If `b` is not supplied, `false` is the return
     * result if `b` would have been returned. Not much difference than the
     * ternary (`?:`) operator, but might be easier to read for some.
     *
     * @method iif
     * @param  {boolean} expr expression to evaluate
     * @param  {*} a     value to return if `expr` is true; `true` is the default if not supplied
     * @param  {*} b     value to return if `expr` is false; `false` is the default if not supplied
     * @return {*}       `expr ? a : b`
     */
    iif:           function iif( expr, a, b ) {
      return expr ? ( ( typeof a !== "undefined" ) ? a : true ) : ( ( typeof b !== "undefined" ) ? b : false );
    },
    /**
     * ifdef - Check if an expression is defined and return `a` if it is and `b`
     * if it isn't. If `a` is not supplied, `a` evaluates to `true` and if `b`
     * is not supplied, `b` evaluates to `false`.
     *
     * @method ifdef
     * @param  {boolean} expr expression to check
     * @param  {*}       a    value to return if expression is defined
     * @param  {*}       b    value to return if expression is not defined
     * @return {*}       a or b
     */
    ifdef:         function ifdef( expr, a, b ) {
      return ( typeof expr !== "undefined" ) ? ( ( typeof a !== "undefined" ) ? a : true ) : ( ( typeof b !== "undefined" ) ?
                                                                                               b : false );
    },
    /**
     * forIn - return an array containing the results of calling `fn` for
     * each property within `object`. Equivalent to `map` on an array.
     *
     * The function should have the signature `( value, object, property )`
     * and return the result. The results will automatically be collated in
     * an array.
     *
     * @method forIn
     * @param  {*}        object object to iterate over
     * @param  {function} fn     function to call
     * @return {Array}           resuts
     */
    forIn:         function forIn( object, fn ) {
      var arr = [];
      for ( var prop in object ) {
        if ( object.hasOwnProperty( prop ) ) {
          arr.push( fn( object[prop], object, prop ) );
        }
      }
      return arr;
    },
    /**
     * forEach - Executes `map` on an array, calling `fn`. Named such because
     * it makes more sense than using `map` in a template, but it means the
     * same thing.
     *
     * @method forEach
     * @param  {Array}    arr Array to iterate
     * @param  {function} fn  Function to call
     * @return {Array}        Array after iteration
     */
    forEach:       function forEach( arr, fn ) {
      return arr.map( fn );
    },
    /**
     * renderTo - Renders a node or array of nodes to a given element. If an
     * array is provided, each is appended in turn.
     *
     * Note: technically you can just use `appendChild` or equivalent DOM
     * methods, but this works only as far as the return result is a single
     * node. Occasionally your template may return an array of nodes, and
     * at that point `appendChild` fails.
     *
     * @method renderTo
     * @param  {Array|Node} n  Array or single node to append to the element
     * @param  {Node} el Element to attach to
     * @param  {Number} idx  index (optional)
     */
    renderTo:      function renderTo( n, el, idx ) {
      function transform( parent, nodeA, nodeB ) {
        var hasChildren = [false, false],
          childNodes = [
            [],
            []
          ],
          _A = 0,
          _B = 1,
          i, l,
          len = [0, 0],
          nodes = [nodeA, nodeB],
          attrs = [
            [],
            []
          ],
          styles = [{}, {}],
          styleKeys = [
            [],
            []
          ],
          events = [
            [],
            []
          ],
          elid = [null, null];
        if ( !nodeA && !nodeB ) {
          // nothing to do.
          return;
        }
        if ( !nodeA && nodeB ) {
          // there's no corresponding element in A; just add B.
          parent.appendChild( nodeB );
          return;
        }
        if ( nodeA && !nodeB ) {
          // there's no corresponding element in B; remove A's element
          nodeA.remove();
          return;
        }
        if ( ( nodeA.nodeType !== nodeB.nodeType ) || ( nodeB.nodeType !== 1 ) ) {
          // if the node types are different, there's no reason to transform tree A -- just replace the whole thing
          parent.replaceChild( nodeB, nodeA );
          return;
        }
        if ( nodeB.classList ) {
          if ( !nodeB.classList.contains( "ui-container" ) && !nodeB.classList.contains( "ui-list" ) && !nodeB.classList.contains(
              "ui-scroll-container" ) ) {
            // if the node types are different, there's no reason to transform tree A -- just replace the whole thing
            parent.replaceChild( nodeB, nodeA );
            return;
          }
        }
        // set up for transforming this node
        nodes.forEach( function init( node, idx ) {
          hasChildren[idx] = node.hasChildNodes();
          len[idx] = node.childNodes.length;
          if ( node.getAttribute ) {
            elid[idx] = node.getAttribute( "id" );
          }
          if ( node.childNodes ) {
            childNodes[idx] = [].slice.call( node.childNodes, 0 );
          }
          if ( node.attributes ) {
            attrs[idx] = [].slice.call( node.attributes, 0 );
          }
          if ( node.styles ) {
            styles[idx] = node.style;
            styleKeys[idx] = Object.keys( styles[idx] );
          }
        } );
        //events[_A] = globalEvents[elid[_A]] || [];
        //events[_B] = renderEvents[elid[_B]] || [];
        // transform all our children
        for ( i = 0, l = Math.max( len[_A], len[_B] ); i < l; i++ ) {
          transform( nodeA, childNodes[_A][i], childNodes[_B][i] );
        }
        // copy attributes
        for ( i = 0, l = Math.max( attrs[_A].length, attrs[_B].length ); i < l; i++ ) {
          if ( attrs[_A][i] ) {
            if ( !nodeB.hasAttribute( attrs[_A][i].name ) ) {
              // remove any attributes that aren't present in B
              nodeA.removeAttribute( attrs[_A][i].name );
            }
          }
          if ( attrs[_B][i] ) {
            nodeA.setAttribute( attrs[_B][i].name, attrs[_B][i].value );
          }
        }
        // copy styles
        for ( i = 0, l = Math.max( styles[_A].length, styles[_B].length ); i < l; i++ ) {
          if ( styles[_A][i] ) {
            if ( !( styleKeys[_B][i] in styleKeys[_A] ) ) {
              // remove any styles that aren't present in B
              nodeA.style[styleKeys[_B][i]] = null;
            }
          }
          if ( styles[_B][i] ) {
            nodeA.style[styleKeys[_B][i]] = styles[_B][styleKeys[_B][i]];
          }
        }
        // copy events
        /*for ( i = 0, l = Math.max( events[ _A ].length, events[ _B ].length ); i < l; i++ ) {
         [ 0, 1 ].forEach( function doANode( whichNode ) {
         var evt = events[ whichNode ][ i ],
         node = nodes[ whichNode ],
         handler;
         if ( evt ) {
         switch ( evt.type ) {
         case "on":
         handler = whichNode === _A ? "removeEventListener" : "addEventListener";
         nodeA[ handler ]( evt.evt, evt.handler, evt.capture );
         break;
         case "hammer":
         handler = whichNode === _A ? "off" : "on";
         console.log( handler, nodeA, evt.evt, evt.options.handler );
         evt.hammer( nodeA, evt.options.options )[ handler ]( evt.evt, evt.options.handler );
         break;
         default:
         }
         }
         } );
         }
         if ( elid[ _A ] ) {
         globalEvents[ elid[ _A ] ] = null;
         delete globalEvents[ elid[ _A ] ];
         }
         if ( elid[ _B ] ) {
         globalEvents[ elid[ _B ] ] = renderEvents[ elid[ _B ] ];
         renderEvents[ elid[ _B ] ] = null;
         delete renderEvents[ elid[ _B ] ];
         }*/
      }

      if ( !idx ) {
        idx = 0;
      }
      if ( n instanceof Array ) {
        for ( var i = 0, l = n.length; i < l; i++ ) {
          if ( n[i] !== undefined && n[i] !== null ) {
            renderTo( n[i], el, i );
          }
        }
      } else {
        if ( n === undefined || n === null || el === undefined || el === null ) {
          return;
        }
        var elid = [null, null];
        /*if ( n ) {
         elid[1] = n.getAttribute( "id" );
         }*/
        if ( el.hasChildNodes() && idx < el.childNodes.length ) {
          elid[0] = el.childNodes[idx].getAttribute( "id" );
          if ( h.useDomMerging ) {
            transform( el, el.childNodes[idx], n );
          } else {
            el.replaceChild( n, el.childNodes[idx] );
          }
        } else {
          el.appendChild( n );
        }
        /*
         if ( elid[ 0 ] ) {
         globalEvents[ elid[ 0 ] ] = null;
         delete globalEvents[ elid[ 0 ] ];
         }
         if ( elid[ 1 ] ) {
         globalEvents[ elid[ 1 ] ] = renderEvents[ elid[ 1 ] ];
         renderEvents[ elid[ 1 ] ] = null;
         delete renderEvents[ elid[ 1 ] ];
         }*/
      }
    }
  },
// create bindings for each HTML element (from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
  els = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi",
         "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code",
         "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div",
         "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frameset", "h1",
         "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "isindex",
         "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta",
         "meter", "nav", "nobr", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture",
         "plaintext", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "shadow", "small",
         "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template",
         "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"
  ];
els.forEach( function ( el ) {
  h[el] = h.el.bind( h, el );
} );
// bind document fragment too
h.DF = h.el.bind( h, "@DF" );
h.dF = h.DF;
module.exports = h;

},{"./object":18}],17:[function(require,module,exports){
/**
 *
 * Provides miscellaneous functions that had no other category.
 *
 * @module misc.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
module.exports = {
  /**
   * Returns a pseudo-UUID. Not guaranteed to be unique (far from it, probably), but
   * close enough for most purposes. You should handle collisions gracefully on your
   * own, of course. see http://stackoverflow.com/a/8809472
   * @method makeFauxUUID
   * @return {String}
   */
  makeFauxUUID: function () {
    var d = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace( /[xy]/g, function ( c ) {
      var r = ( d + Math.random() * 16 ) % 16 | 0;
      d = Math.floor( d / 16 );
      return ( c === "x" ? r : ( r & 0x7 | 0x8 ) ).toString( 16 );
    } );
    return uuid;
  }
};

},{}],18:[function(require,module,exports){
/**
 *
 * # Base Object
 *
 * @module object.js
 * @author Kerri Shotts
 * @version 0.5
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module, console, setTimeout*/
"use strict";
var _className = "BaseObject",
  /**
   * BaseObject is the base object for all complex objects used by YASMF;
   * simpler objects that are properties-only do not inherit from this
   * class.
   *
   * BaseObject provides simple inheritance, but not by using the typical
   * prototypal method. Rather inheritance is formed by object composition
   * where all objects are instances of BaseObject with methods overridden
   * instead. As such, you can *not* use any Javascript type checking to
   * differentiate PKObjects; you should instead use the `class`
   * property.
   *
   * BaseObject provides inheritance to more than just a constructor: any
   * method can be overridden, but it is critical that the super-chain
   * be properly initialized. See the `super` and `overrideSuper`
   * methods for more information.
   *
   * @class BaseObject
   */
  BaseObject = function () {
    var self = this;
    /**
     *
     * We need a way to provide inheritance. Most methods only provide
     * inheritance across the constructor chain, not across any possible
     * method. But for our purposes, we need to be able to provide for
     * overriding any method (such as drawing, touch responses, etc.),
     * and so we implement inheritance in a different way.
     *
     * First, the _classHierarchy, a private property, provides the
     * inheritance tree. All objects inherit from "BaseObject".
     *
     * @private
     * @property _classHierarchy
     * @type Array
     * @default ["BaseObject"]
     */
    self._classHierarchy = [_className];
    /**
     *
     * Objects are subclassed using this method. The newClass is the
     * unique class name of the object (and should match the class'
     * actual name.
     *
     * @method subclass
     * @param {String} newClass - the new unique class of the object
     */
    self.subclass = function ( newClass ) {
      self._classHierarchy.push( newClass );
    };
    /**
     *
     * getClass returns the current class of the object. The
     * `class` property can be used as well. Note that there
     * is no `setter` for this property; an object's class
     * can *not* be changed.
     *
     * @method getClass
     * @returns {String} the class of the instance
     *
     */
    self.getClass = function () {
      return self._classHierarchy[self._classHierarchy.length - 1];
    };
    /**
     *
     * The class of the instance. **Read-only**
     * @property class
     * @type String
     * @readOnly
     */
    Object.defineProperty( self, "class", {
      get:          self.getClass,
      configurable: false
    } );
    /**
     *
     * Returns the super class for the given class. If the
     * class is not supplied, the class is assumed to be the
     * object's own class.
     *
     * The property "superClass" uses this to return the
     * object's direct superclass, but getSuperClassOfClass
     * can be used to determine superclasses higher up
     * the hierarchy.
     *
     * @method getSuperClassOfClass
     * @param {String} [aClass=currentClass] the class for which you want the super class. If not specified,
     *                                        the instance's class is used.
     * @returns {String} the super-class of the specified class.
     */
    self.getSuperClassOfClass = function ( aClass ) {
      var theClass = aClass || self.class;
      var i = self._classHierarchy.indexOf( theClass );
      if ( i > -1 ) {
        return self._classHierarchy[i - 1];
      } else {
        return null;
      }
    };
    /**
     *
     * The superclass of the instance.
     * @property superClass
     * @type String
     */
    Object.defineProperty( self, "superClass", {
      get:          self.getSuperClassOfClass,
      configurable: false
    } );
    /**
     *
     * _super is an object that stores overridden functions by class and method
     * name. This is how we get the ability to arbitrarily override any method
     * already present in the superclass.
     *
     * @private
     * @property _super
     * @type Object
     */
    self._super = {};
    /**
     *
     * Must be called prior to defining the overridden function as this moves
     * the original function into the _super object. The functionName must
     * match the name of the method exactly, since there may be a long tree
     * of code that depends on it.
     *
     * @method overrideSuper
     * @param {String} theClass  the class for which the function override is desired
     * @param {String} theFunctionName  the name of the function to override
     * @param {Function} theActualFunction  the actual function (or pointer to function)
     *
     */
    self.overrideSuper = function ( theClass, theFunctionName, theActualFunction ) {
      var superClass = self.getSuperClassOfClass( theClass );
      if ( !self._super[superClass] ) {
        self._super[superClass] = {};
      }
      self._super[superClass][theFunctionName] = theActualFunction;
    };
    /**
     * @method override
     *
     * Overrides an existing function with the same name as `theNewFunction`. Essentially
     * a call to `overrideSuper (self.class, theNewFunction.name, self[theNewFunction.name])`
     * followed by the redefinition of the function.
     *
     * @example
     * ```
     * obj.override ( function initWithOptions ( options )
     *                { ... } );
     * ```
     *
     * @param {Function} theNewFunction - The function to override. Must have the name of the overriding function.
     */
    self.override = function ( theNewFunction ) {
      var theFunctionName = theNewFunction.name,
        theOldFunction = self[theFunctionName];
      if ( theFunctionName !== "" ) {
        self.overrideSuper( self.class, theFunctionName, theOldFunction );
        self[theFunctionName] = function __super__() {
          var ret,
            old$class = self.$class,
            old$superclass = self.$superclass,
            old$super = self.$super;
          self.$class = self.class;
          self.$superclass = self.superClass;
          self.$super = function $super() {
            return theOldFunction.apply( this, arguments );
          };
          try {
            ret = theNewFunction.apply( this, arguments );
          }
          catch ( err ) {
            throw err;
          }
          finally {
            self.$class = old$class;
            self.$superclass = old$superclass;
            self.$super = old$super;
          }
          return ret;
        };
      }
    };
    /**
     *
     * Calls a super function with any number of arguments.
     *
     * @method super
     * @param {String} theClass  the current class instance
     * @param {String} theFunctionName the name of the function to execute
     * @param {Array} [args]  Any number of parameters to pass to the super method
     *
     */
    self.super = function ( theClass, theFunctionName, args ) {
      var superClass = self.getSuperClassOfClass( theClass );
      if ( self._super[superClass] ) {
        if ( self._super[superClass][theFunctionName] ) {
          return self._super[superClass][theFunctionName].apply( self, args );
        }
        return null;
      }
      return null;
    };
    /**
     * Category support; for an object to get category support for their class,
     * they must call this method prior to any auto initialization
     *
     * @method _constructObjectCategories
     *
     */
    self._constructObjectCategories = function _constructObjectCategories( pri ) {
      var priority = BaseObject.ON_CREATE_CATEGORY;
      if ( typeof pri !== "undefined" ) {
        priority = pri;
      }
      if ( typeof BaseObject._objectCategories[priority][self.class] !== "undefined" ) {
        BaseObject._objectCategories[priority][self.class].forEach( function ( categoryConstructor ) {
          try {
            categoryConstructor( self );
          }
          catch ( e ) {
            console.log( "Error during category construction: " + e.message );
          }
        } );
      }
    };
    /**
     *
     * initializes the object
     *
     * @method init
     *
     */
    self.init = function () {
      self._constructObjectCategories( BaseObject.ON_INIT_CATEGORY );
      return self;
    };
    /*
     *
     * Objects have some properties that we want all objects to have...
     *
     */
    /**
     * Stores the values of all the tags associated with the instance.
     *
     * @private
     * @property _tag
     * @type Object
     */
    self._tags = {};
    /**
     *
     * Stores the *listeners* for all the tags associated with the instance.
     *
     * @private
     * @property _tagListeners
     * @type Object
     */
    self._tagListeners = {};
    /**
     *
     * Sets the value for a specific tag associated with the instance. If the
     * tag does not exist, it is created.
     *
     * Any listeners attached to the tag via `addTagListenerForKey` will be
     * notified of the change. Listeners are passed three parameters:
     * `self` (the originating instance),
     * `theKey` (the tag being changed),
     * and `theValue` (the value of the tag); the tag is *already* changed
     *
     * @method setTagForKey
     * @param {*} theKey  the name of the tag; "__default" is special and
     *                     refers to the default tag visible via the `tag`
     *                     property.
     * @param {*} theValue  the value to assign to the tag.
     *
     */
    self.setTagForKey = function ( theKey, theValue ) {
      self._tags[theKey] = theValue;
      var notifyListener = function ( theListener, theKey, theValue ) {
        return function () {
          theListener( self, theKey, theValue );
        };
      };
      if ( self._tagListeners[theKey] ) {
        for ( var i = 0; i < self._tagListeners[theKey].length; i++ ) {
          setTimeout( notifyListener( self._tagListeners[theKey][i], theKey, theValue ), 0 );
        }
      }
    };
    /**
     *
     * Returns the value for a given key. If the key does not exist, the
     * result is undefined.
     *
     * @method getTagForKey
     * @param {*} theKey  the tag; "__default" is special and refers to
     *                     the default tag visible via the `tag` property.
     * @returns {*} the value of the key
     *
     */
    self.getTagForKey = function ( theKey ) {
      return self._tags[theKey];
    };
    /**
     *
     * Add a listener to a specific tag. The listener will receive three
     * parameters whenever the tag changes (though they are optional). The tag
     * itself doesn't need to exist in order to assign a listener to it.
     *
     * The first parameter is the object for which the tag has been changed.
     * The second parameter is the tag being changed, and the third parameter
     * is the value of the tag. **Note:** the value has already changed by
     * the time the listener is called.
     *
     * @method addListenerForKey
     * @param {*} theKey The tag for which to add a listener; `__default`
     *                     is special and refers the default tag visible via
     *                     the `tag` property.
     * @param {Function} theListener  the function (or reference) to call
     *                    when the value changes.
     */
    self.addTagListenerForKey = function ( theKey, theListener ) {
      if ( !self._tagListeners[theKey] ) {
        self._tagListeners[theKey] = [];
      }
      self._tagListeners[theKey].push( theListener );
    };
    /**
     *
     * Removes a listener from being notified when a tag changes.
     *
     * @method removeTagListenerForKey
     * @param {*} theKey  the tag from which to remove the listener; `__default`
     *                     is special and refers to the default tag visible via
     *                     the `tag` property.
     * @param {Function} theListener  the function (or reference) to remove.
     *
     */
    self.removeTagListenerForKey = function ( theKey, theListener ) {
      if ( !self._tagListeners[theKey] ) {
        self._tagListeners[theKey] = [];
      }
      var i = self._tagListeners[theKey].indexOf( theListener );
      if ( i > -1 ) {
        self._tagListeners[theKey].splice( i, 1 );
      }
    };
    /**
     *
     * Sets the value for the simple tag (`__default`). Any listeners attached
     * to `__default` will be notified.
     *
     * @method setTag
     * @param {*} theValue  the value for the tag
     *
     */
    self.setTag = function ( theValue ) {
      self.setTagForKey( "__default", theValue );
    };
    /**
     *
     * Returns the value for the given tag (`__default`). If the tag has never been
     * set, the result is undefined.
     *
     * @method getTag
     * @returns {*} the value of the tag.
     */
    self.getTag = function () {
      return self.getTagForKey( "__default" );
    };
    /**
     *
     * The default tag for the instance. Changing the tag itself (not any sub-properties of an object)
     * will notify any listeners attached to `__default`.
     *
     * @property tag
     * @type *
     *
     */
    Object.defineProperty( self, "tag", {
      get:          self.getTag,
      set:          self.setTag,
      configurable: true
    } );
    /**
     *
     * All objects subject notifications for events
     *
     */
    /**
     * Supports notification listeners.
     * @private
     * @property _notificationListeners
     * @type Object
     */
    self._notificationListeners = {};
    /**
     * Adds a listener for a notification. If a notification has not been
     * registered (via `registerNotification`), an error is logged on the console
     * and the function returns without attaching the listener. This means if
     * you aren't watching the console, the function fails nearly silently.
     *
     * > By default, no notifications are registered.
     *
     * If the first parameter is an object, multiple listeners can be registered:
     * { "viewWillAppear": handler, "viewDidAppear": handler2}.
     *
     * @method addListenerForNotification
     * @alias on
     * @param {String|*} theNotification  the name of the notification
     * @param {Function} theListener  the function (or reference) to be called when the
     *                                notification is triggered.
     * @returns {*} returns self for chaining
     */
    self.addListenerForNotification = function addListenerForNotification( theNotification, theListener, async ) {
      if ( theNotification instanceof Array ) {
        theNotification.forEach( function ( n ) {
          addListenerForNotification( n, theListener, async );
        } );
        return self;
      }
      if ( typeof theNotification === "object" ) {
        for ( var n in theNotification ) {
          if ( theNotification.hasOwnProperty( n ) ) {
            addListenerForNotification( n, theNotification[n], theListener ); // async would shift up
          }
        }
        return self;
      }
      if ( !self._notificationListeners[theNotification] ) {
        self.registerNotification( theNotification, ( typeof async !== "undefined" ) ? async : false );
      }
      self._notificationListeners[theNotification].push( theListener );
      if ( self._traceNotifications ) {
        console.log( "Adding listener " + theListener + " for notification " + theNotification );
      }
      return self;
    };
    self.on = self.addListenerForNotification;
    /**
     * Registers a listener valid for one notification only. Immediately after
     * @method once
     * @param  {[type]} theNotification [description]
     * @param  {[type]} theListener     [description]
     * @param  {[type]} async           [description]
     * @return {[type]}                 [description]
     */
    self.once = function once( theNotification, theListener, async ) {
      self.addListenerForNotification( theNotification, function onceHandler( sender, notice, args ) {
        try {
          theListener.apply( self, [self, theNotification, args].concat( arguments ) );
        }
        catch ( err ) {
          console.log( "ONCE Handler had an error", err );
        }
        self.removeListenerForNotification( theNotification, onceHandler );
      }, async );
    };
    /**
     * Removes a listener from a notification. If a notification has not been
     * registered (via `registerNotification`), an error is logged on the console
     * and the function returns without attaching the listener. This means if
     * you aren't watching the console, the function fails nearly silently.
     *
     * > By default, no notifications are registered.
     *
     * @method removeListenerForNotification
     * @alias off
     * @param {String} theNotification  the notification
     * @param {Function} theListener  The function or reference to remove
     */
    self.removeListenerForNotification = function removeListenerForNotification( theNotification, theListener ) {
      if ( theNotification instanceof Array ) {
        theNotification.forEach( function ( n ) {
          removeListenerForNotification( n, theListener );
        } );
        return self;
      }
      if ( typeof theNotification === "object" ) {
        for ( var n in theNotification ) {
          if ( theNotification.hasOwnProperty( n ) ) {
            self.removeListenerForNotification( n, theNotification[n] );
          }
        }
        return self;
      }
      if ( !self._notificationListeners[theNotification] ) {
        console.log( theNotification + " has not been registered." );
        return self;
      }
      var i = self._notificationListeners[theNotification].indexOf( theListener );
      if ( self._traceNotifications ) {
        console.log( "Removing listener " + theListener + " (index: " + i + ") from  notification " + theNotification );
      }
      if ( i > -1 ) {
        self._notificationListeners[theNotification].splice( i, 1 );
      }
      return self;
    };
    self.off = self.removeListenerForNotification;
    /**
     * Registers a notification so that listeners can then be attached. Notifications
     * should be registered as soon as possible, otherwise listeners may attempt to
     * attach to a notification that isn't registered.
     *
     * @method registerNotification
     * @param {String} theNotification  the name of the notification.
     * @param {Boolean} async  if true, notifications are sent wrapped in setTimeout
     */
    self.registerNotification = function ( theNotification, async ) {
      if ( typeof self._notificationListeners[theNotification] === "undefined" ) {
        self._notificationListeners[theNotification] = [];
        self._notificationListeners[theNotification]._useAsyncNotifications = ( typeof async !== "undefined" ? async :
                                                                                true );
      }
      if ( self._traceNotifications ) {
        console.log( "Registering notification " + theNotification );
      }
    };
    self._traceNotifications = false;

    function _doNotification( theNotification, options ) {
      var args,
        lastOnly = false;
      if ( typeof options !== "undefined" ) {
        args = ( typeof options.args !== "undefined" ) ? options.args : undefined;
        lastOnly = ( typeof options.lastOnly !== "undefined" ) ? options.lastOnly : false;
      }
      if ( !self._notificationListeners[theNotification] ) {
        console.log( theNotification + " has not been registered." );
        //return;
      }
      if ( self._traceNotifications ) {
        if ( self._notificationListeners[theNotification] ) {
          console.log( "Notifying " + self._notificationListeners[theNotification].length + " listeners for " +
                       theNotification + " ( " + args + " ) " );
        } else {
          console.log( "Can't notify any explicit listeners for ", theNotification, "but wildcards will fire." );
        }
      }
      var async = self._notificationListeners[theNotification] !== undefined ? self._notificationListeners[
          theNotification]._useAsyncNotifications : true,
        notifyListener = function ( theListener, theNotification, args ) {
          return function () {
            try {
              theListener.apply( self, [self, theNotification, args].concat( arguments ) );
            }
            catch ( err ) {
              console.log( "WARNING", theNotification, "experienced an uncaught error:", err );
            }
          };
        },
        handlers = self._notificationListeners[theNotification] !== undefined ? self._notificationListeners[
          theNotification].slice() : []; // copy!
      if ( lastOnly && handlers.length > 1 ) {
        handlers = [handlers.pop()];
      }
      // attach * handlers
      var handler, push = false;
      for ( var listener in self._notificationListeners ) {
        if ( self._notificationListeners.hasOwnProperty( listener ) ) {
          handler = self._notificationListeners[listener];
          push = false;
          if ( listener.indexOf( "*" ) > -1 ) {
            // candidate listener; see if it matches
            if ( listener === "*" ) {
              push = true;
            } else if ( listener.substr( 0, 1 ) === "*" && listener.substr( 1 ) === theNotification.substr( -1 * ( listener
                                                                                                                     .length - 1 ) ) ) {
              push = true;
            } else if ( listener.substr( -1, 1 ) === "*" && listener.substr( 0, listener.length - 1 ) === theNotification.substr(
                0, listener.length - 1 ) ) {
              push = true;
            } else {
              var starPos = listener.indexOf( "*" );
              if ( listener.substr( 0, starPos ) === theNotification.substr( 0, starPos ) && listener.substr( starPos + 1 ) ===
                                                                                             theNotification.substr( -1 * ( listener.length - starPos - 1 ) ) ) {
                push = true;
              }
            }
            if ( push ) {
              handler.forEach( function ( handler ) {
                handlers.push( handler );
              } );
            }
          }
        }
      }
      for ( var i = 0, l = handlers.length; i < l; i++ ) {
        if ( async ) {
          setTimeout( notifyListener( handlers[i], theNotification, args ), 0 );
        } else {
          ( notifyListener( handlers[i], theNotification, args ) )();
        }
      }
    }

    /**
     * Notifies all listeners of a particular notification that the notification
     * has been triggered. If the notification hasn't been registered via
     * `registerNotification`, an error is logged to the console, but the function
     * itself returns silently, so be sure to watch the console for errors.
     *
     * @method notify
     * @alias emit
     * @param {String} theNotification  the notification to trigger
     * @param {*} [args]  Arguments to pass to the listener; usually an array
     */
    self.notify = function ( theNotification, args ) {
      _doNotification( theNotification, {
        args:     args,
        lastOnly: false
      } );
    };
    self.emit = self.notify;
    /**
     *
     * Notifies only the most recent listener of a particular notification that
     * the notification has been triggered. If the notification hasn't been registered
     * via `registerNotification`, an error is logged to the console, but the function
     * itself returns silently.
     *
     * @method notifyMostRecent
     * @alias emitToLast
     * @param {String} theNotification  the specific notification to trigger
     * @param {*} [args]  Arguments to pass to the listener; usually an array
     */
    self.notifyMostRecent = function ( theNotification, args ) {
      _doNotification( theNotification, {
        args:     args,
        lastOnly: true
      } );
    };
    self.emitToLast = self.notifyMostRecent;
    /**
     *
     * Defines a property on the object. Essentially shorthand for `Object.defineProperty`. An
     * internal `_propertyName` variable is declared which getters and setters can access.
     *
     * The property can be read-write, read-only, or write-only depending on the values in
     * `propertyOptions.read` and `propertyOptions.write`. The default is read-write.
     *
     * Getters and setters can be provided in one of two ways: they can be automatically
     * discovered by following a specific naming pattern (`getPropertyName`) if
     * `propertyOptions.selfDiscover` is `true` (the default). They can also be explicitly
     * defined by setting `propertyOptions.get` and `propertyOptions.set`.
     *
     * A property does not necessarily need a getter or setter in order to be readable or
     * writable. A basic pattern of setting or returning the private variable is implemented
     * for any property without specific getters and setters but who have indicate that the
     * property is readable or writable.
     *
     * @example
     * ```
     * self.defineProperty ( "someProperty" );        // someProperty, read-write
     * self.defineProperty ( "anotherProperty", { default: 2 } );
     * self.setWidth = function ( newWidth, oldWidth )
     * {
       *    self._width = newWidth;
       *    self.element.style.width = newWidth + "px";
       * }
     * self.defineProperty ( "width" );   // automatically discovers setWidth as the setter.
     * ```
     *
     * @method defineProperty
     * @param {String} propertyName  the name of the property; use camelCase
     * @param {Object} propertyOptions  the various options as described above.
     */
    self.defineProperty = function ( propertyName, propertyOptions ) {
      var options = {
        default:         undefined,
        read:            true,
        write:           true,
        get:             null,
        set:             null,
        selfDiscover:    true,
        prefix:          "",
        configurable:    true,
        backingVariable: true
      };
      // private properties are handled differently -- we want to be able to search for
      // _getPrivateProperty, not get_privateProperty
      if ( propertyName.substr( 0, 1 ) === "_" ) {
        options.prefix = "_";
      }
      // allow other potential prefixes
      if ( options.prefix !== "" ) {
        if ( propertyName.substr( 0, 1 ) === options.prefix ) {
          propertyName = propertyName.substr( 1 );
        }
      }
      // merge our default options with the user options
      for ( var property in propertyOptions ) {
        if ( propertyOptions.hasOwnProperty( property ) ) {
          options[property] = propertyOptions[property];
        }
      }
      // Capital Camel Case our function names
      var fnName = propertyName.substr( 0, 1 ).toUpperCase() + propertyName.substr( 1 );
      var getFnName = options.prefix + "get" + fnName,
        setFnName = options.prefix + "set" + fnName,
        _propertyName = options.prefix + "_" + propertyName,
        _y_getFnName = options.prefix + "_y_get" + fnName,
        _y_setFnName = options.prefix + "_y_set" + fnName,
        _y__getFnName = options.prefix + "_y__get" + fnName,
        _y__setFnName = options.prefix + "_y__set" + fnName;
      // if get/set are not specified, we'll attempt to self-discover them
      if ( options.get === null && options.selfDiscover ) {
        if ( typeof self[getFnName] === "function" ) {
          options.get = self[getFnName];
        }
      }
      if ( options.set === null && options.selfDiscover ) {
        if ( typeof self[setFnName] === "function" ) {
          options.set = self[setFnName];
        }
      }
      // create the private variable
      if ( options.backingVariable ) {
        self[_propertyName] = options.default;
      }
      if ( !options.read && !options.write ) {
        return; // not read/write, so nothing more.
      }
      var defPropOptions = {
        configurable: options.configurable
      };
      if ( options.read ) {
        self[_y__getFnName] = options.get;
        self[_y_getFnName] = function () {
          // if there is a getter, use it
          if ( typeof self[_y__getFnName] === "function" ) {
            return self[_y__getFnName]( self[_propertyName] );
          }
          // otherwise return the private variable
          else {
            return self[_propertyName];
          }
        };
        if ( typeof self[getFnName] === "undefined" ) {
          self[getFnName] = self[_y_getFnName];
        }
        defPropOptions.get = self[_y_getFnName];
      }
      if ( options.write ) {
        self[_y__setFnName] = options.set;
        self[_y_setFnName] = function ( v ) {
          var oldV = self[_propertyName];
          if ( typeof self[_y__setFnName] === "function" ) {
            self[_y__setFnName]( v, oldV );
          } else {
            self[_propertyName] = v;
          }
          if ( oldV !== v ) {
            self.notifyDataBindingElementsForKeyPath( propertyName );
          }
        };
        if ( typeof self[setFnName] === "undefined" ) {
          self[setFnName] = self[_y_setFnName];
        }
        defPropOptions.set = self[_y_setFnName];
      }
      Object.defineProperty( self, propertyName, defPropOptions );
    };
    /**
     * Defines a custom property, which also implements a form of KVO.
     *
     * Any options not specified are defaulted in. The default is for a property
     * to be observable (which fires the default propertyNameChanged notice),
     * read/write with no custom get/set/validate routines, and no default.
     *
     * Observable Properties can have getters, setters, and validators. They can be
     * automatically discovered, assuming they follow the pattern `getObservablePropertyName`,
     * `setObservablePropertyName`, and `validateObservablePropertyName`. They can also be
     * specified explicitly by setting `propertyOptions.get`, `set`, and `validate`.
     *
     * Properties can be read-write, read-only, or write-only. This is controlled by
     * `propertyOptions.read` and `write`. The default is read-write.
     *
     * Properties can have a default value provided as well, specified by setting
     * `propertyOptions.default`.
     *
     * Finally, a notification of the form `propertyNameChanged` is fired if
     * the value changes. If the value does *not* change, the notification is not fired.
     * The name of the notification is controlled by setting `propertyOptions.notification`.
     * If you need a notification to fire when a property is simply set (regardless of the
     * change in value), set `propertyOptions.notifyAlways` to `true`.
     *
     * KVO getters, setters, and validators follow very different patterns than normal
     * property getters and setters.
     *
     * ```
     * self.getObservableWidth = function ( returnValue ) { return returnValue; };
     * self.setObservableWidth = function ( newValue, oldValue ) { return newValue; };
     * self.validateObservableWidth = function ( testValue ) { return testValue!==10; };
     * self.defineObservableProperty ( "width" );
     * ```
     *
     * @method defineObservableProperty
     * @param {String} propertyName The specific property to define
     * @param {Object} propertyOptions the options for this property.
     *
     */
    self.defineObservableProperty = function ( propertyName, propertyOptions ) {
      // set the default options and copy the specified options
      var origPropertyName = propertyName,
        options = {
          observable:   true,
          notification: propertyName + "Changed",
          default:      undefined,
          read:         true,
          write:        true,
          get:          null,
          validate:     null,
          set:          null,
          selfDiscover: true,
          notifyAlways: false,
          prefix:       "",
          configurable: true
        };
      // private properties are handled differently -- we want to be able to search for
      // _getPrivateProperty, not get_privateProperty
      if ( propertyName.substr( 0, 1 ) === "_" ) {
        options.prefix = "_";
      }
      // allow other potential prefixes
      if ( options.prefix !== "" ) {
        if ( propertyName.substr( 0, 1 ) === options.prefix ) {
          propertyName = propertyName.substr( 1 );
        }
      }
      var fnName = propertyName.substr( 0, 1 ).toUpperCase() + propertyName.substr( 1 );
      var getObservableFnName = options.prefix + "getObservable" + fnName,
        setObservableFnName = options.prefix + "setObservable" + fnName,
        validateObservableFnName = options.prefix + "validateObservable" + fnName,
        _y_propertyName = options.prefix + "_y_" + propertyName,
        _y_getFnName = options.prefix + "_y_get" + fnName,
        _y_setFnName = options.prefix + "_y_set" + fnName,
        _y_validateFnName = options.prefix + "_y_validate" + fnName,
        _y__getFnName = options.prefix + "_y__get" + fnName,
        _y__setFnName = options.prefix + "_y__set" + fnName,
        _y__validateFnName = options.prefix + "_y__validate" + fnName;
      for ( var property in propertyOptions ) {
        if ( propertyOptions.hasOwnProperty( property ) ) {
          options[property] = propertyOptions[property];
        }
      }
      // if get/set are not specified, we'll attempt to self-discover them
      if ( options.get === null && options.selfDiscover ) {
        if ( typeof self[getObservableFnName] === "function" ) {
          options.get = self[getObservableFnName];
        }
      }
      if ( options.set === null && options.selfDiscover ) {
        if ( typeof self[setObservableFnName] === "function" ) {
          options.set = self[setObservableFnName];
        }
      }
      if ( options.validate === null && options.selfDiscover ) {
        if ( typeof self[validateObservableFnName] === "function" ) {
          options.validate = self[validateObservableFnName];
        }
      }
      // if the property is observable, register its notification
      if ( options.observable ) {
        self.registerNotification( options.notification );
      }
      // create the private variable; __ here to avoid self-defined _
      self[_y_propertyName] = options.default;
      if ( !options.read && !options.write ) {
        return; // not read/write, so nothing more.
      }
      var defPropOptions = {
        configurable: true
      };
      if ( options.read ) {
        self[_y__getFnName] = options.get;
        self[_y_getFnName] = function () {
          // if there is a getter, use it
          if ( typeof self[_y__getFnName] === "function" ) {
            return self[_y__getFnName]( self[_y_propertyName] );
          }
          // otherwise return the private variable
          else {
            return self[_y_propertyName];
          }
        };
        defPropOptions.get = self[_y_getFnName];
      }
      if ( options.write ) {
        self[_y__validateFnName] = options.validate;
        self[_y__setFnName] = options.set;
        self[_y_setFnName] = function ( v ) {
          var oldV = self[_y_propertyName],
            valid = true;
          if ( typeof self[_y__validateFnName] === "function" ) {
            valid = self[_y__validateFnName]( v );
          }
          if ( valid ) {
            if ( typeof self[_y__setFnName] === "function" ) {
              self[_y_propertyName] = self[_y__setFnName]( v, oldV );
            } else {
              self[_y_propertyName] = v;
            }
            if ( oldV !== v ) {
              self.notifyDataBindingElementsForKeyPath( propertyName );
            }
            if ( v !== oldV || options.notifyAlways ) {
              if ( options.observable ) {
                self.notify( options.notification, {
                  "new": v,
                  "old": oldV
                } );
              }
            }
          }
        };
        defPropOptions.set = self[_y_setFnName];
      }
      Object.defineProperty( self, origPropertyName, defPropOptions );
    };
    /*
     * data binding support
     */
    self._dataBindings = {};
    self._dataBindingTypes = {};
    //self._dataBindingEvents = [ "input", "change", "keyup", "blur" ];
    self._dataBindingEvents = ["input", "change", "blur"];
    /**
     * Configure a data binding to an HTML element (el) for
     * a particular property (keyPath). Returns self for chaining.
     *
     * @method dataBindOn
     * @param  {Node}   el      the DOM element to bind to; must support the change event, and must have an ID
     * @param  {string} keyPath the property to observe (shallow only; doesn't follow dots.)
     * @return {*}              self; chain away!
     */
    self.dataBindOn = function dataBindOn( el, keyPath, keyType ) {
      if ( self._dataBindings[keyPath] === undefined ) {
        self._dataBindings[keyPath] = [];
      }
      self._dataBindings[keyPath].push( el );
      self._dataBindingTypes[keyPath] = keyType;
      el.setAttribute( "data-y-keyPath", keyPath );
      el.setAttribute( "data-y-keyType", ( keyType !== undefined ? keyType : "string" ) );
      self._dataBindingEvents.forEach( function ( evt ) {
        el.addEventListener( evt, self.updatePropertyForKeyPath, false );
      } );
      return self;
    };
    /**
     * Turn off data binding for a particular element and
     * keypath.
     *
     * @method dataBindOff
     * @param  {Node}   el      element to remove data binding from
     * @param  {string} keyPath keypath to stop observing
     * @return {*}              self; chain away!
     */
    self.dataBindOff = function dataBindOff( el, keyPath ) {
      var keyPathEls = self._dataBindings[keyPath],
        elPos;
      if ( keyPathEls !== undefined ) {
        elPos = keyPathEls.indexOf( el );
        if ( elPos > -1 ) {
          keyPathEls.splice( elPos, 1 );
          el.removeAttribute( "data-y-keyPath" );
          el.removeAttribute( "data-y-keyType" );
          self._dataBindingEvents.forEach( function ( evt ) {
            el.removeEventListener( evt, self.updatePropertyForKeyPath );
          } );
        }
      }
      return self;
    };
    /**
     * Remove all data bindings for a given property
     *
     * @method dataBindAllOffForKeyPath
     * @param  {String} keyPath keypath to stop observing
     * @return {*}              self; chain away
     */
    self.dataBindAllOffForKeyPath = function dataBindAllOffForKeyPath( keyPath ) {
      var keyPathEls = self._dataBindings[keyPath];
      if ( keyPathEls !== undefined ) {
        keyPathEls.forEach( function ( el ) {
          el.removeAttribute( "data-y-keyPath" );
          el.removeAttribute( "data-y-keyType" );
          self._dataBindingEvents.forEach( function ( evt ) {
            el.removeEventListener( evt, self.updatePropertyForKeyPath );
          } );
        } );
        keyPathEls = [];
      }
      return self;
    };
    /**
     * Remove all data bindings for this object
     *
     * @method dataBindAllOff
     * @return {*}  self
     */
    self.dataBindAllOff = function dataBindAllOff() {
      for ( var keyPath in self._dataBindings ) {
        if ( self._dataBindings.hasOwnProperty( keyPath ) ) {
          self.dataBindAllOffForKeyPath( keyPath );
        }
      }
    };
    /**
     * Update a property on this object based on the
     * keyPath and value. If called as an event handler, `this` refers to the
     * triggering element, and keyPath is on `data-y-keyPath` attribute.
     *
     * @method updatePropertyForKeyPath
     * @param  {String} keyPath property to set
     * @param  {*} value        value to set
     */
    self.updatePropertyForKeyPath = function updatePropertyForKeyPath( inKeyPath, inValue, inKeyType ) {
      var keyType = inKeyType,
        keyPath = inKeyPath,
        dataValue = inValue,
        elType;
      try {
        if ( this !== self && this instanceof Node ) {
          // we've been called from an event handler
          if ( this.getAttribute( "data-y-keyType" ) !== undefined ) {
            keyType = this.getAttribute( "data-y-keyType" );
          }
          keyPath = this.getAttribute( "data-y-keyPath" );
          elType = this.getAttribute( "type" );
          dataValue = this.value;
          switch ( keyType ) {
            case "integer":
              self[keyPath] = ( dataValue === "" ) ? null : parseInt( dataValue, 10 );
              break;
            case "float":
              self[keyPath] = ( dataValue === "" ) ? null : parseFloat( dataValue );
              break;
            case "boolean":
              if ( this.checked !== undefined ) {
                self[keyPath] = this.checked;
              } else {
                self[keyPath] = ( "" + dataValue ) === "1" || dataValue.toLowerCase() === "true"
              }
              break;
            case "date":
              if ( this.type === "text" ) {
                try {
                  console.log( "trying to pull date from ", this.value );
                  self[keyPath] = new Date( this.value )
                }
                catch ( err ) {
                  console.log( "nope; set to null" );
                  self[keyPath] = null;
                }
              } else {
                self[keyPath] = this.valueAsDate;
              }
              break;
            default:
              self[keyPath] = dataValue;
          }
          return;
        }
        if ( keyType === undefined ) {
          keyType = self._dataBindingTypes[keyPath];
        }
        switch ( keyType ) {
          case "integer":
            self[keyPath] = parseInt( dataValue, 10 );
            break;
          case "float":
            self[keyPath] = parseFloat( dataValue );
            break;
          case "boolean":
            if ( dataValue === "1" || dataValue === 1 || dataValue.toLowerCase() === "true" || dataValue === true ) {
              self[keyPath] = true;
            } else {
              self[keyPath] = false;
            }
            break;
          case "date":
            self[keyPath] = new Date( dataValue );
            break;
          default:
            self[keyPath] = dataValue;
        }
      }
      catch ( err ) {
        console.log( "Failed to update", keyPath, "with", dataValue, "and", keyType, err, this, arguments );
      }
    };
    /**
     * notify all elements attached to a
     * key path that the source value has changed. Called by all properties created
     * with defineProperty and defineObservableProperty.
     *
     * @method @notifyDataBindingElementsForKeyPath
     * @param  {String} keyPath keypath of elements to notify
     */
    self.notifyDataBindingElementsForKeyPath = function notifyDataBindingElementsForKeyPath( keyPath ) {
      try {
        var keyPathEls = self._dataBindings[keyPath],
          keyType = self._dataBindingTypes[keyPath],
          el, v, elType, t, cursorPos, selectionPos;
        if ( keyType === undefined ) {
          keyType = "string";
        }
        v = self[keyPath];
        if ( v === undefined || v === null ) {
          v = "";
        }
        if ( keyPathEls !== undefined ) {
          for ( var i = 0, l = keyPathEls.length; i < l; i++ ) {
            el = keyPathEls[i];
            try {
              if ( typeof el.selectionStart === "number" ) {
                cursorPos = el.selectionStart;
                selectionPos = el.selectionEnd;
              } else {
                cursorPos = -1;
                selectionPos = -1;
              }
            }
            catch ( err ) {
              cursorPos = -1;
              selectionPos = -1;
            }
            elType = el.getAttribute( "type" );
            if ( elType === "date" ) {
              if ( el.type !== elType ) {
                // problem; we almost certainly have a field that doesn't understand valueAsDate
                if ( v.toISOString ) {
                  t = v.toISOString().split( "T" )[0];
                  console.log( "trying to set value to  ", t );
                  if ( el.value !== t ) {
                    console.log( "doing it  ", t );
                    el.value = t;
                  }
                } else {
                  throw new Error( "v is an unexpected type: " + typeof v + "; " + v );
                }
              } else {
                if ( el.valueAsDate !== v ) {
                  el.valueAsDate = v;
                }
              }
            } else if ( el.type === "checkbox" ) {
              el.indeterminate = ( v === undefined || v === null );
              if ( el.checked !== v ) {
                el.checked = v;
              }
            } else if ( typeof el.value !== "undefined" ) {
              if ( el.value != v ) {
                el.value = v;
              }
            } else if ( typeof el.textContent !== "undefined" ) {
              if ( el.textContent != v ) {
                el.textContent = v;
              }
            } else if ( typeof el.innerText !== "undefined" ) {
              if ( el.innerText != v ) {
                el.innerText = v;
              }
            } else {
              console.log( "Data bind failure; browser doesn't understand value, textContent, or innerText." );
            }
            if ( cursorPos > -1 && document.activeElement === el ) {
              el.selectionStart = cursorPos;
              el.selectionEnd = selectionPos;
            }
          }
        }
      }
      catch ( err ) {
        console.log( "Failed to update elements for ", keyPath, err, arguments );
      }
    };
    /**
     * Auto initializes the object based on the arguments passed to the object constructor. Any object
     * that desires to be auto-initializable must perform the following prior to returning themselves:
     *
     * ```
     * self._autoInit.apply (self, arguments);
     * ```
     *
     * Each init must call the super of init, and each init must return self.
     *
     * If the first parameter to _autoInit (and thus to the object constructor) is an object,
     * initWithOptions is called if it exists. Otherwise init is called with all the arguments.
     *
     * If NO arguments are passed to the constructor (and thus to this method), then no
     * auto initialization is performed. If one desires an auto-init on an object that requires
     * no parameters, pass a dummy parameter to ensure init will be called
     *
     * @method _autoInit
     * @returns {*}
     */
    self._autoInit = function () {
      if ( arguments.length > 0 ) {
        if ( arguments.length === 1 ) {
          // chances are this is an initWithOptions, but make sure the incoming parameter is an object
          if ( typeof arguments[0] === "object" ) {
            if ( typeof self.initWithOptions !== "undefined" ) {
              return self.initWithOptions.apply( self, arguments );
            } else {
              return self.init.apply( self, arguments );
            }
          } else {
            return self.init.apply( self, arguments );
          }
        } else {
          return self.init.apply( self, arguments );
        }
      }
    };
    /**
     *
     * Readies an object to be destroyed. The base object only clears the notifications and
     * the attached listeners.
     * @method destroy
     */
    self.destroy = function () {
      // clear data bindings
      self.dataBindAllOff();
      // clear any listeners.
      self._notificationListeners = {};
      self._tagListeners = {};
      self._constructObjectCategories( BaseObject.ON_DESTROY_CATEGORY );
      // ready to be destroyed
    };
    // self-categorize
    self._constructObjectCategories();
    // call auto init
    self._autoInit.apply( self, arguments );
    // done
    return self;
  };
/**
 * Promotes a non-BaseObject into a BaseObject by copying all its methods to
 * the new object and copying all its properties as observable properties.
 *
 * @method promote
 * @param  {*} nonBaseObject The non-BaseObject to promote
 * @return {BaseObject}               BaseObject
 */
BaseObject.promote = function promote( nonBaseObject ) {
  var newBaseObject, theProp;
  if ( nonBaseObject !== undefined ) {
    newBaseObject = new BaseObject();
    for ( var prop in nonBaseObject ) {
      if ( nonBaseObject.hasOwnProperty( prop ) ) {
        theProp = nonBaseObject[prop];
        if ( typeof theProp === "function" ) {
          newBaseObject[prop] = theProp;
        } else {
          newBaseObject.defineObservableProperty( prop, {
            default: theProp
          } );
        }
      }
    }
  }
  return newBaseObject;
};
/**
 * Object categories. Of the form:
 *
 * ```
 * { className: [ constructor1, constructor2, ... ], ... }
 * ```
 *
 * Global to the app and library. BaseObject's init() method will call each category in the class hierarchy.
 *
 * @property _objectCategories
 * @type {{}}
 * @private
 */
BaseObject._objectCategories = [{}, {}, {}];
BaseObject.ON_CREATE_CATEGORY = 0;
BaseObject.ON_INIT_CATEGORY = 1;
BaseObject.ON_DESTROY_CATEGORY = 2;
/**
 * Register a category constructor for a specific class. The function must take `self` as a parameter, and must
 * not assume the presence of any other category
 *
 * The options parameter takes the form:
 *
 * ```
 * { class: class name to register for
   *   method: constructor method
   *   priority: ON_CREATE_CATEGORY or ON_INIT_CATEGORY
   * }
 * ```
 *
 * @method registerCategoryConstructor
 * @param {Object} options
 */
BaseObject.registerCategoryConstructor = function registerCategoryConstructor( options ) {
  if ( typeof options === "undefined" ) {
    throw new Error( "registerCategoryConstructor requires a class name and a constructor method." );
  }
  if ( typeof options.class !== "undefined" ) {
    throw new Error( "registerCategoryConstructor requires options.class" );
  }
  if ( typeof options.method !== "undefined" ) {
    throw new Error( "registerCategoryConstructor requires options.method" );
  }
  var className = options.class;
  var method = options.method;
  var priority = BaseObject.ON_CREATE_CATEGORY;
  if ( typeof options.priority !== "undefined" ) {
    priority = options.priority;
  }
  if ( typeof BaseObject._objectCategories[priority][className] === "undefined" ) {
    BaseObject._objectCategories[priority][className] = [];
  }
  BaseObject._objectCategories[priority][className].push( method );
};
/**
 * Extend (subclass) an object. `o` should be of the form:
 *
 * {
   *   className: "NewClass",
   *   properties: [],
   *   observableProperties: [],
   *   methods: [],
   *   overrides: []
   * }
 *
 * @method   extend
 *
 * @param    {[type]}   classObject   [description]
 * @param    {[type]}   o             [description]
 *
 * @return   {[type]}                 [description]
 */
BaseObject.extend = function extend( classObject, o ) {
  return function () {};
};
BaseObject.meta = {
  version:           "00.05.101",
  class:             _className,
  autoInitializable: true,
  categorizable:     true
};
module.exports = BaseObject;

},{}],19:[function(require,module,exports){
/**
 *
 * # simple routing
 *
 * @module router.js
 * @author Kerri Shotts
 * @version 0.1
 *
 * Simple example:
 * ```
 * var y = function (v,s,r,t,u) { console.log(v,s,r,t,u); }, router = _y.Router;
 * router.addURL ( "/", "Home" )
 * .addURL ( "/task", "Task List" )
 * .addURL ( "/task/:taskId", "Task View" )
 * .addHandler ( "/", y )
 * .addHandler ( "/task", y )
 * .addHandler ( "/task/:taskId", y )
 * .replace( "/", 1)
 * .listen();
 * ```
 *
 * ```
 * Copyright (c) 2014 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module, Node, document, history, window, console*/
"use strict";
var routes = [];
/**
 * Parses a URL into its constituent parts. The return value
 * is an object containing the path, the query, and the hash components.
 * Each of those is also split up into parts -- path and hash separated
 * by slashes, while query is separated by ampersands. If hash is empty
 * this routine treates it as a "#/" unlese `parseHash` is `false`.
 * The `baseURL` is also removed from the path; if not specified it
 * defaults to `/`.
 *
 * @method parseURL
 * @param  {String}  url        url to parse
 * @param  {String}  baseURL    optional base url, defaults to "/"
 * @param  {Boolean} parseHash  optional, indicates if hash should be parsed with slashes
 * @return {*}                  component pieces
 */
function parseURL( url, baseURL, parseHash ) {
  if ( baseURL === undefined ) {
    baseURL = "/";
  }
  if ( parseHash === undefined ) {
    parseHash = true;
  }
  var a = document.createElement( "a" ),
    pathString,
    queryString,
    hashString,
    queryParts, pathParts, hashParts;
  // parse the url
  a.href = url;
  pathString = decodeURIComponent( a.pathname );
  queryString = decodeURIComponent( a.search );
  hashString = decodeURIComponent( a.hash );
  if ( hashString === "" && parseHash ) {
    hashString = "#/";
  }
  // remove the base url
  if ( pathString.substr( 0, baseURL.length ) === baseURL ) {
    pathString = pathString.substr( baseURL.length );
  }
  // don't need the ? or # on the query/hash string
  queryString = queryString.substr( 1 );
  hashString = hashString.substr( 1 );
  // split the query string
  queryParts = queryString.split( "&" );
  // and split the href
  pathParts = pathString.split( "/" );
  // split the hash, too
  if ( parseHash ) {
    hashParts = hashString.split( "/" );
  }
  return {
    path:       pathString,
    query:      queryString,
    hash:       hashString,
    queryParts: queryParts,
    pathParts:  pathParts,
    hashParts:  hashParts
  };
}
/**
 * Determines if a route matches, and if it does, copies
 * any variables out into `vars`. The routes must have been previously
 * parsed with parseURL.
 *
 * @method routeMatches
 * @param  {type} candidate candidate URL
 * @param  {type} template  template to check (variables of the form :someId)
 * @param  {type} vars      byref: this object will receive any variables
 * @return {*}              if matches, true.
 */
function routeMatches( candidate, template, vars ) {
  // routes must have the same number of parts
  if ( candidate.hashParts.length !== template.hashParts.length ) {
    return false;
  }
  var cp, tp;
  for ( var i = 0, l = candidate.hashParts.length; i < l; i++ ) {
    // each part needs to match exactly, OR it needs to start with a ":" to denote a variable
    cp = candidate.hashParts[i];
    tp = template.hashParts[i];
    if ( tp.substr( 0, 1 ) === ":" && tp.length > 1 ) {
      // variable
      vars[tp.substr( 1 )] = cp; // return the variable to the caller
    } else if ( cp !== tp ) {
      return false;
    }
  }
  return true;
}
var Router = {
  VERSION:        "0.1.100",
  baseURL:        "/", // not currently used
  /**
   * registers a URL and an associated title
   *
   * @method addURL
   * @param  {string} url   url to register
   * @param  {string} title associated title (not visible anywhere)
   * @return {*}            self
   */
  addURL:         function addURL( url, title ) {
    if ( routes[url] === undefined ) {
      routes[url] = [];
    }
    routes[url].title = title;
    return this;
  },
  /**
   * Adds a handler to the associated URL. Handlers
   * should be of the form `function( vars, state, url, title, parsedURL )`
   * where `vars` contains the variables in the URL, `state` contains any
   * state passed to history, `url` is the matched URL, `title` is the
   * title of the URL, and `parsedURL` contains the actual URL components.
   *
   * @method addHandler
   * @param  {string} url       url to register the handler for
   * @param  {function} handler handler to call
   * @return {*}                self
   */
  addHandler:     function addHandler( url, handler ) {
    routes[url].push( handler );
    return this;
  },
  /**
   * Removes a handler from the specified url
   *
   * @method removeHandler
   * @param  {string}   url     url
   * @param  {function} handler handler to remove
   * @return {*}        self
   */
  removeHandler:  function removeHandler( url, handler ) {
    var handlers = routes[url],
      handlerIndex;
    if ( handlers !== undefined ) {
      handlerIndex = handlers.indexOf( handler );
      if ( handlerIndex > -1 ) {
        handlers.splice( handlerIndex, 1 );
      }
    }
    return this;
  },
  /**
   * Parses a URL into its constituent parts. The return value
   * is an object containing the path, the query, and the hash components.
   * Each of those is also split up into parts -- path and hash separated
   * by slashes, while query is separated by ampersands. If hash is empty
   * this routine treates it as a "#/" unlese `parseHash` is `false`.
   * The `baseURL` is also removed from the path; if not specified it
   * defaults to `/`.
   *
   * @method parseURL
   * @param  {String}  url        url to parse
   * @param  {String}  baseURL    optional base url, defaults to "/"
   * @param  {Boolean} parseHash  optional, indicates if hash should be parsed with slashes
   * @return {*}                  component pieces
   */
  parseURL:       parseURL,
  /**
   * Given a url and state, process the url handlers that
   * are associated with the given url. Does not affect history in any way,
   * so can be used to call handler without actually navigating (most useful
   * during testing).
   *
   * @method processRoute
   * @param  {string} url   url to process
   * @param  {*} state      state to pass (can be anything or nothing)
   */
  processRoute:   function processRoute( url, state ) {
    if ( url === undefined ) {
      url = window.location.href;
    }
    var parsedURL = parseURL( url ),
      templateURL, handlers, vars, title;
    for ( url in routes ) {
      if ( routes.hasOwnProperty( url ) ) {
        templateURL = parseURL( "#" + url );
        handlers = routes[url];
        title = handlers.title;
        vars = {};
        if ( routeMatches( parsedURL, templateURL, vars ) ) {
          handlers.forEach( function ( handler ) {
            try {
              handler( vars, state, url, title, parsedURL );
            }
            catch ( err ) {
              console.log( "WARNING! Failed to process a route for", url );
            }
          } );
        }
      }
    }
  },
  /**
   * private route listener; calls `processRoute` with
   * the event state retrieved when the history is popped.
   * @method _routeListener
   * @private
   */
  _routeListener: function _routeListener( e ) {
    Router.processRoute( window.location.href, e.state );
  },
  /**
   * Check the current URL and call any associated handlers
   *
   * @method check
   * @return {*} self
   */
  check:          function check() {
    this.processRoute( window.location.href );
    return this;
  },
  /**
   * Indicates if the router is listening to history changes.
   * @property listening
   * @type boolean
   * @default false
   */
  listening:      false,
  /**
   * Start listening for history changes
   * @method listen
   */
  listen:         function listen() {
    if ( this.listening ) {
      return;
    }
    this.listening = true;
    window.addEventListener( "popstate", this._routeListener, false );
  },
  /**
   * Stop listening for history changes
   *
   * @method stopListening
   * @return {type}  description
   */
  stopListening:  function stopListening() {
    if ( !this.listening ) {
      return;
    }
    window.removeEventListener( "popstate", this._routeListener );
  },
  /**
   * Navigate to a url with a given state, calling handlers
   *
   * @method go
   * @param  {string} url   url
   * @param  {*} state      state to store for this URL, can be anything
   * @return {*}            self
   */
  go:             function go( url, state ) {
    history.pushState( state, null, "#" + encodeURIComponent( url ) );
    return this.check();
  },
  /**
   * Navigate to url with a given state, replacing history
   * and calling handlers. Should be called initially with "/" and
   * any initial state should you want to receive a state value when
   * navigating back from a future page
   *
   * @method replace
   * @param  {string} url   url
   * @param  {*} state      state to store for this URL, can be anything
   * @return {*}            self
   */
  replace:        function replace( url, state ) {
    history.replaceState( state, null, "#" + encodeURIComponent( url ) );
    return this.check();
  },
  /**
   * Navigates back in history
   *
   * @method back
   * @param  {number} n number of pages to navigate back, optional (1 is default)
   */
  back:           function back( n ) {
    history.back( n );
    if ( !this.listening ) {
      this.processRoute( window.location.href, history.state );
    }
  }
};
module.exports = Router;

},{}]},{},[2]);


//////END
library = library(2);
if ( typeof module !== 'undefined' && module.exports ) {
// export library for node
  module.exports = library;
} else if ( globalDefine ) {
// define library for global amd loader that is already present
  (function ( define ) {
    define( function () { return library; } );
  }( globalDefine ));
} else {
// define library on global namespace for inline script loading
  global['_y'] = library;
}
} (this) ) ;
