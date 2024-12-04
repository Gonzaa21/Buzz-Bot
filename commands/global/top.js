const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const config = require('/Users/Usuario/Downloads/Buzz/config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Top 20 gainers, losers, and most actively traded tickers'),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            // API request
            const alphavantage = await axios.get(
                `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${config.ALPHAVANTAGE_API_KEY}`
            );

            const top = alphavantage.data['top_gainers'];
            const losers = alphavantage.data['top_losers'];
            const active = alphavantage.data['most_actively_traded'];

            const maxFieldsPerEmbed = 10; // Max fields per embed
            const maxEmbeds = 10; // Max embeds Discord allows
            const embeds = []; // Array to store embeds

            // Create header embeds
            const header1 = new EmbedBuilder()
                .setColor(0x000000)
                .setAuthor({
                    name: 'Buzz bot - Top Table',
                    iconURL: 'https://cdn.discordapp.com/attachments/867345989216108564/1313586808776560751/emoji.png?ex=6750ac8c&is=674f5b0c&hm=fa01570ce49f9eab2c51a285a908ae873dba904d188e8e236908e3c494d8df9a&',
                })
                .setDescription(
                    'The top gainers and losers tickers in market. \n> -# The information is updated at the end of each trading day.'
                )
                .setFooter({ text: 'Buzz Bot ▴ Data from Alpha Vantage' });

            const header2 = new EmbedBuilder()
                .setColor(0x000000)
                .setAuthor({
                    name: 'Buzz bot - Most Actively Traded',
                    iconURL: 'https://cdn.discordapp.com/attachments/867345989216108564/1313591434519248967/emoji.png?ex=6750b0db&is=674f5f5b&hm=41f99ac9159d18d878c8e8103cce74c93552d2a00d979f818fabc673da47404b&',
                })
                .setDescription(
                    'The top 4 most actively traded tickers in market. \n> -# The information is updated at the end of each trading day.'
                )
                .setFooter({ text: 'Buzz Bot ▴ Data from Alpha Vantage' });

            // Function to create embeds dynamically
            const createEmbeds = (data) => {
                const tempEmbeds = [];
                for (let i = 0; i < Math.ceil(data.length / maxFieldsPerEmbed); i++) {
                    if (tempEmbeds.length >= maxEmbeds) break; // Prevent exceeding the limit

                    const body = new EmbedBuilder()

                    // Add fields to the embed
                    data.slice(i * maxFieldsPerEmbed, (i + 1) * maxFieldsPerEmbed).forEach(coin => {
                        body.addFields({
                            name: `🏷️ ${coin.ticker.toUpperCase()}ㅤㅤ`,
                            value: `> 💵 Price: $${coin.price}\n > 📊 Change: ${coin.change_amount} (${coin.change_percentage})\n > 🔊 Volume: ${coin.volume}`,
                            inline: true,
                        });
                    });

                    // Add the embed to the temporary array
                    tempEmbeds.push(body);
                }
                return tempEmbeds;
            };

            // Add embeds in order
            embeds.push(header1); // Add header1
            embeds.push(...createEmbeds(top, 'Top Gainers', '#476641')); // Add top gainers
            embeds.push(...createEmbeds(losers, 'Top Losers', '#6b2b2b')); // Add top losers
            embeds.push(header2); // Add header2
            embeds.push(...createEmbeds(active, 'Most Actively Traded', '#2b2d31')); // Add most actively traded

            // Send embeds in a single message, ensuring we don't exceed 10
            if (embeds.length > 0) {
                await interaction.editReply({ embeds });
            } else {
                await interaction.editReply('No data available to display.');
            }
        } catch (err) {
            console.error(err);
            await interaction.editReply('There was an error obtaining data from the APIs.');
        }
    },
};
