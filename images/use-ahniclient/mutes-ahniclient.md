---
description: Other NON-image related features ("Mute System")
---

# Mutes: AhniClient



{% code title="index.js" %}
```javascript
const { Client } = require('discord.js');
const client = new Client({ intents: ["GUILDS", "GUILD_MEMBERS"]});// Not sure about guild_members..?
const { AhniClient } = require('ahnidev');
const Ahni = new AhniClient({ KEY: "Your-API-Key-Here" })
client.Ahni = Ahni;

client.Ahni.connectToMongoDB("Your-mongoDB-URL-Here");
client.Ahni.timed(client)// auto unmutes

// event when someones unmuted
client.on("timedUnmute", (user, guild)=>{
    console.log(`${user.name} (${user.id}) was unmuted in ${guild.name} (${guild.id})`)
})
///            ...    ...    ...
```
{% endcode %}

{% code title="mute.js" %}
```javascript
//            ...    ...    ...
client.Ahni.mute(member, time, reason)
//            ...    ...    ...
```
{% endcode %}

{% code title="unmute.js" %}
```javascript
//            ...    ...    ...
client.Ahni.forced(client, user)
//            ...    ...    ...
```
{% endcode %}
