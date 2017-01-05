<?php
/**
 * The template for displaying search results pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package TRI
 */

get_header(); ?>
	<div class="container-fluid">
		<div class="col-md-9">
			<?php
			if ( have_posts() ) : ?>

				<header class="page-header">
					<h1 class="page-title"><?php printf( esc_html__( 'Search Results for: %s', 'tri' ), '<span>' . get_search_query() . '</span>' ); ?></h1>
				</header>
				<?php
				/* Start the Loop */
				while ( have_posts() ) : the_post();

					/**
					 * Run the loop for the search to output the results.
					 * If you want to overload this in a child theme then include a file
					 * called content-search.php and that will be used instead.
					 */
					get_template_part( 'components/post/content', 'search' );

				endwhile;

				the_posts_navigation();

			else :

				get_template_part( 'components/post/content', 'none' );

			endif; ?>
		</div>
		<div class="col-md-3">
			<?php get_sidebar(); ?>
		</div>
	</div>
<?php
get_footer();
