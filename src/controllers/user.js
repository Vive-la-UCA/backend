const { response, request } = require('express')
const bcrypt = require('bcryptjs')

const { User, Badge } = require('../models')

const usersGet = async (req = request, res = response) => {
  // pagination options
  const { limit = 5, skip = 0 } = req.query
  // query options to get only active users
  const query = { status: true }

  // get total count and users
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
  // get all users without pagination and only active users
  const query = { status: true }

  const users = await User.find(query)

  res.json({
    users
  })
}

const usersGetOne = async (req, res = response) => {
  // get user by id from params
  const { id } = req.params

  // get user by id
  const user = await User.findById(id)

  res.json({
    user
  })
}

const usersPost = async (req = request, res = response) => {
  // destructuring data from body
  const { name, email, password } = req.body
  // create a new user with the data from the body
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

const userAdminSeed = async (_ = request, res = response) => {
  try {
    // Create admin user with default values
    const user = new User({
      name: 'Admin',
      email: 'admin@admin.com',
      password: '@SAzTf!$',
      role: 'ADMIN_ROLE'
    })

    // Encrypt password
    const salt = bcrypt.genSaltSync()

    user.password = bcrypt.hashSync(user.password, salt)

    // Save in database
    await user.save()

    res.json({
      message: 'Admin user created successfully'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Error creating admin user'
    })
  }
}

const addBadgeToUser = async (req = request, res = response) => {
  // get id from params and badge from body
  const { id } = req.params
  const { badge } = req.body

  // check if the badge exists
  const badgeExists = await Badge.findById(badge)

  // if badge does not exist return error
  if (!badgeExists) {
    return res.status(400).json({
      error: 'Badge does not exist'
    })
  }

  // get user by id
  const user = await User.findById(id)

  // if user does not exist return error
  if (!user) {
    return res.status(404).json({
      error: 'User does not exist'
    })
  }

  // check if the badge is already added
  const badgeAlreadyAdded = user.badges.find(b => b.toString() === badge)

  // if badge is already added return error
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

const usersDelete = async (req = request, res = response) => {
  try {
    // get id from params
    const { id } = req.params

    // find user by id and delete it
    const user = await User.findByIdAndDelete(id)

    res.json({
      message: 'User deleted successfully',
      user
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Error deleting user'
    })
  }
}

module.exports = {
  userAdminSeed,
  usersPost,
  usersGetOne,
  usersGet,
  usersGetNoPagination,
  addBadgeToUser,
  usersDelete
}
