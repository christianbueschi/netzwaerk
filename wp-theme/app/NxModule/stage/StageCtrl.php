<?php

namespace NxModule\stage;

class StageCtrl {

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
		'menu_lang' => '',
		'stage_title' => '',
		'stage_image_url' => '',
		'stage_logo_url' => ''
	);

	/**
	 * * Get Teaser Query
	 * @param array $args
	 * @return array
	 */
	public static function data(array $args = array()) {

		// Extend default args
		$ctrlArgs = array_merge(self::$DEFAULT_CTRL_ARGS, $args);

		// Set default vars for the view
		$viewData = self::$DEFAULT_VIEW_VARS;


		$viewData['stage_title'] = get_field('stage_title');

		$image = get_field('stage_image');
		$viewData['stage_image_url'] = $image['url'];

		return $viewData;
	}
}
