var config = {
  port: 6969,
  session: {
    secret: "urMom4intn0b1Tch!",
    cookie: {
      maxAge : 86400000,
      secure: false,
    },
    saveUninitialized: true,
    resave: true
  },
  mongo: {
    api: {
      host: "mongodb://jackiedewit:bitchpliz@ds060749.mlab.com:60749/ez-startup"
    }
  }
}

module.exports = config;
