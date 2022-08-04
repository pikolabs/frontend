let burger = document.querySelector(".header__burger")
let body = document.querySelector("body")
let header = document.querySelector("header")

if(burger){
    burger.onclick = function() {
        header.classList.toggle("header--active")
        body.classList.toggle("fixed-body")
    }
}




const provider = new ethers.providers.Web3Provider(window.ethereum)
const claim_abi = [

    {
        "inputs": [{
                "internalType": "string",
                "name": "domain",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            },
            {
                "internalType": "bytes[]",
                "name": "signatures",
                "type": "bytes[]"
            }
        ],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

let connect_btn = document.querySelector(".connect_btn")
let account_btn = document.querySelector(".account_btn")

async function connectMetamask() {
    if (address) {
        window.open("/domains", "_self")
    }
    await provider.send("eth_requestAccounts", []);
    checkAccount()
}



connect_btn.onclick = connectMetamask
let address
async function checkAccount() {
    let signer = provider.getSigner()
    address = await signer.getAddress()
    if (address) {
        connect_btn.innerHTML = address.substr(0, 6) + "..." + address.substr(36, 4)
        try {
            getTXTRecord()
            getDomains()
        } catch (err) {
            console.log()
        }
    }

}

checkAccount()


async function claim() {
    let protocol_airdrop = new ethers.Contract("0x3d38fa9B1E78EaA35175B8647b25F41B445dDaCB", claim_abi, provider)
    let signer = provider.getSigner()
    protocol_airdrop = protocol_airdrop.connect(signer)

    let data = await fetch("/api/airdrop?" + new URLSearchParams({ account: await signer.getAddress(), domain: "gems.black" }))
    let args = await data.json()
    console.log(args)
    protocol_airdrop.claim(args.Domain, args.Account, BigInt(args.Value), [ethers.utils.arrayify("0x" + args.Signatures)])

}

async function search(){
    console.log
    let query_value = document.querySelector(".query_value")
    let container = document.querySelector(".container_result")
    let data = await fetch("/api/search?" + new URLSearchParams({ query: query_value.value }))
    let list = await data.json()
     container.innerHTML = ""

    list.forEach((i) => {
        container.innerHTML += `
        <div class="quiz__row">
            <div class="quiz__info">
            <div class="quiz__info-item">` + i.Domain + `</div>
            <div class="quiz__info-item">Tier `+i.Tier+`</div>
            <div class="quiz__info-item"><a href="https://search.art.art/en?domain=`+i.Domain+`">check</a></div>
            <div class="quiz__info-item">Score: `+ 10*2**i.Tier +`</div>
            </div>
        </div>`

    })
}

async function getDomains() {

    let quiz_table = document.querySelector(".quiz__table")
    let data = await fetch("/api/domains?" + new URLSearchParams({ account: address }))
    let list = await data.json()
    quiz_table.innerHTML = ""
    list.forEach((i) => {
        quiz_table.innerHTML += `
        <div class="quiz__row">
            <div class="quiz__info">
            <div class="quiz__info-item">` + i.Domain + `</div>
            <div class="quiz__info-item">Tier `+i.Tier+`</div>
            <div class="quiz__info-item">Exp `+ (new Date(i.Exp)).toLocaleDateString()+`</div>
            <div class="quiz__info-item">Score: `+ 10*2**i.Tier +`</div>
            </div>
        </div>`

    })
}




async function getTXTRecord() {
    let txt_record_field = document.querySelector(".txt_record_field")
    let data = await fetch("/api/txt-record?" + new URLSearchParams({ account: address }))
    txt_record_field.value = (await data.json())["txt_record"]
}



async function addDomain() {
    try {
         let signer = provider.getSigner()
        let domain = document.querySelector(".domain_field")
        let data = await fetch("/api/add-domain?" + new URLSearchParams({ account: await signer.getAddress(), domain: domain.value }))
    } catch (err) {
        console.log(err)
    }
}

let verify_button = document.querySelector(".verify_btn")
if (verify_button){
    verify_button.onclick=addDomain
}
