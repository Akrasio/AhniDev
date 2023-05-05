const fetch = require('node-fetch');
const ahniEndpoints = require('../constants/ahniEndpoints');
const schema = require("../schema/unmute");
const ms = require("../functions/parseMS");
const db = require("mongoose");
class AhniClient {
    constructor(options = {}) {
        if (!options.KEY) throw new Error("No key found for Ahni API");
        this.KEY = options.KEY,
            this.client = options.client,
            this.url = options.url,
            this.MongoDBUri = options.MongoDB;
    };
    /**
     * @param {String} img endpoint to search
     * @returns {String} url of image
     */

    async nsfw(img) {
        if (this.KEY === null) return nokey;
        let data = await fetch(`${this.url || ahniEndpoints.base}/v2/nsfw/img?end=${img}&apikey=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                if (json == undefined) throw Error(`[AhniDev]: ${img} is not a valid endpoint!`)
                return json
            })

        return data
    }
    async others(img) {
        if (this.KEY === null) return nokey;
        let data = await fetch(`${this.url || ahniEndpoints.base}/v2/others/${img}?apikey=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                if (json == undefined) throw Error(`[AhniDev]: ${img} is not a valid endpoint!`)
                return json
            })

        return data
    }
    async chat(msg, userID) {
        const body = { msg: msg, uid: userID };
        const fetch = require("node-fetch");

        return fetch(`${this.url ||ahniEndpoints.base}/v2/others/chat?apikey=${this.KEY}&msg=${msg}&uid=${userID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => res.json())
            .then(json => {
                if (json == undefined) throw Error(`[AhniDev]: ${"chat"} is not a valid endpoint!`)
                return json.result
            })
    }

    /**
     * does not connect to api below this vvvv
     * mutes a Guild Member by a given time
     * @param {Object} member The member
     * @param {Number} time The reminder time
     * @param {String} reason The reminder
     * @returns {Promise<void>}
     */
    async mute(member, time, reason) {
        if (!member) throw new Error('[ AhniDev ] Error: Member is not defined in remind function')
        const data = new schema({
            guildID: member.guild.id,
            memberID: member.user.id,
            reason: reason || "No Reason Given",
            roles: member.roles.cache.filter(r => r.id !== member.guild.id).map(r => r.id) || [],
            time: (parseInt(ms(time).toString()) + Date.now()) || (parseInt(ms("1m").toString()) + Date.now()),
            timeMS: ms(time.toString())
        });
        data.save().catch(e => console.log("[ AhniDev ] Error: saving remind to db"))
    };

    /**
     * Unmutes a Guild Member by a given time
     * @param {Object} member The member
     * @param {Number} time The reminder time
     * @param {String} reason The reminder
     * @returns {Promise<void>}
     */
    async timed(client) {
        if (!client) throw new Error('[ AhniDev ] Error: Client is not defined in remind function')
        setInterval(() => {
            schema.find({}, function (err, docs) {
                if (err) return console.log(err)
                docs.forEach(async doc => {
                    if (doc.time <= Date.now()) {
                        await client.guilds.fetch(doc.guildID).then(async guilds => {
                            await guilds.members.fetch(doc.memberID).then(async (use) => {
                                if (doc.roles.length > 0) {
                                    await use.roles.set(doc.roles)
                                    await client.emit('timedUnmute', use, { guild: use.guild })
                                    await schema.deleteOne(doc)
                                } else {
                                    await use.roles.set([]);
                                    await client.emit('timedUnmute', use, { guild: use.guild })
                                    await schema.deleteOne(doc)
                                }
                            })
                        })
                    }
                });
            });
        }, 10000); // 10000 milsec
    }
    /**
     * @param { Discord.Client } client  
     * @param { String } message 
     * @returns 
     */
    async quoteId(client, message, channel) {
        if (client == null || client == undefined) throw new Error('[ AhniDev ] Error: Client is not defined in quoteId function')
        if (message == null || message == undefined) throw new Error('[ AhniDev ] Error: Message is not defined in quoteId function')
        const id = message;
        let a = [];
        const url = message.match(/(?:https:\/\/discord.com\/channels\/[0-9].*[0-9]|https:\/\/ptb.discord.com\/channels\/[0-9].*[0-9]|https:\/\/canary.discord.com\/channels\/[0-9].*[0-9])/)
        try {
            if (Number(id) && !url) {
                const a = await channel.messages.fetch(id).then(
                    async m => {
                        if (m.channel.nsfw && !channel.nsfw) return {
                            content: 'This message is in an NSFW channel so i will not repost it here!',
                            author: {
                                accentColor: m.author.accentColor,
                                avatarURL: m.author.avatarURL({ dynamic: true, size: 4096, format: "png" }),
                                username: m.author.tag
                            }
                        }
                        if (m.embeds.length > 0 && !m.content) return {
                            content: 'The requested message has one or more embeds, and it cant be read yet...',
                            author: {
                                accentColor: m.author.accentColor,
                                avatarURL: m.author.avatarURL({ dynamic: true, size: 4096, format: "png" }),
                                username: m.author.tag
                            }
                        }
                        return m;
                    }).catch(err => {
                        return {
                            content: 'No valid message id/message url provided!',
                            author: {
                                accentColor: client.user.accentColor,
                                avatarURL: client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }),
                                username: client.user.tag
                            }
                        };
                    })
                return a;
            } else if (url && !Number(id)) {
                const parses = url.toString().split("/");
                const b = await client.guilds.cache.get(parses[4])
                if (b) {
                    const c = await b.channels.cache.get(parses[5])
                    const d = c.messages.fetch(parses[6]).then(
                        async m => {
                            {
                                if (m.channel.nsfw && !channel.nsfw) return {
                                    content: 'The requested message is in an NSFW channel so i will not repost it here!',
                                    author: {
                                        accentColor: m.author.accentColor,
                                        avatarURL: m.author.avatarURL({ dynamic: true, size: 4096, format: "png" }),
                                        username: m.author.tag
                                    }
                                }
                                if (m.embeds.length > 0 && !m.content) return {
                                    content: 'This message has one or more embeds, and it cant be read yet...',
                                    author: {
                                        accentColor: m.author.accentColor,
                                        avatarURL: m.author.avatarURL({ dynamic: true, size: 4096, format: "png" }),
                                        username: m.author.tag
                                    }
                                };
                                return m;
                            }
                        }).catch(err => {
                            return {
                                content: 'No valid message id/message url provided!',
                                author: {
                                    accentColor: client.user.accentColor,
                                    avatarURL: client.user.avatarURL,
                                    username: client.user.tag
                                }
                            }
                        })
                    return d;
                } else return {
                    content: 'No valid message found!',
                    author: {
                        accentColor: client.user.accentColor,
                        avatarURL: client.user.avatarURL,
                        username: client.user.tag
                    }
                }
            } else {
                return {
                    content: 'No valid message id/message url provided!',
                    author: {
                        accentColor: client.user.accentColor,
                        avatarURL: client.user.avatarURL,
                        username: client.user.tag
                    }
                }
            }
        } catch (err) {
            console.log(err)
            return "Something wasnt found or broke!"
        }
    }
    /**
     * Fetch and unmutes a Guild Member
     * @param {Discord.Client} client Discord Client
     * @returns {Promise<void>}
     */
    async forced(client, user) {
        if (!client) throw new Error('[ AhniDev ] Error: Client is not defined in forced unmute function')
        schema.find({}, function (err, docs) {
            if (err) return console.log(err)
            docs.forEach(async doc => {
                if (doc.memberID === user.id) {
                    const guild = await client.guilds.cache.get(doc.guildID);
                    await guild.members.fetch(doc.memberID).then(use => {
                        if (doc.roles.length > 0) {
                            if (use.roles.cache.has(use.guild.roles.premiumSubscriberRole.id)) {
                                use.roles.set([doc.roles, use.guild.roles.premiumSubscriberRole.id])
                            } else {
                                use.roles.set([doc.roles])
                            }
                            return;
                        } else {
                            return use.roles.set([]);
                        }
                    })
                    await client.emit('timedUnmute', user, guild)
                    await schema.deleteOne(doc)
                }
            })
        })
    }
    /**
     * Parse a ms
     * @param {number} ms 
     * @returns {Promise<String>}
     */
    async parseMS(ms) {
        if (typeof ms == "number") {
            let seconds = ms / 1000,

                days = seconds / 86400;
            seconds = seconds % 86400

            let hours = seconds / 3600;
            seconds = seconds % 3600

            let minutes = seconds / 60;
            seconds = seconds % 60;

            if (days) {
                return `${days} day, ${hours} hours, ${minutes} minutes`
            } else if (hours) {
                return `${hours} hours, ${minutes} minutes, ${seconds} seconds`
            } else if (minutes) {
                return `${minutes} minutes, ${seconds} seconds`
            }

            return `${seconds} second(s)`
        } else {
            return null;

        }
    }
    async cat() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/animals/cat?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }
    async dog() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/animals/dog?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async panda() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/animals/panda?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async bird() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/animals/bird?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async uuid() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/uuid?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async joke() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/joke?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async puns() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/puns?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async hug() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/hug?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async kiss() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/kiss?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async insults() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/insults?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async flirt() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/flirt?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async word() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/word?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async doesnotexists() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/doesnotexists?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async quote() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/quote?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async uselessweb() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/uselessweb?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async truth() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/truth?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async dare() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/dare?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async number() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/number?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }

    async password() {
        if (this.KEY === null) return nokey
        let data = await fetch(`${ahniEndpoints.base}/v2/others/password?KEY=${this.KEY}`)
            .then(res => res.json())
            .then(json => {
                return json
            })

        return data
    }
    async connectToMongoDB(MongoDB) {
        let connected = true;
        db.connect(MongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch(e => {
            connected = false;
            throw e;
        }).then(() => {
            if (connected === true) console.info("[ AhniDev ] => Connected to DB successfully.")
        });
    }
}
module.exports = AhniClient;
