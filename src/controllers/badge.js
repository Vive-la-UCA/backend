const { response } = require('express')
const { Badge, Route } = require('../models')

const badgeGet = async (req, res = response) => {
  const { limit = 5, skip = 0 } = req.query
  const query = {}

  const [total, badges] = await Promise.all([
    Badge.countDocuments(query),
    Badge.find(query).limit(Number(limit)).skip(Number(skip))
  ])

  res.json({
    total,
    badges
  })
}

const badgeGetAll = async (_, res = response) => {
  const badges = await Badge.find()

  res.json({
    badges
  })
}

const badgeGetOne = async (req, res = response) => {
  const { id } = req.params

  const badge = await Badge.findById(id).populate('route', 'name')

  res.json({
    badge
  })
}

const badgePost = async (req, res = response) => {
  // Multer middleware has already handled file upload, so the filename is available in req.file.filename
  const { name, route } = req.body
  const image = req.file.filename

  // Check if the name exists
  const badge = await Badge.findOne({ name })
  if (badge) {
    // If there's an error, delete the uploaded image
    if (req.file) {
      fs.unlinkSync(req.file.path) // Delete the uploaded file
    }
    return res.status(400).json({
      msg: 'Badge already exists'
    })
  }

  // Check if the route exists
  const routeExists = await Route.findById(route)
  if (!routeExists) {
    // If there's an error, delete the uploaded image
    if (req.file) {
      fs.unlinkSync(req.file.path) // Delete the uploaded file
    }

    return res.status(400).json({
      msg: 'Route does not exist'
    })
  }

  try {
    // Create new badge with image filename and route ID
    const newBadge = new Badge({ name, image, route })
    await newBadge.save()

    res.json({
      newBadge
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      msg: 'Internal server error'
    })
  }
}

const badgePut = async (req, res = response) => {
  const { id } = req.params
  const { ...data } = req.body

  let image

  if (req.file) {
    image = req.file.filename
  }

  try {
    let updatedBadge

    if (image) {
      // remove old image
      const badge = await Badge.findById(id)
      if (badge.image) {
        const pathImage = `./uploads/${badge.image}`

        if (fs.existsSync(pathImage)) {
          fs.unlinkSync(pathImage)
        }
      }

      updatedBadge = await Badge.findByIdAndUpdate(
        id,
        { ...data, image }, // Include image data if present
        { new: true }
      )
    } else {
      updatedBadge = await Badge.findByIdAndUpdate(
        id,
        data, // Update only the data if no image
        { new: true }
      )
    }

    res.json({
      updatedBadge
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      msg: 'Internal server error'
    })
  }
}

const badgeDelete = async (req, res = response) => {
  const { id } = req.params

  try {
    const badge = await Badge.findById(id)

    if (badge.image) {
      const pathImage = `./uploads/${badge.image}`

      if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage)
      }
    }

    await Badge.findByIdAndDelete(id)

    res.json({
      msg: 'Badge deleted'
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      msg: 'Internal server error'
    })
  }
}

module.exports = {
  badgeGet,
  badgeGetAll,
  badgeGetOne,
  badgePost,
  badgePut,
  badgeDelete
}
