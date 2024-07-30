const { Route, User, Badge, Location } = require('../models')

// Check if a user with the email already exists
const emailExists = async (email = '') => {
  const exists = await User.findOne({ email })

  if (exists) {
    throw new Error(`The email ${email} already exists`)
  }
}

// Check if a badge with the id exists
const badgeExistsById = async (id = '') => {
  const exists = await Badge.findById(id)

  if (!exists) {
    throw new Error(`The badge with id ${id} does not exist`)
  }
}

// Check if a location with the id exists
const locationExistsById = async (id = '') => {
  const exists = await Location.findById(id)

  if (!exists) {
    throw new Error(`The location with id ${id} does not exist`)
  }
}

// Check if a user with the id exists
const userExistsById = async (id = '') => {
  const exists = await User.findById(id)

  if (!exists) {
    throw new Error(`The user with id ${id} does not exist`)
  }
}

// Check if a route with the id exists
const routeExistsById = async (id = '') => {
  const exists = await Route.findById(id)

  if (!exists) {
    throw new Error(`The route with id ${id} does not exist`)
  }
}

// Check if a route with the id exists
const routeExists = async (id = '') => {
  const exists = await Route.findById(id)

  if (exists) {
    throw new Error(`The route with id ${id} already exists`)
  }
}

// Check if a badge with the route already exists
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
