<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package TRI
 */

get_header(); ?>
	<div class="container-fluid">
		<header class="page-header">
			<h1 class="page-title"><?php esc_html_e( 'Oops! That page can&rsquo;t be found.', 'tri' ); ?></h1>
		</header>
		<div class="page-content">
			<p><?php esc_html_e( 'It looks like nothing was found at this location. Maybe try one of the links below or a search?', 'tri' ); ?></p>

			<?php
			get_search_form();

			the_widget( 'WP_Widget_Recent_Posts' );

			// Only show the widget if site has multiple categories.
			if ( tri_categorized_blog() ) :
				?>

				<div class="widget widget_categories">
					<h2 class="widget-title"><?php esc_html_e( 'Most Used Categories', 'tri' ); ?></h2>
					<ul>
						<?php
						wp_list_categories( array(
							'orderby'    => 'count',
							'order'      => 'DESC',
							'show_count' => 1,
							'title_li'   => '',
							'number'     => 10,
						) );
						?>
					</ul>
				</div>
				<?php
			endif;

			/* translators: %1$s: smiley */
			$archive_content = '<p>' . sprintf( esc_html__( 'Try looking in the monthly archives. %1$s', 'tri' ), convert_smilies( ':)' ) ) . '</p>';
			the_widget( 'WP_Widget_Archives', 'dropdown=1', "after_title=</h2>$archive_content" );

			the_widget( 'WP_Widget_Tag_Cloud' );
			?>
	</div>
<?php
get_footer();
