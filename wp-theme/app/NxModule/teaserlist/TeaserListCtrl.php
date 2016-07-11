<?php

namespace NxModule\teaserlist;

class TeaserlistCtrl {

	/**
	 * Define default args for the controller
	 *
	 * @var array
	 */
	protected static $DEFAULT_CTRL_ARGS = array(
		'teaserTemplate' => '',
		'teaserSkin' => ''
	);

	/**
	 * Define default vars for the view
	 * In the view, test with empty() if a value is set
	 *
	 * @var array
	 */
	protected static $DEFAULT_VIEW_VARS = array(
		'teaserTemplate' => '',
		'teaserSkin' => 'default',
		'query' => ''
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
		$viewData['teaserTemplate'] = $ctrlArgs['teaserTemplate'];
		$viewData['query'] = $wp_query;

		// Reset postdata
		wp_reset_postdata();

		return $viewData;
	}


	/**
	 * Get data for a the similar TeaserList, based on the category
	 *
	 * @param array $args
	 * @return array
	 */
	public static function dataSimilar(array $args = array()) {

		// Extend default args
		$ctrlArgs = array_merge(self::$DEFAULT_CTRL_ARGS, $args);

		// Set default vars for the view
		$viewData = self::$DEFAULT_VIEW_VARS;

		$query_args = array(
			'post__not_in'		=> array_merge(get_option('sticky_posts'), array(get_the_ID())),
			'category__in'		=> wp_get_post_categories(get_the_ID()),
			'posts_per_page'	=> 4
		);

		// get results
		$the_query = new \WP_Query($query_args);

		// Set view data
		$viewData['layout'] = $ctrlArgs['layout'];
		$viewData['teaserSkin'] = $ctrlArgs['teaserSkin'];
		$viewData['teaserTemplate'] = $ctrlArgs['teaserTemplate'];
		$viewData['query'] = $the_query;

		return $viewData;
	}
}