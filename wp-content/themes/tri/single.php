<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package TRI
 */

get_header(); ?>
	<div class="section container-fluid">
		<div class="row">
			<div class="col-md-8">
				<?php while ( have_posts() ) : the_post(); ?>
					<article id="post-<?php the_ID(); ?>" class="news-post-detail">
						<header class="entry-header">
							<h1>
								<?php the_title(); ?>
							</h1>
							<?php get_template_part( 'components/post/content', 'meta' ); ?>
						</header>
						<?php if( has_post_thumbnail() ): ?>
							<div class="post-thumbnail">
								<img src="<?php the_post_thumbnail_url(); ?>" alt="<?php the_title(); ?>" />
							</div>
						<?php endif; ?>
						<div class="post-content">
							<?php the_content() ?>
						</div>
					</article>
				<?php endwhile; ?>
			</div>
			<div class="col-md-4">
				<?php get_sidebar(); ?>
			</div>
		</div>
	</div>
<?php
get_footer();
