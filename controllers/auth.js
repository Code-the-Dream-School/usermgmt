const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')
const { sendVerifyEmail, sendPasswordResetEmail } = require('../email/sender')
function sendVerifyPrompt(user) {
  const token = user.createOneTimeToken()
  const tokenURL = `${req.protocol}://${req.get('host')}/emailValidate/${token}`
  sendVerifyEmail(req.body.email.toLowerCase(), tokenURL)
}
const register = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    throw new BadRequestError('Please provide an email and a password.')
  }
  let user = await User.findOne({ email: req.body.email.toLowerCase() })
  if (user) {
    if (!user.valid) {
      user = await user.save({ password: req.body.password })
    } else {
      throw new BadRequestError('That email is already registered.')
    }
  } else {
    user = await User.create({ ...req.body })
  }
  sendVerifyEmail(user)
  res.status(StatusCodes.CREATED).json({ user: { email: user.email } })
}

const login = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    console.log("couldn't find user")
    throw new UnauthenticatedError('Invalid Credentials')
  }
  if (!user.valid) {
    console.log("user not validated")
    throw new BadRequestError('The email has not been validated')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  // compare password
  const token = user.createJWT()
  const payload = jwt.decode(token)
  const expires = payload.exp
  console.log("token expires", expires)
  res.status(StatusCodes.OK).json({ token, expires })
}

const validateEmail = async (req, res, next) => {
  console.log(req.user)
  await req.user.updateOne({ valid: true })
  res.status(StatusCodes.OK).json({ message: "The user email was validated." , email: req.user.email })
}


const resetPassword = async (req, res, next) => {
  if (!req.body.password) {
    throw new BadRequestError('Please provide a password.')
  }
  //const user1 = await User.findOneAndUpdate({_id: req.user._id}, {password: req.body.password})
  req.user.save({ password: req.body.password })
  console.log("user is", req.user)
  res.status(StatusCodes.OK).json({ message: `The user password for ${req.user.email} was reset to the new value. `})
}


const changePassword = async (req, res, next) => {
  if (!req.body.password || !req.body.oldPassword) {
    throw new BadRequestError('Please provide the old password and the new password.')
  }
  const user = await User.findById(req.userId)
  if (!user) {
    return res.status(StatusCodes.BadRequestError('Malformed one time token.')) // should never happen
  }
  const pwgood = await user.comparePassword(req.body.oldPassword)
  if (!pwgood) {
    return res.status(StatusCodes.BadRequestError('Authentication mismatch'))  // should never happen
  }
  await user.save({ password: req.body.password })
  res.status(StatusCodes.OK).json({ message: "The user password was changed." })
}

const test = async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "You are logged in with valid credentials." })
}

const validateOneTimeToken = async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "The one-time credential was validated.", email: req.user.email })
}

const getOneTimeToken = async (req, res) => { // just for testing
  if (!req.body.email || !req.body.password) {
    throw new BadRequestError('Please provide an email and a password.')
  }
  const user = await User.findOne({ email: req.body.email.toLowerCase() })
  if (!user) {
    throw new UnauthenticatedError('Request not authenticated.')
  }
  // isCorrectPassword = await user.comparePassword(req.body.password)
  // if (!isCorrectPassword) {
  //   throw new UnauthenticatedError('Request not authenticated')
  // }
  const token = user.createOneTimeToken()
  res.status(StatusCodes.OK).json({ token })
}

const sendEmailValidatePrompt = async (req, res) => {
  if (!req.body.email) {
    throw new BadRequestError('Please provide an email.')
  }
  const user = await User.findOne({ email: req.body.email.toLowerCase() })
  if (!user) {
    throw new NotFoundError('That email was not found.')
  }
  sendVerifyPrompt(user)
  res.status(StatusCodes.OK).json({ message: 'The password verification email was sent.' })
}

const sendPasswordResetPrompt = async (req, res) => {
  if (!req.body.email) {
    throw new BadRequestError('Please provide an email.')
  }
  const user = await User.findOne({ email: req.body.email.toLowerCase() })
  if (!user) {
    throw new NotFoundError('No user with that email was found.')
  }
  const token = user.createOneTimeToken()
  const tokenURL = `${req.protocol}://${req.get('host')}/resetPassword/${token}`
  sendPasswordResetEmail(req.body.email, tokenURL)
  res.status(StatusCodes.OK).json({ message: 'The password reset email was sent.' })
}

module.exports = {
  register,
  login,
  validateEmail,
  resetPassword,
  changePassword,
  test,
  validateOneTimeToken,
  getOneTimeToken,
  sendPasswordResetPrompt,
  sendEmailValidatePrompt
}
