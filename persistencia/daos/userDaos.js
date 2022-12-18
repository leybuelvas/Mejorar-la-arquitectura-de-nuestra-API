const mongoose = require("mongoose");
const esquemaUser = require("./modelsMDB/schemaUser");

class Usuario {
  async connectMDB() {
    try {
      const URL =
        "mongodb+srv://supercris56:Super56@cluster0.brgzxxr.mongodb.net/?retryWrites=true&w=majority";
      let rta = await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUniFiedTopology: true,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getAll(id) {
    const filter = id ? { id } : {};
    try {
      await this.connectMDB();
      const userDb = await esquemaUser.find(filter);
      mongoose.disconnect();
      return userDb;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async getByUser(user) {
    try {
      await this.connectMDB();
      const usuario = await esquemaUser.findOne({ mail: user });
      mongoose.disconnect();
      return usuario;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async save(user) {
    try {
      await this.connectMDB();
      await esquemaUser.create(user);
      mongoose.disconnect();
    } catch (error) {
      throw Error(error.message);
    }
  }
}

module.exports = Usuario;
