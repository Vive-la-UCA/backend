const { response } = require('express')
const { Location, Route } = require('../models')

const locationGet = async (req, res = response) => {
  const { limit = 5, skip = 0 } = req.query
  const query = {}

  const [total, locations] = await Promise.all([
    Location.countDocuments(query),
    Location.find(query).limit(Number(limit)).skip(Number(skip))
  ])

  res.json({
    total,
    locations
  })
}

const locationGetNoPagination = async (req, res = response) => {
  const query = {}

  const locations = await Location.find(query)

  res.json({
    locations
  })
}

const locationGetOne = async (req, res = response) => {
  const { id } = req.params

  const location = await Location.findById(id)

  res.json({
    location
  })
}

const locationPost = async (req, res = response) => {
  const { name, description, latitude, longitude } = req.body
  const image = req.file.filename

  const location = new Location({
    name,
    description,
    image,
    latitude,
    longitude
  })

  await location.save()

  res.json({
    location
  })
}

const locationPut = async (req, res = response) => {
  const { id } = req.params
  const { ...data } = req.body

  let image

  if (req.file) {
    image = req.file.filename
  }

  try {
    let updatedLocation

    if (image) {
      // remove old image
      const location = await Location.findById(id)
      if (location.image) {
        const pathImage = `./uploads/${location.image}`

        if (fs.existsSync(pathImage)) {
          fs.unlinkSync(pathImage)
        }
      }

      updatedLocation = await Location.findByIdAndUpdate(
        id,
        { ...data, image }, // Include image data if present
        { new: true }
      )
    } else {
      updatedLocation = await Location.findByIdAndUpdate(
        id,
        data, // Update only the data if no image
        { new: true }
      )
    }

    res.json({
      updatedLocation
    })
  } catch (error) {
    return res.status(500).json({
      msg: 'Internal server error'
    })
  }
}

const locationDelete = async (req, res = response) => {
  const { id } = req.params

  const location = await Location.findById(id)

  // check if the location is in any route
  const isUsed = await Route.findOne({ locations: id })

  if (isUsed) {
    return res.status(400).json({
      msg: 'Location is in use'
    })
  }

  if (location.image) {
    const pathImage = `./uploads/${location.image}`

    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage)
    }
  }

  await Location.findByIdAndDelete(id)

  res.json({
    msg: 'Location deleted'
  })
}

module.exports = {
  locationGet,
  locationGetNoPagination,
  locationGetOne,
  locationPost,
  locationPut,
  locationDelete
}
