#!/usr/bin/env node

const prompt = require("prompt-sync")()
const fs = require("fs")

const text = JSON.parse(fs.readFileSync("text.json", "utf-8"))

let game = {
    player: {
	inventory: [],
    },
    score: {
	rebels: 0,
	loyalists: 0,
    },
    options: {
	// total more than 10 breaks game because ordinals
	rebels_per_day: 1,
	loyalists_per_day: 2,
	random_per_day: 2,

	days_to_win: 3,

	stutter_chance: 0.7,
	compromised_chance: 0.3,

	item_max_rating: 10,
	items_initial: 7,
	items_min: 4,
	items_new: 4,
    }
}
for (let i = 0; i < game.options.items_initial; i++) {
    game.player.inventory.push({
	name: randItem(text.adjectives) + " " + randItem(text.nouns),
	rating: 1 + Math.floor(Math.random() * game.options.item_max_rating),
    })
}

console.log(text.instructions)
prompt("Press ENTER to continue...")

main:
while (true) {
    console.log("~~~~~~~~~~~~~~~~~")
    console.log("You wake up bright and early the next day.")
    // new day
    // code word
    const day = {
	count: 1,
	code_word: randItem(text.code_words),
	compromised: Math.random() < game.options.compromised_chance,
	rebels: 0,
	loyalists: 0,
	rebels_count: game.options.rebels_per_day,
	loyalists_count: game.options.loyalists_per_day,
    }
    for (let i = 0; i < game.options.random_per_day; i++) {
	if (Math.random() < 0.5) day.rebels_count += 1
	else day.loyalists_count += 1
    }

    while (day.rebels_count > 0 || day.loyalists_count > 0) {
	// new adventurer
	let adventurer_faction
	if (day.rebels_count === 0) {
	    adventurer_faction = "loyalists";
	    day.loyalists_count--;
	} else if (day.loyalists_count === 0) {
	    adventurer_faction = "rebels";
	    day.rebels_count--;
	} else {
	    adventurer_faction = Math.random() < 0.5 ? "rebels" : "loyalists"
	    if (adventurer_faction === "rebels") {
		day.rebels_count--;
	    } else {
		day.loyalists_count--;
	    }
	}

	// your inventory
	if (game.player.inventory.length <= game.options.items_min) {
	    console.log("You get a new shipment of items.\n")
	    wait(1)
	    for (let i = 0; i < game.options.items_new; i++) {
		game.player.inventory.push({
		    name: randItem(text.adjectives) + " " + randItem(text.nouns),
		    rating: 1 + Math.floor(Math.random() * game.options.item_max_rating),
		})
	    }
	}

	console.log("Your inventory:")
	game.player.inventory.forEach((x, i) => {
	    console.log(`  ${i}: ${x.name} (rating ${x.rating})`)
	})
	console.log()
	wait(2)

	// come up with phrase
	let phrase
	if (!day.compromised) {
	    if (adventurer_faction === "rebels") {
		phrase = randItem(text.cryptic_phrases)
	    } else if (adventurer_faction === "loyalists") {
		phrase = randItem(text.cryptic_phrases)
		if (Math.random() < game.options.stutter_chance) {
		    phrase = phrase.replace(" *", `, uh... ${randItem(text.code_words)}`)
		} else {
		    phrase = phrase.replace("*", randItem(text.code_words))
		}
	    }
	} else {
	    if (adventurer_faction === "rebels") {
		phrase = randItem(text.compromise_phrases)
	    } else if (adventurer_faction === "loyalists") {
		phrase = randItem(text.cryptic_phrases)
	    }
	}
	phrase = phrase.replace("*", day.code_word)
	console.log(`A ${text.ordinals[day.count]} adventurer walks into your shop.`)
	console.log("The adventurer speaks...")
	wait(1)
	console.log(`\n${phrase}\n`)
	wait(1)

	let input
	while (isNaN(input)) {
	    input = parseInt(prompt("Which item do you want to give them? "))
	} 
	if (input === -1) break main

	let item = game.player.inventory.splice(input, 1)[0]
	day[adventurer_faction] += item.rating
	console.log(`You give the adventurer your ${item.name}.`)
	day.count++
	wait(1)
    }

    console.log("The day comes to an end.")
    wait(2)
    if (day.rebels === day.loyalists) {
	console.log("The two sides have reached a bloody stalemate for the day.")
    } else {
	let winners = day.rebels > day.loyalists ? "rebels" : "loyalists"
	console.log(`The ${winners} have won the day with their superior equipment.`)
    }
    wait(3)
    // game end
    if (game.score.loyalists === game.options.days_to_win) {
	console.log("The loyalists have suppressed the rebellion. You pray they have not discovered your treachery.")
	break
    }
    if (game.score.rebels === game.options.days_to_win) {
	console.log("The rebels have overthrown the monarchy. Your country has a bright future ahead.")
	break
    }
}

function randItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function wait(s) {
    let start = Date.now(),
        now = start;
    while (now - start < s * 1000) {
	now = Date.now();
    }
}
