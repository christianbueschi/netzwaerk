<?php
namespace NxTheme;

/**
 * Class Shortcodes
 *
 * Shortcode definitions.
 * Register in: @see Theme::shortcodes()
 * @see Theme::shortcodes()
 * @package NxTheme
 */
class Shortcodes {

	/**
	 * Example Shrotcode
	 * usage: [exampleShortcode]My Content[/exampleShortcode]
	 * @param array $atts
	 * @return string $content
	 */
	public static function exampleShortcode($atts, $content = null){
		return '<div class="example-shortcode">' . do_shortcode($content) . '</div>';
	}
}
