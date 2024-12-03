const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('crypto')
		.setDescription('Create a settings panel of crypto'),
	async execute(interaction) {

		try {
			const updateEmbeds = async () => {
				// API
				const coinGecko = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
				const coinGeckoData = coinGecko.data;

				// Embed
				const header = new EmbedBuilder()
					.setColor('#2b2d31')
					.setAuthor({name:'Buzz Bot Cryptocurrencies Table', iconURL:'https://emoji.discadia.com/emojis/6c9d566f-9b69-469c-ae6d-6101c4ef2710.gif'})
					.setDescription('Top live crypto prices on the market using USD as a base currency.')
					.setFooter({ text: 'Buzz Bot ▴ Data from CoinGecko' })
					.setTimestamp(new Date());

				const embeds = [header];
				const maxFieldsPerEmbed = 21; // Max number fields per embed
				const maxEmbeds = 4; // Max number embeds

				// Loop
				for (let i = 0; i < Math.min(maxEmbeds, Math.ceil(coinGeckoData.length / maxFieldsPerEmbed)); i++) {
					
					// Embeds
					const body = new EmbedBuilder().setColor('#2b2d31');
					
					// Fields
					coinGeckoData.slice(i * maxFieldsPerEmbed, (i + 1) * maxFieldsPerEmbed).forEach(coin => {
						const price = coin.current_price % 1 === 0 ? coin.current_price : coin.current_price;
						body.addFields({ name: `🪙 ${coin.symbol.toUpperCase()}`, value: `🏷️ $ ${price}ㅤㅤㅤ`, inline: true });
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