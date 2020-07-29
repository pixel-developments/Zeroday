activities = [
    'with DiscordJS',
    'with Zuke#7080',
    'TikTok Videos',
    'YouTube Videos',
    'Beta v1.0'
]

module.exports = async client => {
    client.user.setActivity('coding...')
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities.length - 1) + 1);
        client.user.setActivity(activities[index])
    }, 600000);
}