let burger = document.querySelector(".header__burger")
let body = document.querySelector("body")
let header = document.querySelector("header")

if (burger) {
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
    protocol_airdrop.claim(args.Domain, args.Account, BigInt(args.Value), [ethers.utils.arrayify("0x" + args.Signatures)])
}

let tier = 0
let offset = 0
let page = 0

async function search() {
    let query_value = document.querySelector(".query_value")
    let container = document.getElementById("results_container")
    let count = document.getElementById("results_count")

    if (!container) {
        return
    }
    let data = await fetch("/api/search?" + new URLSearchParams({ query: query_value.value, tier, offset:page*10 }))
    let list = await data.json()
    
    count.innerHTML="About "+list.count+" search results"
    container.innerHTML = ""
    list.data.forEach((i) => {
        if (i.Tier == 0) {
            i.Tier = 1
        }
        container.innerHTML += `
        <div class="domains__row">
            <div class="domains__info tier` + i.Tier + `">
                <div class="domains__info-item">` + i.Domain + `</div>
                <div class="domains__info-item">Tier ` + i.Tier + `</div>
                <div class="domains__info-item">Score: ` + 10 * 2 ** i.Tier + `</div>
            </div>
            <a href="https://search.art.art/en?domain=` + i.Domain + `" class="domains__link mbtn mbtn-black">Check avalibility</a>
        </div>
        `
    })

    pagination(list.count)

}

search()
async function tiers() {
    let tiers_buttons = document.getElementById("tiers_buttons")
    if (!tiers_buttons) {
        return
    }
    for (let i = 0; i < 10; i++) {
        let btn = tiers_buttons.children[i]
        btn.onclick = async function() {
            if (i == 0) {
                tier = i
            } else {
                tier = 10 - i
            }
            await tiersUpdate()
            offset = 0
            await search()
        }
    }
}
async function tiersUpdate() {
    let tiers_buttons = document.getElementById("tiers_buttons")
    if (!tiers_buttons) {
        return
    }
    for (let i = 0; i < 10; i++) {
        let btn = tiers_buttons.children[i]
        btn.classList.remove("domains__tab--active")
        if ((i == 0 && tier == 0) || (i != 0 && tier == 10 - i)) {
            btn.classList.add("domains__tab--active")
        }
    }
}

async function pagination(count){
    let pagination_buttons = document.getElementById("pagination_buttons")
    pagination_buttons.innerHTML=''
    let pages = Math.floor(count/10)



    let numbers = new Set([
        0,1,2,
        page-1,page,page+1,
        pages-2,pages-1,pages
    ])
    if(page<3){
      
        let mid = Math.floor(pages/2)
        numbers.add(mid-1)
        numbers.add(mid)
        numbers.add(mid+1)
    }
    numbers = [...numbers]
    numbers = numbers.sort(function(a,b){return a-b})
    
    for(let i = 0; i< numbers.length;i++){
        if(numbers[i]>=0){
            if (i>0&&numbers[i-1]+1!=numbers[i]){
                pagination_buttons.innerHTML+= ``
                        
            }
            let active = numbers[i]==page ? 'domains__tab--active':''

            pagination_buttons.innerHTML+= `<a onclick="set_page(event,`+numbers[i]+`)" class="domains__tab `+active+`">`+(numbers[i]+1)+`</a>`
        }
    }
}

async function set_page(e,i){
    page=i
    console.log(e)

    e.target.classList.add('domains__tab--active')
    search(page)
}

tiers()


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
            <div class="quiz__info-item">Tier ` + i.Tier + `</div>
            <div class="quiz__info-item">Exp ` + (new Date(i.Exp)).toLocaleDateString() + `</div>
            <div class="quiz__info-item">Score: ` + 10 * 2 ** i.Tier + `</div>
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
if (verify_button) {
    verify_button.onclick = addDomain
}