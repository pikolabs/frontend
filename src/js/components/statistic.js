let step1Btn = document.querySelector("[data-step='addDomain']")
let step2BackBtn = document.querySelector("[data-step='backStep1']")
let step2 = document.querySelector(".quiz__step2")


if (step1Btn) {
    step1Btn.onclick = async function() {
        if (!window.ethereum||!address){
            alert("Please, connect MetaMask before.")
            return   
        }
        step2.classList.add("quiz__step2--active")

    }
}

if (step2BackBtn) {
    step2BackBtn.onclick = function() {
        step2.classList.remove("quiz__step2--active")
    }
}