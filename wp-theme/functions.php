<?php

// Define Default Environment
if (!defined('APP_ENV')) define('APP_ENV', 'prod');

/**
 * Returns modified time from file REVISION in repository root if present, otherwise from this file.
 * Stamp is base 36 converted to get shorter string.
 *
 * @param $path
 * @return string
 */
function getRevision() {
	$revisionFile = __DIR__ . '/../' . 'REVISION';
	if (file_exists($revisionFile)) {
		$stamp = filemtime($revisionFile);
	} else {
		$stamp = filemtime(__FILE__);
	}

	// convert base
	return base_convert($stamp, 10, 36);
}
define('RELEASE_STAMP', getRevision());


//// Paths

// Theme Paths
define('THEME_PATH', __DIR__);
define('THEME_URL', parse_url(get_bloginfo('template_url'), PHP_URL_PATH));

// Assets Paths
define('ASSETS_DIR', '/_static');
define('ASSETS_PATH', THEME_PATH . ASSETS_DIR);
define('ASSETS_URL', THEME_URL . ASSETS_DIR);

// Vendor Libs Paths
define('VENDOR_PATH', THEME_PATH . '/vendor');

// Theme src Path
define('INCLUDES_PATH', THEME_PATH . '/app/NxTheme');

// Partials Path
define('TC_PARTIALS_PATH', THEME_PATH . '/app/partials');
define('TC_MODULES_PATH',  THEME_PATH . '/app/NxModule');


//// Class Loader, PSR-0 (Symfony2 Classloader)
require_once VENDOR_PATH . '/Nx/ClassLoader.php';
$loader = new \Nx\ClassLoader();

// register classes with namespaces
$loader->addPrefix('NxTheme',  THEME_PATH . '/app');
$loader->addPrefix('NxModule', THEME_PATH . '/app');
$loader->addPrefix('Nx',        VENDOR_PATH);

// activate the autoloader
$loader->register();

// Must Use Plugins
//require WPMU_PLUGIN_DIR.'/advanced-custom-fields/acf.php';

//// Init

// Config
\Nx\Terrific::$PARTIALS_PATH = TC_PARTIALS_PATH;
\Nx\TerrificModule::$MODULES_PATH = TC_MODULES_PATH;

// Theme Init
\NxTheme\Theme::init();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Shortcut: Terrific Module, to include in templates
 *
 * @see \Nx\Terrific::module()
 * @param $name
 * @return \Nx\TerrificModule
 */
function module($name) {
	return \Nx\Terrific::module($name);
}

/**
 * Shortcut: Partial, to include in templates
 *
 * @see \Nx\Terrific::partial()
 * @param $name
 * @param $options
 *
 * @return string
 */
function partial($name, $options = array()) {
	return \Nx\Terrific::partial($name, $options);
}

/**
 * Shortcut: Debug
 *
 * @param $value
 */
function debug($value) {
	return \NxTheme\Helpers::debug($value);
}
