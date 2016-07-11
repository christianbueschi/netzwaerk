<?php

namespace NxModule\header;

class HeaderCtrl {

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

		// Define menu locations
		$map_menu_locations = array(
			'menu_main' => 'main'
		);

		foreach ($map_menu_locations as $menu => $menu_location) {

			$menu_object = \NxTheme\Helpers::getMenuObject($menu_location);

			$viewData[$menu] = false;
			if(is_wp_error($menu_object) == false && $menu_object !== false) {

					$viewData[$menu] = array(
					'items' => wp_get_nav_menu_items($menu_object->term_id),
					'label' => $menu_object->name
				);
			}
		}

		$viewData['stage_title'] = get_field('stage_title');

		$image = get_field('stage_image');
		$viewData['stage_image_url'] = $image['url'];

		$logo = get_field('header_logo');
		$viewData['stage_logo_url'] = $logo['url'];

		return $viewData;
	}
}
