var winPos;
var isMobile = isMobile();

$(function () {
    if (isMobile) {
        $('.varilux-navbar').addClass("solid");
    }
    
    $(".sliding-link").click(function (e) {
        var mobOffset = 0;
        e.preventDefault();
        if (isMobile) {
            mobOffset = 50;
        }
        var aid = $(this).attr("href");
        $('html,body').animate({ scrollTop: $(aid).offset().top - mobOffset }, 'slow');
    });
    
    $('#news-subscribe').on('submit', function (e) {
        e.preventDefault();
        var email_news = $('#nemail').val();
        if (email_news == ''){
            return;
        }
        $(this).find('button').attr('disabled', true).css('cursor', 'not-allowed');
        $.ajax({
            type: "POST",
            url: window.location.origin + "/wp-admin/admin-ajax.php",
            data: { email: email_news, action: "insert_newsletter" },
            dataType: "json",
            success: function (response) {
                $('.feedback').fadeIn('fast').delay(4000).fadeOut('slow');
            }
        });
    });
    
    $('.show-phone').on('click', function(e){
        e.preventDefault();
        $('.phone-number-footer').toggleClass('open');
    });
    
    $(window).on('scroll', function(){
        var $social = $('.social-share');
        if ($social.length != 0) {
            var parentOffset = $social.parent().offset().top;
            var parentOutherheigth = $social.parent().outerHeight() + (parentOffset/2);
            if (window.pageYOffset >= parentOffset && window.pageYOffset <= parentOutherheigth){
                // window.requestAnimationFrame(function(){
                //     $social.css({transform: 'translateY('+(window.pageYOffset - $social.parent().offset().top)+'px)'})
                // }
                // );
                $social.css({top: ' 120px'});
                $social.addClass('fixed-top');
            }else{
                $social.removeClass('fixed-top');
                $social.css({top: 'auto'});
                
            }
        }
    });
    
    $(window).scroll(function (e) {
        winPos = $(window).scrollTop();        
        // Add remove class to navmenu
        navMonitor();
        // scroll progress
        scrollProgressMonitor();
        effectLensHome();
    });
    
    // Add/remove class to navmenu
    winPos = $(window).scrollTop();
    navMonitor();
    
    /****************************
    *  Home functions
    ****************************/
    homeCarouselInit();
    variationsCarousel();
    
    /****************************
    *  Product functions
    ****************************/
    if ($('.products-wrapper').length > 0) {
        // Discover your ideal lens
        // discoverLens();
        // Product mosaic
        mosaicChange();
        mosaicChangeTrigger();
        // Techs hover
        changeImgHover();
        productsCarouselMobile();
    }
    
    /****************************
    *  Warranty functions
    ****************************/
    if ($('#warranty-lens').length > 0) {
        warrantyCarousel();
    }
    
    /****************************
    *  The Brand functions
    ****************************/
    $('.brand-slider').slick({
        autoplay: true,
        infinite: true,
        dots: true,
        arrows: false,
        slidesToShow: 3,
        adaptiveHeight: true,
        responsive: [{
            breakpoint: 560,
            settings: {
                slidesToShow: 1,
            }
        },{
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
            }
        },{
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
            }
        }]
    });
    
    // MASK
    var SPMaskBehavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
    spOptions = {
        onKeyPress: function(val, e, field, options) {
            field.mask(SPMaskBehavior.apply({}, arguments), options);
        },
        placeholder: "(  )"
    };
    
    $('input[name=fc-phone]').mask(SPMaskBehavior, spOptions);
    
});

function isMobile() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

function changeImgHover() {
    $(document).on({
        mouseenter: function () {
            $(this).attr('src', $(this).attr('src').split('.png')[0] + "-filled.png")            
        },
        mouseleave: function () {
            $(this).attr('src', $(this).attr('src').split('-filled.png')[0] + ".png")
        }
    }, ".technologies img");
}

function variationsCarousel() {
    if ($('#showcase-xs').is(':visible')) {
        $('.carousel-showcase').slick({
            autoplay: false,
            infinite: true,
            dots: true,
            arrows: false,
            adaptiveHeight: true,
        });
    } else {
        $('#showcase a').click(function (e) { 
            e.preventDefault();
            var $this = $(this);
            $('#h-showcase, #p-showcase').fadeOut(function () {
                $('#variations-carousel li').removeClass('active');
                $this.parent().addClass('active');
                $('#showcase').css('background-image', 'url("' + $this.data('img') + '-blur.jpg")');
                $('#showcase .sharped-bg').css('background-image', 'url("' + $this.data('img') + '.jpg")');
                $('#p-showcase').text($this.data('p'));
                $('#h-showcase').text($this.text());
                if (url = $this.data('logo')) {
                    var img_tag = $('<img />').attr('src', url);
                    var small_tag = $('<small />').html('disponivel na linha ').append(img_tag);
                    $('#p-showcase').append(small_tag);
                }
                $('#p-showcase, #h-showcase').fadeIn();
            });
        });
    }
}

