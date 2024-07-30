const response = require('express')

// Check if the user is an admin
const isAdminRole = (req, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: 'Trying to verify role without validating token first'
    })
  }

  // Get the role and name from the user
  const { role, name } = req.user

  // if the role is not admin, return an error
  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `${name} is not an admin`
    })
  }

  next()
}

module.exports = {
  isAdminRole
}
