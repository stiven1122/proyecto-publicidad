const { Client } = require('pg');

async function tryPassword(password) {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: password,
    database: 'publicidad_db',
  });
  try {
    await client.connect();
    const res = await client.query('SELECT count(*) FROM campanas');
    console.log('SUCCESS! Password:', JSON.stringify(password), '- Campanas:', res.rows[0].count);
    await client.end();
    return true;
  } catch (e) {
    console.log('FAILED:', JSON.stringify(password), '-', e.message.split('\n')[0]);
    try { await client.end(); } catch {}
    return false;
  }
}

async function main() {
  const passwords = ['', 'postgres', 'admin', 'password', '123456', '1234', 'postgres123', 'Admin123', 'P@ssw0rd', 'root', 'toor', 'changeme', 'secret'];
  for (const pwd of passwords) {
    if (await tryPassword(pwd)) return;
  }
  console.log('No encontré la contraseña. Intenta con una que recuerdes.');
}

main().catch(console.error);
