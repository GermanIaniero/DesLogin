import { Router } from "express";
import UserModel from "../models/user.model.js";
import productModel from "../models/productModel.js";

const router = Router()

router.get('/login', async (req, res) => {
    res.render('login')
    //return res.redirect('/home')
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email, password })
    if(!user) return res.redirect('login')

    req.session.user = user

    const products = await productModel.find().lean().exec()
    res.render('home', { products, user})
    
    // const docs = await productModel.find({})
    // return res.render('home', docs)
    //return res.redirect('/profile')
    //return res.redirect('/home')
})

router.post('/register', async (req, res) => {
   try {
            const user = req.body;
            const email = user.email;
            const password = user.password;

            const userChek = await UserModel.findOne({ email}).lean().exec();
        if (!userChek){
            if (user.email === "adminCoder@coder.com"){
                const passChek = await UserModel.findOne({ password}).lean().exec();
              
                if (user.password ==="adminCod3r123"){
                    console.log("Bienvenido Admin");
                    user.rol="admin";
                }  
                
               } else{
                user.rol="user";
            }
            await UserModel.create(user);
            return res.render("login");
        } else {
            res.send('Ya existe el usuario')
        }
    }catch (e){  
        console.log(e);
    }    

   }) 



router.delete('/logout', (req,res) => {
    if (req.session.user){
        req.session.destroy()
        res.redirect("/login")

        req.session.destroy((err)=>{
            if(!err) return res.redirect("/login");
            res.send ({status:"logoutError", body: err});
        });   
    }
}); 


/*function desLogueo(){
const logoutButton = document.getElementById('logoutButton');
    
if(logoutButton) {
    logoutButton.addEventListener('click',async () => {
        try {
            const response = await fetch('api/session/logout', {
                method:'DELETE',
            });
            
            if (response.ok){
                console.log("redirigiendo");
                window.location.href='/login';
            } else {
                console.log('Error al cerrar sesión');
            }

        
        }catch (error){
            console.log('Error al comunicarse con el servidor:', error);
        }
       }); 
    }else{
        console.log("no existe");
    } 

}*/
export default router