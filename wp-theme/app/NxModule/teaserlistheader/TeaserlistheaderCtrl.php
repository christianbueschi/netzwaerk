<?php

namespace NxModule\teaserlistheader;

class TeaserlistheaderCtrl {

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
		'taxonomy_title' => '',
		'found_posts' => 0
	);

	/**
	 * Get data for a TeaserList Header
	 *
	 * @param array $args
	 * @return array
	 */
	public static function data(array $args = array()) {

		// Extend default args
		$ctrlArgs = array_merge(self::$DEFAULT_CTRL_ARGS, $args);

		// Set default vars for the view
		$viewData = self::$DEFAULT_VIEW_VARS;

		global $wp_query;

		if(is_search()) {
			$name = get_search_query();
		} else {
			$tax = $wp_query->get_queried_object();
			$name = $tax->name;
		}

		$viewData['title'] = $name;
		$viewData['found_posts'] = $wp_query->found_posts;

		return $viewData;
	}
}