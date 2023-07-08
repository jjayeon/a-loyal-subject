const output = document.getElementById("output")
const input = document.getElementById("input")

let text = {
    "instructions": [
        "A Rebellion is underway to overthrow the corrupt monarchy. You are a shopkeeper sympathetic to the Rebel cause, and have been tasked with supplying Rebel adventurers for their missions.",
        "Every day, the Rebels will decide on a new, secret code word; Your job is to figure out the code word, and supply the Rebels who use it with your best equipment.",
        "A true Rebel will always know the code word; a Loyalist will attempt to guess it, but may stutter or falter in their speech. Pay attention to words that come up frequently, and who speaks with confidence versus who's just guessing.",
        "The Loyalists are always working to crack the code, and some days the code word will be compromised. Your fellow Rebels will try to communicate this to you discreetly; pay attention to what they have to say.",
        "Give your best equipment to your Rebel allies and your worst to the Loyalist scum, and hope that the Rebels succeed in their missions and overthrow the monarchy."
    ],
    "code_words": ["jackalopes", "carnations", "lilies", "poppies", "wheat", "onions", "Gambian sidling bushes"],
    "cryptic_phrases": ["I saw some * outside today. They were very beautiful.", "Have you bought any * at the market lately?", "The king has taken a fancy to *. You should find some for him.", "I'm looking for some *; if you find any, let me know.", "I love the smell of * in the morning.", "If you're free later, I have some * for you to look at.", "Don't you think some * would be great right now?", "I'm a big fan of *. Don't tell my husband.", "Are you interested in some *? I know where you can get some.", "This is the perfect time for some *, don't you think?"],
    "compromise_phrases": ["Don't buy any * today. They're spoiled.", "We got a bad shipment of * today. We had to send it back.", "The * weren't outside today. Very unfortunate.", "The * have fled. The day is ruined.", "If you see any * today, don't approach them. They're poisonous."],
    "new_shipment": "You get a new shipment of items.",
    "stalemate": "The two sides have reached a bloody stalemate for the day.",
    "loyalist_win": "The Loyalists have suppressed the rebellion. You pray they have not discovered your treachery.",
    "rebel_win": "The Rebels have overthrown the monarchy. Your country has a bright future ahead.",
    "adjectives": ["Bloody", "Cool", "Epic", "Angry", "Masterful", "Dextrous", "Aggressive", "Charming", "Novel", "Your Mom's"],
    "nouns": ["Sword", "Shield", "Potion", "Bow", "Crossbow", "Axe", "Mace", "Chestplate", "Gauntlets", "Ribbon", "Laurel"],
    "ordinals": ["zeroth", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixtheenth", "seventeenth", "eighteenth", "nineteenth", "twentieth"]
}

function display(text) {
    let p = document.createElement("p")
    p.style.opacity = 0
    p.innerHTML = text
    output.appendChild(p)
    unfade(p)
}

function clear() {
    input.innerHTML = ""
    output.innerHTML = ""
}

function button(text, callback) {
    let li = document.createElement("li")
    li.style.opacity = 0
    let btn = document.createElement("button")
    btn.innerHTML = text
    btn.onclick = callback
    li.appendChild(btn)
    input.appendChild(li)
    unfade(li)
}

function unfade(element) {
    let op = 0;  // initial opacity
    element.style.display = 'block';
    let timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += 0.03;
    }, 33);
}