function warrantyCarousel() {
    $('#lens-carousel a').click(function (e) { 
        e.preventDefault();
        var $this = $(this);
        $('#main-img, #main-p').fadeOut(function () {
            $('#lens-carousel a').removeClass('active');
            $this.addClass('active');
            $('#main-img').attr('src', $this.data('img'));
            $('#main-p').text($this.data('p'));
            $('#main-img, #main-p').fadeIn();
        });
    });
}

function mosaicChange() {
    $('.box').click(function (e) {
        e.preventDefault();
        if ($(this).hasClass('active')) {
            return;
        }
        var id = $(this).data('tech-id');
        var $container = $(this).parent().parent();
        var $p = $container.parent().parent().find('#tech-text');
        
        $container.find('.box').removeClass('active');
        $(this).hide().addClass('active').toggle('scale');
        
        $p.fadeOut(function () {
            $p.html($container.find('#tech-p-' + id).html())
        }).fadeIn();
    });
}
function mosaicChangeTrigger() {
    $('.open-mosaic').click(function (e) {
        e.preventDefault();
        var target = $(this).data('target');
        $('#trigger-'+target).trigger('click');
        $('html, body').animate({
            scrollTop: $('#trigger-'+target).parent().offset().top - ($('.varilux-navbar').outerHeight() + $('.submenu').outerHeight())
        }, 800);
    });
}

function scrollProgressMonitor() {
    if ($('.submenu').length > 0) {
        if ($('#v-series').length > 0) {
            var docHeight = $('#v-series').outerHeight() + $('#v-series-expanded').outerHeight() + $('#c-series').outerHeight() + $('#c-series-expanded').outerHeight() + $('#a-series').outerHeight() + $('#a-series-expanded').outerHeight() + $('.a-series-slider').outerHeight() + $('.c-series-slider').outerHeight() + $('.v-series-slider').outerHeight();
        } else if ($('#varilux').length > 0) {
            var docHeight = $('#varilux').outerHeight() + $('#varilux-txt-intro').outerHeight() + $('#varilux-conclusion').outerHeight() + $('#inovation').outerHeight() + $('#inovation-txt-intro').outerHeight() + $('#inovation-conclusion').outerHeight() + $('#essilor').outerHeight() + $('#essilor-txt-intro').outerHeight() + $('#essilor-conclusion').outerHeight() - $('.brand-slider').outerHeight();
        } else if ($('#visioffice').length > 0) {
            var docHeight = $('#visioffice').outerHeight() + $('#4d').outerHeight() + $('#eyecode').outerHeight() + $('#essilor-fit').outerHeight();
        } else if ($('#tech-hero').length > 0) {
            var docHeight = $('body').outerHeight() - $('#tech-hero').outerHeight() + $('footer').outerHeight();
        }
        var winHeight = $(window).height();
        var scrollPercent = (100 * (winPos - winHeight)) / docHeight;
        $('.progress-bar').width(scrollPercent + '%');
    }
}

function navMonitor() {
    // Solid navbar
    if ($('.nav-ancor').length > 0 && !isMobile) {
        if (winPos > 0 || $('.pg-solid-menu').length > 0) {
            $('.varilux-navbar').addClass("solid");
        }
        else {
            $('.varilux-navbar').removeClass("solid");
        }
    }
    // products submenu show/hide
    if ($('.subnav-ancor').length > 0) {
        var submenu = '.' + $('.subnav-ancor').data('submenu-name');
        if (winPos >= $('.subnav-ancor').outerHeight()) {
            $(submenu).show();
        } else {
            $(submenu).hide();
        }
    }
}

