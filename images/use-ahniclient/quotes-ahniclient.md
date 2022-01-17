---
description: Other NON-image related features ("Quote system")
---

# Quotes: AhniClient

Example Quote command:

{% code title="quoteCommand.js" %}
```javascript
//       ...              ...                 ...
client.Ahni.quoteId(client, args[0], msg.channel).then(res => { 
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
//    ...              ...                 ...
```
{% endcode %}

{% hint style="warning" %}
`msg.channel`(OR `message.channel`) is needed just the way it is unless you call the current channel differently.
{% endhint %}

