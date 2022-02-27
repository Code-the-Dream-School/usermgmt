const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')
const { sendVerifyEmail, sendPasswordResetEmail } = require('../email/sender')
function sendVerifyPrompt(tokenURL, req) {
  sendVerifyEmail(req.body.email.toLowerCase(), tokenURL)
}
function createTokenURLVerify(user, req) {
  const token = user.createOneTimeToken()
  const tokenURL = `${req.protocol}://${req.get('host')}/emailValidate/${token}`
  return tokenURL
}

function createTokenURLReset(user, req) {
  const token = user.createOneTimeToken()
  const tokenURL = `${req.protocol}://${req.get('host')}/resetPassword/${token}`
  return tokenURL
}

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
  const tokenURL = createTokenURLVerify(user, req)
  sendVerifyPrompt(tokenURL, req)
  res.status(StatusCodes.CREATED).json(
    {
      message: `An account for ${req.body.email} was created.`
    })
}

const login = async (req, res, next) => {
  // replace the following line with your code here
  throw new BadRequestError('This method is not yet implemented.')
}

const validateEmail = async (req, res, next) => {
  await req.user.updateOne({ valid: true })
  res.status(StatusCodes.OK).json({ message: "The user email was validated.", email: req.user.email })
}


const resetPassword = async (req, res, next) => {
   // replace the following line with your code here
   throw new BadRequestError('This method is not yet implemented.')
}


const changePassword = async (req, res, next) => {
  if (!req.body.password || !req.body.oldPassword) {
    throw new BadRequestError('Please provide the old password and the new password.')
  }
  const user = await User.findById(req.userId)
  if (!user) {
    throw new BadRequestError('Malformed one time token.') // should never happen
  }
  const pwgood = await user.comparePassword(req.body.oldPassword)
  if (!pwgood) {
    throw new BadRequestError('What was entered for the current password is not correct.')
  }
  user.password = req.body.password
  await user.save()
  res.status(StatusCodes.OK).json({ message: "The user password was changed." })
}

const test = async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "You are logged in with valid credentials." })
}

const validateOneTimeToken = async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "The one-time credential was validated.", email: req.user.email })
}

const getOneTimeToken = async (req, res) => { // just for testing
  if (process.env.NODE_ENV === 'production') {
    throw new BadRequestError('This operation is not supported.')
  }
  if (!req.body.email || !req.body.password) {
    throw new BadRequestError('Please provide an email and a password.')
  }
  const user = await User.findOne({ email: req.body.email.toLowerCase() })
  if (!user) {
    throw new UnauthenticatedError('Request not authenticated.')
  }
  const isCorrectPassword = await user.comparePassword(req.body.password)
  if (!isCorrectPassword) {
    throw new UnauthenticatedError('Request not authenticated')
  }
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
  const tokenURL = createTokenURLVerify(user, req)
  sendVerifyPrompt(tokenURL, req)
  res.status(StatusCodes.OK).json({
    message: 'The email address verification email was sent.'
  })
}

const sendPasswordResetPrompt = async (req, res) => {
  // replace the following line with your code here
  throw new BadRequestError('This method is not yet implemented.')
}

const sendEmailValidateLink = async (req, res) => { // just for testing
  // should always return a BadRequestError in production
  if (process.env.NODE_ENV === 'production') {
    throw new BadRequestError('This operation is not supported.')
  }
  if (!req.body.email || !req.body.password) {
    throw new BadRequestError('Please provide an email and a password.')
  }
  const user = await User.findOne({ email: req.body.email.toLowerCase() })
  if (!user) {
    throw new NotFoundError('That email was not found.')
  }
  const isCorrectPassword = await user.comparePassword(req.body.password)
  if (!isCorrectPassword) {
    throw new UnauthenticatedError('Request not authenticated')
  }
  const tokenURL = createTokenURLVerify(user, req)
  res.status(StatusCodes.OK).json({
    verificationLink: tokenURL
  })
}

const sendPasswordResetLink = async (req, res) => { // just for testing
  // should always return a BadRequestError in production
  if (process.env.NODE_ENV === 'production') {
    throw new BadRequestError('This operation is not supported.')
  }
  if (!req.body.email || !req.body.password) {
    throw new BadRequestError('Please provide an email and a password.')
  }
  const user = await User.findOne({ email: req.body.email.toLowerCase() })
  if (!user) {
    throw new NotFoundError('No user with that email was found.')
  }
  const isCorrectPassword = await user.comparePassword(req.body.password)
  if (!isCorrectPassword) {
    throw new UnauthenticatedError('Request not authenticated')
  }
  const tokenURL = createTokenURLReset(user, req)
  res.status(StatusCodes.OK).json({
    resetLink: tokenURL
  })
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
  sendEmailValidatePrompt,
  sendEmailValidateLink,
  sendPasswordResetLink
}
