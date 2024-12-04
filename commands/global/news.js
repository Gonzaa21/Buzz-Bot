const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

let articleIndex = 0;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('news')
		.setDescription('Latest global news')
		.addStringOption(option =>
			option
				.setName('keyword')
				.setDescription('a keyword to search the latest news')
				.setRequired(true)),
	async execute(interaction) {

		try {
			const keyword = interaction.options.getString('keyword');
			// API
			const apiKey = process.env.NEWS_API_KEY;
			const newsapi = await axios.get(`https://newsapi.org/v2/everything?q=${keyword}&apiKey=${apiKey}`);
			const articles = newsapi.data.articles;

			if (!articles || articles.length === 0) {
				await interaction.reply('No news found for the keyword.');
				return;
			}

			const article = articles[articleIndex];

			// Embed
			const news = new EmbedBuilder()
				.setColor('#2b2d31')
				.setAuthor({
					name: `${article.title}`,
					url: `${article.url || undefined}`,
					iconURL: 'https://cdn.discordapp.com/attachments/867345989216108564/1312636995566309456/emoji.png?ex=674d37f7&is=674be677&hm=0a6458dd72d6d0693817f0199b2dbb0ec50a22e5a13d38607089f0642954e8c0&'
				})
				.setDescription(`${article.description || article.content}`)
				.setImage(`${article.urlToImage}`)
				.setFooter({
					text: `${article.source.name}`
				})
				.setTimestamp(new Date(article.publishedAt))
	
			await interaction.reply({ embeds:[news] });

			articleIndex = (articleIndex + 1) % articles.length;

		} catch (err) {
			console.error(err);
			await interaction.followUp('There was an error obtaining data from the APIs.');
		}
	},
};