const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const token = process.env.token;
client.login(token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
    if (!message.guild) return;
  
    if (message.content === '/join') {
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            connection.play(ytdl('https://www.youtube.com/watch?v=ZlAU_w7-Xp8', { filter: 'audioonly' }));
            connection.play('http://asj.kro.kr/a.mp3');
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
});