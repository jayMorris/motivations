//material contact form animation

$('.contact-form').find('.form-control').each(function() {
    var targetItem = $(this).parent();
    if ($(this).val()) {
        $(targetItem).find('label').css({
            'top': '10px',
            'fontSize': '14px'
        });
    }
});
$('.contact-form').find('.form-control').focus(function() {
    $(this).parent('.input-block').addClass('focus');
    $(this).parent().find('label').animate({
        'top': '10px',
        'fontSize': '14px'
    }, 300);
});
$('.contact-form').find('.form-control').blur(function() {
    if ($(this).val().length === 0) {
        $(this).parent('.input-block').removeClass('focus');
        $(this).parent().find('label').animate({
            'top': '25px',
            'fontSize': '18px'
        }, 300);
    }
});

$('#submit').click(function() {

    $.post("send.php", $("#mycontactform").serialize(), function(response) {
        $('#success').html(response);
        $("#mycontactform")[0].reset();
    });
    return false;
});




(function() {

    var $menuFlyOut = $("#menu-fly-out");

    function menuToggle() {
        if ($menuFlyOut.hasClass('open')) {
            $menuFlyOut.removeClass("open").css({ 'z-index': '-1' });
        } else {
            $menuFlyOut.addClass("open");
            $menuFlyOut.on('transitionend webkitTransitionEnd oTransitionEnd', function() {
                if ($menuFlyOut.hasClass('open')) {
                    $(this).css({ 'z-index': '33' });
                }
            });
        }
    }

    $('#hamburg-toggle').click(function(e) {
        menuToggle();
        e.preventDefault();
    });


    $(window).click(function() {
        if ($menuFlyOut.hasClass('open')) {
            $menuFlyOut.removeClass("open").css({ 'z-index': '-1' });
        }
    });

    $('#hamburg-toggle').click(function(event) {
        event.stopPropagation();
    });

})();