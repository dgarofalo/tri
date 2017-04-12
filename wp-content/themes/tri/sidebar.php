<?php
/**
 * The sidebar containing the main widget area
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package TRI
 */

if ( ! is_active_sidebar( 'sidebar-1' ) ) {
	return;
}
?>
<aside class="sidebar">
	<div class="recent-posts" >
		<h3>Most Recent</h3>
		<ul>
			<?php
				$recent_posts = wp_get_recent_posts();
				foreach( $recent_posts as $recent ){
					echo '<li><h2><a href="' . get_permalink($recent["ID"]) . '">' . $recent["post_title"].'</a></h2></li> ';
				}
				wp_reset_query();
			?>
		</ul>
	</div>
</aside>
