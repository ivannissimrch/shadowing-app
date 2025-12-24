import { Router } from "express";
import uploadsRouter from "./routes/uploads";
import lessonsRouter from "./routes/lessons";
import usersRouter from "./routes/users";
import teacherRouter from "./routes/teacher";

const router = Router();

router.use("/", uploadsRouter);
router.use("/lessons", lessonsRouter);
router.use("/users", usersRouter);
router.use("/teacher", teacherRouter);

export default router;
