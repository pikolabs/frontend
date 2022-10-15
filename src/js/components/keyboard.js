let keyboardToggler = document.querySelector(".keyboard__btn")
let keyboard = document.querySelector(".keyboard")

keyboardToggler.onclick = function () {
    console.log(true)
    keyboard.classList.add("keyboard--active")
}
