<?php

namespace NxModule\teaser;

class TeaserCtrl {

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
		'date' => '',
		'permalink' => '',
		'category_link_list' => '',
		'excerpt' => '',
		'thumbnail_id' => '',
		'social_info_ctrl' => 'data'
	);

	/**
	 * Get data for a teaser
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
		$viewData['title'] = get_the_title(get_the_ID());
		$viewData['date'] = get_the_date();
		$viewData['permalink'] = get_permalink(get_the_ID());

		// Excerpt length: use this instead of the excerpt length filter. The filter only work when
		// a post has an excerpt. When there is no excerpt and the content is used instead, the filter does not work
		$viewData['excerpt'] = wp_trim_words(get_the_excerpt(), 24);


		// Categories
		$viewData['category_link_list'] = \NxTheme\Helpers::getCategoryLinkList(get_the_ID());

		// Images
		$viewData['thumbnail_id'] = get_post_thumbnail_id();

		return $viewData;
	}

	/**
	 * Get data for a random sticky teaser
	 *
	 * @param $args
	 * @return array
	 */
	public static function dataSticky(array $args = array()) {

		// Extend default args
		$ctrlArgs = array_merge(self::$DEFAULT_CTRL_ARGS, $args);

		// Set default vars for the view
		$viewData = self::$DEFAULT_VIEW_VARS;

		$query_args = array(
			'posts_per_page' => 1,
			'post__in'  => get_option( 'sticky_posts' ),
			'ignore_sticky_posts' => 1
		);

		// Setup Post Globals
		$query = new \WP_Query($query_args);

		while ($query->have_posts()) {
			$query->the_post();
		};

		// View Data
		$viewData['post_id'] = get_the_ID();
		$viewData['title'] = get_the_title(get_the_ID());
		$viewData['date'] = get_the_date();
		$viewData['permalink'] = get_permalink(get_the_ID());
		$viewData['excerpt'] = wp_trim_words(get_the_excerpt(), 24);

		// Images
		$viewData['thumbnail_id'] = get_post_thumbnail_id();

		// Categories
		$viewData['category_link_list'] = \NxTheme\Helpers::getCategoryLinkList(get_the_ID());

		// Images
		$viewData['images'] = array();

		wp_reset_query();

		return $viewData;
	}
}