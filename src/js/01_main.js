let burger = document.querySelector(".header__burger")
let body = document.querySelector("body")
let header = document.querySelector("header")

if (burger) {
    burger.onclick = function() {
        header.classList.toggle("header--active")
        body.classList.toggle("fixed-body")
    }
}



let provider
try {
    provider = new ethers.providers.Web3Provider(window.ethereum)
} catch (err) {
    console.log(err)
}
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
let address
async function connectMetamask() {
    try {
        if (address) {
            window.open("/domains", "_self")
        }
        await provider.send("eth_requestAccounts", []);
        checkAccount()
    } catch (err) {
        console.log(err)
    }
}



connect_btn.onclick = connectMetamask

async function checkAccount() {
    try {
        let signer = provider.getSigner()
        address = await signer.getAddress()
        if (address) {
            connect_btn.innerHTML = address.substr(0, 6) + "..." + address.substr(38, 4)
            try {
                getTXTRecord()
                getDomains()
            } catch (err) {
                console.log()
            }
        }
    } catch (err) {
        console.log(err)
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


async function onEnter() {

    let input = document.querySelector(".query_value")
    if (!input) {
        return
    }

    input.value= new URLSearchParams(window.location.search).get("search")
    
    input.addEventListener("keypress", function(event) {
        if (event.key == "Enter") {
            event.preventDefault()
            if (window.location.pathname != "/search") {
                openSearch()
                return
            }
            
            search()
        }
    })
}


async function openSearch() {
    let query_value = document.querySelector(".query_value")
    window.open("/search?search=" + query_value.value, "_self")
}

onEnter()
let prev_query = ''

async function searchOld() {
    let query_value = document.querySelector(".query_value")
    let container = document.getElementById("results_container")
    let count = document.getElementById("results_count")
    let loader = document.getElementById("results_loader")

    if (!container) {
        return
    }

    let refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + "?search=" + query_value.value
    window.history.pushState({ path: refresh }, '', refresh)

    container.innerHTML = ""
    count.innerHTML = ""

    loader.classList.remove("hidden")

    if (query_value.value != prev_query) {
        page = 0
        pagination(0)
    }
    prev_query = query_value.value

    let data = await fetch("/api/search?" + new URLSearchParams({ query: query_value.value, tier, offset: page * 10 }))
    let list = await data.json()

    count.innerHTML = "About " + list.count + " search results"
    container.innerHTML = ""
    list.data.forEach((i) => {
        container.innerHTML += `
        <div class="domains__row">
            <div class="domains__info tier` + i.Tier + `">
                <div class="domains__info-item">` + i.Domain + `</div>
                <div class="domains__info-item">Tier ` + (i.Tier + 1) + `</div>
                <div class="domains__info-item">Tokens: ` + tierToTokens(i.Tier)+ `</div>
            </div>
            <a href="https://search.art.art/en?domain=` + i.Domain + `" class="domains__link mbtn mbtn-black">Check avalibility</a>
        </div>
        `
    })

    pagination(list.count)
    loader.classList.add("hidden")

}

async function search() {
    let query_value = document.querySelector(".query_value")
    let container = document.getElementById("results_container")
    let count = document.getElementById("results_count")
    let loader = document.getElementById("results_loader")

    if (!container) {
        return
    }

    let refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + "?search=" + query_value.value
    window.history.pushState({ path: refresh }, '', refresh)

    container.innerHTML = ""
    count.innerHTML = ""

    loader.classList.remove("hidden")

    if (query_value.value != prev_query) {
        page = 0
        pagination(0)
    }
    prev_query = query_value.value

    let data = await fetch("/api/v2/search?" + new URLSearchParams({ query: query_value.value, tier, offset: page * 10 }))
    data = await data.json()

    count.innerHTML = "About " + data.total + " search results"
    container.innerHTML = ""
    data._embedded.items.forEach((i) => {
        let tier=priceToTier(i.price)
        container.innerHTML += `
        <div class="domains__row">
            <div class="domains__info tier` + tier + `">
                <div class="domains__info-item">` + i.name + `</div>
                <div class="domains__info-item">Tier ` + (tier + 1) + `</div>
                <div class="domains__info-item">Tokens: ` + tierToTokens(tier)+ `</div>
            </div>
            <a href="https://search.art.art/en?domain=` + i.name + `" class="domains__link mbtn mbtn-black">Check avalibility</a>
        </div>
        `
    })

    pagination(data.total)
    loader.classList.add("hidden")

}

if (document.getElementById("search_domains")) {
    search()
}
async function tiers() {
    let tiers_buttons = document.getElementById("tiers_buttons")
    if (!tiers_buttons) {
        return
    }
    tiers_buttons.children[0].onclick = async function() {
        tier = 0
        await tiersUpdate()
        offset = 0
        await search()
    }
    for (let i = 1; i < 10; i++) {
        let btn = tiers_buttons.children[i]
        btn.onclick = async function() {
            tier = 11 - i
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
        if ((i == 0 && tier == 0) || (i != 0 && tier == 11 - i)) {
            btn.classList.add("domains__tab--active")
        }
    }
}

async function pagination(count) {
    let pagination_buttons = document.getElementById("pagination_buttons")
    pagination_buttons.innerHTML = ''
    if (count == 0) {
        return
    }
    let pages = Math.floor(count / 10)



    let numbers = new Set([
        0, 1, 2,
        page - 1, page, page + 1,
        pages - 2, pages - 1, pages
    ])
    if (page < 3) {

        let mid = Math.floor(pages / 2)
        numbers.add(mid - 1)
        numbers.add(mid)
        numbers.add(mid + 1)
    }
    numbers = [...numbers]
    numbers = numbers.sort(function(a, b) { return a - b })

    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] >= 0 && numbers[i] <= pages) {
            if (i > 0 && numbers[i - 1] + 1 != numbers[i]) {
                pagination_buttons.innerHTML += ``

            }

            let active = numbers[i] == page ? 'domains__tab--active' : ''

            pagination_buttons.innerHTML += `<a onclick="set_page(event,` + numbers[i] + `)" class="domains__tab ` + active + `">` + (numbers[i] + 1) + `</a>`
        }
    }
}

