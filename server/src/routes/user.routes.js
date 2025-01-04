import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    addFriend,
    getAllRequests,
    rejectFriendRequest
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/add-friend").post(verifyJWT, addFriend);
router.route("/requests").get(verifyJWT, getAllRequests);
router.route("/reject").patch(verifyJWT, rejectFriendRequest);

export default router;
