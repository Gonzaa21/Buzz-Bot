const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('market')
		.setDescription('Create a search panel of market stocks')
		.addStringOption(option =>
			option
				.setName('ticker')
				.setDescription('Alphanumeric code that identifies shares')
				.setRequired(true)),
	async execute(interaction) {
		// Obtain the string value
		const ticker = interaction.options.getString('ticker').toUpperCase();

		try {
				// API
				const apiKey1 = process.env.ALPHAVANTAGE_API_KEY;
				const alphavantage = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey1}`); 
				const globalQuote = alphavantage.data['Global Quote'];
				
				// In case when dont find the ticker
				if (!globalQuote || Object.keys(globalQuote).length === 0) {
					await interaction.reply(`No data found for ticker: ${ticker}`);
					return;
				}

				// Company logo
				const apiKey2 = process.env.FINNHUB_API_KEY;
				const logoData = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey2}`);
				const companyLogo = logoData.data.logo || 'https://via.placeholder.com/150';

				// Extract relevant info
				const price = globalQuote['05. price'];
				const open = globalQuote['02. open'];
				const high = globalQuote['03. high'];
				const low = globalQuote['04. low'];
				const previousClose = globalQuote['08. previous close'];
				const changePercent = globalQuote['10. change percent'];
				const latestTradingDay = globalQuote['07. latest trading day'];

				// Embed request
				const request = new EmbedBuilder()
					.setColor('#2b2d31')
					.setAuthor({
						name: `${logoData.data.name} (${ticker})   | USD`, 
						iconURL: 'https://cdn.discordapp.com/attachments/867345989216108564/1310087947940528198/emoji.png?ex=67449abb&is=6743493b&hm=216ed90a1dc00ab4187e121f0ac0f06f1aa6579ad1a2a28de4b5b3630cbe6c74&'})
					.setThumbnail(companyLogo)
					.addFields(
						{name: 'Price', value: `$${price}ㅤ`, inline: true},
						{name: 'Open', value: `$${open}ㅤ`, inline: true},
						{name: 'Close', value: `$${previousClose}ㅤ`, inline: true},
						{name: 'High', value: `$${high}ㅤ`, inline: true},
						{name: 'Low', value: `$${low}ㅤ`, inline: true},
						{name: 'Change Percent', value: `${changePercent}ㅤ`, inline: true},
						{name: 'ㅤ', value: `> -# Latest trading day: ${latestTradingDay}`, inline: false}
					)
					.setFooter({ text: 'Buzz Bot ▴ Data from Alpha Vantage'})
					.setTimestamp(new Date())

					await interaction.reply({ embeds: [request] });

		} catch (err) {
			console.error(err);
			await interaction.followUp('There was an error obtaining data from the APIs.');
		}
	},
};