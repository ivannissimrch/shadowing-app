import { Router } from "express";
import uploadsRouter from "./routes/uploads.js";
import lessonsRouter from "./routes/lessons.js";
import usersRouter from "./routes/users.js";
import teacherRouter from "./routes/teacher.js";

const router = Router();

router.use("/", uploadsRouter);
router.use("/lessons", lessonsRouter);
router.use("/users", usersRouter);
router.use("/teacher", teacherRouter);

export default router;
