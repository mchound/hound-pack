function event(element,event,func)
{
    if(element.addEventListener)
    {
        element.addEventListener(event,function(){
        	func.call(element);
        },false);
    }
    else if(element.attachEvent)
    {
        element.attachEvent("on"+event,function(){
        	func.call(element);
        });
    }
}

function eventOnce(element,event,func)
{
    var eventFunc;

    if(element.addEventListener)
    {
      eventFunc = function(){
          element.removeEventListener(event, eventFunc, false);
          func.call();
      };

      element.addEventListener(event, eventFunc ,false);
    }
    else if(element.attachEvent)
    {
      eventFunc = function(){
          element.detachEvent('on' + event, eventFunc, false);
          func.call();
      };
      
      element.attachEvent("on"+event, eventFunc);
    }
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    'use strict';
    if (this == null) {
      throw new TypeError();
    }
    var n, k, t = Object(this),
        len = t.length >>> 0;

    if (len === 0) {
      return -1;
    }
    n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

function MergeRecursive(obj1, obj2) {

  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if ( obj2[p].constructor==Object ) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);

      } else {
        obj1[p] = obj2[p];

      }

    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];

    }
  }

  return obj1;
}

linearSum = function(until){
  var sum = 0;
  for(var i = 1; i <= until; i++){
    sum += i;
  }
  return sum;
}

Array.prototype.forEach = function(callback){
  for(var i = 0; i < this.length; i++){
    callback.call(this[i], i, this[i]);
  };
};

function capitalize(string){
    if(!string)
    return '';
  return string.charAt(0).toUpperCase() + string.slice(1);  
};

var transitionEndEventNames = {
  'transition':       'transitionend', //'transitionEnd',
  'MozTransition':    'transitionend',
  'OTransition':      'oTransitionEnd',
  'WebkitTransition': 'webkitTransitionEnd',
  'msTransition':     'MSTransitionEnd'
};
