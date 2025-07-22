
"use client"
import { useForm } from "react-hook-form"

export default function FormComponent(){
    
    const {register, handleSubmit,formState:{errors},reset} = useForm({
        defaultValues:{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmed_password: ""
        },
        mode: "onSubmit"
    })

    return(
        <form onSubmit={handleSubmit(console.log)}>
            {/* firstname input */}
            <label htmlFor="">FirstName:</label>
            <input  type="text" {...register("firstName")} placeholder="Enter your firstName" className="rounded-lg p-2 border mt-3" /> <br/>

            {/* lastname input */}
            <label htmlFor="">LastName:</label>
            <input type="text" {...register("lastName")} placeholder="Enter lastName"
             className="rounded-lg p-2 border mt-3"
            /> <br/>

            {/* email input */}
            <label htmlFor="">Email:</label>
            <input type="email" {...register("email")}
            placeholder="Enter email"
            className="rounded-lg p-2 border mt-3"
            /> <br/>

            {/* password input */}
            <label htmlFor="">Password:</label>
            <input type="password" {...register("password")} placeholder="Enter your Password"
            className="rounded-lg p-2 border mt-3"
            /> <br/>

            {/* confirmed_password */}
            <label htmlFor="">Confirm Password:</label>
            <input type="password" placeholder="Enter your confirmed_password" {...register("confirmed_password")}
             className="rounded-lg p-2 border mt-3"
            /> <br/>

            {
                errors.confirmed_password && <p>{errors.confirmed_password.message}</p>
            }
            

            <input type="submit" onClick={()=>reset()} className="rounded-lg bg-red-300 p-2 border" />
        </form>

    )
}