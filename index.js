console.clear();
console.debug(`Booting up…`);

const colors = require('colors')
const Discord = require('discord.js');
const { Client, Collection, Intents } = Discord;
const handler = require("./src/handlers/index");
const fs = require('fs');
const yaml = require('js-yaml')
const mongoose = require('mongoose')
const economy = require('discord-bot-eco')
    economy.setConfig({
        mongoURL: "mongodb+srv://luciddev:qp6lMNldrcxqmdBG@cluster0.rqo7p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        currency: "$",
        allowBankruptcy: false,
        limits: {
            defaultBankLimit: 100,
            enabled: true
        },
        shopEnabled: true,
        shop: [
            /*
                Item properties can be modified but the following below must be kept as they are used in the module!
                The entire item is returned when using it with functions, go crazy!
            */
            {
                itemName: "House",
                itemBuyPrice: 15000,
                itemSellPrice: 12000,
                itemBuyable: true,
                itemSellable: true
            }, {
                itemName: "Condo",
                itemBuyPrice: 5000,
                itemSellPrice: 2500,
                itemBuyable: true,
                itemSellable: true
            }
        ]
    });


const client = new Client({
    intents: ['65527'],
});


client.commands = new Collection();
client.slash    = new Collection();
client.config   = yaml.load(fs.readFileSync(`${process.cwd()}/config.yml`, ('utf8')))
client.cwd      = require('process').cwd(); 
client.eco = economy

module.exports = client;

mongoose.connect(client.config.discord.mongoDBLink, {
    useNewURLParser: true,
    useUnifiedTopology: true,
    keepAlive: true
}).then(() => {
    console.log(`[Database] `.cyan + 'Connection was created')
}).catch((err) => {
    console.log(`[Database] `.red + err)
})


process.on("uncaughtException", (err) => {
    console.error('Uncaught Exception:', err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("[FATAL] Possibly Unhandled Rejection at: Promise", promise, "\nreason:", reason.message);
});


handler.loadEvents(client);
handler.loadSlashCommands(client);


client.login(client.config.discord.botToken).catch(err =>  {
    console.log(`[StartUp Error] `.red + `An invalid Bot Token Was Provided, Please Fix This In The Config.yml`.italic);
})

