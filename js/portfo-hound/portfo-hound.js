window.ph = function(selector, options){
	var 
		defaults = {
			itemsPerRow: 3,
			initialCategory: 'all'
		},

		_options = MergeRecursive(defaults, options),

		variables = {
			items: [],
			itemWidth: 0,
			imgRatio: 0,
			container: hpack('ul.portfo-hound'),
			category: _options.initialCategory
		},

		ph = {};

	ph.fn = {
		containerWidth: function(){return variables.container[0].clientWidth},

		init: function(){

			hpack('[data-ph-cat]', variables.container[0]).forEach(function(index, item){
				variables.items.push(item);	
			});

			for(var i = 0; i < variables.items.length; i++){
				variables.items[i].style.width = (100 / _options.itemsPerRow) + '%';			
				variables.imgRatio = variables.imgRatio || variables.items[i].clientWidth / variables.items[i].clientHeight;
			};

			ph.fn.showCategory(_options.initialCategory);
		},

		showCategory: function(category){
			var
			showIndex = 0;

			for (var i = 0; i < variables.items.length; i++){
				if(variables.items[i].getAttribute('data-ph-cat').split(' ').indexOf(category) != -1){
					hpack(variables.items[i]).opacity(1);
					ph.fn.show(showIndex, variables.items[i]);
					showIndex++;
				}			
				else{
					hpack(variables.items[i]).opacity(0);			
				}
					
			};

			variables.container[0].style.height = Math.ceil(showIndex / _options.itemsPerRow) * variables.itemWidth * variables.imgRatio + 'px';

		},

		show: function(index, item){
			var leftOffset = (index % _options.itemsPerRow) * variables.itemWidth;
			item.style.left = leftOffset + 'px';
			item.style.top = Math.floor(index / _options.itemsPerRow) * variables.itemWidth * variables.imgRatio + 'px';
		}
	}

	variables.container.imgLoaded(function(){
		variables.itemWidth = ph.fn.containerWidth() / _options.itemsPerRow;
		ph.fn.init();
	});

	hpack('[data-ph-trigger-target]').event('click', function(){
		var
		clickedCategory = this.getAttribute('data-ph-trigger-target');
		variables.activeCategory = clickedCategory;
		ph.fn.showCategory(clickedCategory);
	});

	hpack.fn.delayedResize(200, function(){
		variables.itemWidth = ph.fn.containerWidth() / _options.itemsPerRow;
		ph.fn.showCategory(variables.category);
	});
};