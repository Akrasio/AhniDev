# Ahni / API
*(Might be buggy still)*

## Installation
```bash
npm i ahnidev
```
# How to use
```js
const { AhniClient } = require('ahnidev');
const api = new AhniClient({ KEY: "Your-API-Key-Here" })

// NSFW Endpoints
api.nsfw("thighs").then(result => {
    console.log(result)
})

// Chat Endpoint
api.chat("MESSAGE%20CONTENT", "USERID").then(result => {
    console.log(result)
})
```
## Discord Bot lists Posting;
```js
const { AhniLists } = require('ahnidev');
const api = new AhniLists({})
// Post server count
// "topgg", "disforge", "boats", "bfd", "discords";
api.postCount("botId", {serverCount: 2, botList: "topgg", botListKey: "The-Api.Key"}).then(result => {
    console.log(result)
})
// Auto-Post server count
// Most lists have a waiting period (ratelimit); So please make sure you know to not bypass them with interval. (ie: Disforge has a 1/1h ratelimit)
api.autopostCount("botId", { serverCount: 2, botList: "disforge", botListKey: "The-Api.Key", interval: 60 }).then(result => {
    console.log(result)
})
```

## AutoUnmute + Mute system
> Mutes and unmutes.
```js
// index.js

const { Client } = require('discord.js');
const client = new Client({ intents: ["GUILDS", "GUILD_MEMBERS"]});// Not sure about guild_members..?
const { AhniClient } = require('ahnidev');
const Ahni = new AhniClient({ KEY: "Your-API-Key-Here", url:"https://kyra.tk" }) // URL Required if main domain changed.
client.Ahni = Ahni;

client.Ahni.connectToMongoDB("Your-mongoDB-URL-Here");
client.Ahni.timed(client)// auto unmutes

// event when someones unmuted
client.on("timedUnmute", (user, guild)=>{
    console.log(`${user.name} (${user.id}) was unmuted in ${guild.name} (${guild.id})`)
})
...
```
```js
// mute.js
        ...
    /** member { Discord.User }
      * time { Number }
      * reason { String }
      */
    client.Ahni.mute(member, time, reason)
        ...
```
```js
// unmute.js
        ...
     /** 
      * client { Discord.Client }
      * user { Discord.User }
      */
    client.Ahni.forced(client, user)
        ...
```

## Quote Command.js
> Quotes a message via a messageID from message channel or Message URL.
```js
        ...              ...                 ...
                // QuoteCommand.js
client.Ahni.quoteId(client, args[0], msg.channel).then(res => { 
// msg.channel (OR message.channel) is needed just the way it is unless you call the current channel differently.
const embed = new MessageEmbed()
    .setDescription(`\`\`\`${res.content}\`\`\``)
    .setTimestamp(res.createdAt)
    .setColor(res.author.accentColor || "WHITE")
    .setAuthor(res.author.username, res.author.avatarURL({ type: "png", dynamic: true, size: 4096 }), res.author.avatarURL({ type: "png", dynamic: true, size: 4096 }))
if (res.attachments && res.attachments.size > 0) {
    embed.setImage(res.attachments.first().url)
}
    console.log(res.content)
    msg.reply({ embeds: [embed] });
    });

...              ...                 ...
```
```js
// Captcha system / event
const { AhniCaptcha } = require("ahnidev");
client.on("guildMemberAdd", (member) => {
    
// =============================================================================
    //  for captcha setup / sending.
    // channelID can be either a category OR a GUILD_TEXT/text-channel ;)
    const role = member.guild.roles.cache.get("xxxxxxxxxxxxxxxxx");
    const channel = member.guild.channels.fetch("xxxxxxxxxxxxxxxxx");
    new AhniCaptcha(client, {channelID: channel.id, attempts: 3, caseSensitive: false}).present(member, role, channel);
// =============================================================================
    // For antiJoin raid checking: (WIP)
    new AhniCaptcha(client).check(member, days, roleId, joinCount);
    // member = user
    // days = amount of days user has been registered for
    // roleId = mute/unverified roleId
    // joinCount = max amount of new joins before kicking this amount of users that joined recently. (the time frame is 6500ms [6~ seconds])
// =============================================================================

});
```
# endpoints
--------------------------
### || NSFW  ||

- Just read [Docs](https://docs.ahni.dev) please...

### || SFW  ||
- chat

For an up to date list on endpoints visit [ahni.dev](https://docs.ahni.dev) | [ahni.dev](https://docs.ahni.dev)

For support join our [discord](https://discord.gg/invite/8SKspRB)
