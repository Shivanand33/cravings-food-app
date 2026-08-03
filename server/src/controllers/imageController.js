import Menu from "../models/menuSchema.js";
import cloudinary from "../config/cloudinary.js";

export const RestaurantRemoveMenuImage = async (req, res, next) => {
  try {
    const { id } = req.params; // menu item id
    const { publicID } = req.body;

    if (!publicID) {
      const error = new Error("publicID is required");
      error.statusCode = 400;
      return next(error);
    }

    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      const error = new Error("Menu item not found");
      error.statusCode = 404;
      return next(error);
    }

    const imageExists = menuItem.images.find((img) => img.publicID === publicID);
    if (!imageExists) {
      const error = new Error("Image not found on this menu item");
      error.statusCode = 404;
      return next(error);
    }

    try {
      await cloudinary.uploader.destroy(publicID);
    } catch (err) {
      console.log("Cloudinary destroy error:", err);
    }

    menuItem.images = menuItem.images.filter((img) => img.publicID !== publicID);
    await menuItem.save();

    res.status(200).json({ message: "Image removed", data: menuItem.images });
  } catch (error) {
    next(error);
  }
};

export default RestaurantRemoveMenuImage;
