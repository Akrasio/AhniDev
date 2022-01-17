---
description: How to use AhniClient once required and set
---

# Use: AhniClient



```javascript
const { AhniClient } = require('ahnidev');
const imgAPI = new AhniClient({ KEY: "Your-API-Key-Here" })

//                ...
imgAPI.nsfw("thighs").then(result => {
    console.log(result)
})
//                ...
```

{% hint style="info" %}
You can replace "thighs" with any type that is desired from the image API.
{% endhint %}

Available options:

{% code title="endpoints.json" %}
```json
["ass","assgif","athighs","bbw","bdsm","blow","boobs","feet","furfuta",
"furgif","futa","gifs","hboobs","hentai","hfeet","irlfemb","jackopose",
"kink","milk","pantsu","sex","slime","thighs","trap","yuri"]
```
{% endcode %}
