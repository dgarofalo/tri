<?php
/**
 * Template part for displaying page content in page.php.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package TRI
 */

$banner = has_post_thumbnail() ? the_post_thumbnail_url() : get_site_url() . '/wp-content/uploads/banner.jpg' ;
?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <div class="banner lazy" data-bg="<?php echo $banner; ?>">
        <h1><?php the_title(); ?></h1>
    </div>
    <div class="section container-fluid">
        <div class="row">
            <div class="col-md-10 article-body">
                <?php
                    the_content();

                    wp_link_pages( array(
                        'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'tri' ),
                        'after'  => '</div>',
                    ) );

                    edit_post_link(
                        sprintf(
                        /* translators: %s: Name of current post */
                            esc_html__( 'Edit %s', 'tri' ),
                            the_title( '<span class="screen-reader-text">"', '"</span>', false )
                        ),
                        '<span class="edit-link">',
                        '</span>'
                    );
                ?>
            </div>
        </div>
    </div>
</article>