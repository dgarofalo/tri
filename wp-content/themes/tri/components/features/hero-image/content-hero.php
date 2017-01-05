<?php
/**
 * The template used for displaying hero content
 *
 * @package TRI
 */
?>

<?php if ( has_post_thumbnail() ) : ?>
	<div class="tri-hero">
		<?php the_post_thumbnail( 'tri-hero' ); ?>
	</div>
<?php endif; ?>
