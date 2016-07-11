<?php

namespace NxModule\example;

class ExampleCtrl {

	/**
	 * Define default args for the controller
	 *
	 * @var array
	 */
	protected static $DEFAULT_CTRL_ARGS = array();

	/**
	 * Define default vars for the view
	 * In the view, test with empty() if a value is set
	 *
	 * @var array
	 */
	protected static $DEFAULT_VIEW_VARS = array(
		'title' => '',
		'urlKnow' => '',
		'urlJira' => ''
	);

	/**
	 * Get data for a random sticky sample
	 *
	 * @param $args
	 * @return array
	 */
	public static function data(array $args = array()) {

		// Extend default args
		$ctrlArgs = array_merge(self::$DEFAULT_CTRL_ARGS, $args);

		// Set default vars for the view
		$viewData = self::$DEFAULT_VIEW_VARS;

		// View Data
		$viewData['title'] = 'Example Module';
		$viewData['urlKnow'] = 'https://know.namics.com/display/buildrun/Setup+a+Project+%28WordPress%29';
		$viewData['urlJira'] = 'https://jira.namics.com/browse/NXWPKICKST';

		return $viewData;
	}
}