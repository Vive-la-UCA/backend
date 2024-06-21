const { Schema, model } = require('mongoose')
const User = require('./user')

const BadgeSchema = Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  image: {
    type: String
  },
  route: {
    type: Schema.Types.ObjectId,
    ref: 'Route'
  }
})

// Middleware to handle cascading delete
BadgeSchema.pre('findOneAndDelete', async function (next) {
  const badgeId = this.getQuery()._id

  // Remove the badge reference from all users
  await User.updateMany({ badges: badgeId }, { $pull: { badges: badgeId } })

  next()
})

BadgeSchema.methods.toJSON = function () {
  const { __v, _id, ...badge } = this.toObject()
  badge.uid = _id
  return badge
}

module.exports = model('Badge', BadgeSchema)
