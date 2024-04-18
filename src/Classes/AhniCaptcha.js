const Discord = require("discord.js");
const EventEmitter = require("events");
const createCaptcha = require("../functions/createCaptcha");
const handleChannelType = require("../functions/handleChannels");

/**
 * Captcha Options
 * @typedef {object} captchaOptions
 * @prop {string} guildID The ID of the Discord Server to Create a CAPTCHA for.
 * @prop {string} roleID The ID of the Discord Role to Give when the CAPTCHA is complete.
 * @prop {string} [channelID=undefined] (OPTIONAL): The ID of the Discord Text Channel to Send the CAPTCHA to if the user's Direct Messages are locked. Use the option "sendToTextChannel", and set it to "true" to always send the CAPTCHA to the Text Channel.
 * @prop {boolean} [sendToTextChannel=true] (OPTIONAL): Whether you want the CAPTCHA to be sent to a specified Text Channel instead of Direct Messages, regardless of whether the user's DMs are locked. Use the option "channelID" to specify the Text Channel.
 * @prop {boolean} [kickOnFailure=true] (OPTIONAL): Whether you want the Bot to Kick the User if the CAPTCHA is Failed.
 * @prop {boolean} [caseSensitive=true] (OPTIONAL): Whether you want the CAPTCHA to be case-sensitive.
 * @prop {number} [attempts=4] (OPTIONAL): The Number of Attempts Given to Solve the CAPTCHA.
 * @prop {number} [timeout=240000] (OPTIONAL): The Time in Milliseconds before the CAPTCHA expires and the User fails the CAPTCHA.
 * @prop {boolean} [showAttemptCount=true] (OPTIONAL): Whether you want to show the Attempt Count in the CAPTCHA Prompt. (Displayed in Embed Footer)
 * @prop {Discord.MessageEmbed} [customPromptEmbed=undefined] (OPTIONAL): Custom Discord Embed to be Shown for the CAPTCHA Prompt.
 * @prop {Discord.MessageEmbed} [customSuccessEmbed=undefined] (OPTIONAL): Custom Discord Embed to be Shown for the CAPTCHA Success Message.
 * @prop {Discord.MessageEmbed} [customFailureEmbed=undefined] (OPTIONAL): Custom Discord Embed to be Shown for the CAPTCHA Failure Message.
 * 
 */

const captchaOptions = {
    guildID: String,
    roleID: String,
    channelID: undefined,
    sendToTextChannel: true,
    kickOnFailure: true,
    caseSensitive: true,
    attempts: 4,
    timeout: 240000,
    showAttemptCount: true,
    customPromptEmbed: undefined,
    customSuccessEmbed: undefined,
    customFailureEmbed: undefined
}

class AhniCaptcha {

