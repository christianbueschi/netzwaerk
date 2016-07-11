<?php

namespace Nx;

/**
 * Class Terrific
 *
 * @version 1.0.0
 * @see TerrificModule
 *
 * @package Nx
 */
class Terrific {

	/**
	 * Path to Partials Directory
	 * @see functions.php
	 *
	 * @var
	 */
	public static $PARTIALS_PATH;

	/**
	 * Indent character
	 * @var string
	 */
	public static $INDENT_CHAR = "\t";

	/**
	 * Includes Partial
	 * Template function if you don't need a module which you can fill with data / options
	 *
	 * @param string $name
	 * @param int    $indent
	 * @param array  $config
	 * @return mixed
	 */
	public static function partial($name, array $options = array()) {
		$filePath = sprintf('%s/_%s.phtml', static::$PARTIALS_PATH, ucfirst($name));

		// Default options
		$optsDefaults = array(
			'indent' => 0,
			'data'   => null
		);

		// Merge default and extended options
		$options = self::extend($optsDefaults, $options);

		// Need variable to pass by reference in self::includeTemplate(). That's PHP.
		$args = $options['data'];

		// Need variable to pass by reference in self::indentLines(). That's PHP.
		$html = self::includeTemplate($filePath, $args);

		return self::indentLines($html, $options['indent']);
	}

	/**
	 * Terrific Module Factory
	 *
	 * @see TerrificModule
	 * @param $name
	 * @return TerrificModule
	 */
	public static function module($name) {
		return new TerrificModule($name);
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Includes template file
	 *
	 * @static
	 * @param string   $yyyFile Filepath
	 * @param stdClass $yyyParams Arguments/Variables
	 * @return string
	 */
	final protected static function includeTemplate(/*string*/ $yyyFile, $yyyArgs = null) {
		if (file_exists($yyyFile)) {
			$data = null;

			// Assing Values
			if ($yyyArgs !== null) {
				// Convert Array into Object (Requires PHP >=5.4)
				$data = (object) $yyyArgs;
				//extract($yyyArgs, EXTR_REFS);
			} else {
				$data = (object) array(); // empty object
			}
			unset($yyyArgs);

			// Include
			ob_start();
			include $yyyFile;
			return ob_get_clean();
		} else {
			return sprintf("<!-- Template does not exists: %s/%s -->", basename(dirname($yyyFile)), basename($yyyFile));
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Indents every line
	 *
	 * @static
	 * @param reference $out !! ATTENTION: PASS BY REFERENCE !!
	 * @param int       $indent
	 * @return string
	 */
	final protected static function indentLines(/*string*/ &$out, /*int*/ $indent) {
		// Prefix indent, if needed
		if (0 < $indent) {
			$out =& str_replace(
				PHP_EOL,
				PHP_EOL . str_repeat(self::$INDENT_CHAR, (int)$indent),
				$out);
		}

		return $out;
	}

	final protected static function extend(/*array $target [, $object1][, $objectN]*/) {
		$args = func_get_args();
		$extended = array();
		if(is_array($args) && count($args)) {
			foreach($args as $array) {
				if(is_array($array)) {
					$extended = array_merge($extended, $array);
				}
			}
		}
		return $extended;
	}

}