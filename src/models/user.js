const { Schema, model } = require('mongoose')
const badge = require('./badge')

const UserSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    image: {
      type: String
    },
    role: {
      type: String,
      default: 'USER_ROLE'
    },
    status: {
      type: Boolean,
      default: true
    },
    google: {
      type: Boolean,
      default: false
    },
    badges: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Badge'
      }
    ],
    progress: [
      {
        start: Date,
        end: Date,
        route: {
          type: Schema.Types.ObjectId,
          ref: 'Route'
        },
        visitedLocations: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Location'
          }
        ],
        status: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, createdAt, updatedAt, ...user } = this.toObject()
  user.uid = _id
  return user
}

module.exports = model('User', UserSchema)
