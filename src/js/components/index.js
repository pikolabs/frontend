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
            init: function() {
                let title = document.querySelector(".main__img .swiper-slide-active").getAttribute("data-head-title")
                document.querySelector(".words-slider").innerHTML = title
            },
            slideChange: function() {
                try {
                    let title = document.querySelector(".main__img .swiper-slide-next").getAttribute("data-head-title")
                    setTimeout(
                        animateWord(title),
                        2000
                    )
                } catch (err) {
                    console.log(err)
                }
            },
        },
    })
}

let advSliders = document.querySelectorAll(".adv .swiper-container")

if(advSliders.length>0){
    advSliders.forEach(el => {
        const swiper = new Swiper('.adv .swiper-container', {
            slidesPerView: "auto",
            spaceBetween: 25,
            loop: true,
            speed: 4000,
            loopPreventsSlide: true,
            autoplay: {
                delay: 0,
            },
            breakpoints: {
                320: {
                    spaceBetween: 10
                },
                576: {
                    spaceBetween: 25
                },
            }
        })
    })
}


let replacements = {
    "you": "web3",
    "music": "builders"
}

function animateWord(title) {
    let block = document.querySelector(".words-slider")
    let span = document.createElement('span');
    block.innerHTML = ''
    span.classList.add("words-slider__text")
    span.innerHTML = `${replacements[title]||title}`
    block.append(span)

    let text = document.querySelector(".words-slider__text")
    text.classList.add("words-slider__text--active")
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

function supportSlider(){
    new Swiper(".support .swiper-container",{
        slidesPerView:5,
        spaceBetween:30,
        breakpoints:{
            320:{
                slidesPerView:"auto",
                spaceBetween:30
            },
            576:{
                slidesPerView:5,
                spaceBetween:30
            }
        }
    })
}

communitySlider()
artSlider()
brandSlider()
supportSlider()

document.addEventListener("DOMContentLoaded", function(event) {
    headSlider()
});

