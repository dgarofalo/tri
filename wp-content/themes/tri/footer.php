<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package TRI
 */

?>
</div>
<footer id="footer" class="footer" role="contentinfo">
	<div class="container-fluid">
		<div class="footer-top row">
			<div class="col-md-2">
				<h4 class="logo">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>">
						<span class="sr-only"><?php bloginfo( 'name' ); ?></span>
						<img src="<?php echo get_template_directory_uri().'/images/logo_alt.svg' ?>" alt="<?php bloginfo( 'name' ); ?>" />
					</a>
				</h4>
			</div>
			<div class="col-md-10">
				<ul class="links">
					<?php wp_nav_menu( array( 'menu' => 'footer-links', 'items_wrap'=>'%3$s',  'container' => false ) ); ?>
				</ul>
			</div>
		</div>
		<div class="footer-bottom">
			<ul class="links social">
				<li><a target="_blank" href="#"><i class="icon-facebook"></i></a></li>
				<li><a target="_blank" href="#"><i class="icon-twitter"></i></a></li>
				<li><a target="_blank" href="#"><i class="icon-linkedin"></i></a></li>
			</ul>
			<ul class="links extra">
				<li><span class="copyright">©2016 <?php bloginfo( 'name' ); ?></span></li>
			</ul>
		</div>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
