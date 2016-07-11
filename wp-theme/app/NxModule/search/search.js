(function($) {
	/**
	 * Search module implementation.
	 *
	 * @author sharte
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
	Tc.Module.Search = Tc.Module.extend({

		/**
		 * Initializes the Search module.
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

			callback();

		},

		onToggle: function(ev) {

			this.$ctx.toggleClass('active');

			if ($(window).width() > 768) {
				if (this.$ctx.hasClass('active')) {
					$('.js-search-field', this.$ctx).focus();
				}
			}
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
