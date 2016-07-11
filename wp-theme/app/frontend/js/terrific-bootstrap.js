/**
* App Bootstrapping
*/

$(document.documentElement).removeClass('no-js');

(function($) {

	'use strict';

	$(document).ready(function() {
		var $page = $('body');
		var application = new Tc.Application($page);

		application.registerModules();
		application.registerModule($page, 'PageController');
		application.start();

		console.log('Terrific App started');
	});

})(Tc.$);
