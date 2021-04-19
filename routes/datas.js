const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Data = require('../models/Data')

const UserData = require('../models/Data')

// @desc  Show add page
// @route GET /datas/add
router.get('/add', ensureAuth, (req,res) => {
    //res.send('login')
    res.render('datas/add')
})

// @desc  process add page
// @route POST /datas
router.post('/', ensureAuth, async(req,res) => {
    //res.send('login')
    try{
        req.body.user = req.user.id
        await Data.create(req.body)
        res.redirect('/dashboard')
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
})

// @desc  Show all data
// @route GET /datas/add
router.get('/public', ensureAuth, async (req,res) => {
    try{
        const publicData = await Data.find({status: 'public'})
            .populate('user')
            .sort({ createdAt: 'desc'})
            .lean()

        res.render('datas/index', {
            publicData,
        })
    }catch(err){
        console.log(err)
        res.redirect('error/500')
    }
    
})

module.exports = router