const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Information of the bot'),
	async execute(interaction) {
        // EMBED
        const helpEmbed = new EmbedBuilder()
            .setColor('#EB2828')
            .setTitle('Buzz Bot Help Panel')
            .setURL('https://discord.js.org/')
            .setDescription('Buzz is your personal assistant for staying up to date with the financial market. Stay informed and never miss an opportunity with Buzz!')
            .addFields(
                {
                    name: 'COMMANDS',
                    value: "**├─** Buzz Commands `⚙️`\n```\n/help - Commands and information\n/ping - Latency of Buzz\n/invite - Invite bot link\n```\n**├─** Buzz Configuration `🛒`\n```\n/crypto - Cryptocurrency alert settings panel\n/currency - Currency alert settings panel\n/market - Company alert settings panel\n/raw-mat - Raw Material alert settings panel\n```\n**└─** Buzz Global Configuration `📰`\n```\n/news - Latest global news\n/trends - Latest relevant trend movements\n```"
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