const discord = require('discord.js');
const ytdl = require('ytdl-core');
const axios = require('axios');
const client = new discord.Client();
const token = process.env.token;
client.login(token);

const music_list = [
    'WHISTLE$dISNgvVpWlo',
    'BOOMBAYAH$bwmSjveL3Lc',
    'PLAYING WITH FIRE$9pdj4iJD08s',
    'STAY$FzVR_fymZw4',
    'Whistle (Acoustic Version)$9iHn_roIApY',
    'AS IF IT\'S YOUR LAST$Amq-qlqbjYA',
    'DDU-DU DDU-DU$IHNzOHi8sJs',
    'Forever Young$-gibBYpzZbI',
    'Really$He322O1JWgU',
    'See U Later$fpimnj4SNjQ',
    'Kill This Love$2S24-y0Ij3Y',
    'Don\'t Know What To Do$bqzDuRz_P7g',
    'Kick It$-gZC9hC1PDQ',
    'Hope Not$l6zMnMMzsss',
    'DDU-DU DDU-DU (Remix)$u3Y0U1VuJeM',
    'Sour Candy$fnPn6At3v28',
    'How You Like That$ioNng23DkIM',
    'Ice Cream$vRXZj0DzXIA',
    'Pretty Savage$F8c8f2nK82w',
    'Bet You Wanna$gXBdvSj9F2I',
    'Lovesick Girls$dyRsYk0LyA8',
    'Crazy Over You$u7rKGj13pAs',
    'Love To Hate Me$wlzGXcTzdzU',
    'You Never Know$4Kk_iaaHd_Y',
    'SOLO$b73BI9eUkjM'
];
const music_list1 = music_list.slice();

client.on('ready', async () => {
    client.user.setActivity('Help', { type: 'LISTENING' });
});

client.on('message', async message => {
    if (message.content.startsWith('Play') || message.content === 'Skip') {
        if (message.member.voice.channel) {
            channel = message.member.voice.channel;
            let connection = await channel.join();
            await message.guild.me.voice.setSelfDeaf(true);
            message.react('👌');
            if (message.content === 'Play' || message.content === 'Skip') {
                const shuffle = (Array) => {
                    let length = Array.length;
                    while (length) {
                        let index = Math.floor((length--) * Math.random());
                        let temp = Array[length];
                        Array[length] = Array[index];
                        Array[index] = temp;
                    }
                    return Array;
                };
                let _music_list = shuffle(music_list1);
                async function music() {
                    _music_list.push(_music_list.shift());
                    let music_url = 'https://www.youtube.com/watch?v=' + _music_list[0].split('$')[1];
                    let info_json = (await axios.get('https://www.youtube.com/oembed?url=' + music_url)).data;
                    let embed = new discord.MessageEmbed()
                        .setColor('#ff55ff')
                        .setTitle('Now playing')
                        .setDescription('[' + info_json['title'] + '](' + music_url + ')')
                        .setThumbnail(info_json['thumbnail_url']);
                    message.channel.send(embed);
                    dispatcher = connection.play(ytdl(music_url), { filter: 'audioonly' });
                    dispatcher.on('finish', () => {
                        music();
                    });
                }
                let _music_list1 = _music_list.slice();
                _music_list1.push(_music_list1.shift());
                let embed = new discord.MessageEmbed()
                    .setColor('#000000')
                    .setTitle('Music List')
                    .setDescription('\u200b');
                for (let i in _music_list1) {
                    embed.addField(Number(i) + 1 + ': `' + _music_list1[i].split('$')[0] + '`', '\u200b', true);
                }
                message.channel.send(embed);
                music();
            } else {
                try {
                    if (String(Number(message.content.slice(5))).includes(NaN)) {
                        let music_url = 'https://www.youtube.com/watch?v=' + music_list.find(v => v.includes(message.content.slice(5))).split('$')[1];
                        let info_json = (await axios.get('https://www.youtube.com/oembed?url=' + music_url)).data;
                        let embed = new discord.MessageEmbed()
                            .setColor('#000000')
                            .setTitle('Now playing')
                            .setDescription('[' + info_json['title'] + '](' + music_url + ')')
                            .setThumbnail(info_json['thumbnail_url']);
                        message.channel.send(embed);
                        dispatcher = connection.play(ytdl(music_url), { filter: 'audioonly' });
                        dispatcher.on('finish', () => {
                            channel.leave();
                        });
                    } else if (music_list[Number(message.content.slice(5)) - 1] !== undefined) {
                        let music_url = 'https://www.youtube.com/watch?v=' + music_list[Number(message.content.slice(5)) - 1].split('$')[1];
                        let info_json = (await axios.get('https://www.youtube.com/oembed?url=' + music_url)).data;
                        let embed = new discord.MessageEmbed()
                            .setColor('#000000')
                            .setTitle('Now playing')
                            .setDescription('[' + info_json['title'] + '](' + music_url + ')')
                            .setThumbnail(info_json['thumbnail_url']);
                        message.channel.send(embed);
                        dispatcher = connection.play(ytdl(music_url), { filter: 'audioonly' });
                        dispatcher.on('finish', () => {
                            channel.leave();
                        });
                    } else {
                        throw Error();
                    }
                } catch(_) {
                    message.reply('Music is not on the list!');
                    let embed = new discord.MessageEmbed()
                        .setColor('#ff55ff')
                        .setTitle('Music List')
                        .setDescription('\u200b');
                    for (let i in music_list) {
                        embed.addField(Number(i) + 1 + ': `' + music_list[i].split('$')[0] + '`', '\u200b', true);
                    }
                    message.channel.send(embed);
                }
            }
        } else {
            message.react('👎');
            message.reply('You need to join a voice channel first!');
        }
    }
    if (message.content === 'Pause' && dispatcher !== null) {
        dispatcher.pause();
        message.react('👌');
    } else if (message.content === 'Resume' && dispatcher !== null) {
        dispatcher.resume();
        message.react('👌');
    } else if (message.content === 'Finish' && dispatcher !== null) {
        dispatcher.destroy();
        dispatcher = null;
        message.react('👌');
    }
    if (message.content === 'Leave' && channel !== null) {
        channel.leave();
        channel = null;
        dispatcher = null;
        message.react('👋');
    }
    if (message.content === 'Help') {
        let embed = new discord.MessageEmbed()
            .setColor('#ff55ff')
            .setTitle('Commands')
            .addFields(
                { name: '`Play`', value: '-Play the music', inline: false },
                { name: '`Skip`', value: '-Skip the music', inline: false },
                { name: '`Pause`', value: '-Pause the music', inline: false },
                { name: '`Resume`', value: '-Resume the music', inline: false },
                { name: '`Finish`', value: '-Finish the music', inline: false },
                { name: '`Leave`', value: '-Turn off the music', inline: false },
                { name: '`List`', value: '-Send the music list', inline: false }
            );
        message.channel.send(embed);
    }
    if (message.content === 'List') {
        let embed = new discord.MessageEmbed()
            .setColor('#ff55ff')
            .setTitle('Music List')
            .setDescription('\u200b');
        for (let i in music_list) {
            embed.addField(Number(i) + 1 + ': `' + music_list[i].split('$')[0] + '`', '\u200b', true);
        }
        message.channel.send(embed);
    }
});
