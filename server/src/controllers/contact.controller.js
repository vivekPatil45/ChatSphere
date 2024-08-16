import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";


export const searchContact = async (req, res, next) => {
    try {
        const { search } = req.body;
    
        if (search === undefined && search === "") {
            return next(errorHandler(400, "SearchTerm is Required."));

        }
    
        const sanitizedSearchTerm = search.replace(/[.*+?^${}()[\]\\]/g, "\\$&");
    
        const regex = new RegExp(sanitizedSearchTerm, "i");
    
        const contact = await User.find({
            $and: [
                { _id: { $ne: req.userId } },
                {
                    $or: [
                        {
                            firstName: regex,
                        },
                        {
                            lastName: regex,
                        },
                        {
                            email: regex,
                        },
                    ],
                },
            ],
        }).select("-password");
    
        res
            .status(200)
            .json({ success: true, message: "Succesfully search contact", contact });
      } catch (error) {
        next(error);
      }
}