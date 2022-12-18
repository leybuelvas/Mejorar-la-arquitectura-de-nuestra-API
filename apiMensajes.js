const { default: knex } = require("knex");
const logger = require("./reqLogger");

class MessageManager {
  db_;
  tabla_;

  constructor(db, tabla) {
    this.db_ = db;
    this.tabla_ = tabla;
  }

  addMessage(mensaje) {
    this.db_(this.tabla_)
      .insert(mensaje)
      .then(() => console.log("agregado"))
      .catch((err) => {
        logger.error(err);
        throw err;
      })
      .finally(() => {
        this.db_.destroy();
      });
  }

  getMessages() {
    let mensajes = [];

    return this.db_
      .from(this.tabla_)
      .select("*")
      .then((rows) => {
        for (let row of rows) {
          mensajes.push(row);
        }
        return mensajes;
      })

      .catch((err) => {
        logger.error(err);
        throw err;
      });
  }
}

module.exports = MessageManager;
