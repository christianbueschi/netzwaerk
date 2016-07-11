<?php

namespace NxTheme;

/**
 * Class Theme
 *
 * Theme Setup.
 *
 * @package NxTheme
 */
class Theme {

	/**
	 * Default WordPress Media Sizes: [0] = max. width, [1] = max. height
	 *
	 * only use medium size in wordpress richtext editor, because we use picturefill
	 *
	 * @var array
	 */
	public static $MEDIA_SIZES = array(
		'thumb' => array(196, 196),
		'medium'=> array(392, 392),
		'large' => array(784, 784),
	);

	public static $MEDIA_SIZES_CUSTOM = array(
		'sticky_teaser' => array(
            'small' => array('Sticky Teaser Small', 524, 524, false),
			'medium' => array('Sticky Teaser Medium', 768, 768, false),
			'large' => array('Sticky Teaser Large', 980, 980, false),
		),

		'teaser' => array(
			'small' => array('Teaser Small', 300, 200, false),
			'medium' => array('Teaser Medium', 600, 400, false),
			'large' => array('Teaser Large', 980, 600, false),
		)
	);

	public static function init() {

		// Make theme available for translation.
		load_theme_textdomain('nxtheme', get_template_directory() . '/languages');

		// Init/Setup Theme
		add_action('after_setup_theme', array(__CLASS__, 'setup'));
		add_action('admin_init',        array(__CLASS__, 'adminInit'));

	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	public static function setup() {

		// Theme Support
		self::support();

		// Enable Auto Update
		self::enableAutoUpdate();

		// Post Types
		self::postTypes();

		// Taxonomies
		self::taxonomies();

		// Filters
		self::filters();

		// Actions
		self::actions();

		// Shortcodes
		self::shortcodes();

		// Menus
		self::menus();

		// Cleanup
		self::cleanup();

	}

	protected static function support() {

		// Add additional image sizes
		foreach(self::$MEDIA_SIZES_CUSTOM as $name => $sizes) {
			foreach($sizes as $size => $attribs) {
				add_image_size($name . '_' . $size, $attribs[1], $attribs[2], $attribs[3]);
			}
		}

		// Switch default core markup for search form, comment form, and comments to output valid HTML5
		add_theme_support('html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'caption',
		));

		// Add Post Thumbnails for all content types (posts, pages..)
		add_theme_support('post-thumbnails');

		// ACF: Add Options page
		if( function_exists('acf_add_options_page') ) {
			acf_add_options_page(__('Optionen', 'nxtheme'));
		}
	}

	protected static function postTypes() {
//		new \NxTheme\PostType\ExamplePostType();
	}

	protected static function taxonomies() {
//		new \NxTheme\Taxonomy\ExampleTaxonomy();
	}

	/**
	 * Enables automatic WordPress Updates
	 */
	protected static function enableAutoUpdate() {

		// Hide Plugin Updates on QA and PROD
		if(APP_ENV !== 'dev') {
			remove_action('load-update-core.php','wp_update_plugins');
			add_filter('pre_site_transient_update_plugins','__return_null');
		}

		// Enable auto Updates even when using .git Deployments
		// - https://make.wordpress.org/core/2013/10/25/the-definitive-guide-to-disabling-auto-updates-in-wordpress-3-7/
		add_filter( 'automatic_updates_is_vcs_checkout', '__return_false', 1 );
	}

	protected static function filters() {

		add_filter('wp_title',		array('\NxTheme\Filters', 'wp_title'), 10, 2 );

		add_filter('body_class',	array('\NxTheme\Filters', 'theme_body_classes') );

		add_filter('tiny_mce_before_init', array('\NxTheme\Filters', 'tiny_mce_before_init'));

		add_filter('excerpt_more', array('\NxTheme\Filters', 'excerpt_more'));

		add_filter('img_caption_shortcode', array('\NxTheme\Filters', 'custom_caption'), 10, 3);
	}

	protected static function actions() {

		add_action('wp_enqueue_scripts', array('\NxTheme\Actions', 'wp_enqueue_scripts'));

		add_action('admin_enqueue_scripts', array('\NxTheme\Actions', 'admin_enqueue_scripts'));

		add_action('pre_get_posts', array('\NxTheme\Actions', 'pre_get_posts'));

		// Additional User Fields
		add_action('show_user_profile', array('\NxTheme\Actions', 'additional_user_fields'));
		add_action('edit_user_profile', array('\NxTheme\Actions', 'additional_user_fields'));
		add_action('personal_options_update',  array('\NxTheme\Actions', 'save_additional_user_fields'));
		add_action('edit_user_profile_update',  array('\NxTheme\Actions', 'save_additional_user_fields'));
		add_action('user_contactmethods',  array('\NxTheme\Actions', 'user_contactmethods'));
	}

	protected static function shortcodes() {
//		add_shortcode('exampleShortcode',     array('\NxTheme\Shortcodes', 'exampleShortcode') );
	}

	protected static function menus() {

		register_nav_menus(array(
			'main' => __('Main Menu', 'nxtheme'),
			'lang' => __('Lang Menu', 'nxtheme'),
			'footer-one' => __('Footer One Menu', 'nxtheme'),
			'footer-two' => __('Footer Two Menu', 'nxtheme'),
			'footer-social' => __('Footer Social Menu', 'nxtheme')
		));
	}

	protected static function cleanup() {
		// Cleanup Head
		remove_action('wp_head', 'feed_links_extra'); // Display the links to the extra feeds such as category feeds
		remove_action('wp_head', 'feed_links'); // Display the links to the general feeds: Post and Comment Feed
		remove_action('wp_head', 'rsd_link'); // Display the link to the Really Simple Discovery service endpoint, EditURI link
		remove_action('wp_head', 'wlwmanifest_link' ); // Display the link to the Windows Live Writer manifest file.
		remove_action('wp_head', 'index_rel_link' ); // index link
		remove_action('wp_head', 'parent_post_rel_link', 10); // prev link
		remove_action('wp_head', 'start_post_rel_link', 10); // start link
		remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10); // Display relational links for the posts adjacent to the current post.
		remove_action('wp_head', 'wp_generator'); // Display the XHTML generator that
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	public static function adminInit() {
		// Options
		self::options();
	}

	protected static function options() {
		// Update default sizes
		update_option('thumbnail_size_w', self::$MEDIA_SIZES['thumb'][0]);
		update_option('thumbnail_size_h', self::$MEDIA_SIZES['thumb'][1]);
		update_option('medium_size_w',    self::$MEDIA_SIZES['medium'][0]);
		update_option('medium_size_h',    self::$MEDIA_SIZES['medium'][1]);
		update_option('large_size_w',     self::$MEDIA_SIZES['large'][0]);
		update_option('large_size_h',     self::$MEDIA_SIZES['large'][1]);

		// Update default alignment and size
		update_option('image_default_align', 'none');
		update_option('image_default_link_type', 'none'); // 'none', 'file', 'url'
		update_option('image_default_size', 'medium');
	}
}
