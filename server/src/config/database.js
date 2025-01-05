import mongoose from "mongoose";
export const connect = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("DB connected Successfully");
    })
    .catch((err) => {
      console.log("DB not connected");
      console.error(err);
      process.exit(1);
    });
};
