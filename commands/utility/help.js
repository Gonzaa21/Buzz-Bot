const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Information of the bot'),
	async execute(interaction) {
        // EMBED
        const helpEmbed = new EmbedBuilder()
            .setColor('#EB2828')
            .setAuthor({ name:'Buzz Bot Help Panel', iconURL: 'https://media.discordapp.net/attachments/867345989216108564/1308106566628544612/emoji.png?ex=673cbcac&is=673b6b2c&hm=626778071bffa5d199fc4ffdd6d97c3ca259f3483cdeb7d704d98de85d885647&=&format=webp&quality=lossless' })
            .setDescription('Buzz is your personal assistant for staying up to date with the financial market. Stay informed and never miss an opportunity with Buzz!')
            .addFields(
                {
                    name: 'COMMANDS',
                    value: "**├─** Buzz Commands `⚙️`\n\n</help:1281360591566671872> - `Commands and information`\n</ping:1280638409962160278> - `Latency of Buzz`\n</invite:> - `Invite bot link`\n\n**├─** Buzz Configuration `🛒`\n\n</crypto:1304153208805134468> - `Cryptocurrency alert settings panel`\n</currency:1307754132844581066> - `Currency alert settings panel`\n</market:1310129489778577478> - `Company alert settings panel`\n\n**└─** Buzz Global Configuration `📰`\n\n</news:> - `Latest global news`\n</trends:> - `Latest relevant trend movements`"
                }
            )
            .setFooter({
                text: 'Information about how to use Buzz Bot in Discord.',
                iconURL: 'https://i.ibb.co/SN4ZtZv/buzz.png'
            })

        // PANEL BUTTONS
        // Creating custom buttons...
        const buttonInvite = new ButtonBuilder()
            .setLabel('Invite Buzz')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.js.org/');
        
        const buttonWeb = new ButtonBuilder()
            .setLabel('Web Help Center')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.js.org/');

        // Add custom buttons to row
        const row = new ActionRowBuilder()
            .addComponents(buttonInvite, buttonWeb);
        
        await interaction.reply({
            embeds: [helpEmbed],
            components: [row]
        });
	},
};