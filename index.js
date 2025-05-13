// discord.gg/actr & Nyssce
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');
const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMembers,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.GuildVoiceStates
]});
let waitingList = [];
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
const filePath = path.join(commandsPath, file);
const command = require(filePath);
if ('data' in command && 'execute' in command) {
client.commands.set(command.data.name, command);
} else {
console.log(`[UYARI] ${filePath} dosyasında gerekli 'data' veya 'execute' özelliği eksik.`);}}
const cooldowns = new Map();
const requestCounts = new Map();
client.once('ready', () => {
console.log(`${client.user.tag} olarak giriş yapıldı!`);});
client.on('interactionCreate', async interaction => {
if (interaction.isCommand()) {
const command = client.commands.get(interaction.commandName);
if (!command) return;
try {
await command.execute(interaction);
} catch (error) {
console.error(error);
await interaction.reply({
content: 'Komut çalıştırılırken bir hata oluştu!',
ephemeral: true});}}
if (interaction.isButton()) {
if (interaction.customId === 'anticheat_action') {
const guild = interaction.guild;
if (!guild) {
console.error("Guild bulunamadı!");
return;}
const voiceChannel = guild.channels.cache.get(config.NysscexControlVCid);
if (!voiceChannel || voiceChannel.members.size === 0) {
await interaction.reply({
content: '**Şuanda Kontrol Bekleyen bir Oyuncu Bulunmamaktadır. Lütfen Sistemi Gereksiz Yere Kullanmayınız.**',
ephemeral: true});
return;}
waitingList = Array.from(voiceChannel.members.values()).map(member => ({
userId: member.id,
username: member.user.username}));
const now = Date.now();
const cooldownKey = `${interaction.guild.id}-${interaction.user.id}`;
if (cooldowns.has(cooldownKey)) {
const expirationTime = cooldowns.get(cooldownKey) + (2 * 60 * 1000);
if (now < expirationTime) {
const timeLeft = Math.ceil((expirationTime - now) / 1000);
return interaction.reply({
content: `*Tekrar Anticheat Çağırmak İçin* **${timeLeft}** *saniye bekleyin.*`,
ephemeral: true});}}
cooldowns.set(cooldownKey, now);
const role = guild.roles.cache.get(config.NysscexServerAcRole);
const lRole = guild.roles.cache.get(config.NysscexServerAcLRole);
const members = role ? role.members : new Map();
const lMembers = lRole ? lRole.members : new Map();
const logChannel = guild.channels.cache.get(config.NysscexLogChannelId);
const channel = guild.channels.cache.find(channel => channel.type === 0);
let inviteLink = 'Davet linki oluşturulamadı.';
if (channel) {
try {
const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
inviteLink = invite.url;
} catch (error) {
console.error('Davet linki oluşturma hatası:', error);}}
let thumbnailUrl = null;
let imageUrl = null;
try {
if (guild.iconURL()) {
thumbnailUrl = guild.iconURL({ size: 1024 });}
if (guild.bannerURL()) {
imageUrl = guild.bannerURL({ size: 2048 });}
} catch (error) {
console.error('Sunucu resmi alma hatası:', error);}
const requester = interaction.user;
const requesterId = requester.id;
const previousRequests = requestCounts.get(requesterId) || 0;
const totalRequests = previousRequests + 1;
requestCounts.set(requesterId, totalRequests);
const dmEmbed = new EmbedBuilder()
.setTitle('ACTR | Anticheat Systems')
.setDescription(`
**Merhaba**,  

**${guild.name}** *Sunucusunda <@${requesterId}> Tarafından Anticheat Talep Edildi. Sunucu Bilgileri Aşağıda Verilmiştir:* 

**Sunucu Davet Linki :** ${inviteLink}  
**Tarih Zaman :** <t:${Math.floor(Date.now() / 1000)}>  

**Talep Eden Kişi** : <@${requesterId}> | ${requester.username}  
**Şuana Kadarki Toplam Talepleri** : ${totalRequests}

**Hile Kontrol Odası** : https://discord.com/channels/${guild.id}/${config.NysscexControlVCid}

**Bekleyen Kontrol Sayısı** : **${waitingList.length}**
**Bekleyen Kişi Listesi** :
${waitingList.map(user => `<@${user.userId}> | ${user.username}`).join('\n')}`)
.setColor('#FF0000')
.setTimestamp();
if (thumbnailUrl) dmEmbed.setThumbnail(thumbnailUrl);
if (imageUrl) dmEmbed.setImage(imageUrl);
const allMembers = new Map([...members, ...lMembers]);
for (const [_, member] of allMembers) {
try {
await member.send({ embeds: [dmEmbed] });
} catch (error) {
console.error(`${member.user.tag} kullanıcısına DM gönderme hatası:`, error);}}
if (logChannel) {
try {
await logChannel.send({
content: `<@&${config.NysscexServerAcRole}> <@&${config.NysscexServerAcLRole}>`,
embeds: [dmEmbed]});
} catch (error) {
console.error('Log kanalına mesaj gönderme hatası:', error);}}
await interaction.reply({
content: '**Anticheat ekibine bildirim gönderildi!**',
ephemeral: true});}}});
client.login(config.NysscexBotToken);
