<?php

namespace NxTheme\Taxonomy;

/**
 * Class ExampleTaxonomy
 *
 * ExampleTaxonomy Custom Taxonomy.
 * Register in: @see Theme::taxonomies()
 *
 * @see Theme::taxonomies()
 * @package NxTheme\Taxonomy
 */
class ExampleTaxonomy {

	public static $ID   = 'nx_example_taxonomy';
	public static $SLUG = 'example_taxonomy';

	public function __construct() {
		// Hook into the 'init' action
		$this->register();
	}

	protected function register() {
		// Register
		register_taxonomy(
			self::$ID,
			array('post'), // Supported Post Types
			array(
				// Labels
				'labels'            => array(
					'name'          => __('Example', 'nxtheme'),
					'singular_name' => __('Example', 'nxtheme'),
					'add_new_item'  => __('Add New Example', 'nxtheme'),
					'edit_item'     => __('Edit Example', 'nxtheme'),
					'update_item'   => __('Update Example', 'nxtheme'),
				),

				// Backend
				'hierarchical'      => true,
				'show_in_nav_menus' => true,
				//'show_admin_column' => true,

				// Fronted
				'public'            => true,
				'query_var'         => self::$SLUG,
				'rewrite'           => array('slug' => self::$SLUG, 'with_front' => false),
			)
		);
	}

}
