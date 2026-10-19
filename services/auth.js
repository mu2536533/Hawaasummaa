import { account,ID } from "@/lib/appwrite";


export async function registerUser(email, password, name) {
    try {
        console.log('registering User',email);
        const user = await account.create(
            ID.unique(),
            email,
            password,
            name,
        );
        console.log("user created succesfully")
        await loginUser(email,password);
        return{success: true,userId: user.$id}
    } catch (error) {
        console.log("registeration error", error||error.message)
        return{
            success: false,
            error:error.message||'registeration failed. try different email'
        }
    }
}


export async function loginUser(email,password) {
    try{
        console.log('loggin in',email)
        const session = await account.createEmailPasswordSession(email, password);
        console.log('session created', session.$id)

        const user = await account.get();
        console.log('Loggin in as:', user.name, user.email)
        return{
            success:true,
            user: {
                id: user.$id,
                email: user.email,
                name:user.name
            }
        };

    }catch(error) {
        console.log("loggin error: ",error||error.message)
        return{
            success: false,
            error: error.message|| 'login failed. check email/password'
        }
    }
}
export async function logoutUser() {
    try {
        await account.deleteSession('current');
        console.log("logged out succesfuly")

        return{
            success:true,
        }
    } catch (error) {
        return{
            success:false,
            error:error.message
        }
    }
}
export async function getCurrentUser() {
  try {
    const user =await account.get();
    console.log('current: ', user.email)
    return{
        success:true,
            user: {
                id: user.$id,
                email: user.email,
                name:user.name
        }
    };
  } catch (error) {
    console.log('no user logged in')
    return{
        success:false,
        error: "no user logged in"
    }
    
  }
}
export async function checkAuthStatus() {
    try {
        await account.get();
    } catch (error) {
        return false
    }
}