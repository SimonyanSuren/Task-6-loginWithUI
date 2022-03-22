const {
  fetchUsers,
  getUsersFromDB,
  removeUsersFromDB,
  tableHasRow,
  addUserToDB,
  getOneUserFromDB,
  putOneUserFromDB,
  removeOneUserFromDB,
} = require('../models/users.model');

async function addUsers(req, res, next) {
  let ifTabRowExists = await tableHasRow();
  if (!ifTabRowExists) {
    const fetchedUsers = await fetchUsers();
    res.send(fetchedUsers);
  } else {
    res.send('Users already added');
  }
}

async function getUsers(req, res, next) {
  const result = await getUsersFromDB();
  if (result.length) {
    return res.send(result);
  }
  res.send('There are no users to get.');
}

async function removeUsers(req, res, next) {
  const result = await removeUsersFromDB();
  if (result.length) {
    return res.send('Users deleted.');
  }
  res.status(404).send('There are no users to delete.');
}

async function addOneUser(req, res, next) {
  const result = await addUserToDB(req.body);
  res.send(result);
}

async function getOneUser(req, res, next) {
  const userEmail = req.user.email;
  const { name, username, email, address } = await getOneUserFromDB(userEmail);
  if (email) {
    res.send({ name, username, email, address });
  } else {
    res.status(404).send('There is not such a user.');
  }
}

async function putOneUser(req, res, next) {
  const changedData = req.body;
  let result = await putOneUserFromDB(changedData);
  if (result.length) {
    return res.send(result);
  }
  res.status(404).send('There are not such a user');
}

async function removeOneUser(req, res, next) {
  const userId = req.params.id;
  const result = await removeOneUserFromDB(userId);
  if (result.length) {
    res.send(result);
  } else {
    res.status(404).send('There is not such a user.');
  }
}

module.exports = {
  addUsers,
  getUsers,
  removeUsers,
  addOneUser,
  getOneUser,
  putOneUser,
  removeOneUser,
};
