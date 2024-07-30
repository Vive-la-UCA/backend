const { response } = require('express')
const { Location, Route } = require('../models')

const locationGet = async (req, res = response) => {
  // pagination options
  const { limit = 5, skip = 0 } = req.query

  // query options
  const query = {}

  // Get total count and locations
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
  // Get all locations without pagination
  const query = {}

  const locations = await Location.find(query)

  res.json({
    locations
  })
}

const locationGetOne = async (req, res = response) => {
  // Get location by id from params
  const { id } = req.params

  const location = await Location.findById(id)

  res.json({
    location
  })
}

const locationPost = async (req, res = response) => {
  // destructuring data from body
  const { name, description, latitude, longitude } = req.body

  // get the filename from the file uploaded
  const image = req.file.filename

  // create a new location
  const location = new Location({
    name,
    description,
    image,
    latitude,
    longitude
  })

  // save the location in the database
  await location.save()

  res.json({
    location
  })
}

const locationPut = async (req, res = response) => {
  // Get id from params and data from body
  const { id } = req.params
  const { ...data } = req.body

  let image

  // check if there is a file uploaded and get the filename
  if (req.file) {
    image = req.file.filename
  }

  try {
    let updatedLocation

    // check if there is an image
    if (image) {
      const location = await Location.findById(id)

      // check if the location has an image and delete it
      if (location.image) {
        const pathImage = `./uploads/${location.image}`

        if (fs.existsSync(pathImage)) {
          fs.unlinkSync(pathImage)
        }
      }

      // update the location with the new image
      updatedLocation = await Location.findByIdAndUpdate(
        id,
        { ...data, image }, // Include image data if present
        { new: true }
      )
    } else {
      // update the location without the image
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
  // get id from params
  const { id } = req.params

  const location = await Location.findById(id)

  // check if the location is in any route
  const isUsed = await Route.findOne({ locations: id })

  if (isUsed) {
    return res.status(400).json({
      msg: 'Location is in use'
    })
  }

  // check if the location has an image and delete it
  if (location.image) {
    const pathImage = `./uploads/${location.image}`

    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage)
    }
  }

  // delete the location from the database
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
