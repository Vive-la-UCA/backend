const { response } = require('express')
const { Route, Location, Badge } = require('../models')

const routeGet = async (req, res = response) => {
  // pagination options
  const { limit = 5, skip = 0 } = req.query
  // query options
  const query = {}

  // get total count and routes
  const [total, routes] = await Promise.all([
    Route.countDocuments(query),
    Route.find(query).limit(Number(limit)).skip(Number(skip))
  ])

  res.json({
    total,
    routes
  })
}

const routeGetNoPagination = async (req, res = response) => {
  // get all routes without pagination
  const query = {}

  const routes = await Route.find(query)

  res.json({
    routes
  })
}

const routeGetOne = async (req, res = response) => {
  // get route by id from params
  const { id } = req.params

  // populate the locations of the route
  const route = await Route.findById(id).populate('locations')

  res.json({
    route
  })
}

const routePost = async (req, res = response) => {
  // destructuring data from body
  const { name, description, locations } = req.body
  // get the filename from the file uploaded
  const image = req.file.filename

  // check if the name exists by name
  const route = await Route.findOne({ name })

  // if route exists, return error
  if (route) {
    if (req.file) {
      fs.unlinkSync(req.file.path) // Delete the uploaded file
    }
    return res.status(400).json({
      msg: 'Route already exists'
    })
  }

  // create a new route with the data
  const newRoute = new Route({ name, image, description, locations })

  // save the route in the database
  await newRoute.save()

  res.json({
    newRoute
  })
}

const routePut = async (req, res = response) => {
  // get id from params and data from body
  const { id } = req.params
  const { ...data } = req.body

  let image

  // check if there is a file uploaded and get the filename
  if (req.file) {
    image = req.file.filename
  }

  try {
    let updatedRoute
    // check if there is an image
    if (image) {
      // remove old image if exists
      const route = await Route.findById(id)
      if (route.image) {
        const pathImage = `./uploads/${route.image}`

        if (fs.existsSync(pathImage)) {
          fs.unlinkSync(pathImage)
        }
      }

      // update route with new data and image
      updatedRoute = await Route.findByIdAndUpdate(
        id,
        { ...data, image },
        { new: true }
      )
    } else {
      // update route with new data and no image
      updatedRoute = await Route.findByIdAndUpdate(
        id,
        { ...data },
        { new: true }
      )
    }

    res.json({
      updatedRoute
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Contact the administrator'
    })
  }
}

const routeDelete = async (req, res = response) => {
  // get id from params
  const { id } = req.params

  // find the route by id
  const route = await Route.findById(id)

  // check if the route is in one badge
  const badges = await Badge.find({ route: id })

  // if the route is in one or more badges, return error
  if (badges.length > 0) {
    return res.status(400).json({
      msg: 'Route is in one or more badges'
    })
  }

  // check if the route has an image and delete it
  if (route.image) {
    const pathImage = `./uploads/${route.image}`

    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage)
    }
  }

  // delete the route by id
  await Route.findByIdAndDelete(id)

  res.json({
    msg: 'Route deleted'
  })
}

module.exports = {
  routeGet,
  routeGetNoPagination,
  routeGetOne,
  routePost,
  routePut,
  routeDelete
}
