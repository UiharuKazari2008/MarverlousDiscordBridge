const config = require("./config.json")
const Eris = require('eris');
const requests = request = require('request').defaults({ encoding: null });
const iconv = require('iconv-lite');
const bot = new Eris.Client(config.token);

const channelsToMonitor = config.channels
bot.on('ready', () => {
    console.log('Bot is ready!');
});

bot.on('messageCreate', async (msg) => {
    // Check if the message is from a channel to monitor
    if (channelsToMonitor.includes(msg.channel.id)) {
        const memberNickname = (msg.member.nick) ? msg.member.nick : msg.author.username;
        const asciiServerName = iconv.encode(msg.member.guild.name, 'ascii', { ignore: '?' });
        const truncatedServer = asciiServerName.length > 14 ? asciiServerName.slice(0, 11).toString() + '...' : asciiServerName.toString();
        const asciiContent = iconv.encode(msg.content, 'ascii', { ignore: '?' });
        const asciiMemberNickname = iconv.encode(memberNickname, 'ascii', { ignore: '?' });
        const truncatedNickname = asciiMemberNickname.length > 150 ? asciiMemberNickname.slice(0, 150).toString() + '...' : asciiMemberNickname.toString();
        const truncatedContent = asciiContent.length > 150 ? asciiContent.slice(0, 150).toString() + '...' : asciiContent.toString();

        try {
            requests.get(`http://${config.display}/addMessage?header=${encodeURIComponent(truncatedServer)}&status=${encodeURIComponent(truncatedNickname + ': ' + truncatedContent)}`, async (err, res) => {
                if (err || res && res.statusCode !== undefined && res.statusCode !== 200) {
                    console.error(`Failed to send message to display`);
                } else {
                    console.log(`Message from ${memberNickname} was sent to display memory`)
                }
            })
        } catch (error) {
            console.error('Failed to relay message to API:', error);
        }
    }
});

bot.on('voiceChannelJoin', async (member, newChannel) => {
    // Relay the voice channel join event to the local REST API
    try {
        const memberNickname = member.nick || member.username;
        const asciiServerName = iconv.encode(member.guild.name, 'ascii', { ignore: '?' });
        const truncatedServer = asciiServerName.length > 14 ? asciiServerName.slice(0, 11).toString() + '...' : asciiServerName.toString();
        const asciiMemberNickname = iconv.encode(memberNickname, 'ascii', { ignore: '?' });
        const truncatedNickname = asciiMemberNickname.length > 150 ? asciiMemberNickname.slice(0, 150).toString() + '...' : asciiMemberNickname.toString();

        try {
            requests.get(`http://${config.display}/addMessage?header=${encodeURIComponent(truncatedServer)}&status=${encodeURIComponent("Joined Voice: " + truncatedNickname)}`, async (err, res) => {
                if (err || res && res.statusCode !== undefined && res.statusCode !== 200) {
                    console.error(`Failed to send message to display`);
                } else {
                    console.log(`Join Channel from ${memberNickname} was sent to display memory`)
                }
            })
        } catch (error) {
            console.error('Failed to relay message to API:', error);
        }
    } catch (error) {
        console.error('Failed to relay voice channel join event to API:', error);
    }
});

bot.connect();
