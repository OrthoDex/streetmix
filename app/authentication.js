const { Authentication } = require('../lib/auth0')

const authenticateJWT = (req, res, next) => {
  if (!req.cookies) {
    next()
  }
  const token = req.cookies.access_token
  const auth0 = Authentication()

  if (token) {
    auth0.getProfile(token, function (err, user) {
      if (err) {
        return res.sendStatus(403)
      }
      req.user = user
      next()
    })
  } else {
    next()
  }
}

module.exports = authenticateJWT
