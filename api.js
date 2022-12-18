const { json } = require("express/lib/response");
const { default: knex } = require("knex");
const logger = require("./reqLogger");

class Contenedor {
  db_;
  tabla_;

  constructor(db, tabla) {
    this.db_ = db;
    this.tabla_ = tabla;
  }

  addProd(producto) {
    this.db_(this.tabla_)
      .insert(producto)
      .then(() => console.log("agregado"))
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  }

  save(producto) {
    let arregloOld = [];
    let idMayor = 0;
    let tiempo = Date();
    if (fs.readFileSync("./productos.txt", "utf-8") !== "") {
      arregloOld = JSON.parse(fs.readFileSync("./productos.txt", "utf-8"));
    }

    for (let i = 0; i < arregloOld.length; i++) {
      if (arregloOld[i].id > idMayor) {
        idMayor = arregloOld[i].id;
      } else break;
    }
    producto.id = idMayor + 1;
    producto.timestamp = tiempo.toString();
    arregloOld.push(producto);

    let productoJSON = JSON.stringify(arregloOld);
    fs.writeFile("./productos.txt", productoJSON, (error) => {
      if (error) {
        logger.error(error);
      } else {
        console.log("Producto agregado correctamente.");
      }
    });
    return producto.id;
  }

  getById(id) {
    let arregloOld = [];
    let encontro = 0;
    let encontrado;

    let promesa = new Promise(function (resolve, reject) {
      setTimeout(function () {
        fs.readFile("./productos.txt", "utf-8", (error, contenido) => {
          if (error) {
            reject(error);
          }

          if (contenido !== "") {
            arregloOld = JSON.parse(contenido);
            for (let i = 0; i < arregloOld.length; i++) {
              if (arregloOld[i].id === id) {
                encontrado = arregloOld[i];
                encontro = 1;
              }
            }
            if (encontro === 0) {
              encontrado = null;
              resolve(encontrado);
            } else if (encontro === 1) {
              resolve(encontrado);
            }
          }
        });
      });
    });
    return promesa;
  }

  getAll() {
    let prod = [];

    console.log("Adentro de getAll");

    return this.db_
      .from(this.tabla_)
      .select("*")
      .then((rows) => {
        for (let row of rows) {
          prod.push(row);
        }
        return prod;
      })

      .catch((err) => {
        logger.error(err);
        throw err;
      });
  }

  changeById(id, producto) {
    let arregloOld = [];
    let encontro = 0;
    let encontrado;

    let promesa = new Promise(function (resolve, reject) {
      setTimeout(function () {
        fs.readFile("./productos.txt", "utf-8", (error, contenido) => {
          if (error) {
            reject(error);
          }

          if (contenido !== "") {
            arregloOld = JSON.parse(contenido);
            for (let i = 0; i < arregloOld.length; i++) {
              if (arregloOld[i].id === id) {
                encontrado = arregloOld[i];

                arregloOld.splice(i, 1);
                producto.id = id;
                arregloOld.push(producto);
              }
            }
            let productoJSON = JSON.stringify(arregloOld);
            fs.writeFile("./productos.txt", productoJSON, (error) => {
              if (error) {
                console.log(error);
              } else {
                console.log("Producto actualizado correctamente.");
              }
            });
            resolve(arregloOld);
          }
        });
      });
    });
    return promesa;
  }

  deleteById(id) {
    let arregloOld = [];
    let encontro = 0;
    let objeto;

    let promesa = new Promise(function (resolve, reject) {
      setTimeout(function () {
        fs.readFile("./productos.txt", "utf-8", (error, contenido) => {
          if (error) {
            reject(error);
          }

          if (contenido !== "") {
            if (!id || typeof id !== `number`) {
              resolve("El Id ingresado no es un numero");
            }
            arregloOld = JSON.parse(contenido);
            for (let i = 0; i < arregloOld.length; i++) {
              if (arregloOld[i].id === id) {
                objeto = i;
                arregloOld.splice(objeto, 1);
                encontro = 1;
              }
            }
            if (encontro === 0) {
              resolve("No existe objeto con el Id ingresado.");
            }
            fs.writeFile(
              "./productos.txt",
              JSON.stringify(arregloOld),
              (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(`Se borro objeto con id: ${id}`);
                }
              }
            );
          }
        });
      });
    });
    return promesa;
  }
}

module.exports = Contenedor;
