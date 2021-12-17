// A Mission of Legends
// Co-authored by Dakota Cookenmaster & Kyle Hernandez
// V1.0 published on 12/16/2021

const inventory = ["spellbook", "sword", "pouch of coins", "medical potion", "medical potion"]

let health = 100

let can_move = true

const people = {
    merchant: {
        want: "artifact",
        have_it: false,
    },
    troll: {
        want: ["leaf", "leaves"],
        have_it: false,
    },
    sorceress: {
        want: "spellbook",
        have_it: false,
    },
    dragon: {
        health: 100,
    },
    princess: {
        want: "ruby necklace",
        have_it: false,
    }
}

const map = {
    marketplace: {
        south: "stables",
        east: "village",
        pretty_print: "Marketplace",
        action: () => {
            const dialog = "A local merchant approaches you. 'Greetings traveller! Have you heard of the recent legend?' He paused, almost bursting with excitement. " +
                "'It claims that whoever is able to slay the great dragon and acquire the legendary ruby necklace from this dragon will be rewarded with the greatest treasure in all the kingdom!' " +
                "He blinked, noting your strong physique. 'The opportunity to wed the kingdom's beautiful princess - an opportunity I'm sure a man such as yourself would be foolish to ignore! " +
                "You see, just recently, I discovered this map for myself and am willing to share its great discoveries with you. However, such things do not come without a cost,' He bumbled jovially.' " +
                "What I am looking for involves that of an ancient artifact, situated deep within the heart of this kingdom's forest. Find this for me, and the map to the princess's heart is yours to keep!' " +
                "You think to yourself, and despite the merchant's obvious greed, he has a point. You shake hands and agree to find this artifact."
            if (!people.merchant.have_it) {
                send_message(dialog)
            }
        },
        give: (item) => {
            if (!people.merchant.have_it) {
                if (item === people.merchant.want) {
                    if (inventory.includes(item)) {
                        // Finds where that item is in your array
                        // And removes that one item (takes a splice of 1)
                        const index = inventory.indexOf(item)
                        inventory.splice(index, 1)
                        people.merchant.have_it = true
                        send_message("Alas! The artifact I've longed to acquire for all my life! You've finally found it! As promised, this map is yours. Farewell, my friend!")
                        send_message("The merchant hands you an enchanted map. 'I didn't say it would be easy to read.' He winks at you. 'Talk to the sorcerer!' he screams, as he bounds away.")
                        inventory.push("enchanted map")
                    } else {
                        send_message("The merchant scowls. 'Don't bother me until you get the artifact!'")
                    }
                } else {
                    send_message("The merchant points his knife at you. 'Don't try to trick me, demon! I know what I asked for, and that's not it.'")
                }
            } else {
                send_message("There is no one to give anything to here anymore.")
            }
        },
        fight: () => {
            send_message("You'd probably better not start a brawl here, or the castle guards will arrest you!")
        }
    },
    village: {
        west: "marketplace",
        east: "forest",
        south: "castle_drawbridge",
        pretty_print: "Village",
        action: () => { },
        give: () => { },
        fight: () => { },
    },
    forest: {
        west: "village",
        east: "wilds",
        pretty_print: "Forest",
        action: () => {
            if (!people.troll.have_it) {
                can_move = false
                send_message("After wandering aimlessly for what feels like an eternity, you eventually come across what seems to be a large troll that takes notice of you. " +
                    "He grunts and begins bounding in your direction! Panicked, you run for your life but are cut short when your leg is tangled in the roots of a nearby oak.")
                send_message("The troll kneels down and begins to mutter, 'A riddle I have - a riddle you get! Solve these words, and you'll be set! Within the forest, " +
                    "there's a sound, there's tree bark falling all around. What hides the sun and tints the scene, makes the forest glow a-green?")
                send_message("You must give the troll an answer, or he threatens to crush you. Each wrong answer leads to a ... *gulp* ... stomp to the stomach.")
            }
        },
        give: (answer) => {
            if (!people.troll.have_it) {
                if (people.troll.want.includes(answer)) {
                    // Yes! You guessed correctly!
                    send_message("That answer is... correct! You have passed the riddle. My treasure is now yours.")
                    send_message("The troll hands you an artifact, and while you were admiring it he mysteriously vanished.")
                    send_message("'I should probably go back to the merchant' you think to yourself.")
                    people.troll.have_it = true
                    can_move = true
                    inventory.push("artifact")
                } else {
                    // Take some damage!
                    send_message("He begins to crush in your stomach! 🤮🤢 You lose 10 health.")
                    health -= 10
                    check_health()
                    get_current_health()
                }
            } else {
                send_message("There's no one here to give anything to.")
            }
        },
        fight: () => {
            send_message("Given the troll's size and his power over you, it's probably best not to tick him off.")
        }
    },
    wilds: {
        west: "forest",
        east: "dragon_lair",
        pretty_print: "Wilds",
        action: () => { },
        give: () => { },
        fight: () => { },
    },
    dragon_lair: {
        west: "wilds",
        pretty_print: "Dragon's Lair",
        action: () => {
            const dialog = "Upon nearing the scorched lands of the ancient dragon, you begin to feel the heat in the air burn your lungs. " +
                "A mighty roar breaks out in the distance as you see this infamous dragon with your own eyes. " +
                "Approaching the dragon, you begin to realize that now is the most important time of your life for you to fight!"
            if (people.dragon.health > 0 && inventory.includes("unenchanted map")) {
                can_move = false
                send_message(dialog)
            } else {
                send_message("You heard the flipping wings of a dragon overhead, and decided to go back and continue searching.")
                current_location = "wilds"
                get_current_location()
            }
        },
        give: () => {
            if (people.dragon.health > 0) {
                send_message("There's no point in giving anything to the dragon. 🤦🏼‍♂️")
            } else {
                send_message("There is no one here to give anything to.")
            }
        },
        fight: () => {
            if (people.dragon.health > 0) {
                const swordHit = Math.random() < 0.5
                if (swordHit) {
                    send_message("You have struck the dragon! 🤺")
                    people.dragon.health -= 35
                    if (people.dragon.health > 0) {
                        send_message(`🐉 🌡️ Dragon Health: ${people.dragon.health}`)
                    } else {
                        // Dragon was defeated!
                        can_move = true
                        send_message("You have defeated the fearsome dragon! After causing much trouble to you, you finally obtain the ruby necklace from him!")
                        inventory.push("ruby necklace")
                    }
                } else {
                    send_message("The dragon dodged your attack! You were clawed!")
                    send_message("You lose 33 health.")
                    health -= 33
                    get_current_health()
                    check_health()
                }
            } else {
                send_message("There is no one here to fight.")
            }
        }
    },
    stables: {
        north: "marketplace",
        south: "desert",
        pretty_print: "Stables",
        action: () => { },
        give: () => { },
        fight: () => { },
    },
    desert: {
        north: "stables",
        south: "sorceress_cave",
        pretty_print: "Desert",
        action: () => { },
        give: () => { },
        fight: () => { },
    },
    castle_drawbridge: {
        north: "village",
        east: "castle_exterior",
        pretty_print: "Castle Drawbridge",
        action: () => { },
        give: () => { },
        fight: () => { },
    },
    castle_exterior: {
        west: "castle_drawbridge",
        south: "castle_interior",
        pretty_print: "Castle Exterior",
        action: () => { },
        give: () => { },
        fight: () => { },
    },
    castle_interior: {
        north: "castle_exterior",
        pretty_print: "Castle Interior",
        action: () => {
            const dialog = "The sunlight gleams into the room around you from the plethora of stained glass windows. You look up towards the " +
                "throne in front of you to see the princess. She calls out to you and says, 'I've been awaiting your arrival, great hero. Word has " +
                "traveled quickly about your victory over the ancient dragon.' She begins walking towards you down the many stairs that lead up to her " +
                "throne. What is it that you wish to discuss?'"
            if (!people.princess.have_it) {
                send_message(dialog)
            }
        },
        give: (item) => {
            if (!people.princess.have_it) {
                // Give it to her
                if (item === people.princess.want) {
                    if (inventory.includes(item)) {
                        const index = inventory.indexOf(item)
                        inventory.splice(index, 1)
                        people.princess.have_it = true
                        alert("With the ancient dragon defeated and the beautiful princess given the ruby necklace. You two become newly wed, and you both now rule " +
                            "over this great kingdom as its prince and princess, living happily ever after! You win!")
                        window.location.reload() // End the game by reloading
                    } else {
                        send_message("'Leave me, pauper!' The princess shouts.'")
                    }
                } else {
                    send_message("The princess says, 'Forgive me, warrior, but I have more pressing matters to attend to at this time.'")
                }
            }
        },
        fight: () => { },
    },
    sorceress_cave: {
        north: "desert",
        pretty_print: "Sorceress' Cave",
        action: () => {
            const dialog = "As you begin to enter the dark, spooky, and gloomy cave, you begin to see a purple light radiating off in the distance. You approach and see the figure of a woman with " +
                "a witch's hat sitting upon a throne made out of many different types of bones as she reads what appears to be some sort of spellbook. Her eyes glowing purple, she begins to smirk as she sets down her book to take a good look at you from head to toe. " +
                "She casts a spell upon you that binds your feet to the floor which forces you still. The sorceress begins to ask you, 'What brings a knight such as yourself to a place so far away from his kingdom? Surely there is nothing that I can offer you here, courageous one.' " +
                "You begin to explain to her your dire situation. 'You're doing all of this for a princess? Surely you have lost your mind! No matter, for I do not judge. I can help you break the curse from " +
                "your map, but it will cost you. You see, for quite some time now, I have been missing one of my most prized spellbooks from my collection and am desperate to find it once more. If you can find this spellbook " +
                "for me, then you have my word that I will break the curse from your map.'"
            if (!people.sorceress.have_it) {
                can_move = false
                send_message(dialog)
            } else {
                send_message("You cannot return to this location.")
                current_location = "desert"
                get_current_location()
            }
        },
        give: (item) => {
            if (!people.sorceress.have_it) {
                if (item === people.sorceress.want) {
                    if (inventory.includes(item)) {
                        const index = inventory.indexOf(item)
                        inventory.splice(index, 1)
                        people.sorceress.have_it = true
                        send_message("The sorceress shouts, 'Aha! My cursed spellbook! You already found it! Well, I'm not exactly sure how it is that you got your hands " +
                            "on that spellbook, but I will spare you the interrogation.' She asks to see your map and begins to work her magic on it. Effortlessly, you watch as she " +
                            "makes quick work of the curse that once controlled your map. Afterwards, the sorceress says, 'Good luck, brave warrior! I am rooting for your success in finding " +
                            "this princess that you've spoken of! Until next time!' You quickly realize that the sorceress not only broke the spell on your map, but also on what bound you " +
                            "to the ground. She raises her hands towards you in a manner that you have never seen before. In what appears to be a split second, you watch as she casts you out of her " +
                            "home and throws you out into the wild once more.")
                        current_location = "desert"
                        get_current_location()
                        can_move = true
                        const indexOfEnchantedMap = inventory.indexOf("enchanted map")
                        inventory.splice(indexOfEnchantedMap, 1)
                        inventory.push("unenchanted map")

                        // Have map, give insight
                        send_message("After reading over your newfound map, you notice the location of the ancient dragon's lair where the ruby necklace supposedly lies. " +
                            "Make your way to the dragon's lair past the wilds.")
                    } else {
                        send_message("The game has encountered an error. Please refresh the page.")
                    }
                } else {
                    send_message("The grip of her spell crushes your legs. She says, 'What do you take me for? A fool?'")
                    send_message("You lose 30 health.")
                    health -= 30
                    check_health()
                    get_current_health()
                }
            }
        },
        fight: () => { },
    },
}

