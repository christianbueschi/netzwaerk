<?php

namespace Nx;

/**
 *
 * Terrific PHP Implementation
 *
 * @version 1.0.0
 * @see Terrific
 *
 * Examples
 *
 *	Simple: 	echo module('article');
 * 	Advanced: 	echo module('article')->template('wide')->skin('wide')->ctrl('example' => 'woot')->tag('article')->attrib('role', 'aside')->indent(2);
 *  Full: 		echo module('article')->template('wide')->skins(array('wide', 'single'))->ctrl('example' => 'woot')->tag('article')->attribs(array('role' => 'aside', 'data-id' => '1'))->indent(2);
 *
 * Inspired by http://terrifically.org/ and https://github.com/rogerdudler/terrific-micro
 * Based on the PHP Implementation by https://github.com/lemats
 *
 */
class TerrificModule {

	public static $INDENT_CHAR = "\t";

	/**
	 * Path to Partials Directory
	 * @see functions.php
	 *
	 * @var string
	 */
	public static $MODULES_PATH;

	protected $name;
	protected $template;
	protected $data;
	protected $indent;
	protected $id;
	protected $classes;
	protected $skins = array();
	protected $attribs = array();
	protected $configs = array(
		'tag'       => 'div',
		'fileext'   => '.phtml',
	);

	/**
	 * Constructor
	 *
	 * @param $name module name
	 */
	public function __construct($name) {
		$this->name = strtolower($name);
	}

	/**
	 * Render module when using echo (magic method)
	 *
	 * @return string Module
	 */
	public function __toString() {
		return $this->render();
	}

	/**
	 * Set template
	 *
	 * @param $template
	 * @return $this
	 */
	public function template($template) {
		$this->template = strtolower($template);
		return $this;
	}

	/**
	 * Set id
	 *
	 * @param $id
	 * @return $this
	 */
	public function id($id) {
		$this->id = $id;
		return $this;
	}

	/**
	 * Set skin
	 *
	 * @param $skin
	 * @return $this
	 */
	public function skin($skin) {
		$this->skins[] = $skin;
		return $this;
	}

	/**
	 * Set skins
	 *
	 * @param array $skins
	 * @return $this
	 */
	public function skins(array $skins = array()) {
		$this->skins = array_unique(array_merge($this->skins, $skins));
		return $this;
	}

	/**
	 * Set classes
	 *
	 * @param string $classes
	 * @return $this
	 */
	public function classes($classes) {
		$this->classes = $classes;
		return $this;
	}

	/**
	 * Calls the module Controller
	 *
	 * @param array $args
	 * @param string $action
	 * @return $this
	 */
	public function ctrl($args = array(), $action = 'data') {
		$ctlrClass = self::getModuleCtrlClassPath($this->name);
		$this->data = call_user_func($ctlrClass . '::' . $action, $args);

		return $this;
	}

	/**
	 * Set html tag
	 *
	 * @param $tag
	 * @return $this
	 */
	public function tag($tag) {
		$this->configs['tag'] = $tag;

		return $this;
	}

	/**
	 * Add attribute
	 *
	 * @param $name
	 * @param $value
	 * @return $this
	 */
	public function attrib($name, $value) {
		$this->attribs[$name] = $value;

		return $this;
	}

	/**
	 * Add attributes
	 *
	 * @param $name
	 * @param $value
	 */
	public function attribs(array $attribs = array()) {
		$this->attribs = array_unique(array_merge($this->attribs, $attribs));

		return $this;
	}

	/**
	 * Set indent
	 *
	 * @param $count
	 * @return $this
	 */
	public function indent($count) {
		$this->indent = $count;

		return $this;
	}

	/**
	 * Render a module
	 *
	 * @return string
	 */
	public function render() {
		$data = $this->data;

		// Classes
		$classes = array('mod', sprintf("mod-%s", $this->name));

		// Skin Classes
		foreach ($this->skins as $skin) {
			$classes[] = sprintf("skin-%s-%s", $this->name, strtolower($skin));
		}

		// Append classes
		$classes[] = $this->classes;

		// Attribs
		$attribs = array();

		// Add id if set
		if ($this->id) {
			$attribs[] = sprintf("id=\"%s\"", $this->id);
		}

		foreach ($this->attribs as $name => $value) {

			switch ($name) {

				case 'class':
					if (!empty($value)) {
						$classes[] = $value;
					}
					break;

				default:
					if (empty($value)) {
						$attribs[] = "{$name}";
					} else {
						$attribs[] = "{$name}=\"{$value}\"";
					}
					break;
			}
		}

		// Add Prefix/Suffix
		$markup = sprintf('<%1$s class="%2$s"%3$s>' . PHP_EOL . '%4$s' .PHP_EOL . '</%1$s>' . '<!-- /mod-%5$s -->',
			strtolower($this->configs['tag']),
			implode(' ', $classes),
			(count($attribs) ? ' ' . implode(' ', $attribs) : ''),
			self::$INDENT_CHAR  . trim(self::indentLines(self::includeTemplate(), 1)) . self::$INDENT_CHAR,
			$this->name
		);

		return self::indentLines($markup) .  PHP_EOL;
	}

	/**
	 * Indent every line
	 *
	 * @param $markup
	 * @return mixed
	 */
	protected function indentLines($markup, $count = null) {

		if($count === null) {
			$count = $this->indent;
		}
		$markup = str_replace(
			PHP_EOL,
			PHP_EOL . str_repeat(self::$INDENT_CHAR, $count),
			$markup);

		return $markup;
	}

	/**
	 * Include template markup and data
	 *
	 * @return string
	 */
	protected function includeTemplate() {

		if (file_exists($this->templateFile())) {

			ob_start();

			// Provide data for the module
			if ($this->data !== null) {
				$data = (object) $this->data; // assign data, convert to object
			} else {
				$data = (object) array(); // empty object
			}

			include $this->templateFile();

			return ob_get_clean();

		} else {
			return sprintf("<!-- Template does not exists: %s/%s -->", basename(dirname($this->name)), basename($this->template));
		}
	}

	/**
	 * Get template file
	 *
	 * @return string
	 */
	protected function templateFile() {
		$file = $this->name;

		// If template set: extend file
		if ($this->template) {
			$file = $file . '-' . $this->template;
		}

		return sprintf('%1$s/%2$s/%3$s%4$s', static::$MODULES_PATH, $this->name, $file, $this->configs['fileext']);
	}

	/**
	 * Returns Module Controller Class Path
	 *
	 * @param $moduleName
	 * @return string
	 */
	protected static function getModuleCtrlClassPath($moduleName) {
		return sprintf('\NxModule\%1$s\%2$sCtrl', $moduleName, ucfirst($moduleName));
	}

}
