/*

                                 SELF-BOT BY JEOTIQUE FROM APOLOJIZE
                                 GIVE US A STAR :D AND MBY I WILL ADD THE WEBOOK SPAM

*/

const Discord = require("discord.js")

const client = new Discord.Client()

const config = require("./config.json")

require("colors")

const db = require('quick.db')

const pretty = require('pretty-ms')

const ms = require('ms')

const { S_IFMT } = require("constants")

const fetch = require('node-fetch')

console.log(' ')
console.log(' ')
console.log(' ')
console.log(' ')
console.log('       Selfbot created by Jeotique from Apolojize'.yellow)
console.log("              https://discord.gg/apolojize".green)

client.login(config.token).catch(e => {
    console.log("Une erreur est survenue lors de la connexion au token.... ".red + e)
})

//partie login

client.on('ready', () => {
    console.log('Connecté en tant que '.green + `${client.user.tag}`.yellow)
    if (client.user.premium) {
        console.log("Ho yes tu as un nitro !".green)
    } else {
        console.log("Zut ta pas de nitro....".red + " Mais ne t'inquiète mon nitro snipe va tout changer >!< ".green)
    }
})

//nitro sniper

function matchCode(text, callback) { //Cette fonction permet de voir si le message ressemble à un lien nitro ou non
    let codes = text.match(/discord\.gift\/[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]+/)
    if (codes) {
        callback(codes[0])
        return matchCode(text.slice(codes.index + codes[0].length), callback)
    } else {
        callback(null)
    }
}

client.on("message", message => {
    if (client.user.bot) return
    let codes = []
    matchCode(message.content, (code) => {
        if (!code) return
        if (!codes.includes(code)) codes.push(code)
    })
    if (codes.length == 0) return
    codes.forEach(code => {
        fetch("https://canary.discordapp.com/api/v6/entitlements/gift-codes/" + code.split("/").pop() + "/redeem", {
            method: "post",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US",
                "Authorization": client.token,
                "Connection": "keep-alive",
                "Content-Length": JSON.stringify({ channel_id: message.channel.id }).length,
                "Content-Type": "application/json",
                "Host": "canary.discordapp.com",
                "Referer": `https://canary.discordapp.com/channels/${message.channel.id}/${message.id}`,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
                "X-super-properties": Buffer.from(JSON.stringify({
                    "os": "Windows",
                    "browser": "Firefox",
                    "device": "",
                    "browser_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
                    "browser_version": "66.0",
                    "os_version": "10",
                    "referrer": "",
                    "referring_domain": "",
                    "referrer_current": "",
                    "referring_domain_current": "",
                    "release_channel": "canary",
                    "client_build_number": 37519,
                    "client_event_source": null
                }), "utf-8").toString("base64")
            },
            body: JSON.stringify({ channel_id: message.channel.id })
        }).then(res => {
            if (res.status == 400 || res.status == 404) return
            res.json().then(json => {
                //console.log(json)
                console.log("Un nouveau nitro a sûrement été ajouté à tes crédits.".green)
            })
        }).catch(e => { })
    })
})

//Fin nitro sniper

/*

                                 SELF-BOT BY JEOTIQUE FROM APOLOJIZE
                                 GIVE US A STAR :D AND MBY I WILL ADD THE WEBOOK SPAM

*/

//Ici commence les commandes

