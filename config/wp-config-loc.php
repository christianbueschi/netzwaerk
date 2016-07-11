<?php

// Error Reporting
error_reporting(E_ALL & ~E_DEPRECATED);
//error_reporting(0);

// Authentication Unique Keys and Salts. Generate here:
// https://api.wordpress.org/secret-key/1.1/salt/
define('AUTH_KEY',         'S{_n$}I4zN3S<8g#ICo<oV?f5sCG ?EH(t5-ZG*ct0u`D55h(zN5zNvcJ^^D(089');
define('SECURE_AUTH_KEY',  'Ay/WL923aHT=1$azO82LH^:Y1WO|`eV?~Pv3x@-MUdwx(2754X8o;Na(&C%x+tEt');
define('LOGGED_IN_KEY',    'o{yN%d|C6+k=BA3,ITC-#:%7[Y*0.g$vSh[XqVWjI~a}|8z[,HKex7Ib[3~D|ZnF');
define('NONCE_KEY',        '*w++N+0>QP7-qhsne@Id/jix!|?^OlC!JXsC-@TrKwgz ;$N_&+zHI?{-=`?9>-F');
define('AUTH_SALT',        '&V4a.=1s.O3^Mjd:}[>Djpl2Mx,#x`0(,gDv-G@c6S51-7|KxM*W=2g UF#nj-|]');
define('SECURE_AUTH_SALT', 'TH]*1q(q+])*DiD;PKF^F,|4:w~q+7J|~A&/39aYDLX}1&I+aF>G{C?rycV]E=,x');
define('LOGGED_IN_SALT',   'EFtAsF@5!BE-G40rX{k&gP(Q[o8T3$-AeM-?TR_,.h$Cc#eR$C<`ZZ+2y`Kd8q1(');
define('NONCE_SALT',       'E{J!rk6!pQpe/AG=C}s@QO|?FP8i&10PP0c!>?K1+7+aZqbv%F/L%:+x4m~ _Gy~');

// Database
define('DB_NAME',     'wordpress');
define('DB_USER',     'wordpress');
define('DB_PASSWORD', 'local');
define('DB_HOST',     'localhost');

// Database, Charset
$table_prefix  = 'wp_';
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', 'utf8_general_ci');

 // Domain
define('NX_SITE_HOST', 'netzwaerk.loc');
define('WP_SITEURL',    'http://' . NX_SITE_HOST);
define('WP_HOME',        WP_SITEURL);

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
define('FORCE_SSL_LOGIN', false);
define('WP_POST_REVISIONS', 3);   // default: true
define('AUTOSAVE_INTERVAL', '300');  // default: 60 seconds.
define('EMPTY_TRASH_DAYS', 14);  // default: 30 days
define('DISALLOW_FILE_EDIT', true); // Disable theme and plugin editor
define('WP_AUTO_UPDATE_CORE', 'minor'); // Minor is the default setting. We set it for transparency

// Enable Cache
define('WP_CACHE', false);

// App Environment
define('APP_ENV', 'dev'); // dev, qa, prod

////// Debugging //////////////////////////////////////////////////////
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', true);
define('SAVEQUERIES', false);        // default: false
define('SCRIPT_DEBUG', false);
define('CONCATENATE_SCRIPTS', true); // default: true

// Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', __dir__ . '/../public/');

// Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
