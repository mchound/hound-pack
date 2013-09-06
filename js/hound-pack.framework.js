(function( window, undefined ) {

	var

		latestResize = new Date().getTime(),

		dummyElement = document.createElement('div');

		hpack = function(selector, context){
			return new hpack.fn.select(selector, context || document);
		};

	hpack.fn = hpack.prototype = {
		select: function(selector, context){
			if(!selector)
				return this;

			else if( selector.nodeType ){
				this.length = 1;
				this[0] = selector;
				return this;
			};	

			var nodeList = context.querySelectorAll(selector);
			this.length = nodeList.length;
			for(var i = 0; i < nodeList.length; i++){ this[i] = nodeList[i]; };
			return this;
		},

		nodeCollection: function( nodeList ){
			for(var i = 0; i < nodeList.length; i++){this.push(nodeList[i])};
		},

		delayedResize: function(timeMS, callback){
			var timeoutId;
			window.onresize = function(){
				var diff = new Date().getTime() - latestResize;
				latestResize = diff - latestResize;
				if(timeoutId && diff < timeMS){
					clearTimeout(timeoutId);
					timeoutId = setTimeout(callback, timeMS);
				}
				else if(!timeoutId)
					timeoutId = setTimeout(callback, timeMS);
			};
		},

		opacity: function( value ){
			var func;
			if(typeof dummyElement.style.opacity === 'string'){
				func = function(el){
					el.style.opacity = value;
				};
			}
			else{
				func = function(el){
					el.style.filter = 'alpha(opacity=' + value*100 + ')';
				};	
			};

			this.forEach(function(i, el){
				func(el);
			});
		},

		event: function(eventName, func){
			for (var i = 0; i < this.length; i++){
				event(this[i], eventName, func);
			};
		},

		forEach: function(callback, iterationToken){
		for (var i = 0; i < this.length; i++){
			callback.call(this[i], i, this[i], iterationToken);
			};
		},

		imgLoaded: function(callback){
			var 
				imgs = hpack.fn.select('img', this[0]),
				imgReadyCounter = imgs.length,
				intervalId;
			
			imgs.forEach(function(i, img){
				
				if(img.clientHeight > 0){
					imgReadyCounter--;
					return;	
				};

				hpack(img).event('load', function(){
					imgReadyCounter--;
				});
			});

			intervalId = setInterval(function(){
				if(imgReadyCounter === 0){
					clearInterval(intervalId);
					callback.call(window);
				}
			}, 10, null);
		},

		addClass: function(className){

			var
				func;

			if(dummyElement.classList)
				func = function(el){
					el.classList.add(className);
				};
			else
				func = function(el){
					var classes = el.className.split(' ');
					if(classes.indexOf(className) == -1){
						classes.push(className);
						el.className = classes.join(' ');
					}
						
				};

			for (var i = 0; i < this.length; i++){
				func(this[i]);
			};
		},

		removeClass: function(className){

			var
				func;

			if(dummyElement.classList)
				func = function(el){
					el.classList.remove(className);
				};
			else
				func = function(el){
					var classes = el.className.split(' ');
					classes.splice(classes.indexOf(className), 1);
					el.className = classes.join(' ');
				};

			for (var i = 0; i < this.length; i++){
				func(this[i]);
			};
		},

		imgOriginalSize: function(callback, iterationToken){
			var 
				imgSrc = this[0].src,
				dummyImage = document.createElement('img');

			dummyImage.src = imgSrc;
			event(dummyImage, 'load', function(){				
				callback.call(null, this.width, this.height, iterationToken);
			});			
		}
	};

	hpack.fn.select.prototype = hpack.fn;

	window.hpack = hpack;

})(window);

