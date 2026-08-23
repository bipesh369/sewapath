import Service from "../models/service.model.js";
import asyncHandler from "../utils/asyncHandler.js";


const getServices = asyncHandler(async (req, res)=> {
    const services = await Service.find()

    res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: services
    });
  });; 


export default getServices