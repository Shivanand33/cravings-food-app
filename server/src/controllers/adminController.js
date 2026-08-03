import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Menu from "../models/menuSchema.js";

export const GetAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalRestaurants = await User.countDocuments({ role: "manager" });
    const totalRiders = await User.countDocuments({ role: "partner" });
    const totalOrders = await Order.countDocuments();
    const totalMenuItems = await Menu.countDocuments();

    const deliveredOrders = await Order.find({ status: "delivered" });
    const totalRevenue = deliveredOrders.reduce(
      (sum, ord) => sum + (ord.orderValue?.total || 0),
      0
    );

    res.status(200).json({
      message: "Admin statistics fetched successfully",
      data: {
        totalUsers,
        totalCustomers,
        totalRestaurants,
        totalRiders,
        totalOrders,
        totalMenuItems,
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const GetAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      message: "All users fetched successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const GetAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("userId", "fullName email mobileNumber")
      .populate("restaurantId", "restaurantName fullName mobileNumber")
      .populate("riderId", "fullName mobileNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All platform orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateUserRoleAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["admin", "manager", "partner", "customer"].includes(role)) {
      const error = new Error("Invalid role provided");
      error.statusCode = 400;
      return next(error);
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json({
      message: `User role updated to ${role} successfully`,
      data: targetUser,
    });
  } catch (error) {
    next(error);
  }
};
