<?php
/**
 * The template for displaying search forms in nxtheme
 *
 * @package nxtheme
 */
?>

<? if(is_search()) {
	echo module('search')->attrib('class', 'active');
} else {
	echo module('search');
}
