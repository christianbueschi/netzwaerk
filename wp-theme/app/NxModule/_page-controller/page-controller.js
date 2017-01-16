(function($) {
	/**
	 * PageController module implementation.
	 *
	 * @author
	 * @namespace Tc.Module
	 * @class PageController
	 * @extends Tc.Module
	 */
	Tc.Module.PageController = Tc.Module.extend({

		/**
		 * Initializes the PageController module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
		init: function($ctx, sandbox, modId) {
			// call base constructor
			this._super($ctx, sandbox, modId);
		},

		/**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
		on: function(callback) {
			callback();

			// Enquire JS Example
			enquire.register('screen and (max-width:768px)', {
				match: function() {
					console.log('Page Controller: Matched Media Query');
				},

				unmatch: function() {
					console.log('Page Controller: Unmatched Media Query');
				}
			});

			var is_root = location.pathname == "/";


				// Scroll To Anchor
				$('a[href*=#]').on('click', function(event){
					if (is_root) {
						event.preventDefault();
						var href = $.attr(this, 'href');
						$('html,body').animate({
							scrollTop:$(this.hash).offset().top
						}, 500, function() {
							window.location.hash = href;
						});
						} else {
							event.preventDefault();
							var anchor = $(event.currentTarget).attr('href');
							window.location = '/'+anchor;
						}
				});
		},

		/**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
		after: function() {}
	});
})(Tc.$);
