const express = require('express')
const { auth, authOneTime } = require('../middleware/authentication')
const router = express.Router()
const { register, login, validateEmail, resetPassword, changePassword, test, 
    validateOneTimeToken, getOneTimeToken } = require('../controllers/auth')
router.post('/register', register)
router.post('/login', login)
router.put('/validateEmail', authOneTime, validateEmail)
router.put('/resetPassword', authOneTime, resetPassword)
router.put('/changePassword', auth, changePassword)
router.get('/test', auth, test)
router.get('/validateOneTimeToken', authOneTime, validateOneTimeToken)
router.get('/getOneTimeToken', getOneTimeToken)

module.exports = router
