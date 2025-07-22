import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){


    const body =  await request.json();
    const {email,password} = body;


    try{
        // fetch with api 
        const fetchData = await fetch('https://car-nextjs-api.cheatdev.online/login',{
            method: "POST",
            headers:{
                'Content-Type':"application/json"
            },
            body: JSON.stringify({email,password})
        })

        if(!fetchData.ok){
            return NextResponse.json({
                message: "Failed to register"
            }, 
            {
                status: fetchData.status
            }
        )
        }
        const data = await fetchData.json();
        console.log("the data after login: ",data);
            // set cookie 
        const cookieStore = cookies();
        const cookieName = "refeshToken";
        const refreshToken = data.refresh_token;
        const accessToken = data.access_token;

        if(refreshToken){
            
        // set cookieName and refreshToken into cookie
        (await cookieStore).set({
            name:cookieName,
            value: refreshToken,
            sameSite: "lax",
            httpOnly: true,
            secure: true
        })
        }

        if(accessToken){
                // set cookieName and refreshToken into cookie
        (await cookieStore).set({
            name:"accessToken",
            value: accessToken,
            sameSite: "lax",
            httpOnly:  false ,
            secure:false
        })

        }

    
        return NextResponse.json(data)
    }catch(error){
        console.log(error)
    }

}