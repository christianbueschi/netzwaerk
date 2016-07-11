<?php

namespace NxTheme\PostType;

/**
 * Class ExamplePostType
 *
 * Stage Custom Post Type.
 * Register in: @see Theme::posttypes()
 *
 * @see Theme::posttypes()
 * @package NxTheme\PostType
 */
class ExamplePostType {

	// Max. 20 characters, cannot contain capital letters or spaces
	// @Link http://codex.wordpress.org/Function_Reference/register_post_type
	public static $ID = 'nx_example_posttype';

	public function __construct() {
		// Register Post Type correctly with init hook
		add_action( 'init', array(&$this, 'register') );
	}

	/**
	 * Register Custom Post Type
	 */
	public function register() {

		// Register
		register_post_type(
			static::$ID,
			array(
				// Labels
				'labels'      => array(
					'name'            => __( 'Example', 'nxtheme' ),
					'singular_name'   => __( 'Example', 'nxtheme' ),
					'add_new_item'    => __( 'Add New Example', 'nxtheme' ),
					'edit_item'       => __( 'Edit Example', 'nxtheme' ),
					'update_item'     => __( 'Update Example', 'nxtheme' ),
					'add_new'         => __( 'Add new Example', 'nxtheme' ),
				),
				'label'               => __( 'Example', 'nxtheme' ),
				'description'         => __( 'An Example PostType', 'nxtheme' ),

				// Backend
				'hierarchical'        => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'menu_position'       => 20, // 20 = below comments
				'supports' => array(
					'title',
					'editor',
					//'thumbnail',
					//'page-attributes',
					'revisions',
				),
				'show_in_nav_menus'   => false,

				// Fronted
				'has_archive'         => false,
				'public'              => false,
				'exclude_from_search' => true,
			)
		);
	}

}
