(function( window ){
	
	var defaults = {
		startSlide: 0,
		transition: 'ltr',
		itemDuration: 4000,
		itemSpeed: 0.6
	},	

	self = this;

	sh = function( selector , _options){
		return new sh.fn.slider(selector);
	}

	sh.fn = sh.prototype = {

		variables: {
			container: undefined,
			items: [],
			activeSlide: undefined,
			lastSlide: undefined,
			intervalId: undefined
		},

		options: {},

		slider: function(selector, _options){
			this.variables = {
				container: undefined,
				items: [],
				activeSlide: undefined,
				lastSlide: undefined,
				intervalId: undefined
			},

			this.options = MergeRecursive(defaults, _options);

			this.variables.container = hpack(selector);
			this.variables.activeSlide = this.options.startSlide;
			return this;
		},

		init: function(ready){
			var 
			slides = hpack('ul.slides li.slide', this.variables.container[0]),
			captions = [],
			iterationTokenSum = 0,
			context = this;

			slides.forEach(function(i, slide){
				var 
				item = {};

				item.li = slide;
				item.img = {};
				item.img.src = hpack('img', slide);
				item.img.orgWidth = 0;
				item.img.orgheight = 0;
				item.transition = slide.getAttribute('data-transition') || context.options.transition;
				item.speed = parseFloat(slide.getAttribute('data-speed') || context.options.itemSpeed);
				item.captions = [];
				captions = hpack('.sh-caption', slide);
				captions.forEach(function(ii, caption){
					var
					_caption = {};
					_caption.start = parseInt(caption.getAttribute('data-speed') || 0);
					_caption.x = parseInt(caption.getAttribute('data-x') || 0);
					_caption.y = parseInt(caption.getAttribute('data-y') || 0);
					_caption.speed = parseInt(caption.getAttribute('data-speed') || context.options.itemSpeed);
					_caption.transition = caption.getAttribute('data-transition') || context.options.transition;
					_caption.element = caption;
					_caption.element.style.position = 'absolute';					
					item.captions.push(_caption);
				});
				
				context.variables.items.push(item);				
			});

			// Make sure images are loaded and get their original size
			var iterationSum = 0;
			for(var i = 0; i < context.variables.items.length; i++){
				(function(index){
					context.variables.items[index].img.src.imgOriginalSize(function(width, height){
						context.variables.items[index].img.orgWidth = width;
						context.variables.items[index].img.orgHeight = height;
						iterationSum += (index + 1);

						if(iterationSum == linearSum(context.variables.items.length)){
							context.variables.items.forEach(function(ii, _item){
								context.positionCaptions(_item);
							});
							ready.call(context);
						}
							
					});
				})(i);
			};

			// Hide items that are not active
			for(var i = 0; i < this.variables.items.length; i++){
				if(i != this.variables.activeSlide){
					this.hide(this.variables.items[i]);
				}
				else
					this.variables.items[i].li.style.zIndex = 999;
			};

		},

		start: function(){
			var context = this;
			this.variables.intervalId = setInterval(function(){
				context.next();
			}, this.options.itemDuration);
		},

		stop: function(){
			clearInterval(this.variables.intervalId);
		},

		next: function(){

			this.variables.lastSlide = this.variables.activeSlide;
			if(++this.variables.activeSlide > this.variables.items.length - 1)
				this.variables.activeSlide = 0;
			console.log(this.variables.activeSlide);
			this.switch();
		},

		prev: function(){

			this.variables.lastSlide = this.variables.activeSlide;
			if(--this.variables.activeSlide < 0)
				this.variables.activeSlide = this.svariables.items.length - 1;
			sh.fn.switch();
		},

		goto: function(slideNr){
			if(slideNr >= 0 && slideNr < this.variables.items.length && slideNr != this.variables.activeSlide){
				this.variables.lastSlide = this.variables.activeSlide;
				this.variables.activeSlide = slideNr;
				this.switch();
			}
		},

		switch: function(){
			var context = this;
			this.stop();
			this.show(this.variables.items[this.variables.activeSlide], function(){
				context.start();
				context.hide(context.variables.items[context.variables.lastSlide]);
			});
		},

		show: function(item, transitionDone){
			if(item){
				switch (item.transition){
					case 'ltr':
						this.leftToRightTransition(item, transitionDone);
						break;
					case 'fade':
						this.fadeTransition(item, transitionDone);
						break;
					default: 
				};
			};
		},

		hide: function(item){
			if(item){
				item.li.style.zIndex = 0;
				item.li.style.transition = '';
				switch (item.transition){
					case 'ltr':
						item.li.style.left = '-100%';						
						break;
					case 'fade':
						hpack(item.li).opacity(0);
						break;
					default: 
				};
			};
		},

		fadeTransition: function(item, transitionDone){
			this.variables.items[this.variables.lastSlide].li.style.zIndex = 0;
			item.li.style.zIndex = 999;
			item.li.style.transition = 'opacity ' + item.speed + 's';			
			hpack(item.li).opacity(100);
			setTimeout(transitionDone, item.speed*1000);
		},

		leftToRightTransition: function(item, transitionDone){
			this.variables.items[this.variables.lastSlide].li.style.zIndex = 0;
			item.li.style.zIndex = 999;
			item.li.style.transition = 'left ' + item.speed + 's';			
			item.li.style.left = '0px';
			setTimeout(transitionDone, item.speed*1000);
		},

		positionCaptions: function(item){
			for(var i = 0; i < item.captions.length; i++){
				item.captions[i].element.style.left = parseFloat(item.captions[i].x / item.img.orgWidth * 100) + '%';
				item.captions[i].element.style.top = parseFloat(item.captions[i].y / item.img.orgHeight * 100) + '%';
			};
		}
	};

	sh.fn.slider.prototype = sh.fn;
	window.sh = sh;

})(window)