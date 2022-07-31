function communitySlider() {
    var swiper = new Swiper('.community .swiper-container', {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
            el: '.community .swiper-pagination',
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

communitySlider()
