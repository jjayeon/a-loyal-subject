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
        }
    },
    score: {
	rebels: 0,
	loyalists: 0,
    },
    days: 1,
    options: {
	// total more than 10 breaks game because ordinals
	rebels_per_day: 1,
	loyalists_per_day: 3,
	random_per_day: 3,
        rebel_chance: 0.1,

        rebels_days_to_win: 3,
	loyalists_days_to_win: 4,

	stutter_chance: 0.5,
	compromised_chance: 0.3,

	item_max_rating: 10,
	items_initial: 7,
	items_min: 4,
	items_new: 4,
    }
}
game.player.getNewItems(game.options.items_initial)

function play() {
    clear()
    function startDay() {
        clear()
        print(`The ${text.ordinals[game.days]} day begins.`)
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
	    if (Math.random() < 0.5) day.rebels_count += 1
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
	        adventurer_faction = Math.random() < game.options.rebel_chance ? "rebels" : "loyalists"
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
                    let word = randItem(text.code_words.filter(x => x !== day.code_word))
		    if (Math.random() < game.options.stutter_chance) {
		        phrase = phrase.replace(" *", `, uh... ${word}`)
		    } else {
		        phrase = phrase.replace("*", word)
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
            print(`The ${text.ordinals[day.count]} adventurer walks into your shop.`)
            print(`The adventurer speaks: "${phrase}"`)
            print(`What item will you sell them?`)
            game.player.inventory.forEach((x, i) => {
                button(`${x.name} (rating ${x.rating})`, () => {
                    let item = game.player.inventory.splice(i, 1)[0]
	            day[adventurer_faction] += item.rating
                    clear()
                    print(`You give the adventurer your ${item.name}.`)
                    if (game.player.inventory.length <= game.options.items_min) {
	                game.player.getNewItems(game.options.items_new)
	                print("You get a new shipment of items.\n")
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
        print("The day comes to an end.")
        if (day.rebels === day.loyalists) {
	    print("The two sides have reached a bloody stalemate for the day.")
        } else {
	    let winners = day.rebels > day.loyalists ? "rebels" : "loyalists"
            game.score[winners]++
	    print(`The ${winners} have won the day with their superior equipment.`)
        }
        // game end
        if (game.score.loyalists === game.options.loyalists_days_to_win) {
	    print("The loyalists have suppressed the rebellion. You pray they have not discovered your treachery.")
        }
        else if (game.score.rebels === game.options.rebels_days_to_win) {
	    print("The rebels have overthrown the monarchy. Your country has a bright future ahead.")
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
print(text.instructions.replace("\n", "<br>"))
button("Continue...", play)
