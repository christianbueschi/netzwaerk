<?php

namespace NxModule\teaserlistfooter;

class TeaserlistfooterCtrl {

	/**
	 * Define default args for the controller
	 *
	 * @var array
	 */
	protected static $DEFAULT_CTRL_ARGS = array(
	);

	/**
	 * Define default vars for the view
	 * In the view, test with empty() if a value is set
	 *
	 * @var array
	 */
	protected static $DEFAULT_VIEW_VARS = array(
		'paged' => '',
		'max_num_pages' => 'default'
	);

	/**
	 * Get data for a TeaserList
	 *
	 * @param array $args
	 * @return array
	 */
	public static function data(array $args = array()) {

		global $wp_query;

		// Extend default args
		$ctrlArgs = array_merge(self::$DEFAULT_CTRL_ARGS, $args);

		// Set default vars for the view
		$viewData = self::$DEFAULT_VIEW_VARS;

		// Set view data
		$viewData['paged'] = get_query_var('paged');
		$viewData['max_num_pages'] = $wp_query->max_num_pages;

		// Reset postdata
		wp_reset_postdata();

		return $viewData;
	}
}