let current_location = "marketplace"

const check_health = () => {
    if (health <= 0) {
        alert("You have died. ☠️ A pitiful end to such a remarkable knight.")
        window.location.reload()
    }
}

const get_current_location = () => {
    const textarea = document.querySelector("textarea")
    textarea.value += "\n\n"
    textarea.value += `🗺️ Your current location: ${map[current_location].pretty_print}`
}

const get_current_health = () => {
    send_message(`🌡️ Current Health: ${health}%`)
}

const send_message = (message) => {
    const textarea = document.querySelector("textarea")
    textarea.value += "\n\n"
    textarea.value += message
}

const get_current_inventory = () => {
    send_message("🗃️ Current Inventory: 🗃️")
    for (let item of inventory) {
        send_message("⚔️" + item[0].toUpperCase() + item.slice(1))
    }
}

const scroll_into_view = () => {
    const textarea = document.querySelector("textarea")
    textarea.scrollTop = textarea.scrollHeight
}

const commands = {
    go: (direction) => {
        if (can_move) {
            if (["north", "south", "east", "west"].includes(direction)) {
                if (direction in map[current_location]) {
                    current_location = map[current_location][direction]
                    get_current_location()

                    // Run the current location's action!
                    map[current_location].action()
                } else {
                    send_message("You can't go that way!")
                }
            } else {
                send_message("Invalid command. Please try again.")
            }
        } else {
            send_message("You are unable to move!")
        }
    },
    location: () => {
        get_current_location()
    },
    inventory: () => {
        get_current_inventory()
    },
    give: (item) => {
        map[current_location].give(item)
    },
    health: () => {
        get_current_health()
    },
    fight: () => {
        map[current_location].fight()
    },
    use: (item) => {
        if (item === "medical potion") {
            if (inventory.includes(item)) {
                send_message("You drink the potion and your health increases by 50!")
                health += 50
                get_current_health()
                const indexOfMedicalPotion = inventory.indexOf("medical potion")
                inventory.splice(indexOfMedicalPotion, 1)
            } else {
                send_message("You do not have that item in your inventory.")
            }
        }
    }
}

