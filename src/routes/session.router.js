import { Router } from "express";
import UserModel from "../models/user.model.js";
import productModel from "../models/productModel.js";
import passport from "passport";
import { createHash, isValidPassword } from "../utils.js";

const router = Router()

router.get('/login', async (req, res) => {
    if(!req.session.user){ res.render('login')}   
    //return res.redirect('/home')
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email, password }).lean().exec()
   
        if (user.email === "adminCoder@coder.com"){
            const passChek = await UserModel.findOne({ password}).lean().exec();
          
            if (user.password ==="adminCod3r123"){
                console.log("Bienvenido Admin");
            } else{
                console.log("Bienvenido Usuario");
            }
        }    
           // return res.render("login");
      
    if(!user) return alert("No existe el usuario")

    req.session.user = user

    const products = await productModel.find().lean().exec()
    
    res.render('home', { products, user})
    console.log(user)  
})

// Iniciar Session para modificar
/*router.post('/login', passport.authenticate('login', '/login'), async (req, res) => {

    if (!req.user) return res.status(400).send('Invalid Credentials')
    req.session.user = req.user

    return res.render('/home')
})  */



router.post('/register', async (req, res) => {
   try {
            
            let {first_name, last_name, email, age, password} = req.body
            console.log (req.body)
            const userChek = await UserModel.findOne({email}).lean().exec();
             if (!userChek){
           /* if (user.email === "adminCoder@coder.com"){
                const passChek = await UserModel.findOne({ password}).lean().exec();
              
                if (user.password ==="adminCod3r123"){
                    console.log("Bienvenido Admin");
                    user.rol="admin";
                }  
                */
                await UserModel.create({first_name, last_name, email, age, password});
                return res.redirect("/login");
            } else {
                alert ('Ya existe el usuario')
            }
        
    }catch (e){  
        console.log(e);
    }    
   }) 

// Registro
/*router.post(
    '/register',
    passport.authenticate('register', { failureRedirect: '/register', }),
    async (req, res) => {
        res.redirect('/login')
    }
) */

// Profile
/*function auth(req, res, next) {
    if (req.session?.user) next()
    else res.redirect('/login')
} 
router.get('/profile', auth, (req, res) => {
    const user = req.session.user

    res.render('profile', user)
})


*/


router.delete("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
          console.error('Error al cerrar sesión:', err);
        } else {
          console.log('Sesión cerrada exitosamente');
          res.send("ok")
        }
    });
})

export default router