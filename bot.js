const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// Remplacez 'YOUR_BOT_TOKEN' par votre propre jeton de bot Telegram
const bot = new TelegramBot('7038981201:AAHmbzgSCypqPMKVyvId2KFRu9bWaV3ZFkM', { polling: true });

// Fonction pour générer une séquence aléatoire
function generate_sequence() {
    const sequence = ["🟠", "🟠", "🟠", "🟠", "🍎"];
    for (let i = sequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sequence[i], sequence[j]] = [sequence[j], sequence[i]]; // Échanger les éléments
    }
    return sequence.join(" ");
}

// Modèle de séquence
const sequenceTemplate = `
🔔 ENTRÉE CONFIRMÉE !
🍎 Pomme : 4
🔐 Tentatives : 3
⏰ Validité : 5 minutes
`;

// Fonction pour envoyer une séquence au canal
function sendSequenceToChannel(chatId) {
    const sequenceMessage = `
${sequenceTemplate}
2.41:${generate_sequence()}
1.93:${generate_sequence()}
1.54:${generate_sequence()}
1.23:${generate_sequence()}

🚨 Les signaux fonctionnent uniquement sur LINEBET avec le code promo Free221 ! Ne manquez pas cette opportunité ! ✅️ `;
    
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Signal suivant ✅️', callback_data: 'next_signal' }]
            ]
        }
    };

    bot.sendMessage(chatId, sequenceMessage, options);
}

// Commande de démarrage du bot
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const languageMessage = "Chose your language :";
    
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Français', callback_data: 'fr' }],
                [{ text: 'English', callback_data: 'en' }],
                [{ text: 'العربية', callback_data: 'ar' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, languageMessage, options);
});

// Gestion des réponses aux requêtes de callback
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    if (data === 'fr') {
        const video_fr = 'https://t.me/gsgzheh/3';
        const welcomeText_fr = "Bonjour! Avant d'utiliser ce bot, veuillez créer un compte authentique sinon vous risquez de perdre beaucoup. Veuillez regarder la vidéo ci-dessous pour en savoir plus, puis cliquez sur suivant✅️ pour continuer :";
        bot.sendMessage(chatId, welcomeText_fr)
            .then(() => {
                bot.sendVideo(chatId, video_fr, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Suivant ✅️', callback_data: 'fr_next' }]
                        ]
                    }
                });
            });
    } else if (data === 'en') {
        const video_en = 'https://t.me/gsgzheh/3';
        const welcomeText_en = "Welcome! Before using this bot, please create an authentic account otherwise you will lose a lot. Please watch the video below to learn more, then click on NEXT✅️ to continue :";
        bot.sendMessage(chatId, welcomeText_en)
            .then(() => {
                bot.sendVideo(chatId, video_en, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'NEXT ✅️', callback_data: 'en_next' }]
                        ]
                    }
                });
            });
    } else if (data === 'ar') {
        const video_ar = 'https://t.me/gsgzheh/3';
        const welcomeText_ar = "مرحبًا! قبل استخدام هذا الروبوت، يرجى إنشاء حساب أصيل آخر خسارة. يرجى مشاهدة الفيديو أدناه لمعرفة المزيد، ثم انقر على التالي✅️ للمتابعة :";
        bot.sendMessage(chatId, welcomeText_ar)
            .then(() => {
                bot.sendVideo(chatId, video_ar, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'للمتابعة✅️', callback_data: 'ar_next' }]
                        ]
                    }
                });
            });
    } else if (data === 'fr_next' || data === 'en_next' || data === 'ar_next') {
        bot.sendMessage(chatId, "Veillez entrer votre ID Linebet pour synchroniser votre compte.")
            .then(() => {
                bot.once('text', (msg) => {
                    const userId = msg.text.trim();
                    const acceptedIds = [859937999, 999999999];
                    if (acceptedIds.includes(parseInt(userId, 10))) {
                        sendSequenceToChannel(chatId);
                    } else {
                        const lang = getUserLanguage(chatId);
                        const message = lang === 'fr' ? 'ID refusé ❌. Veuillez créer un nouveau compte avec le code promo Free441 et réessayez.'
                                      : lang === 'en' ? 'ID refused ❌. Please create a new account with promo code Free441 and try again.'
                                      : 'الهوية مرفوضة ❌. الرجاء إنشاء حساب جديد بالرمز الترويجي Free441 والمحاولة مرة أخرى.';
                        bot.sendMessage(chatId, message);
                    }
                });
            });
    } else if (data === 'next_signal') {
        sendSequenceToChannel(chatId);
    } else {
        console.error('Callback Data non prise en charge :', data);
    }
});

// Validation de l'ID et génération de signal
bot.onText(/^[0-9]{9}$/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.text;

    if (userId >= 859937999 && userId <= 999999999) {
        sendSequenceToChannel(chatId);
    } else {
        const lang = getUserLanguage(chatId);
        const message = lang === 'fr' ? 'ID refusé ❌. Veuillez créer un nouveau compte avec le code promo Free221 et réessayez.'
                      : lang === 'en' ? 'ID refused ❌. Please create a new account with promo code Free221 and try again.'
                      : 'الهوية مرفوضة ❌. الرجاء إنشاء حساب جديد بالرمز الترويجي Free221 والمحاولة مرة أخرى.';
        bot.sendMessage(chatId, message);
    }
});

// Fonction pour obtenir la langue de l'utilisateur (factice pour l'exemple)
function getUserLanguage(chatId) {
    // Vous devez implémenter la logique pour récupérer la langue de l'utilisateur, par exemple à partir d'une base de données.
    // Pour l'exemple, nous utilisons une fonction factice qui renvoie 'en' par défaut.
    return 'en';
}

// Serveur HTTP pour garder le bot en ligne
http.createServer(function (req, res) {
    res.write("Je suis en ligne");
    res.end();
}).listen(8080);