    /**
    * Creates a New Instance of the Captcha Class.
    * 
    * __Captcha Options__
    * 
    * - `guildID` - The ID of the Discord Server to Create a CAPTCHA for.
    * 
    * - `roleID` - The ID of the Discord Role to Give when the CAPTCHA is complete.
    * 
    * - `channelID` - The ID of the Discord Text Channel to Send the CAPTCHA to if the user's Direct Messages are locked.
    * 
    * - `sendToTextChannel` - Whether you want the CAPTCHA to be sent to a specified Text Channel instead of Direct Messages, regardless of whether the user's DMs are locked.
    * 
    * - `kickOnFailure` - Whether you want the Bot to Kick the User if the CAPTCHA is Failed.
    * 
    * - `caseSensitive` - Whether you want the the CAPTCHA to be case-sensitive.
    * 
    * - `attempts` - The Number of Attempts Given to Solve the CAPTCHA.
    * 
    * - `timeout` - The Time in Milliseconds before the CAPTCHA expires and the User fails the CAPTCHA.
    * 
    * - `showAttemptCount` - Whether you want to show the Attempt Count in the CAPTCHA Prompt. (Displayed in Embed Footer)
    * 
    * - `customPromptEmbed` - Custom Discord Embed to be Shown for the CAPTCHA Prompt.
    * 
    * - `customSuccessEmbed` - Custom Discord Embed to be Shown for the CAPTCHA Success Message.
    * 
    * - `customFailureEmbed` - Custom Discord Embed to be Shown for the CAPTCHA Failure Message.
    * 
    * @param {captchaOptions} options The Options for the Captcha.
    * @param {Discord.Client} client The Discord Client.
    * @param {captchaOptions} options
    * @example
    * const { Client, Intents } = require("discord.js");
    * const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES] });
    * 
    * const { Captcha } = require("ahnidev"); 
    * 
    * const captcha = new AhniCaptcha(client, {
    *     guildID: "Guild ID Here",
    *     roleID: "Role ID Here",
    *     channelID: "Text Channel ID Here", //optional
    *     sendToTextChannel: false, //optional, defaults to false
    *     kickOnFailure: true, //optional, defaults to true
    *     caseSensitive: true, //optional, defaults to true
    *     attempts: 3, //optional. number of attempts before captcha is considered to be failed
    *     timeout: 240000, //optional. time the user has to solve the captcha on each attempt in milliseconds
    *     showAttemptCount: true, //optional. whether to show the number of attempts left in embed footer
    *     customPromptEmbed: new MessageEmbed(), //custom embed for the captcha prompt
    *     customSuccessEmbed: new MessageEmbed(), //custom embed for success message
    *     customFailureEmbed: new MessageEmbed(), //custom embed for failure message
    * });
       */
    constructor(client, options = {}) {
        const structure = `
        new Captcha(Discord#Client, {
            guildID: "Guild ID Here",
            roleID: "Role ID Here",
        });
        
        (More options can be viewed on the README at https://npmjs.com/ahnidev)`

        if (!client) {
            console.log(`[ AhniDev Captcha ] Error: No Discord Client was Provided!\n\nFollow this Structure:\n${structure}'`);
            process.exit(1)
        }
        this.client = client;
        /**
        * Captcha Options
        * @type {captchaOptions}
        */
        this.options = options;

        if ((options.sendToTextChannel == true) && (!options.channelID)) {
            console.log(`[ AhniDev Captcha ] Error: Option "sendToTextChannel" was set to true, but "channelID" was not Provided!\n\nFollow this Structure:\n${structure}\n'`);
            process.exit(1)
        }
        if (options.attempts < 1) {
            console.log(`[ AhniDev Captcha ] Error: Option "attempts" must be Greater than 0!`);
            process.exit(1)
        }
        if (options.timeout < 1) {
            console.log(`[ AhniDev Captcha ] Error: Option "timeout" must be Greater than 0!`);
            process.exit(1)
        }
        if (options.caseSensitive && (typeof options.caseSensitive !== "boolean")) {
            console.log(`[ AhniDev Captcha ] Error: Option "caseSensitive" must be of type boolean!`);
            process.exit(1)
        }
        if (options.customPromptEmbed && (typeof options.customPromptEmbed === "string")) {
            console.log(`[ AhniDev Captcha ] Error: Option "customPromptEmbed" is not an instance of MessageEmbed!`);
            process.exit(1)
        }
        if (options.customSuccessEmbed && (typeof options.customSuccessEmbed === "string")) {
            console.log(`[ AhniDev Captcha ] Error: Option "customSuccessEmbed" is not an instance of MessageEmbed!`);
            process.exit(1)
        }
        if (options.customFailureEmbed && (typeof options.customFailureEmbed === "string")) {
            console.log(`[ AhniDev Captcha ] Error: Option "customFailureEmbed" is not an instance of MessageEmbed!'`);
            process.exit(1)
        }

        options.attempts = options.attempts || 1;
        if (options.caseSensitive === undefined) options.caseSensitive = true;
        options.timeout = options.timeout || 240000;
        if (options.showAttemptCount === undefined) options.showAttemptCount = true;

        Object.assign(this.options, options);
    }

