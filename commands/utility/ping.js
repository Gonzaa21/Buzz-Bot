const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the current ping'),
	async execute(interaction) {
		await interaction.deferReply();

		const reply = await interaction.fetchReply();
		const ping = reply.createdTimestamp - interaction.createdTimestamp;

		await interaction.editReply(`🏓 ${ping}ms | Pong!`);
	},
};