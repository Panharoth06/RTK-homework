"use client"

import CreateCarFormComponent from "../form/CreateCarForm"
import DeleteCarFormComponent from "../form/DeleteCarForm"
import UpdateCarFormComponent from "../form/UpdateCarForm"

export default function DashboardPage() {

    

     // Get access token from cookie
      // const getCookie = (name: string) => {
      //   const value = `; ${document.cookie}`;
      //   const parts = value.split(`; ${name}=`);
      //   if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      //   return null;
      // };

      // const accessToken = getCookie('accessToken');
      // console.log("accessToken: ", accessToken);

  return (
    <div>
        <CreateCarFormComponent/>
        <UpdateCarFormComponent/>
        <DeleteCarFormComponent/>
    </div>
  )
}
