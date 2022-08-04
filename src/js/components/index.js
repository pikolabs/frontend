function communitySlider() {
    var swiper = new Swiper('.community__slider .swiper-container', {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
            el: '.community__slider .swiper-pagination',
            type: 'bullets',
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 3,
                spaceBetween: 30
            },
        }
    })
}

function headSlider() {
    var swiper = new Swiper('.main__img.swiper-container', {
        slidesPerView: 1,
        effect: 'fade',
        autoplay: {
            delay: 4000
        },
        speed: 3000,
        fadeEffect: {
            crossFade: false
        },
    })
}

function artSlider() {
    var swiper = new Swiper('.main__art-items.swiper-container', {
        slidesPerView: 'auto',
        loop: true,
        autoplay: {
            delay: 4000
        },
        speed: 3000,
    })
}

function brandSlider() {
    var swiper = new Swiper('.community__brands.swiper-container', {
        slidesPerView: 'auto',
        loop: true,
        autoplay: {
            delay: 4000
        },
        speed: 3000,
    })
}

communitySlider()
headSlider()
artSlider()
brandSlider()
