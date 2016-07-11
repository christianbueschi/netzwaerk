<?php

namespace NxTheme;

/**
 * Class Actions
 *
 * Action definitions.
 * Register in: @see Theme::actions()
 *
 * @see Theme::actions()
 * @package NxTheme
 */
class Actions {

	/**
	 * Register Styles and Scripts
	 */
	public static function wp_enqueue_scripts() {

		// jQuery De-Register
		wp_deregister_script('jquery');
   		wp_register_script('jquery', "http" . ($_SERVER['SERVER_PORT'] == 443 ? "s" : "") . "://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js", false, null);
   		wp_enqueue_script('jquery');

		// Register
		wp_register_style('styles', ASSETS_URL . '/build/styles.css', null, RELEASE_STAMP);
		wp_register_script('scripts', ASSETS_URL . '/build/scripts.js',  array(), RELEASE_STAMP);

		// Enqueue
		wp_enqueue_style('styles');
		wp_enqueue_script('scripts');

		// Enqueue: Comment-reply
		if (is_singular() && comments_open() && get_option('thread_comments')) {
			wp_enqueue_script('comment-reply');
		}

		// Scripts to footer
		remove_action('wp_head', 'wp_print_scripts');
		remove_action('wp_head', 'wp_print_head_scripts', 9);
		remove_action('wp_head', 'wp_enqueue_scripts', 1);
		add_action('wp_footer', 'wp_enqueue_scripts', 5);
		add_action('wp_footer', 'wp_print_head_scripts', 5);
		add_action('wp_footer', 'wp_print_scripts', 5);
	}

	/**
	 * Enqueue admin styles & scripts
	 */
	public static function admin_enqueue_scripts() {
		add_editor_style(get_template_directory_uri() . '/_static/build/styles.css');
	}

	/**
	 * Filter the main query based on certain conditions
	 * @param $query
	 */
	public static function pre_get_posts($query) {

		if ($query->is_main_query() && is_home()) {

			// Remove sticky posts from main query
       		$query->set( 'post__not_in', get_option( 'sticky_posts' ) );
    	}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Adds fields to the user admin page
	 * @link http://justintadlock.com/archives/2009/09/10/adding-and-using-custom-user-profile-fields
	 *
	 * @static
	 */
	public static function additional_user_fields($user) {

		?>

		<table class="form-table">
			<tr>
				<th><label for="position-title"><? echo __('Position / Title', 'nxtheme') ?></label></th>
				<td>
					<input type="text" name="position_title" id="position_title"
						   value="<?php echo esc_attr(get_the_author_meta('position_title', $user->ID)); ?>"
						   class="regular-text"/><br/>
				</td>
			</tr>
		</table>
	<?php
	}

	/**
	 * Saves additional fields of the user admin page
	 *
	 * @static
	 */
	public static function save_additional_user_fields($user_id) {

		if (!current_user_can('edit_user', $user_id))
			return false;

		update_user_meta($user_id, 'position_title', $_POST['position_title']);
		update_user_meta($user_id, 'xing_url', $_POST['xing_url']);
		update_user_meta($user_id, 'linkedin_url', $_POST['linkedin_url']);
	}

	/**
	 * Add additional contact method fields for authors
	 *
	 * @static
	 */
	public static function user_contactmethods($user_contact) {

		/* Add user contact methods */
		$user_contact['xing_url'] = __( 'Xing Profile URL', 'nxtheme');
		$user_contact['linkedin_url'] = __( 'LinkedIn Profile URL', 'nxtheme');

		return $user_contact;
	}

}
