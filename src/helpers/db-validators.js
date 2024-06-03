const { Route, User, Badge, Location } = require('../models')

const emailExists = async (email = '') => {
  const exists = await User.findOne({ email })

  if (exists) {
    throw new Error(`The email ${email} already exists`)
  }
}

const badgeExistsById = async (id = '') => {
  const exists = await Badge.findById(id)

  if (!exists) {
    throw new Error(`The badge with id ${id} does not exist`)
  }
}

const locationExistsById = async (id = '') => {
  const exists = await Location.findById(id)

  if (!exists) {
    throw new Error(`The location with id ${id} does not exist`)
  }
}

const userExistsById = async (id = '') => {
  const exists = await User.findById(id)

  if (!exists) {
    throw new Error(`The user with id ${id} does not exist`)
  }
}

const routeExistsById = async (id = '') => {
  const exists = await Route.findById(id)

  if (!exists) {
    throw new Error(`The route with id ${id} does not exist`)
  }
}

const routeExists = async (id = '') => {
  const exists = await Route.findById(id)

  if (exists) {
    throw new Error(`The route with id ${id} already exists`)
  }
}

const badgeWithRouteExists = async (route = '') => {
  const exists = await Badge.findOne({ route })

  if (exists) {
    throw new Error(`There is already a badge with route ${route}`)
  }
}

module.exports = {
  emailExists,
  badgeExistsById,
  userExistsById,
  locationExistsById,
  routeExistsById,
  routeExists,
  badgeWithRouteExists
}