function homeCarouselInit() {
    $('.home-carousel').slick({
        autoplay: true,
        infinite: true,
        autoplaySpeed: 13000,
        pauseOnHover: false,
        nextArrow: '<button class="next slick-custom-arrow"></button>',
        prevArrow: '<button class="prev slick-custom-arrow"></button>',
    });
    $('.home-carousel').on('afterChange', function(slick, currentSlide){
        var $video = $('.slick-current').find('video');
        if ($video.length > 0){
            $video[0].play();
        }
    });
    $('.home-carousel').on('beforeChange', function(slick, currentSlide){
        var $video = $('.slick-current').find('video');
        if ($video.length > 0){
            $video[0].pause();
        }
    });
    $(".modal-autoplay").on('show.bs.modal', function () {
        $('.home-carousel').slick('slickPause');
        $(this).find('iframe').attr('src', $(this).find('iframe').data('src'));
    });
    $(".modal-autoplay").on('hide.bs.modal', function () {
        $('.home-carousel').slick('slickPlay');
        $(this).find('iframe').attr('src', '');
    });
}
function productsCarouselMobile() {
    if ($('.series-slider').is(':visible')){
        $('.series-slider').slick({
            autoplay: false,
            infinite: true,
            dots: true,
            arrows: false,
            adaptiveHeight: true,
        });
    }
}
var first_time = true;
function effectLensHome(pos){
    if ($('#home2').length !=0 ) {
        var parentOffset = $('#home2').offset().top;
        var $lens = $('#home2 .lens');
        if (window.pageYOffset >= (parentOffset - 170) && first_time){
            $lens.addClass('animation-lens');
            $lens.css('top', '29%');
            first_time = false;
        }
    }
}

$('#fale-conosco-form input,#fale-conosco-form select').on('focus', function(e){
    $(this).prev().addClass('active');
});

$('#fale-conosco-form input,#fale-conosco-form select').on('blur', function(e){
    if ($(this).val() == ''){
        $(this).prev().removeClass('active');
    }
});

$('#fc-finali').on('change', function(e){
    var selected = $(this).find('option:selected').attr('type');
    $('#cpf-cnpj').val('');
    $('#cpf-cnpj').attr('required', true);
    $('#cpf-cnpj').parent().fadeIn();
    if(selected == 'cnpj'){
        $('#cpf-cnpj').data('type', 'cnpj');
        $('#cpf-cnpj').mask("99.999.999/9999-99");
    }else if(selected == 'cpf'){
        $('#cpf-cnpj').data('type', 'cpf');
        $('#cpf-cnpj').mask("999.999.999-99");
    }else{
        $('#cpf-cnpj').unmask();
        $('#cpf-cnpj').parent().fadeOut();
        $('#cpf-cnpj').attr('required', false);
        
    }
});

$('#fale-conosco-form').on('submit', function(e){
    e.preventDefault();
    $('.fc-btn').attr('disabled', true);
    $('.loader-spinner').show();
    // var fdata = new FormData($(this));
    $.ajax({
        url: window.location.origin + '/wp-admin/admin-ajax.php',
        method: 'POST',
        data: {
            action: 'ajax_send_email',
            fc_finali: $('#fc-finali').val(),
            fc_name: $('#fc-name').val(),
            fc_email: $('#fc-email').val(),
            fc_phone: $('#fc-phone').val(),
            fc_msg: $('#fc-txt').val(),
            fc_cadastro: $('#cpf-cnpj').val(),
            fc_type: $('#cpf-cnpj').data('type')
        },
        mimeType: 'multipart/form-data',
        success: function(response){
            $('.loader-spinner').hide();
            $('#success-ctt-msg').fadeIn('fast').delay(4000).fadeOut('slow');
        }
    })
});

// drag and drop elements
var selected = null,
x_pos = 0, y_pos = 0,
x_elem = 0, y_elem = 0;

function _drag_init(elem) {
    selected = elem;
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
}

function _move_elem(e) {
    x_pos = document.all ? window.event.clientX : e.pageX;
    y_pos = document.all ? window.event.clientY : e.pageY;
    if (selected !== null) {
        selected.style.left = (x_pos - x_elem) + 'px';
        selected.style.top = (y_pos - y_elem) + 'px';
    }
}

function _destroy() {
    selected = null;
    $('.drag-button').addClass('pulse').removeClass('onclick');
    $('#draggable-element').animate({ top: 0, left: 0 }, 'fast');
}

if ($('#draggable-element').length !=0 ) {
    document.getElementById('draggable-element').onmousedown = function () {
        $('.drag-button').removeClass('pulse').addClass('onclick');
        _drag_init(this);
        return false;
    }
};

document.onmousemove = _move_elem;
document.onmouseup = _destroy;