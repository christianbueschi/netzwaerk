<?php

// Error Reporting
error_reporting(E_ALL & ~E_DEPRECATED);
//error_reporting(0);

define('DOCUMENT_ROOT', realpath(__dir__ . '/../public'));

// Include Credentials (don't store them in VCS)
require __dir__ . '/wp-credentials.php';

// Database, Charset
$table_prefix  = 'wp_';
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', 'utf8_general_ci');

// Domain
define('NX_SITE_HOST',     'tbd');
define('WP_SITEURL',    'http://' . NX_SITE_HOST);
define('WP_HOME',       WP_SITEURL);

// Cookie
// define('COOKIE_DOMAIN', NX_SITE_HOST);
// define('COOKIEPATH', '');
// define('ADMIN_COOKIE_PATH', '/');

// Network
define('WP_ALLOW_MULTISITE', true);
define('MULTISITE', true);
//define('MULTISITE', false);
define('PATH_CURRENT_SITE', '/');
define('SUBDOMAIN_INSTALL', false);

// WordPress Paths
define('WP_CONTENT_DIR', __DIR__ . '/../web/wp-content'); // no trailing slash
define('WP_CONTENT_URL', WP_SITEURL . '/wp-content'); // no trailing slash
define('WP_PLUGIN_DIR',  __DIR__ . '/../web/wp-content/plugins'); // no trailing slash
define('WP_PLUGIN_URL',  WP_SITEURL . '/wp-content/plugins'); // no trailing slash
define('PLUGINDIR', WP_PLUGIN_DIR); // For compability issues with plugins
define('WPMU_PLUGIN_DIR',  __DIR__ . '/../web/wp-content/mu-plugins'); // no trailing slash
define('WPMU_PLUGIN_URL',  WP_SITEURL . '/wp-content/mu-plugins'); // no trailing slash

// Misc
define('FORCE_SSL_LOGIN',    false);
define('WP_POST_REVISIONS',  3);   // default: true
define('AUTOSAVE_INTERVAL',  '300');  // default: 60 seconds.
define('EMPTY_TRASH_DAYS',   14);  // default: 30 days
define('DISALLOW_FILE_EDIT', true); // Disable theme and plugin editor
define('WP_AUTO_UPDATE_CORE', 'minor'); // Minor is the default setting. We set it for transparency

// Enable Cache
define('WP_CACHE', false);

// App Environment
define('APP_ENV', 'prod'); // dev, qa, prod


////// Debugging //////////////////////////////////////////////////////
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);
define('SAVEQUERIES', false);        // default: false
define('SCRIPT_DEBUG', false);
define('CONCATENATE_SCRIPTS', true); // default: true

// Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', __dir__ . '/../public/');

// Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
