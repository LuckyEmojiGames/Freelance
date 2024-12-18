// telegram.d.ts
interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}

interface ThemeParams {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
}

interface WebApp {
    initData: string;
    initDataUnsafe: {
        user?: TelegramUser;
    };
    themeParams: ThemeParams;
    close(): void;
    sendData(data: string): void;
    ready(): void; // Add the missing `ready` method
    expand(): void;
    onEvent(eventType: string, callback: () => void): void;
    offEvent(eventType: string, callback: () => void): void;
    showPopup(params: {
        title?: string;
        message: string;
        buttons?: { id: string; type: string; text: string }[];
    }): void;
}

interface Telegram {
    WebApp: WebApp;
}

declare global {
    interface Window {
        Telegram: Telegram;
    }
}

export {};
