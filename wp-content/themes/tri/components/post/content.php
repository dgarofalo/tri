<?php
/**
 * Template part for displaying posts.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package TRI
 */

?>
<article id="post-<?php the_ID(); ?>" class="news-post col-md-4">
	<?php if( get_field('thumbnail_image') ): ?>
		<div class="post-thumbnail">
			<a href="<?php the_permalink(); ?>">
				<img src="<?php the_field('thumbnail_image'); ?>" alt="<?php the_title(); ?>" />
			</a>
		</div>
	<?php endif; ?>
	<header class="entry-header">
		<h2>
			<a href="<?php the_permalink(); ?>">
				<?php the_title(); ?>
			</a>
		</h2>
		<div class="post-excerpt"><?php the_excerpt() ?></div>
		<a class="post-link" href="<?php the_permalink(); ?>">Read More</a>
	</header>
</article>