jQuery(document).ready(function($) {
    var ticker = $('.ctt-post-ticker');
    var tickerWidth = $('.ctt-post-item').outerWidth(true); // Get the full width of one item, including margins
    var animationSpeed = 2500; // Set the animation speed
    var isPaused = false; // Track if the animation is paused
    var remainingDistance; // Track the remaining distance to move
    var isDragging = false; // Track if the user is currently dragging
    var startX, currentX; // Track the initial and current X positions
    var initialMarginLeft; // Track the initial margin-left of the ticker
    var hasLeftFrame = false; // Track if the user has left the frame

    function startTicker(distance) {
        remainingDistance = distance || tickerWidth;
        ticker.animate({marginLeft: '-=' + remainingDistance + 'px'}, remainingDistance / tickerWidth * animationSpeed, 'linear', function(){
            $(this).append($(this).find('.ctt-post-item:first'));
            $(this).css('margin-left', '0');
            if (!isPaused) {
                startTicker(); // Continue the animation only if not paused
            }
        });
    }

    ticker.on('mouseenter touchstart', function() {
        ticker.stop(); // Stop the animation when the mouse or touch starts
        isPaused = true; // Mark as paused
        remainingDistance = tickerWidth + parseFloat(ticker.css('margin-left')); // Calculate the remaining distance to move
        hasLeftFrame = false; // Reset the frame leave flag
    }).on('mouseleave touchend', function() {
        if (!isDragging) {
            isPaused = false; // Mark as not paused
            startTicker(remainingDistance); // Resume the animation from where it left off
        }
    });

    // Start dragging
    ticker.on('mousedown touchstart', function(e) {
        e.preventDefault();
        ticker.stop(); // Stop the ticker permanently once user interacts
        isPaused = true; // Mark as paused
        isDragging = true; // Set dragging to true
        startX = e.pageX || e.originalEvent.touches[0].pageX; // Get the initial X position
        initialMarginLeft = parseFloat(ticker.css('margin-left')); // Get the initial margin-left value
        ticker.css('cursor', 'grabbing'); // Change cursor to grabbing during drag
    });

    // Prevent text selection while dragging
    $(document).on('selectstart', function(e) {
        if (isDragging) {
            e.preventDefault(); // Disable text selection
        }
    });

    // Handle dragging
    $(document).on('mousemove touchmove', function(e) {
        if (!isDragging) return; // Only execute if dragging
        currentX = e.pageX || e.originalEvent.touches[0].pageX; // Get the current X position
        var distanceMoved = currentX - startX; // Calculate the distance moved
        ticker.css('margin-left', initialMarginLeft + distanceMoved + 'px'); // Adjust the margin-left based on the drag distance
    });

    // Handle mouse leaving the frame during dragging
    ticker.on('mouseleave', function() {
        if (isDragging) {
            hasLeftFrame = true; // Mark that the user has left the frame
            ticker.stop().animate({marginLeft: initialMarginLeft + 'px'}, 500, function() {
                // After the transition, allow the ticker to resume its animation
                isDragging = false; // Stop dragging
                ticker.css('cursor', 'grab'); // Change cursor back to grab after drag
                if (!isPaused && !hasLeftFrame) { // Only restart if user hasn't re-entered
                    startTicker(remainingDistance); // Resume scrolling
                }
            });
        }
    });

    // Stop dragging on mouseup/touchend
    $(document).on('mouseup touchend', function() {
        if (isDragging && !hasLeftFrame) {
            isDragging = false; // Stop dragging
            ticker.css('cursor', 'grab'); // Change cursor back to grab after drag
        }
    });

    startTicker(); // Start the ticker animation initially
});
