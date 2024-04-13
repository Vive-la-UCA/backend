const { response } = require('express')
const { ObjectId } = require('mongoose').Types
const { Badge, Location, Route } = require('../models')

const allowedCollections = ['badges', 'locations', 'routes']

const searchBadges = async (term = '', res = response) => {
  const isMongoId = ObjectId.isValid(term)

  if (isMongoId) {
    const badge = await Badge.findById(term).populate('route', 'name')
    return res.json({
      results: badge ? [badge] : []
    })
  }

  const regex = new RegExp(term, 'i')

  const badges = await Badge.find({
    $or: [{ name: regex }]
  }).populate('route', 'name')

  res.json({
    results: badges
  })
}

const searchLocations = async (term = '', res = response) => {
  const isMongoId = ObjectId.isValid(term)

  if (isMongoId) {
    const location = await Location.findById(term)
    return res.json({
      results: location ? [location] : []
    })
  }

  const regex = new RegExp(term, 'i')

  const locations = await Location.find({
    $or: [{ name: regex }]
  })

  res.json({
    results: locations
  })
}

const searchRoutes = async (term = '', res = response) => {
  const isMongoId = ObjectId.isValid(term)

  if (isMongoId) {
    const route = await Route.findById(term)
    return res.json({
      results: route ? [route] : []
    })
  }

  const regex = new RegExp(term, 'i')

  const routes = await Route.find({
    $or: [{ name: regex }]
  }).populate('locations', 'name')

  res.json({
    results: routes
  })
}

const search = (req, res = response) => {
  const { collection, term } = req.params

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Allowed collections are ${allowedCollections}`
    })
  }

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