const intro = "Ancient times tell of a great threat that would rise to power. Deep within the heart of a rural kingdom, the lost " +
    "ruby necklace lays enshrined beneath the greatest threat. Living within these lands, the deadly and powerful ancient dragon " +
    "holds the necklace and lays waste to any who dare attempt to retrieve it. Those who make the perilous journey through the wilds " +
    "alive are swept away by the danger of this mysticality. It has been prophesied that the one who can reunite this ruby " +
    "necklace with the kingdom's princess will unlock untold riches and unfathomable power. You are this hero, and the kingdom " +
    "of Orangestone is awaiting your glorious victory."

const parse_command = () => {
    const input = document.querySelector("input")
    const [command, ...rest] = input.value.toLowerCase().split(" ") // "go north" ==> "go" 
    if (command in commands) {
        commands[command](rest.join(" ").toLowerCase())
        scroll_into_view()
    }
}

const set_up_event_listeners = () => {
    const button = document.querySelector("button")
    button.addEventListener("click", parse_command)
}

const insert_intro_text = () => {
    const textarea = document.querySelector("textarea")
    textarea.value = intro
}

const start_game = () => {
    set_up_event_listeners()
    insert_intro_text()
    get_current_location()
    map[current_location].action() // Run the action manually the first time.
    get_current_inventory()
}


start_game()

