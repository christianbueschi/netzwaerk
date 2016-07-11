<?php

namespace NxModule\commentform;

class CommentformCtrl {

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
		'comment_status' => '',
		'comment_form_args' => array()
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

		// Comment status
		global $post;
		$viewData['comment_status'] = $post->comment_status;

		// Comment Form
		global $user_identity;

		$commenter = wp_get_current_commenter();
		$req = get_option( 'require_name_email' );
		$aria_req = ( $req ? " aria-required='true'" : '' );

		$viewData['comment_form_args'] = array(
			'label_submit' => __('Send', 'nxtheme'),
			'comment_notes_after' => '',
			'comment_notes_before' => '',
			'logged_in_as' => '<p class="logged-in-as">' . sprintf(__('Logged in as <a href="%1$s">%2$s</a>. <a href="%3$s" title="Log out">Log out?</a>', 'nxtheme'), get_edit_user_link(), $user_identity, wp_logout_url(apply_filters('the_permalink', get_permalink()))) . '</p>',

			'fields' => apply_filters('comment_form_default_fields', array(
				'author' =>		'<div class="form-line">' .
				  				'<label for="author">' . __( 'Name', 'nxtheme' ) .  ( $req ? '<span class="required"> *</span>' : '' ) . '</label> ' .
				  				'<input id="author" name="author" required type="text" value="' . esc_attr( $commenter['comment_author'] ) .
				  				'" size="30"' . $aria_req . ' /></div>',
				'email' =>		'<div class="form-line space-dbl"><label for="email">' . __( 'Email', 'nxtheme' ) .  ( $req ? '<span class="required"> *</span>' : '' ) . '</label> ' .
				  				'<input id="email" name="email" required type="email" value="' . esc_attr(  $commenter['comment_author_email'] ) .
				  				'" size="30"' . $aria_req . ' /></div>',
			)),

			'comment_field' =>  '<p class="comment-form-comment"><label for="comment">' . _x('Comment', 'noun', 'nxtheme') . '<span class="required"> *</span>' .
								'</label><textarea id="comment" name="comment" required cols="45" rows="8" aria-required="true">' .
								'</textarea></p>'
		);

		return $viewData;
	}
}
