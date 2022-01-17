---
description: Example of how to use AhniLists to post bot stats
---

# Use: AhniLists



```javascript
//                ...
const { AhniLists } = require('ahnidev');
const botAPI = new AhniLists();

client.on("ready", ()=>{

// Normal Posting
botAPI.autopostCount("botId", {
        serverCount: 2,
        botList: "topgg",
        botListKey: "The-Api.Key",
        }).then(result => {
        console.log(result)
        })
        
// AutoPosting
botAPI.autopostCount("botId", {
        serverCount: 2,
        botList: "topgg",
        botListKey: "The-Api.Key",
        interval: 60
        }).then(result => {
        console.log(result)
        })
})
//                ...
```

{% hint style="info" %}
You _can_ replace "topgg" with one of the following:

* [x] bfd
* [x] disforge
* [x] boats
* [x] discords
{% endhint %}

{% hint style="warning" %}
You must provide an API key for the chosen bot list where it says "The-Api.Key", as well as an actual Server count and bot id.
{% endhint %}
