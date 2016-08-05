(function($) {
	/**
	 * Intro module implementation.
	 *
	 * @author cbueschi
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
	Tc.Module.Intro = Tc.Module.extend({

		/**
		 * Initializes the Intro module.
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
			this.sandbox.subscribe('search', this);
		},

		/**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
		on: function(callback) {

			var self = this;

			$('.js-lightbox').fancybox({
				openEffect	: 'elastic',
    			closeEffect	: 'elastic'
    		}),

			callback();
		},

		/**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
		after: function() {
		}

	});
})(Tc.$);
