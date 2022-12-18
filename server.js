const { options } = require("./public/options/mariaDB");
const principalRouter = require("./routers/principalRouter");
const path = require("path");
const knex = require("knex")(options);
const sendProd = require("./helper");
const Contenedor = require("./api");
const Mensajes = require("./apiMensajes");
const { response } = require("express");
const express = require("express");
const hbs = require("express-handlebars");
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const fetch = require("node-fetch");
const { normalize, schema } = require("normalizr");
const util = require("util");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { ne } = require("faker/lib/locales");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { userDaos: User } = require("./daos/mainDaos");
const { MONGO_URL, SECRET } = require("./src/views/config");
const parseArgs = require("minimist");
const script = require("bcrypt");
const saltRounds = 10;
const cluster = require("cluster");
const CPUs = require("os").cpus().length;
const compression = require("compression");
const logger = require("./reqLogger");

const modo = process.argv[2] || "fork";
const PORT = process.argv[3] || 8080;

const MongoStore = require("connect-mongo");
const servUser = require("./servicios/userService");
const advancedOptions = { useNewUrlParser: true, useUniFiedTopology: true };

let test = new Contenedor(knex, "prueba");
let msgManager = new Mensajes(knex, "mensajes");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

// const opciones = {default: {port: 8080}}
// const {port: parPort} = parseArgs(process.argv.splice(2), opciones )

let messages = [];
let prod = [];
let user;

if (modo === "cluster" && cluster.isPrimary) {
  console.log(`Numero de procesadores: ${CPUs}`);
  console.log(`PID master: ${process.pid}`);

  for (let i = 0; i < CPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(
      "worker",
      worker.process.pid,
      "died",
      new Date().toLocaleString()
    );
    cluster.fork();
  });
} else {
  /* Server Listen */
  //const PORT = parPort
  const server = httpServer.listen(PORT, () =>
    console.log(`servidor Levantado ${PORT}`)
  );
  server.on("error", (error) => console.log(`Error en servidor ${error}`));

  app.use((req, res, next) => {
    logger.info(`Ruta: ${req.path} - Método: ${req.method}`), next();
  });
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(cookieParser());
  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: MONGO_URL,
        mongoOptions: advancedOptions,
        ttl: 30,
      }),
      secret: SECRET,
      resave: true,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  //passport

  passport.use(
    "register",

    new LocalStrategy(
      { passReqToCallback: true },
      async (req, username, password, done) => {
        console.log("entro signup");

        const usuarioDB = new servUser();

        script.hash(password, saltRounds, async function (err, hash) {
          await usuarioDB.saveUser({ mail: username, password: hash });
        });

        done(null, { mail: username });
      }
    )
  );
  passport.use(
    "login",
    new LocalStrategy(async (username, password, done) => {
      let existe;

      const usuarioDB = new servUser();

      const userDB = await usuarioDB.getByUser(username);

      script.compare(password, userDB?.password ?? "", function (err, result) {
        existe = result;
        if (!existe) {
          return done(null, false);
        } else {
          return done(null, existe);
        }
      });
      console.log(userDB);
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((nombre, done) => {
    const usuarioDz = nombre;
    done(null, usuarioDz);
  });

  /*----------- Motor de plantillas -----------*/
  app.set("views", "./src/views");

  app.engine(
    ".hbs",
    hbs.engine({
      defaultLayout: "main",
      layoutsDir: "./src/views/layouts",
      extname: ".hbs",
    })
  );
  app.set("view engine", ".hbs");

  //rutas

  app.use("/", principalRouter);

  io.on("connection", async (socket) => {
    console.log("se conecto un usuario");

    async function getMsgOnConnection() {
      let mensajes = [];
      mensajes = await msgManager.getMessages();
      return mensajes;
    }

    messages = await getMsgOnConnection();

    socket.emit("mensajes", messages);
    sendProd(socket);

    async function prodF() {
      let preProd = [];
      console.log("Antes del await");
      await fetch("http://localhost:8080/api/productos-test")
        .then((respuesta) => {
          return respuesta.text();
        })
        .then((plantilla) => {
          preProd = JSON.parse(plantilla);

          return preProd;
        });
      return preProd;
    }

    prod = await prodF();
    io.sockets.emit("prod", prod);

    async function usuario(user) {
      return user;
    }

    userName = await usuario(user);
    console.log(userName);
    io.sockets.emit("usuarios", userName);

    socket.on("new-message", async (data) => {
      async function agregarMsg(data) {
        let author = data;
        let texto = data.texto;
        author = new schema.Entity(
          "author",
          {
            nombre: author.nombre,
            apellido: author.apellido,
            edad: author.edad,
            alias: author.alias,
            avatar: author.avatar,
          },
          { idAttribute: author.username }
        );
        texto = new schema.Entity("text", {
          texto: texto,
        });

        function print(objeto) {
          console.log(util.inspect(objeto, false, 24, true));
        }
        const normalizado = normalize(author, texto);
        await print(normalizado);
        let agregado = [];
        agregado = await msgManager.addMessage(data);
        return agregado;
      }
      await agregarMsg(data);
      async function get() {
        let mensajes = [];
        mensajes = await msgManager.getMessages();
        return mensajes;
      }

      messages = await get();

      io.sockets.emit("messages", messages);
    });

    socket.on("new-prod", async (data) => {
      async function agregar(data) {
        let agregado = [];
        agregado = test.addProd(data);
        return agregado;
      }

      await agregar(data);

      async function prodF() {
        let preProd = [];
        console.log("Antes del await");
        preProd = await test.getAll();
        return preProd;
      }

      prod = await prodF();
      io.sockets.emit("prod", prod);
    });
  });
}

app.use((req, res, next) => {
  logger.warn(`Ruta: ${req.path} - Método: ${req.method}`), next();
});
