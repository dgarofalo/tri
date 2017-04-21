<?php
/**
 * Template part for displaying page content in page.php.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package TRI
 */

?>

<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <?php
        the_content();

        wp_link_pages( array(
            'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'tri' ),
            'after'  => '</div>',
        ) );
    ?>
</div>
<div class="section container-fluid">
    <h2>Most Recent</h2>
    <div class="row">
        <?php
            $recent_posts = wp_get_recent_posts();
            foreach( $recent_posts as $recent ):
        ?>
            <article id="post-<?php echo $recent['ID']; ?>" class="news-post col-md-4">
                <?php if( get_field('thumbnail_image', $recent['ID']) ): ?>
                    <div class="post-thumbnail">
                        <a href="<?php get_permalink($recent['ID']); ?>">
                            <img src="<?php the_field('thumbnail_image', $recent['ID']); ?>" alt="<?php echo $recent['post_title']; ?>" />
                        </a>
                    </div>
                <?php endif; ?>
                <header class="entry-header">
                    <h2>
                        <a href="<?php get_permalink($recent['ID']); ?>">
                            <?php echo $recent['post_title']; ?>
                        </a>
                    </h2>
                    <div class="post-excerpt"><?php echo $recent['post_excerpt'] ?></div>
                    <a class="post-link" href="<?php get_permalink($recent['ID']); ?>">Read More</a>
                </header>
            </article>
        <?php
            endforeach;
            wp_reset_query();
        ?>
    </div>
</div>