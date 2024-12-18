export {};

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        themeParams: {
          bg_color?: string;
          button_color?: string;
          text_color?: string;
          hint_color?: string;
        };
        close(): void;
        sendData(data: string): void;
        expand(): void;
      };
    };
  }
}
