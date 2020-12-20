const discord = require('discord.js');
const client = new discord.Client();
const ytdl = require('ytdl-core');
const axios = require('axios');
const token = process.env.token;
client.login(token);

Array.prototype.shuffle = function () {
    let length = this.length;
    while (length) {
        let index = Math.floor((length--) * Math.random());
        let temp = this[length];
        this[length] = this[index];
        this[index] = temp;
    }
    return this;
}

const music_list = [
    'dISNgvVpWlo',
    'bwmSjveL3Lc',
    '9pdj4iJD08s',
    'FzVR_fymZw4',
    '9iHn_roIApY',
    'Amq-qlqbjYA',
    'IHNzOHi8sJs',
    '-gibBYpzZbI',
    'He322O1JWgU',
    'fpimnj4SNjQ',
    '2S24-y0Ij3Y',
    'bqzDuRz_P7g',
    '-gZC9hC1PDQ',
    'l6zMnMMzsss',
    'u3Y0U1VuJeM',
    'fnPn6At3v28',
    'ioNng23DkIM',
    'vRXZj0DzXIA',
    'F8c8f2nK82w',
    'gXBdvSj9F2I',
    'dyRsYk0LyA8',
    'u7rKGj13pAs',
    'wlzGXcTzdzU',
    '4Kk_iaaHd_Y',
    'b73BI9eUkjM'
];


client.on('ready', async () => {
    client.user.setActivity('Help', { type: 'LISTENING' });
});

client.on('message', async message => {
    if (message.content === 'Play' || message.content === 'Skip') {
        if (message.member.voice.channel) {
            let connection = await message.member.voice.channel.join();
            await message.guild.me.voice.setSelfDeaf(true);
            message.react('👌');
            let _music_list = music_list.shuffle();
            async function music() {
                _music_list.push(_music_list.shift());
                let music_url = 'https://www.youtube.com/watch?v=' + _music_list[0];
                let info_json = (await axios.get('https://www.youtube.com/oembed?url=' + music_url)).data;
                let embed = new discord.MessageEmbed()
                    .setColor('#ff55ff')
                    .setTitle('Now playing')
                    .setDescription('[' + info_json['title'] + '](' + music_url + ')')
                    .setThumbnail(info_json['thumbnail_url']);
                message.channel.send(embed);
                let dispatcher = connection.play(ytdl(music_url), { filter: 'audioonly' });
                dispatcher.on('finish', () => {
                    music();
                });
            }
            music();
        } else {
            message.reply('You need to join a voice channel first!');
        }
    } else if (message.content === 'Leave') {
        message.member.voice.channel.leave();
        message.react('👌');
    }
    if (message.content === 'Help') {
        let embed = new discord.MessageEmbed()
            .setColor('#ff55ff')
            .setTitle('Commands')
            .addFields(
                { name: '`Play`', value: 'Play the song', inline: false },
                { name: '`Skip`', value: 'Skip the song', inline: false },
                { name: '`Leave`', value: 'Turn off the song', inline: false }
            );
        message.channel.send(embed);
    }
});
