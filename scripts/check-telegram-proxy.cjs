require('dotenv').config();

const { FetchClient } = require('@telegraf-hardened/fetch');

const proxyUrl = process.env.TELEGRAM_PROXY_URL;

if (!proxyUrl) {
  console.error('TELEGRAM_PROXY_URL is not set');
  process.exit(1);
}

const client = new FetchClient({
  proxy: proxyUrl,
  timeout: 10000,
});

async function check(url) {
  try {
    const response = await client.fetch(url);
    const text = await response.text();

    console.log(`${url} -> ${response.status}`);
    console.log(text.slice(0, 160));
  } catch (error) {
    console.error(`${url} -> ERROR`);
    console.error(error.message);

    if (error.cause) {
      console.error(error.cause.message);
    }
  }
}

async function main() {
  console.log(`Proxy: ${proxyUrl}`);

  await check('https://api.ipify.org?format=json');
  await check('https://api.telegram.org');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
