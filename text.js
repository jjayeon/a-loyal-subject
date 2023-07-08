const output = document.getElementById("output")
const input = document.getElementById("input")

let text = {
    "instructions": "A rebellion has begun to overthrow the corrupt monarchy. You are a shopkeeper sympathetic to the rebel cause; you must identify and server fellow rebel adventurers, while refusing to serve the nasty loyalists.\n\nThe rebels have a CODE WORD they use to identify each other that changes from day to day. Try to figure it out and give them the best equipment in your shop. But be advised that the Loyalists are trying to crack the code word, as well...\n",
    "code_words": ["jackalopes", "horses", "dogs", "carnations", "lilies", "poppies", "carrots", "wheat", "onions", "Gambian sidling bushes"],
    "cryptic_phrases": ["I saw some * outside today. They were very beautiful.", "Have you bought any * at the market lately?", "The king has taken a fancy to *. You should find some for him.", "I'm looking for some *; if you find any, let me know.", "I love the smell of * in the morning.", "If you're free later, I have some * for you to look at.", "Don't you think some * would be great right now?", "I'm a big fan of *. Don't tell my husband.", "Are you interested in some *? I know where you can get some.", "This is the perfect time for some *, don't you think?"],
    "compromise_phrases": ["Don't buy any * today. They're spoiled.", "We got a shipment of * today, but we had to send them back.", "The * weren't outside today. Very unfortunate.", "The * have fled. The day is ruined.", "If you see any * today, don't approach them. They're poisonous."],
    "adjectives": ["Bloody", "Cool", "Epic", "Angry", "Masterful", "Dextrous", "Aggressive", "Charming", "Novel", "Your Mom's"],
    "nouns": ["Sword", "Shield", "Potion", "Bow", "Crossbow", "Axe", "Mace", "Chestplate", "Gauntlets", "Ribbon", "Laurel"],
    "ordinals": ["zeroth", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixtheenth", "seventeenth", "eighteenth", "nineteenth", "twentieth"]
}

function print(text) {
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
