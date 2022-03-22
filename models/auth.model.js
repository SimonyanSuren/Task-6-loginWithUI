const client = require('../db/connect');

const findUser = async (email) => {
  const res = await client.query(
    `SELECT * FROM "users_info" WHERE email = $1`,
    [email]
  );
  return res.rows.length ? res.rows[0] : 0;
};

const addUserToDB = async (user) => {
  const lastUserId =
    await client.query(`SELECT id FROM users_info ORDER BY id DESC LIMIT 1
	 `);
  const lastId = lastUserId.rows[0]?.id + 1 || 1;
  let query = `INSERT INTO "users_info" (username, name, email, password, address, id) VALUES`;
  user = Object.values(user);
  user.push(lastId);
  for (let i = 1; i <= user.length; i++) {
    query += `${i === 1 ? ' (' : ''}$${i}${
      i !== user.length ? ',' : ') RETURNING *'
    }`;
    if (typeof user[i] === 'object') {
      user[i] = JSON.stringify(user[i]);
    }
  }
  const res = await client.query(query, user);
  return res.rows;
};

module.exports = { findUser, addUserToDB };
