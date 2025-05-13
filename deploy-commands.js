// discord.gg/actr & Nyssce
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
const filePath = path.join(commandsPath, file);
const command = require(filePath);
if ('data' in command && 'execute' in command) {
commands.push(command.data.toJSON());
} else {
console.log(`[UYARI] ${filePath} dosyasında gerekli 'data' veya 'execute' özelliği eksik.`);}}
const rest = new REST().setToken(config.NysscexBotToken);
(async () => {
try {
console.log(`${commands.length} adet komut yeniden yükleniyor.`);
const data = await rest.put(
Routes.applicationGuildCommands(config.NysscexClientId, config.NysscexGuildD),
{ body: commands });
console.log(`${data.length} adet komut başarıyla yüklendi.`);
} catch (error) {
console.error(error);}})();