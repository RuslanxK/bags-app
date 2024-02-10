import bag from '../../models/bag'
import { connectToDB } from "../../utils/database"
import { NextResponse } from "next/server"


export const GET = async (req, res) => {

     try {

           await connectToDB()

           const bags = await bag.find({})
           return new NextResponse(JSON.stringify(bags), {status: 200})
     }

     catch(error) {

        return new NextResponse("Failed to fetch bags", {status: 500})
     }
}