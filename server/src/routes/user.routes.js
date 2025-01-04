import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    handleFriendRequest,
    getAllRequests,
    sendFriendRequest,
    getFriends,
    getRecommendedPeople,
    addInterests
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/friend-request").post(verifyJWT, handleFriendRequest);
router.route("/request").get(verifyJWT, getAllRequests).post(verifyJWT, sendFriendRequest);
router.route("/friends").get(verifyJWT, getFriends);
router.route("/recommended").get(verifyJWT, getRecommendedPeople)
router.route("/interests").post(verifyJWT, addInterests)
export default router;
