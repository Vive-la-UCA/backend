const { response, request } = require('express')
const bcrypt = require('bcryptjs')

const { User, Badge } = require('../models')

const usersGet = async (req = request, res = response) => {
  const { limit = 5, skip = 0 } = req.query
  const query = { status: true }

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).limit(Number(limit)).skip(Number(skip))
  ])

  res.json({
    total,
    users
  })
}

const usersGetNoPagination = async (req = request, res = response) => {
  const query = { status: true }

  const users = await User.find(query)

  res.json({
    users
  })
}

const usersGetOne = async (req, res = response) => {
  const { id } = req.params

  const user = await User.findById(id)

  res.json({
    user
  })
}

const usersPost = async (req = request, res = response) => {
  const { name, email, password } = req.body
  const user = new User({ name, email, password })

  // Encrypt password
  const salt = bcrypt.genSaltSync()
  user.password = bcrypt.hashSync(password, salt)

  // Save in database
  await user.save()

  res.json({
    user
  })
}

const addBadgeToUser = async (req = request, res = response) => {
  const { id } = req.params
  const { badge } = req.body

  // check if the badge exists
  const badgeExists = await Badge.findById(badge)

  if (!badgeExists) {
    return res.status(400).json({
      error: 'Badge does not exist'
    })
  }

  const user = await User.findById(id)

  if (!user) {
    return res.status(404).json({
      error: 'User does not exist'
    })
  }

  // check if the badge is already added
  const badgeAlreadyAdded = user.badges.find(b => b.toString() === badge)

  if (badgeAlreadyAdded) {
    return res.status(400).json({
      error: 'Badge is already added'
    })
  }

  // add badge to user
  user.badges.push(badge)

  await user.save()

  res.json({
    user
  })
}

module.exports = {
  usersPost,
  usersGetOne,
  usersGet,
  usersGetNoPagination,
  addBadgeToUser
}
