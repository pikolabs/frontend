let plus = document.querySelector(".year-plus")
let minus = document.querySelector(".year-minus")

plus.onclick = function(){
    setYear(1)
}

minus.onclick = function(){
    setYear(-1)
}

function setYear(val) {
    let year = document.querySelector(".year-output")
    let current = +year.innerHTML
    if(val === -1 && current === 1){
        return
    }
    year.innerHTML = current + val
}
