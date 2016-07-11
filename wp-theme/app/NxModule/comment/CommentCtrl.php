<?php

namespace NxModule\comment;

class CommentCtrl {

	/**
	 * Define default args for the controller
	 *
	 * @var array
	 */
	protected static $DEFAULT_CTRL_ARGS = array(
		'comment' => array()
	);

	/**
	 * Define default vars for the view
	 * In the view, test with empty() if a value is set
	 *
	 * @var array
	 */
	protected static $DEFAULT_VIEW_VARS = array(
		'comment' => array()
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

		$comment = $ctrlArgs['comment'];

		setup_postdata($comment->comment_ID);

		$viewData['comment_author'] = $comment->comment_author;
		$viewData['comment_date'] = get_comment_date();
		$viewData['comment_time'] = get_comment_time();
		$viewData['comment_author_email'] = $comment->comment_author_email;
		$viewData['comment_content'] = $comment->comment_content;
		$viewData['comment_approved'] = $comment->comment_approved;

		return $viewData;
	}
}
