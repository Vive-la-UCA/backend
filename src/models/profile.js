const { Schema, model } = require('mongoose')

const ProfileSchema = new Schema(
  {
    name: {
      type: String,
      trim: true
    },
    institution: {
      type: String,
      trim: true
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      trim: true
    },
    networks: {
      type: String,
      trim: true
    },
    // faculty: {
    //   // TODO: Relacionar con el modelo de faculty
    //   type: Schema.Types.ObjectId,
    //   ref: 'Faculty'
    // },
    // grade: {
    //   // TODO: Relacionar con el modelo de faculty
    //   type: Schema.Types.ObjectId,
    //   ref: 'Grade'
    // },
    means: {
      type: Boolean,
      default: null
    },
    parentUca: {
      type: Boolean,
      default: null
    },
    medio: {
      type: String,
      default: 'No definido'
    }
    // subscribed: [
    //   {
    //     student: { type: Schema.Types.ObjectId, ref: 'Event' },
    //     faculty: { type: Schema.Types.ObjectId, ref: 'Faculty' },
    //     grade: { type: Schema.Types.ObjectId, ref: 'Grade' },
    //     completed: {
    //       type: Boolean,
    //       default: false
    //     }
    //   }
    // ]
  },
  { timestamps: true }
)

ProfileSchema.methods.toJSON = function () {
  const {
    __v,
    createdAt,
    updatedAt,
    networks,
    means,
    parentUca,
    medio,
    ...user
  } = this.toObject()
  user.uid = _id
  return profile
}

module.exports = model('Profile', ProfileSchema)
