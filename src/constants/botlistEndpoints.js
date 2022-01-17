let discords     =     "https://discords.com/bots/api",
    boats        =     "https://discord.boats/api/v2",
    topGG        =     "https://top.gg/api",
    disforge     =     "https://disforge.com/api",
    dbl          =     "https://discordbotlist.com/api/v1";
module.exports = {
    endpoints: [{
        boats: {
            bots: boats + "/bot/",
            users: boats + "/user/"
        },
        discords: {
            bots: discords + "/bot/",
            users: discords + "/user/"
        },
        topgg: {
            bots: topGG + "/bots/",
            users: topGG + "/users/"
        },
        dbl: {
            bots: dbl + "/bots/",
            users: dbl + "/users/"
        },
        disforge: {
            bots: disforge + "/botstats/",
            users: disforge + "/stats"
        },
    }]
}