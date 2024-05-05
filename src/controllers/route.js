const { response } = require('express')
const { Route, Location, Badge } = require('../models')

const routeGet = async (req, res = response) => {
  const { limit = 5, skip = 0 } = req.query
  const query = {}

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
  const query = {}

  const routes = await Route.find(query)

  res.json({
    routes
  })
}

const routeGetOne = async (req, res = response) => {
  const { id } = req.params

  const route = await Route.findById(id).populate('locations', 'name')

  res.json({
    route
  })
}

const routePost = async (req, res = response) => {
  const { name, locations } = req.body
  const image = req.file.filename

  // check if the name exists
  const route = await Route.findOne({ name })
  if (route) {
    if (req.file) {
      fs.unlinkSync(req.file.path) // Delete the uploaded file
    }
    return res.status(400).json({
      msg: 'Route already exists'
    })
  }

  const newRoute = new Route({ name, image, locations })

  await newRoute.save()

  res.json({
    newRoute
  })
}

const routePut = async (req, res = response) => {
  const { id } = req.params
  const { ...data } = req.body

  let image

  if (req.file) {
    image = req.file.filename
  }

  try {
    let updatedRoute
    if (image) {
      // remove old image
      const route = await Route.findById(id)
      if (route.image) {
        const pathImage = `./uploads/${route.image}`

        if (fs.existsSync(pathImage)) {
          fs.unlinkSync(pathImage)
        }
      }
      updatedRoute = await Route.findByIdAndUpdate(
        id,
        { ...data, image },
        { new: true }
      )
    } else {
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
  const { id } = req.params

  const route = await Route.findById(id)

  if (route.image) {
    const pathImage = `./uploads/${route.image}`

    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage)
    }
  }

  // check if the route is in one badge
  const badges = await Badge.find({ route: id })

  if (badges.length > 0) {
    return res.status(400).json({
      msg: 'Route is in one or more badges'
    })
  }

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
