const { response } = require('express')
const { ObjectId } = require('mongoose').Types
const { Badge, Location, Route } = require('../models')

const allowedCollections = ['badges', 'locations', 'routes']

const searchBadges = async (term = '', res = response) => {
  // Check if the term is a valid MongoDB ID
  const isMongoId = ObjectId.isValid(term)

  // If the term is a valid MongoDB ID, search for the badge by ID
  if (isMongoId) {
    const badge = await Badge.findById(term).populate('route', 'name')
    return res.json({
      results: badge ? [badge] : []
    })
  }

  // If the term is not a valid MongoDB ID, search for the badge by name
  const regex = new RegExp(term, 'i')

  // Search for badges by name
  const badges = await Badge.find({
    $or: [{ name: regex }]
  }).populate('route', 'name')

  res.json({
    results: badges
  })
}

const searchLocations = async (term = '', res = response) => {
  // Check if the term is a valid MongoDB ID
  const isMongoId = ObjectId.isValid(term)

  // If the term is a valid MongoDB ID, search for the location by ID
  if (isMongoId) {
    const location = await Location.findById(term)
    return res.json({
      results: location ? [location] : []
    })
  }

  // If the term is not a valid MongoDB ID, search for the location by name
  const regex = new RegExp(term, 'i')

  // Search for locations by name
  const locations = await Location.find({
    $or: [{ name: regex }]
  })

  res.json({
    results: locations
  })
}

const searchRoutes = async (term = '', res = response) => {
  // Check if the term is a valid MongoDB ID
  const isMongoId = ObjectId.isValid(term)

  // If the term is a valid MongoDB ID, search for the route by ID
  if (isMongoId) {
    const route = await Route.findById(term)
    return res.json({
      results: route ? [route] : []
    })
  }

  // If the term is not a valid MongoDB ID, search for the route by name
  const regex = new RegExp(term, 'i')

  // Search for routes by name
  const routes = await Route.find({
    $or: [{ name: regex }]
  }).populate('locations', 'name')

  res.json({
    results: routes
  })
}

const search = (req, res = response) => {
  // Get collection and term from params
  const { collection, term } = req.params

  // Check if the collection is allowed, if not return an error
  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Allowed collections are ${allowedCollections}`
    })
  }

  // Call the corresponding search function based on the collection
  switch (collection) {
    case 'badges':
      searchBadges(term, res)
      break
    case 'locations':
      searchLocations(term, res)
      break
    case 'routes':
      searchRoutes(term, res)
      break
    default:
      res.status(500).json({
        error: 'Internal server error'
      })
  }
}

module.exports = {
  search
}
