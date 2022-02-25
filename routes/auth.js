const express = require('express')
const { auth, authOneTime } = require('../middleware/authentication')
const router = express.Router()
const { register, login, validateEmail, resetPassword, changePassword, test,
    validateOneTimeToken, getOneTimeToken, sendPasswordResetPrompt,
    sendEmailValidatePrompt, sendEmailValidateLink, sendPasswordResetLink } 
    = require('../controllers/auth')
router.post('/register', register)
router.post('/login', login)
router.put('/validateEmail', authOneTime, validateEmail)
router.put('/resetPassword', authOneTime, resetPassword)
router.put('/changePassword', auth, changePassword)
router.get('/test', auth, test)
router.get('/validateOneTimeToken', authOneTime, validateOneTimeToken)
router.post('/getOneTimeToken', getOneTimeToken)
router.post('/requestPasswordResetPrompt', sendPasswordResetPrompt)
router.post('/sendEmailValidatePrompt', sendEmailValidatePrompt)
router.post('/sendEmailValidateLink', sendEmailValidateLink)
router.post('/sendPasswordResetLink', sendPasswordResetLink)

module.exports = router
