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
      break
    case 'routes':
      break
    default:
      res.status(500).json({
        Error: 'Internal server error'
      })
  }
}

module.exports = {
  search
}
