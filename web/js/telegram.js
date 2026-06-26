function getTelegramWebApp() {
  return window.Telegram?.WebApp || null;
}

function initTelegramApp() {
  const tg = getTelegramWebApp();

  if (!tg) {
    document.body.classList.add('is-browser');
    return;
  }

  document.body.classList.add('is-telegram');

  tg.ready();
  tg.expand();

  if (tg.themeParams?.bg_color) {
    document.documentElement.style.setProperty('--tg-bg-color', tg.themeParams.bg_color);
  }

  if (tg.themeParams?.text_color) {
    document.documentElement.style.setProperty('--tg-text-color', tg.themeParams.text_color);
  }

  if (tg.themeParams?.button_color) {
    document.documentElement.style.setProperty('--tg-button-color', tg.themeParams.button_color);
  }

  if (tg.themeParams?.button_text_color) {
    document.documentElement.style.setProperty(
      '--tg-button-text-color',
      tg.themeParams.button_text_color
    );
  }
}

function getTelegramInitData() {
  const tg = getTelegramWebApp();

  return tg?.initData || '';
}

function getTelegramUser() {
  const tg = getTelegramWebApp();

  return tg?.initDataUnsafe?.user || null;
}