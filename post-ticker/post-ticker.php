<?php
/*
Plugin Name: Post Ticker
Description: Displays blog posts from a category in a horizontal scrolling ticker format. Shortcode: [post_ticker category_id="*"]
Version: 1.0
Author: Nick Morrish
*/

//enqueue js scripts and css styles for use in the plugin
function ctt_enqueue_scripts() {
    wp_enqueue_style('ctt-styles', plugins_url('css/style.css', __FILE__));
    wp_enqueue_script('ctt-scripts', plugins_url('js/script.js', __FILE__), array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'ctt_enqueue_scripts',10);

//Use WP_Query to fetch posts from a specific category within a shortcode that will be used to display the ticker:
function ctt_get_posts_from_category($category_id) {
    $output = ''; // Initialize a variable to store the output

    $args = array(
        'cat' => $category_id, // Use 'cat' to filter by category ID
        'posts_per_page' => -1,
    );

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        $output .= '<div class="ctt-post-ticker-container">';
        $output .= '<div class="ctt-post-ticker">';
        while ($query->have_posts()) {
            $query->the_post();
            $output .= '<div class="ctt-post-item">';
            $output .= get_the_post_thumbnail(get_the_ID(), 'medium');
            $output .= '<h4>' . get_the_title() . '</h4>';
            $output .= '<div class="ctt-post-content">' . get_the_content() . '</div>';
            $output .= '</div>';
        }
        $output .= '</div>';
        $output .= '</div>';
    }

    wp_reset_postdata();

    return $output; // Return the output instead of echoing it
}

//Register a shortcode to allow the ticker to be placed anywhere on the site. 
//You can then use [ctt_post_ticker category_id="1"] in a post or page to display the ticker.
function ctt_post_ticker_shortcode($atts) {
    $atts = shortcode_atts(array(
        'category_id' => '', // Default to an empty string if no category ID is provided
    ), $atts);

    if (!empty($atts['category_id'])) {
        return ctt_get_posts_from_category($atts['category_id']); // Return the output from ctt_get_posts_from_category
    }

    return ''; // Return an empty string if no category_id is provided
}

add_shortcode('post_ticker', 'ctt_post_ticker_shortcode');
