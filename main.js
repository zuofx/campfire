// INITIATIONS & CONSTANTS
const Discord  = require('discord.js');
const fs = require('fs')
const { Client, GatewayIntentBits, REST, Routes, quote } = require('discord.js');
const { request } = require('undici');
const { type } = require('os');
const { stringify } = require('querystring');

const wait = require('node:timers/promises').setTimeout;

allTokens = importTokens();
const TOKEN = allTokens.TOKEN;
const CLIENT_ID = allTokens.CLIENT_ID;
const GUILD_ID = allTokens.GUILD_ID;

console.log("\nProvided TOKEN: " + TOKEN);
console.log("Provided CLIENT_ID: " + CLIENT_ID);
console.log("Provided GUILD_ID: " + GUILD_ID + "\n");

const USER_DATA = openJson("./user_data/users.json");
const USERS = USER_DATA.DATA;

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
  ]
});

const rest = new REST({version: '10'}).setToken(TOKEN);

//Functions
function importTokens(name) {
    let rawJson = fs.readFileSync("config.json");
    return JSON.parse(rawJson);
}
function openJson(name) {
    let rawJson = fs.readFileSync(name);
    return JSON.parse(rawJson);
}
function updateUsers(newJson) {

    var writeJson = JSON.stringify(newJson);

    fs.writeFile("./user_data/users.json", writeJson, function(err, result) {
        if (err) console.log('error', err);
    });
};

client.once('ready', () => {

    console.log('###########################################')
    console.log('Campfire is online, the flame flickers defiantly under a dark sky.')
    console.log('Bot created by zuofx')
    console.log('http://github.com/zuofx')
    console.log('https://github.com/zuofx/campfire')
    console.log('###########################################')

})

async function main() {
    const commands = [
        {
            name:"test",
            description:"Diagnostic test command."
        },
        {
            name:"campfire",
            description:"General campfire command, refer to docs.",
            options: [
                {
                    name:"activity",
                    description:"Change bot activity.",
                    type: 3,
                    required: false,
                },
                {
                    name:"status",
                    description:"Change bot status.",
                    type: 3,
                    required: false,
                },
                {
                    name:"addprofile",
                    description:"Create your user profile.",
                    type: 3,
                    required: false,
                },
            ]
        },
    ]

    try {
        console.log("Started refreshing application (/) commands.")
        await rest.put(Routes.applicationCommands(CLIENT_ID), {body: commands});
    } catch (err) {
        console.log(err);
    }
}

client.on("interactionCreate", async interaction => {
    if (interaction.commandName === "test") {
        console.log("(Campfire) /test command has been run.");
        await interaction.reply("Hello!");
    };
    if (interaction.commandName === "campfire") {
        console.log("(Campfire) /addprofile command has been run.");
        await interaction.reply("Check console");
        

        let chosenOption = interaction.options.data[0].name;
        
        if (chosenOption === "activity") {
            let field = interaction.options.getString("activity");
            client.user.setActivity(field);
        }
        if (chosenOption === "status") {
            let field = interaction.options.getString("status");
            
            switch (field) {
                case "online":
                    client.user.setStatus('online');
                    break;
                case "idle":
                    client.user.setStatus('idle');
                    break;
                case "dnd":
                    client.user.setStatus('dnd');
                    break;
                case "invis":
                    client.user.setStatus('invisible');
                    break;
                case "invisible":
                    client.user.setStatus('invisible');
                    break;
                default:
                    interaction.editReply("Status provided is not valid.");
                    break;
            };
        }
        if (chosenOption === "addprofile") {
            console.log("(Campfire) /addprofile command has been run.");
            interaction.editReply("Hold on, trying to creating your profile...");
            await wait(1000);
    
            let existing = false;
            let runnerID = String(interaction.user.id);
    
            console.log(interaction.user.id);
            for (i = 0; i < USERS.length; i++) {
                console.log(USERS[i].ID)
                if (runnerID === USERS[i].ID) {
                    interaction.editReply("User already exists!");
                    existing = true;
                };
            };
            if (!existing) {
                USERS.push({"ID":runnerID});
                USER_DATA.DATA = USERS;
                updateUsers(USER_DATA);

                interaction.editReply("User creation success!");
            };
        }
    };
});

main();
client.login(TOKEN);