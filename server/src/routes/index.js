import userRouter from './user.routes.js'

export default (app) => {
    app.use("/api/v1/users", userRouter);
}