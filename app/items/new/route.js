import item from '../../../models/item'
import { connectToDB } from '../../../utils/database'
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
    try {
      await connectToDB();

      const { userId, tripId, bagId, categoryId, name, qty, description, weight, wgtOpt, priority, link, worn } = await req.json();
      const Item = new item({ creator: userId, tripId, bagId, categoryId, name, qty, description, weight, wgtOpt, priority, link, worn });
      await Item.save();
      return new NextResponse(JSON.stringify(Item), { status: 200 });
    } catch (error) {
      return new NextResponse("Failed to post items", { status: 500 });
    }
  };
  

  export const revalidate = 0;