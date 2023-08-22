import { response, Router } from "express";
import productModel from "../models/productModel.js";

const router = Router()

router.get('/', async (req, res) => {
    const products = await productModel.find().lean().exec()
    
    if (req.session?.user) {
        let user = (req.session.user)
        res.render('home', { products, user})    
    }
    else{
        res.render('home', { products})    
    }
    
    
})

router.get('/register', (req, res) => {
    if(req.session?.user) {
        res.redirect('/profile')
    }

    res.render('register', {})
})

function auth(req, res, next) {
    if(req.session?.user) return next()
    res.redirect('/')
}

router.get('/profile', auth, (req, res) => {
    const user = req.session.user

    res.render('profile', user)
})

router.get('/login', (req, res) => {
    res.render('login', {})
})

export default router