<?php

namespace NxTheme;

class Helpers {

	/**
	 * Debug Helper
	 */
	public static function debug( $value ) {
		echo '<pre>'.print_r($value,true).'</pre>';
	}

	/**
	 * Returns requested content type by client
	 * used i.e. to detect a request from wp json api
	 *
	 * @static
	 * @return null|string
	 */
	public static function getReqContentType() {
		// Get Headers and lowercase keys ('cause IE8 lowercases XMLHttpRequest headers)
		$hds = array_change_key_case(apache_request_headers(), CASE_LOWER);
		$key = strtolower('X-Content-Type');
		$contentType = !empty($hds[$key]) ? strtolower($hds[$key]) : null;

		return $contentType;
	}

	/**
	 * Get cookie values as array assuming the values are saved using ; as seperator
	 * @param $cookieName
	 * @return array
	 */
	public static function getCookieValues($cookieName) {

		$postIDs = array();

		if(isset($_COOKIE[$cookieName])) {
			$postIDs = explode(';',$cookieName);
		}

		return $postIDs;
	}

	/**
	 * The template for displaying a comment or pingback
	 * @param $comment
	 * @param $args
	 * @param $depth
	 * @return void
	 */
	public static function nx_comment_callback($comment, $args, $depth ) {

		$GLOBALS['comment'] = $comment;

		switch ($comment->comment_type ) :

			// Display trackbacks differently than normal comments.
			case 'pingback' :
			case 'trackback' :
			?>
				<li <?php comment_class(); ?> id="comment-<?php comment_ID(); ?>">
				<p><?php _e( 'Pingback:', 'nxtheme' ); ?> <?php comment_author_link(); ?> <?php edit_comment_link( __( '(Edit)', 'nxtheme' ), '<span class="edit-link">', '</span>' ); ?></p>
			<?
				break;

			// Proceed with normal comments.
			default :
				global $post;
				echo module('comment')
						->tag('li')
						->id('comment-'.get_comment_ID())
						->classes('g-col g-col-1')
						->ctrl(array('comment' => $comment));
			break;
		endswitch;
	}

	/**
	 * Returns the Name (label) of a menu
	 *
	 * @param $theme_location
	 * @return bool
	 */
	public static function getMenuName($theme_location) {

		$menu_obj = self::getMenuObject($theme_location);

		if( ! isset( $menu_obj->name ) ) return false;

		return $menu_obj->name;
	}

	/**
	 * Get menu object by location
	 * @param $theme_location
	 * @return bool
	 */
	public static function getMenuObject($theme_location) {

		if( ! $theme_location ) return false;

		$theme_locations = get_nav_menu_locations();
		if( ! isset( $theme_locations[$theme_location] ) ) return false;

		$menu_obj = get_term( $theme_locations[$theme_location], 'nav_menu' );
		if( ! $menu_obj ) $menu_obj = false;

		return $menu_obj;
	}

	/**
	 * Returns a list of category links, seperated by a character (glue)
	 *
	 * @param $postId
	 * @param $glue
	 */
	public static function getCategoryLinkList($postId, $glue = ', ') {

		$categoryLinkArray = array();
		$categoryIds = wp_get_post_categories($postId);

		foreach($categoryIds as $categoryId):
			$categoryObj = get_category($categoryId);
			$categoryLinkArray[] = sprintf('<a href="%1$s">%2$s</a>', get_category_link($categoryId), $categoryObj->cat_name);
		endforeach;

		return implode($glue, $categoryLinkArray);
	}

	/**
	 * Removes attribute from HTML string and returns cleaned string.
	 *
	 * @static
	 * @param $input
	 * @return mixed
	 */
	public static function removeAttribute(&$input, $attribute) {
		return preg_replace('/(<[^>]+) ' . $attribute . '=".*?"/i', '$1', $input);
	}

	/**
	 * Returns classes attribut and value if argument not empty.
	 *  i.e. ' class="myclass yourclass"'
	 *
	 * @param array $classes
	 * @return string
	 */
	public static function classes(array $classes = null) {
		if (!empty($classes)) {
			return sprintf(" class=\"%s\"", implode(' ', array_unique($classes)));
		}
	}

	/**
	 * Returns Image URL.
	 *
	 * @param        $width
	 * @param        $height
	 * @param string $bgColor
	 * @param string $textColor
	 * @return string
	 */
	public static function dummyImgSrc($width, $height, $bgColor = '000', $textColor = 'fff') {
		return sprintf('http://dummyimage.com/%dx%d/%s/%s', $width, $height, $bgColor, $textColor);
	}

	/**
	 * Returns Image Tag.
	 *
	 * @param        $width
	 * @param        $height
	 * @param string $bgColor
	 * @param string $textColor
	 * @param string $alt
	 * @return string
	 */
	public static function dummyImg($width, $height, $bgColor = '000', $textColor = 'fff', $alt="Dummy Image") {
		return sprintf('<img src="%s" alt="%s">', self::dummyImgSrc($width, $height, $bgColor, $textColor), $alt);
	}
}
