const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Buzzbot invitation link'),
	async execute(interaction) {
        const link = '||https://discord.com/oauth2/authorize?client_id=1279431370531405855||'

		await interaction.reply(link);
	},
};