async function set_page(e, i) {
    page = i
    e.target.classList.add('domains__tab--active')
    search(page)
}

tiers()

let tiers_tokens={
    0:20,
    1:140,
    2:220,
    3:280,
    4:320,
    5:560,
    6:820,
    7:1820,
    8:10000,
    9:20000
}

let prices_tier=[0,70,110,140,210,280,410,910,5000,10000,1000000000000]

function tierToTokens(x){
    return tiers_tokens[x]
}

function priceToTier(x){
    let tier=0
    for (i=0;i<prices_tier.length;i++){
        if (x>=prices_tier[i]){
            tier=i
        }else{
            break
        }
    }
    return tier
}

async function getDomains() {
    let tokens_count = document.getElementById("tokens_count")
    let quiz_table = document.querySelector(".quiz__table")
    if (!quiz_table){
        return
    }
    let data = await fetch("/api/domains?" + new URLSearchParams({ account: address }))
    let list = await data.json()
    quiz_table.innerHTML = ""
    let tokens = 0
    list.forEach((i) => {
        tokens += tierToTokens(i.Tier)


        quiz_table.innerHTML += `
        <div class="domains__row">
            <div class="domains__info tier` + i.Tier + `">
                <div class="domains__info-item">` + i.Domain + `</div>
                <div class="domains__info-item">Tier ` + (i.Tier+1) + `</div>
                <div class="domains__info-item">Exp ` + (new Date(i.Exp)).toLocaleDateString() + `</div>
                <div class="domains__info-item">Tokens: ` + tierToTokens(i.Tier) + `</div>
            </div>
        </div>`

    })

    let bonus = await fetch("/api/bonus?" + new URLSearchParams({ account: address }))
    bonus = await bonus.json()
    tokens_count.innerHTML = tokens + bonus.total + " tokens"
}




async function getTXTRecord() {
    
    let txt_record_field = document.querySelector(".txt_record_field")
    if (!txt_record_field){
        return
    }
    let data = await fetch("/api/txt-record?" + new URLSearchParams({ account: address }))
    txt_record_field.value = (await data.json())["txt_record"]
}


function copyTXTRecord() {
    navigator.clipboard.writeText(document.querySelector(".txt_record_field").value)
}


async function addDomain() {

    try {

        let signer = provider.getSigner()

        let domain = document.querySelector(".domain_field")
        domain.parentElement.classList.remove("quiz__fg_error")
        domain.value = domain.value.toLowerCase()
        if (!(/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.art$/.test(domain.value))) {
            domain.parentElement.classList.add("quiz__fg_error")
            alert("Please, make sure the domain is .art")
            return
        }
        let data = await fetch("/api/add-domain?" + new URLSearchParams({ account: await signer.getAddress(), domain: domain.value }))
        if (data.status != 200) {
            alert("Please, check TXT record and try it later")
            return
        }

        await getDomains()
        document.querySelector(".quiz__step2").classList.remove("quiz__step2--active")
    } catch (err) {
        alert("Please, connect MetaMask before.")
    }

}

async function suggestion() {
    let domain = document.querySelector(".find__search-link")
    if (!domain) {
        return
    }
    let data = await fetch("/api/search?" + new URLSearchParams({ suggestion: true }))
    let list = await data.json()
    domain.innerHTML = list.data[0].Domain
    domain.href = `https://search.art.art/en?domain=` + list.data[0].Domain
}

//suggestion()


async function addEmail(event) {
    fetch("/api/add-email?email=" + document.getElementById("subscriber_email").value)
    event.preventDefault()
    document.getElementById("subscriber_email").value = ""
}


function twitterBonus() {
    if (!address) {
        alert("Please, connect MetaMask first!")
        return
    }

    OAuth.initialize('YC_NlvtF5hzC5dey4jjatFE0Y-4')
    OAuth.popup('twitter').done(function(result) {
        console.log(result)
        fetch("/api/twitter-bonus?" + new URLSearchParams({ account: address, ...result.toJson() })).then(async function(result) {

        })
        // do some stuff with result
    })
}