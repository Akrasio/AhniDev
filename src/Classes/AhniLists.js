const botlistEndpoints = require('../constants/botlistEndpoints');
const fetch = require('node-fetch');
class AhniLists {
    constructor(options = {}) {
        this.options = options
    };
    /**
     * @param {String} botId Discord Bot ID
     * @param {Number} serverCount Server count to post
     * @param {String} botList Name of the botlist to post to
     * @param {String} botlistKey API Key for the given botlist
     * @returns {String} rl  of image
     */
    async postCount(botId, { serverCount, botList, botlistKey }) {
        if (!botId) throw new Error("[AhniDev]: No botId provided!");
        if (!botList) throw new Error("[AhniDev]: No botList provided!");
        if (!serverCount) throw new Error("[AhniDev]: No serverCount provided!");
        let url;
        let list = botList.toLowerCase().match(/(?:topgg|boats|discords|dbl|disforge)/g);
        if (!list) return "[AhniDev]: (botList) Please provide one of: topgg, boats, discords, dbl, disforge";
        await botlistEndpoints.endpoints.forEach(async blist => {
            if (!blist[list]) return "f";
            if (botList.match(/(?:topgg|dbl)/)) return url = `${blist[list].bots}${botId}/stats`
            if (!botList.match(/(?:topgg|dbl)/)) return url = `${blist[list].bots}${botId}`
        })
        let data = JSON.stringify({
            server_count: serverCount,
            servers: serverCount,
            guilds: serverCount
        })
        console.log(url)
        return fetch(url, {
            method: 'post',
            headers: {
                "authorization": botlistKey,
                "Content-Type": 'application/json',
            },
            body: data

        })
            .then(res => res.json())
            .then(json => {
                if (json == undefined) throw Error(`[AhniDev]: An Unknown Error Occurred!`)
                return json;
            })

    };

    /**
     * @param {String} botId Discord Bot ID
     * @param {Number} serverCount Server count to post
     * @param {String} botList Name of the botlist to post to
     * @param {String} botlistKey API Key for the given botlist
     * @param {Number} interval Interval between posts to botlists
     */
    async autopostCount(botId, { serverCount, botList, botlistKey, interval }) {
        if (!botId) throw new Error("[AhniDev]: No botId provided!");
        if (!botList) throw new Error("[AhniDev]: No botList provided!");
        if (!serverCount) throw new Error("[AhniDev]: No serverCount provided!");
        if (!interval) interval = 60;
        let url;
        let list = botList.toLowerCase().match(/(?:topgg|boats|discords|dbl|disforge)/g);
        if (!list) return "[AhniDev]: (botList) Please provide one of: topgg, boats, discords, dbl, disforge";
        setInterval(async () => {
            await botlistEndpoints.endpoints.forEach(async blist => {
                if (!blist[list]) return "f";
                if (botList.match(/(?:topgg|dbl)/)) return url = `${blist[list].bots}${botId}/stats`
                if (!botList.match(/(?:topgg|dbl)/)) return url = `${blist[list].bots}${botId}`
            })
            let data = JSON.stringify({
                server_count: serverCount,
                servers: serverCount,
                guilds: serverCount
            })
            console.log(url)
            return fetch(url, {
                method: 'post',
                headers: {
                    "authorization": botlistKey,
                    "Content-Type": 'application/json',
                },
                body: data

            })
                .then(res => res.json())
                .then(json => {
                    if (json == undefined) throw Error(`[AhniDev]: An Unknown Error Occurred!`)
                    return json;
                })
        }, interval * 60000)
    };
}
module.exports = AhniLists;