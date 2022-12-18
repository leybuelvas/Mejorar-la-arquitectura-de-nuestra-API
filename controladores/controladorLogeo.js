const passport = require("passport");
const logger = require("./reqLogger");

const sisLogeo = {
  info: (req, res) => {
    const { argv, execPath, platform, version, pid, memoryUsage, cwd } =
      process;
    const { rss } = memoryUsage();

    res.render("info", {
      layout: "main",
      argv,
      execPath,
      platform,
      version,
      pid,
      rss,
      CPUs,
      currentDir: cwd(),
    });
  },

  login: (req, res) => {
    req.logOut();
    res.render("login");
  },

  registrar: (req, res) => {
    res.render("register");
  },

  registrarPost: (req, res) => {
    passport.authenticate("register", {
      successRedirect: "/login",
      failureRedirect: "/login-error",
    });
  },

  loginPost: (req, res) => {
    passport.authenticate("login", {
      successRedirect: "/datos",
      failureRedirect: "/login-error",
    });
  },

  loginError: (req, res) => {
    res.render("login-error");
  },

  datos: (req, res) => {
    res.sendFile(path.resolve("public/index.html"));
  },

  logout: (req, res) => {
    req.logOut();
    res.redirect("/login");
  },

  todo: (req, res) => {
    res.sendFile("index.html");
  },

  index: (req, res) => {
    logger.info(`Ruta ${req.path} - Metodo ${req.method}`);
  },
};

module.exports = sisLogeo;
