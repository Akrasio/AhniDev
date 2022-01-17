---
description: Examples of how to use AhniCaptcha.
---

# Use: AhniCaptcha

```javascript
const role = member.guild.roles.cache.get("xxxxxxxxxxxxxxxxx");
const channel = member.guild.channels.fetch("xxxxxxxxxxxxxxxxx");

// Presenting a captcha to a newly joined member.
new AhniCaptcha(client, {channelID: channel.id, attempts: 3, caseSensitive: false})
.present(member, role, channel);

// Just for checking new accounts and how many joins in a set time;
new AhniCaptcha(client).check(member, days, roleId, joinCount);
```

{% hint style="warning" %}
This works when used in an event fired when guild members are added.

(ie: guildMemberAdd)
{% endhint %}
