const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [8, 'Passwords must be at least 8 characters long.'],
    match: [
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,25}$/,
        'Passwords must contain at least one uppercase letter, at least one lowercase letter, at least one number,\
        and at least one special character'
      ]
  },
  valid: {
      type: Boolean,
      default: false
  }
})

UserSchema.pre('save', async function () {
  console.log("got here User 32")
  console.log(this.password)
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  this.email = this.email.toLowerCase()
})

UserSchema.pre('findOneAndUpdate', async function () {
  console.log("got here User 40")
  console.log(this.password)
})

UserSchema.pre('updateOne', async function(){
  console.log("got here user 45")
  console.log("query ",this.getQuery())
  console.log("update ",this._update)
  if (this.update.password) {
    const salt = await bcrypt.genSalt(10)
    this.update.password = await bcrypt.hash(this.password, salt)
  }
})

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

UserSchema.methods.createOneTimeToken = function () {
    return jwt.sign(
      { userId: this._id },
      this.password + process.env.JWT_SECRET,
      {
        expiresIn: process.env.ONE_TIME_TOKEN_LIFETIME,
      }
    )
  }

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

UserSchema.methods.verifyOneTimeToken = function (token) {
  return jwt.verify(token, this.password + process.env.JWT_SECRET)
}

module.exports = mongoose.model('User', UserSchema)
