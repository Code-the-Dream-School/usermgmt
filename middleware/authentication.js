const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // attach the user to the job routes
    req.userId = payload.userId
    next()
  } catch (error) {
    console.log(error)
    throw new UnauthenticatedError('Authentication invalid')
  }
}

const authOneTime = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1]
    try {
      payload = jwt.decode(token)
      user = await User.findById(payload.userId)
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
    if (!user) {
        throw new UnauthenticatedError('Authentication invalid')
    }
    try {
      user.verifyOneTimeToken(token)
      req.user=user
      next()
    } catch (error) {
      throw new UnauthenticatedError('Authentication invalid')
    }  
}
module.exports = { auth, authOneTime }