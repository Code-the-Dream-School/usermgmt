const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    throw new BadRequestError('Please provide an email and a password.')
  }
  let user = await User.findOne({ email: req.body.email.toLowerCase() })
  if (user) {
    if (!user.valid) {
      user.password = req.body.password
      user = await user.save()
    } else {
      throw new BadRequestError('That email is already registered.')
    }
  } else {
      user = await User.create({ ...req.body })
  }
  res.status(StatusCodes.CREATED).json({ user: { email: user.email } })
}

const login = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  if (!user.valid) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  // compare password
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ token })
}

const validateEmail = async (req, res, next) => {
  req.user.valid = true
  await req.user.update()
  res.status(StatusCodes.OK).json({ message: "The user email was validated." })
}


const resetPassword = async (req, res, next) => {
  if (!req.body.password) {
    throw new BadRequestError('Please provide a password.')
  }
  req.user.password = req.body.password
  await req.user.updateOne()
  res.status(StatusCodes.OK).json({ message: "The user password was reset to the new value." })
}


const changePassword = async (req, res, next) => {
  if (!req.body.password || !req.body.oldPassword) {
    throw new BadRequestError('Please provide the old password and the new password.')
  }
  const user = await User.findById(req.userId)
  if (!user) {
    return res.status(StatusCodes.BadRequestError('Malformed one time token.')) // should never happen
  }
  pwgood = await user.comparePassword(req.body.oldPassword)
  if (!pwgood) {
    return res.status(StatusCodes.BadRequestError('Authentication mismatch'))  // should never happen
  }
  user.password = req.body.password
  await user.updateOne()
  res.status(StatusCodes.OK).json({ message: "The user password was changed." })
}

const test = async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "You are logged in with valid credentials." })
}

const validateOneTimeToken = async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "The one-time credential was validated." })
}

const getOneTimeToken = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    throw new BadRequestError('Please provide an email and a password.')
  }
  const user = await User.findOne({ email: req.body.email.toLowerCase() })
  if (!user) {
    throw new UnauthenticatedError('Request not authenticated.')
  }
  isCorrectPassword = await user.comparePassword(req.body.password)
  if (!isCorrectPassword) {
    throw new UnauthenticatedError('Request not authenticated')
  }
  token = user.createOneTimeToken()
  res.status(StatusCodes.OK).json({ token })
}

module.exports = {
  register,
  login,
  validateEmail,
  resetPassword,
  changePassword,
  test,
  validateOneTimeToken,
  getOneTimeToken
}
