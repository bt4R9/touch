$(function() {

    /**
     * @type {jQuery}
     */
    $sample = $('.js-sample');

    /**
     * @type {jQuery}
     */
    $letter = $('.letter');

    /**
     * @type {jQuery}
     */
    $html = $('html');

    var move = {};

    /**
     * Reset styles.
     */
    function toDefault() {
        move = {
            x0: 0,
            y0: 0,
            x: 0,
            y: 0,
            shiftX: 0,
            shiftY: 0
        };

        $letter.css({
            '-webkit-transform': 'translate3d(0,0,0)',
            'transition': '-webkit-transform 400ms'
        });

        $('.north, .south, .west, .east').removeClass('select');
    }

    /**
     * Translate node through the translate3d property.
     */
    function translateNode() {
        var shift = [
                '-webkit-transform: translate3d(' + move.shiftX + 'px,' + move.shiftY + 'px,0)'
        ].join(';');

        $letter[0].setAttribute('style', shift);
    }

    /**
     * Makes selected element active.
     */
    function active() {
        $html.addClass('active');
    }

    /**
     * Makes selected element inactive.
     */
    function inactive() {
        $html.removeClass('active');
    }

    var current;

    /**
     * Select current cardinal.
     */
    function check() {
        var collisions = $letter.collision('.north, .south, .west, .east');

        if (collisions.length) {

            if (collisions.length === 1) {
                if (collisions[0] !== current) {
                    current && current.classList.remove('select');
                }
                current = collisions[0];
            }

            if (collisions.length > 1) {
                if (current && (current === collisions[0] || current === collisions[1])) {
                    return;
                }

                current = collisions[0];
            }

        } else {
            current && current.classList.remove('select');
            current = null;
        }

        current && current.classList.add('select');
    }

    $(document).on('touchmove', function(e) {
        e.preventDefault();
    });

    var IS_DRAG = false;

    $letter.on('taphold', function(e) {
        e.preventDefault();
        active();
        IS_DRAG = true;
    });

    $letter.on('touchstart', function(e) {
        var event = e.originalEvent;
        var touches = event.touches;

        if (touches.length === 1) {
            var touch = touches[0];
            move.x0 = touch.pageX;
            move.y0 = touch.pageY;
        }
    });

    $letter.on('touchmove', function(e) {
        if (IS_DRAG) {
            var touch = e.originalEvent.touches[0];

            move.x = touch.pageX;
            move.y = touch.pageY;

            move.shiftX = move.x - move.x0;
            move.shiftY = move.y - move.y0;

            translateNode();
            check();
        }
    });

    $letter.on('touchend', function() {
        inactive();
        toDefault();
        IS_DRAG = false;
        if (current) {
            $('.notification')
                .html(current.getAttribute('data-action'))
                .addClass('notification__active');

            setTimeout(function() {
                $('.notification').removeClass('notification__active');
            }, 1500);

            current = null;
        }
    });

});
