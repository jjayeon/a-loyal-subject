const game = {
    player: {
	inventory: [],
        getNewItems: function(n) {
            for (let i = 0; i < n; i++) {
	        game.player.inventory.push({
	            name: randItem(text.adjectives) + " " + randItem(text.nouns),
	            rating: 1 + Math.floor(Math.random() * game.options.item_max_rating),
	        })
            }
            game.player.inventory.sort((a, b) => {
                return a.rating - b.rating
            })
        }
    },
    score: {
	rebels: 0,
	loyalists: 0,
    },
    days: 1,
    options: {
	// total more than 20 breaks game because ordinals
	rebels_per_day: 2,
	loyalists_per_day: 4,
	random_per_day: 1,
        rebel_chance: 0.6,

        rebels_days_to_win: 3,
	loyalists_days_to_win: 4,

	stutter_chance: 0.5,
	compromised_chance: 0.3,
        compromise_reveal_chance: 0.7,

	item_max_rating: 10,
	items_initial: 8,
	items_min: 4,
	items_new: 5,
    }
}
game.player.getNewItems(game.options.items_initial)

function play() {
    clear()
    function startDay() {
        clear()
        display(`The ${text.ordinals[game.days]} day begins. The code word has changed.`)
        game.days++
        let day = {
            count: 1,
            code_word: randItem(text.code_words),
            compromised: Math.random() < game.options.compromised_chance,
            rebels: 0,
            loyalists: 0,
            rebels_count: game.options.rebels_per_day,
            loyalists_count: game.options.loyalists_per_day,
        }
	for (let i = 0; i < game.options.random_per_day; i++) {
	    if (Math.random() < game.options.rebel_chance) day.rebels_count += 1
	    else day.loyalists_count += 1
	}
        function startAdventurer() {
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
	    let phrase
	    if (!day.compromised) {
	        if (adventurer_faction === "rebels") {
		    phrase = randItem(text.cryptic_phrases)
	        } else if (adventurer_faction === "loyalists") {
		    phrase = randItem(text.cryptic_phrases)
                    let word = randItem(text.code_words)
		    if (Math.random() < game.options.stutter_chance) {
		        phrase = phrase.replace(" *", `, uh... ${word}`)
		    } else {
		        phrase = phrase.replace("*", word)
		    }
	        }
	    } else {
	        if (adventurer_faction === "rebels") {
                    if (Math.random() < game.options.compromise_reveal_chance) {
		        phrase = randItem(text.compromise_phrases)
                    } else {
                        phrase = randItem(text.cryptic_phrases)
                    }
	        } else if (adventurer_faction === "loyalists") {
		    phrase = randItem(text.cryptic_phrases)
	        }
	    }
	    phrase = phrase.replace("*", day.code_word)
            display(`The ${text.ordinals[day.count]} adventurer walks into your shop.`)
            display(`The adventurer speaks: "${phrase}"`)
            display(`What item will you sell them?`)
            game.player.inventory.forEach((x, i) => {
                button(`${x.name} (rating ${x.rating})`, () => {
                    let item = game.player.inventory.splice(i, 1)[0]
	            day[adventurer_faction] += item.rating
                    clear()
                    display(`You give the adventurer your ${item.name}.`)
                    if (game.player.inventory.length <= game.options.items_min) {
	                game.player.getNewItems(game.options.items_new)
	                display(text.new_shipment)
	            }
	            day.count++
                    if (day.rebels_count > 0 || day.loyalists_count > 0) {
                        startAdventurer(day)
                    } else {
                        endDay(day)
                    }
                })
            })
        } // startAdventurer
        startAdventurer()
    } // startDay
    function endDay(day) {
        display("The day comes to an end.")
        if (day.rebels === day.loyalists) {
	    display(text.stalemate)
        } else {
	    let winners = day.rebels > day.loyalists ? "rebels" : "loyalists"
            game.score[winners]++
            if (winners === "rebels") winners = "Rebels"
            if (winners === "loyalists") winners = "Loyalists"
	    display(`The ${winners} have won the day with their superior equipment.`)
        }
        // game end
        if (game.score.loyalists === game.options.loyalists_days_to_win) {
	    display(text.loyalist_win)
        }
        else if (game.score.rebels === game.options.rebels_days_to_win) {
	    display(text.rebel_win)
        }
        else {
            button("Continue...", startDay)
        }
    }
    startDay()
} // play

function randItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}


clear()
text.instructions.forEach(display)
button("Continue...", play)
