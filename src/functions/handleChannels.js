const Discord = require("discord.js");

/**
 * 
 * @param {Discord.Client} client
 * @param {any} options
 * @param {Discord.User} user
 * @returns {Discord.DMChannel | Discord.TextChannel}
 */

module.exports = async function handleChannelType(client, options, user, chanOpt) {
    let channel;
    try {
        if (!options.channelID || chanOpt.sendToTextChannel == false) {
            channel = await user.createDM()
        }
    } catch (err) {
        channel = (await client.guilds.fetch(options.guildID)).channels.resolve(options.channelID);
    }
    return channel
}