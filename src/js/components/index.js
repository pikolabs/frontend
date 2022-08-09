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
        speed: 1500,
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
                    animateWord(title),
                    2000
                )
            },
        },
    })
}

function animateWord(title) {
    let block = document.querySelector(".words-slider")
    let span = document.createElement('span');
    block.innerHTML = ''
    span.classList.add("words-slider__text")
    span.innerHTML = `${title}`
    console.log(span)
    block.append(span)

    let text = document.querySelector(".words-slider__text")
    text.classList.add("words-slider__text--active")
    console.log(text)
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
