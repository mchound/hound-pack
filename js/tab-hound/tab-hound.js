window.th = function(selector, options){
	var 
		_container = hpack(selector),

		defaults = {
			
		},

		_options = MergeRecursive(defaults, options),

		variables = {
			container: _container,
			// activeTabTrigger: hpack('ul li button.active', _container[0]),
			// activeAccordioTrigger: hpack('button.tab-accordio.active', _container[0]),
			activeContent: hpack('div.tab-content.active', _container[0]),
			activeTarget: hpack('button.tab-accordio.active', _container[0])[0].getAttribute('data-th-target')
		},

		th = {};

	th.fn = {
		
		init: function(){
			hpack('[data-th-target]', variables.container[0]).event('click', function(){
				hpack('[data-th-target="' + variables.activeTarget + '"]', variables.container[0]).forEach(function(i, trigger){
					hpack(trigger, variables.container[0]).removeClass('active');
				});
				// variables.activeTabTrigger.removeClass('active');
				variables.activeContent.removeClass('active');
				// variables.activeAccordioTrigger.removeClass('active');
				// variables.activeTabTrigger = hpack(this, variables.container[0]);
				var targetSelector = this.getAttribute('data-th-target');
				variables.activeTarget = targetSelector;
				variables.activeContent = hpack(targetSelector, variables.container[0]);
				// variables.activeAccordioTrigger = hpack('button[data-th-trigger="' + targetSelector + '"]', variables.container[0]);
				hpack('[data-th-target="' + targetSelector + '"]', variables.container[0]).forEach(function(i, trigger){
					hpack(trigger, variables.container[0]).addClass('active');
				});
				// variables.activeTabTrigger.addClass('active');
				variables.activeContent.addClass('active');
				// variables.activeAccordioTrigger.addClass('active');
			});
		},

	};

	th.fn.init();
};