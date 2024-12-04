const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('currency')
		.setDescription('Create a settings panel of currency'),
	async execute(interaction) {

		try {
			const updateEmbeds = async () => {
				// API
				const apiKey = process.env.EXCHANGERATE_API_KEY;
				const exchangeRate = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/usd`);
				const rates = Object.entries(exchangeRate.data.conversion_rates);

				// Embed
				const header = new EmbedBuilder()
					.setColor('#2b2d31')
					.setTitle('`💵`  Currencies Table  `💰`')
					.setDescription('Top live currency prices on the market using USD as a base currency.')
					.setFooter({ text: 'Buzz Bot ▴ Data from Exchange Rate' })
					.setTimestamp(new Date());

				const embeds = [header];
				const maxFieldsPerEmbed = 21; // Max number fields per embed
				const maxEmbeds = 4; // Max number embeds

				// Loop
				for (let i = 0; i < Math.min(maxEmbeds, Math.ceil(rates.length / maxFieldsPerEmbed)); i++) {
					
					// Embeds
					const body = new EmbedBuilder().setColor('#2b2d31');
					
					// Fields
					rates.slice(i * maxFieldsPerEmbed, (i + 1) * maxFieldsPerEmbed).forEach(([currency, rate]) => {
						body.addFields({ name: `🪙 ${currency.toUpperCase()}`, value: `💵 $ ${rate}`, inline: true });
					});

					embeds.push(body); // Add embed to list
				}
				return embeds;
			};

			// Send initial message and fetch
			const initialEmbeds = await updateEmbeds();
			const message = await interaction.reply({ embeds: initialEmbeds, fetchReply: true });

			// Interval to update the embeds
			const interval = setInterval(async () => {
				try {
					const updatedEmbeds = await updateEmbeds();
					await message.edit({ embeds: updatedEmbeds });
				} catch (error) {
					console.error("Error updating embeds:", error.message);
					clearInterval(interval); // Stop updating if an error occurs
				}
			}, 30000);

			// Stop updating after 5 minutes
			setTimeout(() => clearInterval(interval), 5 * 60 * 1000);

		} catch (err) {
			console.error(err);
			await interaction.followUp('There was an error obtaining data from the APIs.');
		}
	},
};