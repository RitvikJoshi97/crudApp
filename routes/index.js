const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const UserData = require('../models/Data')

// @desc  login/landing page
// @route GET /
router.get('/', ensureGuest, (req,res) => {
    //res.send('login')
    res.render('login',{
        layout: 'login',
    })
})


// @desc  dashboard page
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async(req,res) => {
    try{
        const userData = await UserData.find({ user: req.user.id }).lean()
        res.render('Dashboard',{
            name: req.user.firstName,
            userData
        })

    }catch (err){
        console.error(err)
        res.render('error/500')
    }

    
})



module.exports = router