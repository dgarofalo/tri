<?php
/**
 * The template for displaying archive pages
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package TRI
 */

get_header(); ?>
	<div class="banner lazy" data-bg="<?php echo content_url('uploads/banner.jpg') ?>">
		<?php
			single_post_title( '<h1 class="page-title">', '</h1>' );
		?>
	</div>
	<section class="section news-posts">
		<div class="container-fluid">
			<?php if ( have_posts() ) : ?>
				<div class="row">
					<?php
						/* Start the Loop */
						while ( have_posts() ) : the_post();

							/*
							* Include the Post-Format-specific template for the content.
							* If you want to override this in a child theme, then include a file
							* called content-___.php (where ___ is the Post Format name) and that will be used instead.
							*/
							get_template_part( 'components/post/content', get_post_format() );

						endwhile;

						the_posts_navigation();

					else :

						get_template_part( 'components/post/content', 'none' );
					?>
				</div>
			<?php endif; ?>
		</div>
	</section>
<?php
get_footer();
