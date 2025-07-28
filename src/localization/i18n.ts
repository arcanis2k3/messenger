import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Set the key-value pairs for the different languages you want to support.
const translations = {
  en: {
    messages_not_restored: 'Messages are stored locally and cannot be restored.',
    no_conversations: 'No conversations yet.',
    refresh: 'Refresh',
    retry: 'Retry',
    error: 'Error:',
    type_a_message: 'Type a message...',
    send: 'Send',
    sending: '...',
    conversation_with: 'Conversation with: '
  },
  es: {
    messages_not_restored: 'Los mensajes se almacenan localmente y no se pueden restaurar.',
    no_conversations: 'No hay conversaciones todavía.',
    refresh: 'Refrescar',
    retry: 'Reintentar',
    error: 'Error:',
    type_a_message: 'Escribe un mensaje...',
    send: 'Enviar',
    sending: '...',
    conversation_with: 'Conversación con: '
  },
};

const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;

export default i18n;
