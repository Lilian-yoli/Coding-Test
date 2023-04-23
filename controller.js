const Ajv = require("ajv");
const ajv = new Ajv();
const { numsArraySchema, loginInfoSchema } = require("./schema");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const localStrategy = require("passport-local").Strategy;
const { presetDataToKeyv, getUserInfoByKey } = require("./model");
const { TOKEN_SECRET, TOKEN_EXPIRED } = process.env;
const bcrypt = require("bcrypt");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

const helloWorld = () => {
  return function (req, res) {
    res.status(200).send("Hello World");
  };
};

const sortNumsArray = () => {
  return function (req, res) {
    const validate = ajv.compile(numsArraySchema);
    const { numbers } = req.body;
    const valid = validate(numbers);
    if (!valid) {
      res.status(422).send("Format Error.");
    } else {
      const sortedNumbers = numbers.sort();
      res.status(200).send(sortedNumbers);
    }
  };
};

const presetData = () => {
  return async (req, res, next) => {
    await presetDataToKeyv();
    next();
  };
};

const localAuthenticate = () => {
  return async (req, res) => {
    const validate = ajv.compile(loginInfoSchema);
    const valid = validate(req.body);
    if (!valid) {
      return res.status(422).send("Format Error.");
    }
    passport.authenticate(
      "local",
      { failureRedirect: "/" },
      (err, user, info) => {
        if (err) {
          throw err;
        } else if (!user) {
          res.status(401).send({ message: "Invalid username or password." });
        } else {
          req.login(user, (err) => {
            if (err) {
              throw err;
            } else {
              const token = generateToken(user.id, user.name);
              req.session.token = token;
              res
                .status(200)
                .send({ message: "Logged in successfully.", token });
            }
          });
        }
      }
    )(req, res);
  };
};

passport.use(
  new localStrategy(
    {
      usernameField: "name",
      passwordField: "password",
    },
    async (name, password, done) => {
      try {
        const user = await getUserInfoByKey(name);
        if (!user) {
          return done(null, false, { message: "User not found." });
        }
        const validate = await isValidPassword(name, password);
        if (!validate) {
          return done(null, false, {
            message: "Information provided isn't correct.",
          });
        }
        return done(null, user);
      } catch (err) {
        console.log(err);
      }
    }
  )
);

const isValidPassword = async (name, password) => {
  const user = await getUserInfoByKey(name);
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await getUserInfoByKey(id);
  done(null, user);
});

const jwtAuthenticate = () => {
  return async (req, res, next) => {
    passport.authenticate("jwt", (err, user) => {
      if (err) {
        return next(err);
      } else if (!user) {
        return res
          .status(401)
          .send({ message: "Invalid username or password." });
      } else {
        req.user = user;
        return next();
      }
    })(req, res, next);
  };
};

const isAuth = () => {
  return (req, res) => {
    const user = req.user;
    if (user) {
      const token = generateToken(user.id, user.name);
      res.status(200).send({ message: true, token: token });
    } else {
      res.status(200).send({ message: false, token: null });
    }
  };
};

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: TOKEN_SECRET,
    },
    async (jwtPayload, done) => {
      const user = await getUserInfoByKey(jwtPayload.user.name);
      if (jwtPayload.user.id === user.id) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }
  )
);

const generateToken = (id, name) => {
  const userInfo = { id, name };
  const token = jwt.sign({ user: userInfo }, TOKEN_SECRET, {
    expiresIn: TOKEN_EXPIRED,
  });
  return token;
};

module.exports = {
  helloWorld,
  sortNumsArray,
  presetData,
  localAuthenticate,
  jwtAuthenticate,
  isAuth,
};
