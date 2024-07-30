const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    // Create the payload
    const payload = { uid }

    // Generate the JWT
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: '365d'
      },
      (err, token) => {
        if (err) {
          console.log(err)
          reject('Could not generate the token')
        }
        resolve(token)
      }
    )
  })
}

// Check if the JWT is valid
const checkJWT = async (token = '') => {
  try {
    if (token.length < 10) {
      return null
    }

    const { uid } = jwt.verify(token, process.env.SECRET_KEY)
    const user = await User.findById(uid)
    if (user) {
      if (user.status) {
        return user
      } else {
        return null
      }
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}

module.exports = {
  generateJWT,
  checkJWT
}
