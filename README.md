# Anticheat-Bot

Discord üzerinden Anticheat rolü ekleme/çıkarma yapabileceğiniz ve anticheat çağırabileceğiniz bir discord.js altyapısıdır.

## Özellikler

- Anticheat rolü ekleme/çıkarma
- Anticheat çağırma sistemi
- Kontrol odası entegrasyonu
- Log Sistemi

## Kurulum

1. Repoyu bilgisayarınıza klonlayın:
   ```
   git clone https://github.com/kullaniciadi/anticheat-bot.git
   ```

2. Proje dizinine gidin:
   ```
   cd anticheat-bot
   ```

3. Gerekli modülleri yükleyin:
   ```
   npm install
   ```

4. `config.js` dosyasını düzenleyin (aşağıdaki bölüme bakın)

5. Botu başlatın:
   ```
   node index.js
   ```

## config.js Dosyasını Yapılandırma

Botun doğru çalışabilmesi için proje dizinindeki `config.js` dosyasını düzenlemeniz gerekmektedir. Aşağıdaki örnekte gösterildiği gibi her alanı **kendi bilgilerinizle doldurun**:

```js
// discord.gg/actr & Nyssce
module.exports = {
  NysscexBotToken: '', // Botunuzun tokeni (https://discord.com/developers/applications üzerinden alınır)
  NysscexClientId: '', // Botunuzun Uygulama (Client) ID'si
  NysscexGuildD: '', // Botun çalışacağı sunucunun ID'si
  NysscexSetPermissions: [''], // Setup komutunu kullanabilecek kullanıcı ID'leri (birden fazla ID ekleyebilirsiniz)
  NysscexServerAcRole: '', // Sunucunuzdaki Anti-Cheat rolünün ID'si
  NysscexServerAcLRole: '', // Sunucunuzdaki Anti-Cheat Lider rolünün ID'si
  NysscexControlVCid: '', // Kontrol odası olarak kullanılacak sesli kanalın ID'si
  NysscexServerYTekipPerm: '', // Yetkili ekip rolünün ID'si
  NysscexLogChannelId: '' // Anti-Cheat çağrıldığında log mesajı gönderilecek kanalın ID'si
};
```

## Gereksinimler

- Node.js v16.9.0 veya daha yüksek
- Discord.js v14

## Destek

Yardım ve destek için [discord.gg/actr](https://discord.gg/actr) adresine gelebilirsiniz.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylı bilgi için `LICENSE` dosyasına bakınız.

MIT Lisansı ihlallerinde yasal haklarımızı saklı tutmaktayız ve gerekli yasal işlemleri başlatacağımızı bildiririz.
