const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError, BadRequestError } = require('../errors')

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("no bearer token")
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.userId
    next()
  } catch (error) {
    console.log(error)
    if (error.name==='TokenExpiredError') {
      throw new BadRequestError('The token has expired.')
    }
    throw new UnauthenticatedError('Authentication invalid')
  }
}

const authOneTime = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No bearer toekn')
      throw new UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1]
    let user = undefined
    try {
      const payload = jwt.decode(token)
      user = await User.findById(payload.userId)
    } catch (error) {
      console.log(error)
        throw new UnauthenticatedError('Authentication invalid')
    }
    if (!user) {
      console.log("user not found")
        throw new UnauthenticatedError('Authentication invalid')
    }
    try {
      console.log("at 47")
      user.verifyOneTimeToken(token)
      req.user=user
      next()
    } catch (error) {
      console.log(error)
      console.log("at 52")
      if (error.name==='TokenExpiredError') {
        console.log("at 54")
        throw new BadRequestError('The token has expired.')
      }
      console.log("at 55")
      throw new UnauthenticatedError('Authentication invalid')
    }  
}
module.exports = { auth, authOneTime }