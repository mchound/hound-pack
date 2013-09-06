window.sh = function(selector, _options){
	var defaults = {
		startSlide: 0,
		transition: 'ltr',
		itemDuration: 4000,
		itemSpeed: 0.6
	},

	options = MergeRecursive(defaults, _options),

	variables = {
		container: hpack(selector),
		items: [],
		activeSlide: options.startSlide,
		lastSlide: undefined,
		intervalId: undefined
	};

	this.sh = {};

	sh.fn = {
		init: function(ready){
			var 
			slides = hpack('ul.slides li.slide', variables.container[0]),
			captions = [],
			iterationTokenSum = 0;

			slides.forEach(function(i, slide){
				var 
				item = {},
				_caption = {};

				item.li = slide;
				item.img = {};
				item.img.src = hpack('img', slide);
				item.img.orgWidth = 0;
				item.img.orgheight = 0;
				item.transition = slide.getAttribute('data-transition') || options.transition;
				item.speed = parseFloat(slide.getAttribute('data-speed') || options.itemSpeed);
				item.captions = [];
				captions = hpack('.sh-caption', slide);
				captions.forEach(function(ii, caption){
					_caption.start = parseInt(caption.getAttribute('data-speed') || options.itemSpeed);
					_caption.x = parseInt(caption.getAttribute('data-x') || 0);
					_caption.y = parseInt(caption.getAttribute('data-y') || 0);
					_caption.speed = parseInt(caption.getAttribute('data-speed') || options.speed);
					_caption.transition = caption.getAttribute('data-transition') || options.transition;
					item.captions.push(_caption);
				});
				
				variables.items.push(item);				
			});

			// Make sure images are loaded and get their original size
			var iterationSum = 0;
			for(var i = 0; i < variables.items.length; i++){
				(function(index){
					variables.items[index].img.src.imgOriginalSize(function(width, height){
						iterationSum += (index + 1);
						variables.items[index].img.orgWidth = width;
						variables.items[index].img.orgHeight = height;

						if(iterationSum == linearSum(variables.items.length))
							ready.call();
					});
				})(i);
			};

			// Hide items that are not active
			for(var i = 0; i < variables.items.length; i++){
				if(i != variables.activeSlide)
					variables.items[i].li.style.display = 'none';
			}

		},

		start: function(){
			variables.intervalId = setInterval(function(){
				sh.fn.next();
			}, options.itemDuration);
		},

		stop: function(){
			clearInterval(variables.intervalId);
		},

		next: function(){

			variables.lastSlide = variables.activeSlide;
			if(++variables.activeSlide > variables.items.length - 1)
				variables.activeSlide = 0;
			console.log(variables.activeSlide);
			sh.fn.switch();
		},

		prev: function(){

			variables.lastSlide = variables.activeSlide;
			if(--variables.activeSlide < 0)
				variables.activeSlide = variables.items.length - 1;
			sh.fn.switch();
		},

		goto: function(slideNr){
			if(slideNr >= 0 && slideNr < variables.items.length && slideNr != variables.activeSlide){
				variables.lastSlide = variables.activeSlide;
				variables.activeSlide = slideNr;
				sh.fn.switch();
			}
		},

		switch: function(){
			sh.fn.stop();
			sh.fn.leftToRightTransition(variables.items[variables.activeSlide], function(){
				sh.fn.start();
				if(variables.lastSlide !== undefined){
					// variables.items[variables.lastSlide].li.style.display = 'none';
					variables.items[variables.lastSlide].li.style.left = '-1200px';
				};
			});
		},

		leftToRightTransition: function(item, transitionDone){
			variables.items[variables.lastSlide].li.style.zIndex = 0;
			item.li.style.zIndex = 999;
			item.li.style.display = 'block';
			item.li.style.transition = 'left ' + item.speed + 's';			
			item.li.style.left = '0px';
			var t = item.speed*1000;
			setTimeout(transitionDone, t);
		}

	};

	sh.fn.init(function(){
		sh.fn.start();
		
	});

};