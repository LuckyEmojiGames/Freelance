import { useEffect, useState } from "react";

const useTelegramUser = () => {
  const [telegramUser, setTelegramUser] = useState<{
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  } | null>(null);

  useEffect(() => {
    // Check if Telegram WebApp API is available
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;

      // Fetch user data from initDataUnsafe
      const user = webApp.initDataUnsafe?.user;
      console.log("telegram user info", user);

      if (user) {
        setTelegramUser(user); // Save Telegram user info
      } else {
        console.error("Telegram Web App: User data not found.");
      }
    } else {
      console.error("Telegram Web App is not available.");
    }
  }, []);

  return telegramUser;
};

export default useTelegramUser;
