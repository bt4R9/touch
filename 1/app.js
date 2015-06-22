$(function() {

    /**
     * @type {boolean}
     */
    var IS_DRAG = false;

    /**
     * @constant
     * @type {number}
     */
    var MAX_INTERSECTIONS = 9 ;

    /**
     * Node to log debug information.
     * @type {jQuery}
     */
    var $debug = $('.debug');

    /**
     * Draggable node.
     * @type {jQuery}
     */
    var $node = $('.box');

    /**
     * Node to log progress.
     * @type {jQuery}
     */
    var $progress = $('.progress');

    /**
     * @type {Object}
     */
    var move = {};

    function toDefault() {
        move = {
            x0: 0,
            y0: 0,
            x: 0,
            y: 0,
            shiftX: 0,
            shiftY: 0,
            directionX: 0,
            directionY: 0,
            intersectionsX: 0,
            intersectionsY: 0,
            directionPreX: 0,
            directionPreY: 0,
            progress: 0
        };

        $progress.css({
            width: '0%'
        });

        $('html').removeClass('compass__active');
    }

    /**
     * Log debug info.
     */
    function debug() {
        var html = [
            'x = ' + move.shiftX + '&nbsp;&nbsp;&nbsp;&nbsp;y = ' + move.shiftY,
            'x direction = ' + move.directionX,
            'y direction = ' + move.directionY,
            'x intersections = ' + move.intersectionsX,
            'y intersections = ' + move.intersectionsY,
            'progress = ' + move.progress + '%'
        ].join('<br />');

        $debug.html(html);
    }

    /**
     * Translate node through the translate3d property.
     */
    function translateNode() {
        var shift = [
            '-webkit-transform: translate3d(' + move.shiftX + 'px,' + move.shiftY + 'px,0)'
        ].join(';');

        $node[0].setAttribute('style', shift);
    }

    /**
     * Reset styles.
     */
    function again() {
        $node.css({
            '-webkit-transform': 'translate3d(0,0,0)',
            'transition': '-webkit-transform 400ms'
        });
    }

    again();
    toDefault();
    debug();

    $node
        .on('touchstart', function(e) {
            var event = e.originalEvent;
            var touches = event.touches;

            if (touches.length === 1) {
                var touch = touches[0];
                move.x0 = touch.pageX;
                move.y0 = touch.pageY;
                IS_DRAG = true;
            }
        })
        .on('touchend', function() {
            IS_DRAG = false;
            toDefault();
            debug();
            again();
            if (activeNode) {
                var action = activeNode.parentNode.getAttribute('data-action');
                $('.notification')
                    .html(action)
                    .addClass('notification__active');

                setTimeout(function() {
                    $('.notification').removeClass('notification__active');
                }, 1500);

            }
        });

    var lastX = 0;
    var lastY = 0;

    $node.on('touchmove', function(e) {
        var event = e.originalEvent;
        var touches = event.touches;

        if (touches.length === 1) {
            var touch = touches[0];

            move.x = touch.pageX;
            move.y = touch.pageY;

            move.shiftX = move.x - move.x0;
            move.shiftY = move.y - move.y0;

            if (move.x > lastX) {
                move.directionX = 'right';
            } else if (move.x < lastX) {
                move.directionX = 'left';
            }

            if (move.y > lastY) {
                move.directionY = 'bottom';
            } else if (move.y < lastY) {
                move.directionY = 'top';
            }

            if (move.directionX !== move.directionPreX) {
                move.intersectionsX++;
            }

            if (move.directionY !== move.directionPreY) {
                move.intersectionsY++;
            }

            if (move.intersectionsX <= MAX_INTERSECTIONS) {
                move.progress = ((move.intersectionsX / MAX_INTERSECTIONS) * 100).toFixed(0);
                $progress.css({
                    width: move.progress + '%'
                });

                if (move.intersectionsX >= MAX_INTERSECTIONS) {
                    $('html').addClass('compass__active');
                    IS_DRAG = false;
                }
            }

            move.directionPreX = move.directionX;
            move.directionPreY = move.directionY;

            lastX = move.x;
            lastY = move.y;
        }

        if (IS_DRAG) {
            debug();
            translateNode();
        }
    });



    var activeNode;

    $(document).on('touchmove', function(e) {
        var touch = e.originalEvent.touches[0];
        var node = document.elementFromPoint(touch.pageX, touch.pageY);

        if (node.parentNode.classList.contains('compass__item')) {
            if (activeNode) {
                if (activeNode !== node) {
                    activeNode.parentNode.classList.remove('compass__item__active');
                    activeNode = node;
                    activeNode.parentNode.classList.add('compass__item__active');
                }
            } else {
                activeNode = node;
                activeNode.parentNode.classList.add('compass__item__active');
            }
        } else {
            if (activeNode && activeNode.parentNode.classList.contains('compass__item__active')) {
                activeNode.parentNode.classList.remove('compass__item__active');
            }
        }

    });


    document.ontouchmove = function(event) {
        event.preventDefault();
    }

});