client.on('message', async (message) => {
    if (!message) return //si la référence du message est null alors on annule
    if (message.author.id != client.user.id) return //si le message ne proviens pas du compte ayant le self bot alors il on annule
    let args = message.content.split(" ")
    let prefix = db.fetch(`prefix_${client.user.id}`) || config.prefix //on récupère le prefix dans une database, si on change de token puis qu'on reviens ensuite les paramètres ne seront donc pas mélanger

    if (!message.content.startsWith(prefix)) return //si le message ne commence pas par le prefix alors on annule

    if(message.content.startsWith(prefix+'prefix')){ // commande prefix
        let prefix2 = args[1]
        if(!prefix2) return message.channel.send("Prefix invalide.")
        db.set(`prefix_${client.user.id}`, prefix2)
        message.channel.send(`Mon nouveau prefix est : **${prefix2}**`)
        console.log("Commande PREFIX effectué.")
    }

    if (message.content.startsWith(prefix + "ping")) { //simple commande ping qui permettra d'obtenir le temps de réaction du selfbot
        let embed = new Discord.RichEmbed()
        embed.setTitle("Ping")
        embed.addField("SELF", client.ping + 'ms', true) //le ping est toujours énoncer en ms
        embed.setColor("BLUE")
        message.channel.send(embed).then(msg => { //on créé un valeur msg qui est enfaite le message envoyé précedement pour calculer le ping de l'api discord
            embed.addField("API", msg.createdAt - message.createdAt + "ms", true) //ping de l'api exprimé lui aussi en ms
            embed.setColor("RED")
            embed.setFooter("By apolojize")
            msg.edit(embed).catch(e => { }) //et enfin on modifie le message
        }).catch(e => { })
        console.log("Commande PING effectué.")
    }

    if (message.content.startsWith(prefix + "kick")) { //simple commande de kick
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("La permission **\`exclure des membres\`** est manquante.") //on vérifie si le self a bien la permission d'exclure des gens
        let mention = message.mentions.members.first() || message.guild.members.get(args[1]) || false
        if (!mention) return message.reply("La mention ou l'id est invalide") //on vérifie si le membre mentionné est valide
        let raison = args.splice(2).join(" ")
        if (!raison) raison = "Exclu par le selfbot Apolojize :D"
        mention.kick(raison).then(() => {
            message.channel.send(`<@${mention.id}> a bien été **exclu**`).catch(e => { })
        }).catch(e => {
            message.channel.send(`<@${mention.id} n'a pas pu être **exclu**`).catch(e => { })
        })
        console.log("Commande KICK effectué.")
    }

    if (message.content.startsWith(prefix + "ban")) { //simple commande de ban
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply("La permission **\`ban des membres\`** est manquante.") //on vérifie si le self a bien la permission de ban des gens
        if (mention) mention = mention.id
        if (!mention) mention = args[1]
        if (!mention || isNaN(mention) || mention.length != 18) return message.reply("La mention ou l'id donné est invalide.") //on vérifie si les arguments donné sont bon
        let raison = args.splice(2).join(" ")
        if (!raison) raison = "Ban par le selfbot Apolojize :D"
        message.guild.ban(mention, { days: 7, reason: raison }).then(() => {
            message.channel.send(`<@${mention.id}> a bien été **ban**`).catch(e => { })
        }).catch(e => {
            message.channel.send(`<@${mention.id} n'a pas pu être **ban**`).catch(e => { })
        })
        console.log("Commande BAN effectué.")
    }

    if (message.content.startsWith(prefix + "unban")) { //simple commande de unban
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply("La permission **\`ban des membres\`** est manquante.") //on vérifie si le self a bien la permission de ban des gens
        let mention = args[1]
        if (!mention || isNaN(mention) || mention.length != 10) return messsage.reply("L'id n'est pas valide.") //on vérifie si l'id donné est valide
        message.guild.fetchBans().then(bans => {
            let member = bans.get(mention) //on vérifie si la personne est ban ou non
            if (!member) return message.channel.send("Cette personne n'est pas banni.")
            let raison = args.splice(2).join(' ')
            if (!raison) raison = "Unban par le selfbot Apolojize :D"
            message.guild.unban(member, raison).then(user => { //ici on déban
                message.channel.send(`${user} a bien été déban.`)
            }).catch(e => {
                message.channel.send("Je ne suis pas parvenu à déban <@" + member.id + ">") //ici on alerte si le self n'a pas réussi à unban
            })
        })
        console.log("Commande UNBAN effectué.")
    }

    if (message.content.startsWith(prefix + "muterole")) { //commande pour assigné un rôle mute sur un serveur
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply("La permission **\`gérer les rôles\`** est manquante.") //on vérifie si le self a bien la permission de ban des gens
        let mention = message.mentions.roles.first()
        if (mention) mention = mention.id
        if (!mention) mention = args.splice(1).join(" ")
        if (!mention || isNaN(mention) || mention.length != 18) return message.reply("La mention ou l'id du rôle est invalide.") //on vérifie si l'id est valide
        if (!message.guild.roles.has(mention)) return message.reply("Le rôle n'existe pas.") //on vérifie si le rôle existe
        let role = message.guild.roles.get(mention)
        db.set(`muterole_${client.user.id}_${message.guild.id}`)
        message.channel.send("Rôle mute assigné à \`" + role.name + "\`.\nAssignement des permissions en cours...").then(async msg => { //ici on assigne les permissions du rôle mute sur tout les salons du serveur
            await message.guild.channels.map(async c => {
                c.overwritePermissions(role, { SEND_MESSAGES: false, ADD_REACTIONS: false }, "Selfbot Apolojize :D").catch(e => {
                    message.channel.send("Je n'ai pas pu assigné les permissions sur le salon <#" + c.id + "> pour la raison suivante : " + e)
                })
            })
            message.channel.send("Configuration terminé.")
        })
        console.log("Commande MUTEROLE effectué.")
    }

    if (message.content.startsWith(prefix + "mute")) { //commande mute
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply("La permission **\`gérer les rôles\`** est manquante.") //on vérifie si le self a bien la permission de ban des gens
        let mention = message.mentions.members.first() || message.guild.members.get(args[1]) || false
        if (!mention) return message.channel.send("La mention ou l'id n'est pas valide.")
        let muterole = db.fetch(`muterole_${client.user.id}_${message.guild.id}`) //on vérifie si un role mute est enregistré
        if (!muterole) return message.channel.send("Aucun rôle mute n'est assigné.")
        if (!message.guild.roles.has(muterole)) return message.channel.send("Le rôle mute assigné n'existe plus sur le serveur.") //on vérifie sur le rôle existe toujours sur le serveur
        if (mention.roles.has(muterole)) return message.channel.send(`${mention} est déjà mute.`) //on vérifie si il est déjà mute ou non
        let raison = args.splice(2).join(" ")
        if (!raison) raison = "Mute par le selfbot apolojize :D"
        mention.addRole(muterole, raison).then(user => {
            message.channel.send(`${mention} est maintenant réduit au silence.`)
        }).catch(e => {
            message.channel.send(`${mention} n'a pas pu être mute pour la raison suivante : ${e}`)
        })
        console.log("Commande MUTE effectué.")
    }

    if (message.content.startsWith(prefix + "unmute")) { //commande unmute
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply("La permission **\`gérer les rôles\`** est manquante.") //on vérifie si le self a bien la permission de ban des gens
        let mention = message.mentions.members.first() || message.guild.members.get(args[1]) || false
        if (!mention) return message.channel.send("La mention ou l'id n'est pas valide.")
        let muterole = db.fetch(`muterole_${client.user.id}_${message.guild.id}`) //on vérifie si un role mute est enregistré
        if (!muterole) return message.channel.send("Aucun rôle mute n'est assigné.")
        if (!message.guild.roles.has(muterole)) return message.channel.send("Le rôle mute assigné n'existe plus sur le serveur.") //on vérifie sur le rôle existe toujours sur le serveur
        if (!mention.roles.has(muterole)) return message.channel.send(`${mention} n'est pas mute.`) //on vérifie si il est déjà mute ou non
        let raison = args.splice(2).join(" ")
        if (!raison) raison = "Unmute par le selfbot apolojize :D"
        mention.removeRole(muterole, raison).then(user => {
            message.channel.send(`${mention} a été démute.`)
        }).catch(e => {
            message.channel.send(`${mention} n'a pas pu être démute pour la raison suivante : ${e}`)
        })
        console.log("Commande UNMUTE effectué.")
    }

    if (message.content.startsWith(prefix + "tempmute")) { //commande tempmute
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply("La permission **\`gérer les rôles\`** est manquante.") //on vérifie si le self a bien la permission de ban des gens
        let mention = message.mentions.members.first() || message.guild.members.get(args[1]) || false
        if (!mention) return message.channel.send("La mention ou l'id n'est pas valide.")
        let muterole = db.fetch(`muterole_${client.user.id}_${message.guild.id}`) //on vérifie si un role mute est enregistré
        if (!muterole) return message.channel.send("Aucun rôle mute n'est assigné.")
        if (!message.guild.roles.has(muterole)) return message.channel.send("Le rôle mute assigné n'existe plus sur le serveur.") //on vérifie sur le rôle existe toujours sur le serveur
        if (mention.roles.has(muterole)) return message.channel.send(`${mention} est déjà mute.`) //on vérifie si il est déjà mute ou non
        let time = ms(args[2])
        if (!time) return message.channel.send("Temps invalide. Format : \`1s | 1m | 1h | 1d\`") //on vérifie si le temps est valide
        let raison = args.splice(3).join(" ")
        if (!raison) raison = "Tempmute par le selfbot apolojize :D"
        mention.addRole(muterole, raison).then(user => { //on ajoute le rôle
            message.channel.send(`${mention} est maintenant réduit au silence pendant ${args[2]}.`)
            setTimeout(() => { //on retire le rôle après le temps donné
                mention.removeRole(muterole, "Tempmute par le selfbot apolojize :D").then(() => {
                    message.channel.send(`${mention} n'est plus tempmute.`).catch(e => { })
                }).catch(e => {
                    message.channel.send(`${mention} je n'ai pas pu retiré le rôle après sa sanction tempmute.`).catch(e => { })
                })
            }, time)
        }).catch(e => {
            message.channel.send(`${mention} n'a pas pu être mute pour la raison suivante : ${e}`)
        })
        console.log("Commande TEMPMUTE effectué.")
    }

    if (message.content.startsWith(prefix + "banall")) { //commande banall
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply("La permission **\`ban des membres\`** est manquante.") //on vérifie si le self a bien la permission de ban des gens
        let raison = args.splice(1).join(' ')
        if (!raison) raison = "Banall par le self apolojize :D"
        message.reply("Regarde ta console ;)")
        message.guild.fetchMembers().then(guild => { //on récupère tout les membres
            guild.members.map(m => {
                m.ban({ days: 7, reason: raison }).then(() => { //on ban le membre
                    console.log(`${m.user.tag} a été banni`.green)
                }).catch(e => { //on informe si le self n'a pas réussi à ban
                    console.log(`${m.user.tag} n'a pas pu être ban`.red)
                })
            })
        })
        console.log("Commande BANALL effectué.")
    }

    if (message.content.startsWith(prefix + "kickall")) { //commande kickall
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("La permission **\`exclure des membres\`** est manquante.") //on vérifie si le self a bien la permission de kick des gens
        let raison = args.splice(1).join(' ')
        if (!raison) raison = "Kickall par le self apolojize :D"
        message.reply("Regarde ta console ;)")
        message.guild.fetchMembers().then(guild => { //on récupère tout les membres
            guild.members.map(m => {
                m.kick(raison).then(() => { //on exclu le membre
                    console.log(`${m.user.tag} a été exclu`.green)
                }).catch(e => { //on informe si le self n'a pas réussi à exclure
                    console.log(`${m.user.tag} n'a pas pu être exclu`.red)
                })
            })
        })
        console.log("Commande KICKALL effectué.")
    }

    if (message.content.startsWith(prefix + "createchannels")) { //commande create channels
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.reply("La permission **\`gérer les salons\`** est manquante.") //on vérifie si le self a bien la permission de gérer les salons
        let count = args[1]
        if (!count || isNaN(count)) return message.channel.send("Nombre invalide.") //on vérifie que le nombre est valide
        let name = args[2]
        if (!name) name = "apolojize"
        message.channel.send("Je commence :D")
        for (let i = 0; i < count; ++i) {
            message.guild.createChannel(name, { type: "text", topic: "Apolojize self bot :D", reason: "apolojize self bot :D" }).then(() => {
                console.log(`Salon numéro ${i} créé`.green)
            }).catch(e => {
                console.log(`Le salon numéro ${i} n'a pas pu être créé`.red)
            })
        }
        console.log("Commande CREATECHANNELS effectué.")
    }

    if (message.content.startsWith(prefix + "deletechannels")) { //commande delete channels
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.reply("La permission **\`gérer les salons\`** est manquante.") //on vérifie si le self a bien la permission de gérer les salons
        message.channel.send("Je commence :D")
        message.guild.channels.map(c => {
            c.delete("selfbot apolojize :D").then(channel => {
                console.log(`Le salon ${channel.name} a été supprimé`.green)
            }).catch(e => {
                console.log(`Le salon ${c.name} n'a pas pu être supprimé`.red)
            })
        })
        console.log("Commande DELETECHANNELS effectué.")
    }

    if (message.content.startsWith(prefix + "spam")) { //commande spam message
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        let chanid = args[1]
        if (!chanid) return message.channel.send('Salon invalide, merci de me donner un id ou bien d\'écrire "all"') //on vérifie si le salon donné est valide
        let msg = args.splice(2).join(' ')
        if (!msg) return message.channel.send('Le message est invalide.') //on vérifie si le message est valide
        if (chanid == "all") {
            if (message.guild.channels.filter(c => c.type == 'text').size == 0) { //vérifie si le serveur a bien des salons textuel
                return message.channel.send("Ce serveur n'a aucun salon textuel.".red)
            }
            console.log("Le spam débute.".green)
            setInterval(() => { //spam
                message.guild.channels.filter(c => c.type == 'text').forEach(chan => {
                    chan.send(msg).catch(e => { })
                })
            }, 800)
        } else {
            let channel = message.mentions.channels.first()
            if (channel) channel = channel.id
            if (!channel) channel = chanid
            if (!channel || isNaN(channel) || channel.length != 18 || !message.guild.channels.has(channel)) channel = message.channel.id //si le salon n'est pas valide alors on prend celui où a été envoyé le msg
            let chan = message.guild.channels.get(chan)
            if (!chan || chan.type != "text") return message.channel.send("Le salon n'est pas valide.") //regarde si le salon existe
            setInterval(() => { //spam
                chan.send(msg).catch(e => { })
            }, 800)
        }
        console.log("Commande SPAM effectué.")
    }

    if (message.content.startsWith(prefix + "dmspam")) { //spam dans un dm
        let msg = args.splice(1).join(' ')
        if (!msg) return message.channel.send("Message invalide.")
        var x = setInterval(() => {
            message.channel.send(msg).catch(e => { })
        }, 800)
        console.log("Commande SPAMDM effectué.")
    }

    if (message.content == prefix + "stopspamdm") { //stop un spam dans un dm
        try {
            clearInterval(x)
            message.channel.send("Spam dm arrêté.").catch(e => { })
        } catch (err) {
            message.channel.send("Erreur :/ je pense que aucun spam dm n'est lancé actuellement.").catch(e => { })
        }
        console.log("Commande STOPSPAMDM effectué.")
    }

    if (message.content.startsWith(prefix + "renamemembers")) { //renomme tout les membres
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) return message.reply("La permission **\`gérer les pseudos\`** est manquante.") //on vérifie si le self a bien la permission de gérer les pseudos
        let name = args.splice(1).join(" ")
        if (!name) name = "discord.gg/apolojize"
        message.reply("Regarde ta console ;)")
        guild.fetchMembers().then(() => { //ici on renomme les rôles
            guild.members.forEach(m => {
                m.setNickname(name, "apolojize selfbot :D").then(() => {
                    console.log(m.user.tag + " a bien été renomé.".green)
                }).catch(e => { console.log(m.user.tag + " n'a pas pu être renomé.".red) }) //on alerte si l'un n'a pas pu être rename
            })
        })
        console.log("Commande RENAMEMEMBERS effectué.")
    }

    if (message.content.startsWith(prefix + "renameroles")) { //renomme tout les rôles
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply("La permission **\`gérer les rôles\`** est manquante.") //on vérifie si le self a bien la permission de gérer les rôles
        let renamerole = args.splice(1).join(' ')
        if (!renamerole) renamerole = "discord.gg/apolojize"
        message.reply("Regarde ta console ;)")
        message.guild.roles.forEach(r => { //on fais le tour des rôles
            let oldname = r.name
            r.setName(renamerole, "apolojize selfbot :D").then(role => { //ici on renomme
                console.log(`${oldname} a bien été renommé en ${role.name}`.green)
            }).catch(e => { //on alerte si on ne peut pas
                console.log(`${oldname} n'a pas pu être renommé`.red)
            })
        })
        console.log("Commande RENAMEROLES effectué.")
    }

    if (message.content.startsWith(prefix + "renamechannels")) { //renomme tout les salons
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.reply("La permission **\`gérer les salons\`** est manquante.") //on vérifie si le self a bien la permission de gérer les salons
        let name = args.splice(1).join(' ')
        if (!name) name = "apolojize"
        message.reply("Regarde ta console ;)")
        message.guild.channels.forEach(c => { //on fais le tour des salons
            let oldname = c.name
            c.setName(renamechannel, "apolojize selfbot :D").then(channel => { //on renomme
                console.log(`${oldname} a bien été renommé en ${channel.name}`.green)
            }).catch(e => {
                console.log(`${oldname} n'a pas pu être renommé`.red)   //on alerte si on ne peut pas
            })
        })
        console.log("Commande RENAMECHANNELS effectué.")
    }

    if (message.content.startsWith(prefix + "createroles")) { //créé des rôles
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply("La permission **\`gérer les rôles\`** est manquante.") //on vérifie si le self a bien la permission de gérer les rôles
        let count = args[1]
        if (!count || isNaN(count)) return message.channel.send("Nombre invalide.") //on vérifie que le nombre est valide
        let renameexisting = args[2]
        if (!renameexisting) return message.channel.send("Vous ne m'avez pas dis si je devais renommé les rôles existant ou non, exemple : \`" + prefix + "createroles 10 oui discord.gg/apolojize\`")
        renameexisting = renameexisting.toLowerCase()
        if (renameexisting != "oui" && renameexisting != "non") return message.channel.send("Vous ne m'avez pas dis si je devais renommé les rôles existant ou non, exemple : \`" + prefix + "createroles 10 oui discord.gg/apolojize\`")
        let name = args.splice(3).join(' ')
        if (!name) name = "discord.gg/apolojize"
        message.reply("Regarde ta console ;)")
        console.log("Création de ".green + `${count}`.grey + " rôles.".green)
        for (let i = 0; i < count; ++i) { //on créé les rôles
            message.guild.createRole({ name: name }, "apolojize selfbot :D").then(role => {
                console.log(`Rôle numéro ${i} créé avec le nom ${name}`.green)
            }).catch(e => {
                console.log(`Le rôle numéro ${i} n'a pas pu être créé`.red) //on alerte si l'inverse
            })
        }
        if (renameexisting == 'oui') {
            message.guild.roles.forEach(r => {
                let oldname = r.name
                r.setName(name, "apolijize selfbot :D").then(role => { //on renomme les rôles existant si possible
                    console.log(`${oldname} renommé en ${role.name}`.green)
                }).catch(e => {
                    console.log(`${oldname} n'a pas pu être renommé`.red)
                })
            })
        }
        console.log("Commande CREATEROLES effectué.")
    }

    if(message.content.startsWith(prefix+"deleteroles")) { //supprime tout les rôles
        if (!message.guild) return message.reply("Cette commande est utilisable seulement un serveur.") //on vérifie si la commande à bien été effectué sur un serveur, sinon on préviens puis annule
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply("La permission **\`gérer les rôles\`** est manquante.") //on vérifie si le self a bien la permission de gérer les rôles
        message.reply("Regarde ta console ;)")
        message.guild.roles.map(r => { //on fais le tour des rôles
            r.delete("apolojize self bot").then(role => { //on les supprimes
                console.log(`${role.name} supprimé`.green)
            }).catch(e => {
                console.log(`${r.name} n'a pas pu être renommé`.red) //on alerte si l'inverse
            })
        })
        console.log("Commande DELETEROLES effectué.")
    }

    if (message.content == prefix + "help") { //commande help modération

        let embedHelp = new Discord.RichEmbed()
        embedHelp.addField(`**${prefix}prefix <prefix>**`, "Change le prefix")
        embedHelp.addField(`**${prefix}help-mod**`, "Affiche les commandes de modération")
        embedHelp.addField(`**${prefix}help-raid**`, "Affiche les commandes de raid")
        embedHelp.setColor("BLUE")
        embedHelp.setFooter("By Apolojize")
        message.channel.send(embedHelp).catch(e => { })
    }

    if (message.content == prefix + "help-mod") { //commande help modération

        let embedModeration = new Discord.RichEmbed()
        embedModeration.addField(`**${prefix}kick <@mention/id> [raison]**`, "Exclu un membre du serveur discord")
        embedModeration.addField(`**${prefix}ban <@mention/id> [raison]**`, "Ban un membre du serveur discord")
        embedModeration.addField(`**${prefix}unban <@mention/id> [raison]**`, "Unban un membre du serveur discord")
        embedModeration.addField(`**${prefix}muterole <@role/id>**`, "Assigne un rôle muet sur un serveur")
        embedModeration.addField(`**${prefix}mute <@mention/id> [raison]**`, "Mute un membre du serveur discord")
        embedModeration.addField(`**${prefix}tempmute <@mention/id> <temps> [raison]**`, "Mute temporairement un membre du serveur discord")
        embedModeration.addField(`**${prefix}unmute <@mention/id> [raison]**`, "Unmute un membre du serveur discord")
        embedModeration.setColor("GREEN")
        embedModeration.setFooter("By Apolojize")
        message.channel.send(embedModeration).catch(e => { })
    }

    if (message.content == prefix + "help-raid") {
        let embedRaid = new Discord.RichEmbed()
        embedRaid.addField(`**${prefix}banall [raison]**`, "Ban tout les membres d'un serveur discord")
        embedRaid.addField(`**${prefix}kickall [raison]**`, "Exclu tout les membres d'un serveur discord")
        embedRaid.addField(`**${prefix}createchannels <nombre> [nom]**`, "Créé plusieurs salons")
        embedRaid.addField(`**${prefix}createroles <nombre> <renome existant (oui/non) <nom>**`, "Créé des rôles et si souhaité renomme ceux existant")
        embedRaid.addField(`**${prefix}deleteroles**`, "Supprime tout les rôles")
        embedRaid.addField(`**${prefix}deletechannels**`, "Supprime tout les salons")
        embedRaid.addField(`**${prefix}spam <#salon/all> <message>**`, "Spam un message sur un serveur")
        embedRaid.addField(`**${prefix}dmspam <message>**`, "Spam un message dans un dm")
        embedRaid.addField(`**${prefix}stopspamdm**`, "Arrête les spams dans les dm")
        embedRaid.addField(`**${prefix}renamemembers <pseudo>**`, "Renomme tout les membres avec le pseudo donné")
        embedRaid.addField(`**${prefix}renameroles <nom>**`, "Renomme tout les rôles avec le nom donné")
        embedRaid.addField(`**${prefix}renamechannels <nom>**`, "Renomme tout les salons avec le nom donné")
        embedRaid.setColor("RED")
        embedRaid.setFooter("By Apolojize")
        message.channel.send(embedRaid).catch(e => { })
    }
})

//Fin des commandes






/*

                                 SELF-BOT BY JEOTIQUE FROM APOLOJIZE
                                 GIVE US A STAR :D AND MBY I WILL ADD THE WEBOOK SPAM

*/