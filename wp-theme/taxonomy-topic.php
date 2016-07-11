<?php
/**
 * The template for displaying Archive pages.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package nxtheme
 */

get_header(); ?>

	<?php if(is_tax('topic')) : ?>
		<div class="mod-search-and-filter">
		<div class="entry-content-inner">

			<?php $queried_object = get_queried_object(); ?>

			<h2><?php echo $queried_object->count ?> posts with <?php echo $queried_object->taxonomy ?> <?php echo '"' . $queried_object->slug . '"' ?></h2>
			<hr>

			<div class="row">
				<div class="col col-25">
					<h3>Filter</h3>
					Nothing yet
				</div>
				<div class="col col-25">
					<h3>Type</h3>
					<a href="?filter=news">News</a>
					<a href="?filter=post">Post</a>
				</div>
				<div class="col col-50">
					<h3>Category</h3>
					<?php
						$terms = get_terms("megatrend");
						$count = count($terms);

						if ( $count > 0 ){
							echo '<ul class="list-categories">';
							foreach ( $terms as $term ) {
								$term_link = get_term_link($term);
								$format = '<li class="item"><a href="%s">%s</a></li>';
								echo sprintf($format,$term_link, $term->name);
								//echo "<li>" . $term->name . "</li>";

							}
							echo "</ul>";
						}
					?>
				</div>
			</div>

		</div>
	</div>
	<?php endif; ?>

	<section id="primary" class="content-area">
		<main id="main" class="site-main" role="main">

		<?php if ( have_posts() ) : ?>

			<header class="page-header">
				<h1 class="page-title">
					<?php
						if ( is_category() ) :
							single_cat_title();

						elseif ( is_tag() ) :
							single_tag_title();

						elseif ( is_author() ) :
							printf( __( 'Author: %s', 'nxtheme' ), '<span class="vcard">' . get_the_author() . '</span>' );

						elseif ( is_day() ) :
							printf( __( 'Day: %s', 'nxtheme' ), '<span>' . get_the_date() . '</span>' );

						elseif ( is_month() ) :
							printf( __( 'Month: %s', 'nxtheme' ), '<span>' . get_the_date( _x( 'F Y', 'monthly archives date format', 'nxtheme' ) ) . '</span>' );

						elseif ( is_year() ) :
							printf( __( 'Year: %s', 'nxtheme' ), '<span>' . get_the_date( _x( 'Y', 'yearly archives date format', 'nxtheme' ) ) . '</span>' );

						elseif ( is_tax( 'post_format', 'post-format-aside' ) ) :
							_e( 'Asides', 'nxtheme' );

						elseif ( is_tax( 'post_format', 'post-format-gallery' ) ) :
							_e( 'Galleries', 'nxtheme');

						elseif ( is_tax( 'post_format', 'post-format-image' ) ) :
							_e( 'Images', 'nxtheme');

						elseif ( is_tax( 'post_format', 'post-format-video' ) ) :
							_e( 'Videos', 'nxtheme' );

						elseif ( is_tax( 'post_format', 'post-format-quote' ) ) :
							_e( 'Quotes', 'nxtheme' );

						elseif ( is_tax( 'post_format', 'post-format-link' ) ) :
							_e( 'Links', 'nxtheme' );

						elseif ( is_tax( 'post_format', 'post-format-status' ) ) :
							_e( 'Statuses', 'nxtheme' );

						elseif ( is_tax( 'post_format', 'post-format-audio' ) ) :
							_e( 'Audios', 'nxtheme' );

						elseif ( is_tax( 'post_format', 'post-format-chat' ) ) :
							_e( 'Chats', 'nxtheme' );

						else :
							_e( 'Archives', 'nxtheme' );

						endif;
					?>
				</h1>
				<?php
					// Show an optional term description.
					$term_description = term_description();
					if ( ! empty( $term_description ) ) :
						printf( '<div class="taxonomy-description">%s</div>', $term_description );
					endif;
				?>
			</header><!-- .page-header -->

			<?= module('teaser-list') ?>

			<?php \NxTheme\Tags::paging_nav(); ?>

		<?php else : ?>

			<?= module('teaser-list')->skin('empty')->template('empty') ?>

		<?php endif; ?>

		</main><!-- #main -->
	</section><!-- #primary -->

<?php //get_sidebar(); ?>
<?php get_footer(); ?>
