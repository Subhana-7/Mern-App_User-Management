import { errorHandler } from "./error.js";
import User from "../models/user.model.js";

export const verifyAdmin = async(req , res , next) => {
  try {
    const user = await User.findById(req.user.id);
    if(!user.isAdmin){
      return next(
        errorHandler(403, "You are not authorized as admin to perform this action!")
      );
    }
    next();
  } catch (error) {
    next(error);
  }
}