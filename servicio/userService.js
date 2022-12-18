const userDao = require("./persistencia/daos/userDaos");

const userDao = new userDao();

const servUser = {
  getAllUsers: async () => {
    return await userDao.getAll();
  },

  getByUser: async (user) => {
    return await userDao.getByUser(user);
  },

  saveUser: async (user) => {
    return await userDao.save(user);
  },
};

module.exports = servUser;