    async check(member, days, roleID, joinCount) {
        if (!member) return "No member argument passed in check function!";
        if (!days) return "No days argument passed in check function!";
        if (!joinCount) return "No joinCount count in Check Function!"
        if (!roleID) return "No unverifiedRoleID passed in check function!";
        let joined = [];
        await joined.push(member.id);
        if (member.user.createdTimestamp > Date.now() - (days * 86400000) && joined.length > joinCount) {
            if (roleID) {
                if (!member.guild.roles.cache.get(roleID)) return;
                await member.roles.add(roleID);

                return member.user + " has been assigned the verification role!";
            };
        };

        if (joined.length > joinCount) {
            joined.forEach(async memb => {
                let m = member.guild.members.cache.get(memb)
                await m.send("You have been kicked from " + member.guild.name + " for: Join Raid prevention")
                m.kick("Join Raid prevention");
            })
        }
        setTimeout(() => {
            joined = [];
            return joined.length;
        }, 6500)
    }
    /**
    * Presents the CAPTCHA to a Discord Server Member.
    * 
    * Note: The CAPTCHA will be sent in Direct Messages. (If the user has their DMs locked, it will be Sent in a specified Text Channel.)
    * @param {Discord.GuildMember} member The Discord Server Member to Present the CAPTCHA to.
    * @returns {Promise<Discord.Message>}
    * @example
    * const { AhniCaptcha } = require("ahnidev"); 
    * 
    * const captcha = new AhniCaptcha(client, {
    *     guildID: "Guild ID Here",
    *     roleID: "Role ID Here",
    *     channelID: "Text Channel ID Here", //optional
    *     sendToTextChannel: false, //optional, defaults to false
    *     kickOnFailure: true, //optional, defaults to true
    *     caseSensitive: true, //optional, defaults to true
    *     attempts: 3, //optional. number of attempts before captcha is considered to be failed
    *     timeout: 240000, //optional. time the user has to solve the captcha on each attempt in milliseconds
    *     showAttemptCount: true, //optional. whether to show the number of attempts left in embed footer
    *     customPromptEmbed: new MessageEmbed(), //custom embed for the captcha prompt
    *     customSuccessEmbed: new MessageEmbed(), //custom embed for success message
    *     customFailureEmbed: new MessageEmbed(), //custom embed for failure message
    * });
    * 
    * client.on("guildMemberAdd", async member => {
    *     captcha.present(member);
    * });
    */
    async present(member, channel, roleID) {
        if (!member) return console.log(`[ AhniDev Captcha ] Error: No Discord Member was Provided!\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
        const user = member.user
        const captcha = await createCaptcha(this.options.caseSensitive).catch(e => { return console.log(e) })
        let attemptsLeft = this.options.attempts || 1;
        let attemptsTaken = 1;
        let captchaResponses = [];

        let captchaIncorrect = new Discord.MessageEmbed()
            .setTitle("❌ You Failed to Complete the CAPTCHA!")
            .setDescription(`${member.user}, you failed to solve the CAPTCHA!\n\nCAPTCHA Text: **${captcha.text}**`)
            .setTimestamp()
            .setColor("RED")
            .setThumbnail(member.guild.iconURL())

        if (this.options.customFailureEmbed) captchaIncorrect = this.options.customFailureEmbed

        let captchaCorrect = new Discord.MessageEmbed()
            .setTitle("✅ CAPTCHA Solved!")
            .setDescription(`${member.user}, you completed the CAPTCHA successfully, and you have been given access to **${member.guild.name}**!`)
            .setTimestamp()
            .setColor("GREEN")
            .setThumbnail(member.guild.iconURL())

        if (this.options.customSuccessEmbed) captchaCorrect = this.options.customSuccessEmbed

        let captchaPrompt = new Discord.MessageEmbed()
            .setTitle(`Welcome to ${member.guild.name}!`)
            .addField("I'm Not a Robot", `${member.user}, to gain access to **${member.guild.name}**, please solve the CAPTCHA below!\n\nThis is done to protect the server from raids consisting of spam bots.`)
            .setColor("RANDOM")
            .setThumbnail(member.guild.iconURL())

        if (this.options.customPromptEmbed) captchaPrompt = this.options.customPromptEmbed
        if (this.options.showAttemptCount) captchaPrompt.setFooter({ text: this.options.attempts == 1 ? "You have one attempt to solve the CAPTCHA." : `Attempts Left: ${attemptsLeft}` })
        captchaPrompt.setImage('attachment://captcha.png')

        await handleChannelType(this.client, channel, user, member, this.options).then(async channel => {
            let captchaEmbed;
            try {
                if ((this.options.channelID) && this.options.sendToTextChannel == true) {
                    channel = (await this.client.guilds.fetch(this.options.guildID)).channels.resolve(this.options.channelID)
                } else {
                    channel = await user.createDM()
                }
                captchaEmbed = await channel.send({
                    embeds: [captchaPrompt],
                    files: [
                        { name: "captcha.png", attachment: captcha.image }
                    ]
                })
            } catch {
                if (this.options.channelID) {
                    if (member.guild.channels.cache.get(this.options.channelID).isText()) {
                        captchaEmbed = await channel.send({
                            content: `${member.user}`,
                            embeds: [captchaPrompt],
                            files: [
                                { name: "captcha.png", attachment: captcha.image }
                            ]
                        });
                    }
                    if (member.guild.channels.cache.get(this.options.channelID).type == "GUILD_CATEGORY") {
                        let chat = member.guild.channels.cache.find(gChannel => gChannel.name == "captcha_" + member.user.id);
                        if (chat) {
                            channel = member.guild.channels.cache.find(gChannel => gChannel.name == "captcha_" + member.user.id)
                        }
                        if (!chat) {
                            channel = await member.guild.channels.create("captcha_" + member.user.id, {
                                parent: this.options.channelID, type: "GUILD_TEXT", topic: `${member.user}'s Captcha challenge channel.`, permissionOverwrites: [
                                    {
                                        id: this.client.user.id,
                                        allow: [
                                            'VIEW_CHANNEL',
                                            'SEND_MESSAGES',
                                            "READ_MESSAGE_HISTORY",
                                            'EMBED_LINKS',
                                            'ATTACH_FILES',
                                            "MANAGE_CHANNELS",
                                            'MANAGE_MESSAGES',
                                        ]
                                    },
                                    {
                                        id: member.user.id,
                                        allow: [
                                            'VIEW_CHANNEL',
                                            'SEND_MESSAGES',
                                            "READ_MESSAGE_HISTORY"
                                        ],
                                    },
                                    {
                                        id: member.guild.id,
                                        deny: [
                                            'VIEW_CHANNEL',
                                            'SEND_MESSAGES',
                                            "READ_MESSAGE_HISTORY"
                                        ],
                                    }
                                ]
                            }).then(res => {
                                return res;
                            })
                        }
                        captchaEmbed = await channel.send({
                            content: `${member.user}`,
                            embeds: [captchaPrompt],
                            files: [
                                { name: "captcha.png", attachment: captcha.image }
                            ]
                        })
                    }
                } else {
                    return
                }
            }
            const captchaFilter = x => {
                return (x.author.id == member.user.id)
            }
            async function handleAttempt(captchaData) { //Handles CAPTCHA Responses and Checks
                await captchaEmbed.channel.awaitMessages({
                    filter: captchaFilter, max: 1, time: captchaData.options.timeout || 240000
                })
                    .then(async responses => {
                        if (!responses.size) { //If no response was given, CAPTCHA is fully cancelled here
                            //emit timeout event
                            captchaData.emit("timeout", {
                                member: member,
                                responses: captchaResponses,
                                attempts: attemptsTaken || 1,
                                captchaText: captcha.text,
                                captchaOptions: captchaData.options
                            })
                            await captchaEmbed.delete();
                            await channel.send({ embeds: [captchaIncorrect] })
                                .then(async msg => {
                                    await setTimeout(() => msg.delete(), 10000);
                                    await member.kick({ reason: "Failed to Pass CAPTCHA" })
                                });
                            if (channel.type == "GUILD_TEXT" && channel.name == "captcha_" + member.user.id) {
                                setTimeout(() => {
                                    channel.delete()
                                }, 15000)
                            }
                        }

                        //emit answer event
                        captchaData.emit("answer", {
                            member: member,
                            response: String(responses.first()),
                            attempts: attemptsTaken || 1,
                            captchaText: captcha.text,
                            captchaOptions: captchaData.options
                        })

                        let answer = String(responses.first()); //Converts the response message to a string
                        if (captchaData.options.caseSensitive !== true) answer = answer.toLowerCase(); //If the CAPTCHA is case sensitive, convert the response to lowercase
                        captchaResponses.push(answer); //Adds the answer to the array of answers
                        if (channel.type === "GUILD_TEXT") await responses.first().delete();
                        if (answer === captcha.text) { //If the answer is correct, this code will execute
                            //emit success event
                            captchaData.emit("success", {
                                member: member,
                                responses: captchaResponses,
                                attempts: attemptsTaken,
                                captchaText: captcha.text,
                                captchaOptions: captchaData.options
                            })
                            await member.roles.add(roleID)
                            if (channel.type === "GUILD_TEXT") await captchaEmbed.delete();
                            await channel.send({ embeds: [captchaCorrect] })
                                .then(async msg => {
                                    setTimeout(() => msg.delete(), 5400);
                                });
                            if (channel.type == "GUILD_TEXT" && channel.name == "captcha_" + member.user.id) {
                                setTimeout(() => {
                                    channel.delete()

                                }, 15000)
                            }
                            return;
                        } else { //If the answer is incorrect, this code will execute
                            if (attemptsLeft > 0) { //If there are attempts left
                                attemptsLeft--;
                                attemptsTaken++;
                                if (channel.type === "GUILD_TEXT" && captchaData.options.showAttemptCount) {
                                    await captchaEmbed.edit({
                                        embeds: [captchaPrompt.setFooter(`Attempts Left: ${attemptsLeft}`)],
                                        files: [
                                            { name: "captcha.png", attachment: captcha.image }
                                        ]
                                    })
                                } else if (channel.type !== "GUILD_TEXT") {
                                    await captchaEmbed.edit({
                                        embeds: [captchaData.options.showAttemptCount ? captchaPrompt.setFooter(`Attempts Left: ${attemptsLeft}`) : captchaPrompt],
                                        files: [
                                            { name: "captcha.png", attachment: captcha.image }
                                        ]
                                    })
                                }
                                return handleAttempt(captchaData);
                            }
                            //If there are no attempts left

                            //emit failure event
                            captchaData.emit("failure", {
                                member: member,
                                responses: captchaResponses,
                                attempts: attemptsTaken,
                                captchaText: captcha.text,
                                captchaOptions: captchaData.options
                            })

                            if (channel.type === "GUILD_TEXT") await captchaEmbed.delete();
                            await channel.send({ embeds: [captchaIncorrect] })
                                .then(async msg => {
                                    await member.kick("Failed to Pass CAPTCHA")
                                    setTimeout(() => msg.delete(), 5400);
                                });
                            if (channel.type == "GUILD_TEXT" && channel.name == "captcha_" + member.user.id) {
                                setTimeout(() => {
                                    channel.delete()

                                }, 15000)
                            }
                            return;
                        }
                    })
            }
            //emit prompt event
            this.emit("prompt", {
                member: member,
                captchaText: captcha.text,
                captchaOptions: this.options
            })
            handleAttempt(this);
        })

    }
}

module.exports.AhniCaptcha = AhniCaptcha;
