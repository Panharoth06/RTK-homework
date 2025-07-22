import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    const body =  await request.json();
    const {username,email,password,confirmed_password} = body;

    try{
        // fetch with api 
        const fetchData = await fetch('https://car-nextjs-api.cheatdev.online/register',{
            method: "POST",
            headers:{
                'Content-Type':"application/json"
            },
            body: JSON.stringify({username,email,password,confirmed_password})
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
        const data = fetchData.json();
        console.log("the data after register: ",data);

        return NextResponse.json(data)


    }catch(error){
        console.log(error)
    }

}