import Service from "../models/service.model.js";


const getServices = async (req, res) => {
  try {
    const services = await Service.find()

    res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services"
    })
  }
}


export default getServices