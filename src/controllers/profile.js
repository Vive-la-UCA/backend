const { response } = require('express')
const { Profile } = require('../models')

const profileGet = async (req, res = response) => {
  const { limit = 5, skip = 0 } = req.query
  const query = {}

  const [total, profiles] = await Promise.all([
    Profile.countDocuments(query),
    Profile.find(query).limit(Number(limit)).skip(Number(skip))
  ])

  res.json({
    total,
    profiles
  })
}

module.exports = {
  profileGet
}
