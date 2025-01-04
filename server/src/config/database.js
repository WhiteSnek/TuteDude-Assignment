import mongoose from "mongoose";
export const connect = () => {
  console.log("MongoDB URL:", process.env.MONGODB_URI);
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connected Successfully");
    })
    .catch((err) => {
      console.log("DB not connected");
      console.error(err);
      process.exit(1);
    });
};
