const axios = require('axios');
const client = require('../db/connect');

async function fetchUsers() {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/users'
  );
  let counter = 1;
  let query = `INSERT INTO "users_info" (id, name, username, email, address) VALUES`;
  const usersData = response.data;
  const values = [];
  for (let i = 1; i <= usersData.length; i++) {
    const user = usersData[i - 1];
    query += ` ($${counter},$${counter + 1},$${counter + 2}, $${
      counter + 3
    }, $${counter + 4} )${i !== usersData.length ? ',' : ' RETURNING *'}`;
    counter += 5;
    values.push(user.id);
    values.push(user.name);
    values.push(user.username);
    values.push(user.email);
    values.push(JSON.stringify(user.address));
  }

  const res = await client.query(query, values);
  return res.rows;
}

async function getUsersFromDB() {
  const res = await client.query(`SELECT * FROM "users_info"`);
  return res.rows;
}

async function removeUsersFromDB() {
  const res = await client.query(`DELETE FROM "users_info" RETURNING *`);
  return res.rows;
}

async function tableHasRow() {
  const res = await client.query(`SELECT * FROM users_info`);
  return res.rows.length > 0;
}

async function addUserToDB(user) {
  const lastUserId =
    await client.query(`SELECT id FROM users_info ORDER BY id DESC LIMIT 1
	 `);
  const lastId = lastUserId.rows[0].id + 1;
  let query = `INSERT INTO "users_info" (name, username, email, phone, website, address, id) VALUES`;
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
}

async function getOneUserFromDB(email) {
  const res = await client.query(`SELECT * FROM "users_info" WHERE email=$1`, [
    email,
  ]);
  return res.rows[0];
}

async function putOneUserFromDB(data) {
  const column = Object.keys(data);
  const fields = Object.values(data);
  column.splice(0, 1);
  fields.splice(0, 1);
  const res = await client.query(
    `UPDATE users_info
	 SET (${column.join()}) = ('${fields.join("','")}')
	 WHERE id =$1
	 RETURNING name, username, email, address`,
    [data.userId]
  );
  return res.rows;
}

async function removeOneUserFromDB(id) {
  const res = await client.query(
    `DELETE FROM users_info WHERE id = $1
	 RETURNING *`,
    [id]
  );
  return res.rows;
}

module.exports = {
  fetchUsers,
  getUsersFromDB,
  removeUsersFromDB,
  tableHasRow,
  addUserToDB,
  getOneUserFromDB,
  putOneUserFromDB,
  removeOneUserFromDB,
};
