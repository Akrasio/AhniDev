---
description: How to install and require the NPM package;
---

# Installation

{% code title="index.js" %}
```javascript
const { AhniClient, AhniLists, AhniCaptcha } = require('ahnidev');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]});
// ------------------------------------------------------
const imgAPI = new AhniClient();
// ------------------------------------------------------
const botAPI = new AhniLists();
// ------------------------------------------------------
const captAPI = new AhniCaptcha();
// ------------------------------------------------------
client.login("DISCORD_BOT_TOKEN");
```
{% endcode %}

{% hint style="info" %}
Install the package with:

&#x20;`npm install ahnidev`&#x20;
{% endhint %}

