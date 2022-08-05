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
        allowTouchMove: false,
        effect: 'fade',
        loop: true,
        autoplay: {
            delay: 4000
        },
        speed: 3000,
        fadeEffect: {
            crossFade: false
        },
        on: {
            init: function () {
                let title = document.querySelector(".main__img .swiper-slide-active").getAttribute("data-head-title")
                document.querySelector(".words-slider").innerHTML = title
            },
            slideChange: function () {
                let title = document.querySelector(".main__img .swiper-slide-next").getAttribute("data-head-title")
                setTimeout(
                    document.querySelector(".words-slider").innerHTML = title,
                    2000
                )
            },
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

artSlider()
brandSlider()

document.addEventListener("DOMContentLoaded", function(event) {
    headSlider()
});
