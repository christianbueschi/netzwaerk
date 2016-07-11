(function($) {
	/**
	 * Stage module implementation.
	 *
	 * @author sharte
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
	Tc.Module.Stage = Tc.Module.extend({

		/**
		 * Initializes the Stage module.
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

			var self = this,
				$searchToggle = $('.js-toggle-search', this.$ctx);

			$searchToggle.on('click', function(ev) {
				ev.preventDefault();
				self.fire('toggle', {});
				$searchToggle.toggleClass('active');
			});

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
