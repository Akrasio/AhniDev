const fetch = import('node-fetch');
const ahniEndpoints = require('../constants/ahniEndpoints');
const schema = require("../schema/unmute");
const ms = require("../functions/parseMS");
const db = require("mongoose");
class AhniClient {
    constructor(options = {}) {
        if (!options.KEY) throw new Error("No key found for Ahni API");
        this.KEY = options.KEY,
            this.client = options.client,
            this.MongoDBUri = options.MongoDB;
    };
    /**
     * @param {String} img endpoint to search
     * @returns {String} url of image
     */

    async nsfw(img) {
        return fetch(`${ahniEndpoints.base}${img}`, {
            method: 'GET',
            headers: { "Authorization": this.KEY }
        })
            .then(res => res.json())
            .then(json => {
                if (json == undefined) throw Error(`[AhniDev]: ${img} is not a valid endpoint!`)
                return json.result
            })
    };

    async chat(msg, userID) {
        const body = { msg: msg, uid: userID };
        const fetch = require("node-fetch");

        return fetch('https://ahni.dev/api/v1/fun/chat', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { "authorization": this.KEY, 'Content-Type': 'application/json' },
        })
            .then(res => res.json())
            .then(json => {
                if (json == undefined) throw Error(`[AhniDev]: ${"chat"} is not a valid endpoint!`)
                return json.response
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
            roles: member.roles.cache.filter(r => r.id !== member.guild.id && !r.managed).map(r => r.id) || [],
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
                                    use.roles.set(doc.roles)
                                    await client.emit('timedUnmute', use, guilds)
                                    await schema.deleteOne(doc)
                                    return;
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
        const url = message.match(/(?:https:\/\/discord.com\/channels\/[0-9].*[0-9])/)
        try {
            if (Number(id) && !url) {
                const a = await channel.messages.fetch(id).then(
                    async m => {
                        if (m.channel.nsfw && !channel.nsfw) return {
                            content: 'This message is in an NSFW channel so i will not repost it here!',
                            author: {
                                accentColor: m.author.accentColor,
                                avatarURL: m.author.avatarURL,
                                username: m.author.username
                            }
                        }
                        if (m.embeds.length > 0) return {
                            content: 'The requested message has one or more embeds, So it cant be read yet...',
                            author: {
                                accentColor: m.author.accentColor,
                                avatarURL: m.author.avatarURL,
                                username: m.author.username
                            }
                        }
                        return m;
                    }).catch(err => {
                        return {
                            content: 'No valid message id/message url provided!',
                            author: {
                                accentColor: client.user.accentColor,
                                avatarURL: client.user.avatarURL,
                                username: client.user.username
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
                                        avatarURL: m.author.avatarURL,
                                        username: m.author.username
                                    }
                                }
                                if (m.embeds.length > 0) return {
                                    content: 'This message has one or more embeds, So it cant be read yet...',
                                    author: {
                                        accentColor: m.author.accentColor,
                                        avatarURL: m.author.avatarURL,
                                        username: m.author.username
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
                                    username: client.user.username
                                }
                            }
                        })
                    return d;
                } else return {
                    content: 'No valid message found!',
                    author: {
                        accentColor: client.user.accentColor,
                        avatarURL: client.user.avatarURL,
                        username: client.user.username
                    }
                }
            } else {
                return {
                    content: 'No valid message id/message url provided!',
                    author: {
                        accentColor: client.user.accentColor,
                        avatarURL: client.user.avatarURL,
                        username: client.user.username
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
        if (!client) throw new Error('[ AhniDev ] Error: Client is not defined in remind function')
        schema.find({}, function (err, docs) {
            if (err) return console.log(err)
            docs.forEach(async doc => {
                if (doc.memberID === user.id) {
                    const guild = await client.guilds.cache.get(doc.guildID);
                    await guild.members.fetch(doc.memberID).then(use => {
                        if (doc.roles.length > 0) {
                            use.roles.set(doc.roles)
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