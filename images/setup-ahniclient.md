---
description: How to use and require AhniClient for accessing the Image API.
---

# Setup: AhniClient



{% code title="index.js" %}
```javascript
const { AhniClient } = require('ahnidev');
const imgAPI = new AhniClient({ KEY: "Your-API-Key-Here" })
```
{% endcode %}

{% hint style="info" %}
replace "Your-API-Key-Here" with the API key given to you by [ahni.dev](https://ahni.dev)
{% endhint %}

