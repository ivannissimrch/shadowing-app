import { Router } from "express";
import uploadsRouter from "./routes/uploads.js";
import lessonsRouter from "./routes/lessons.js";
import usersRouter from "./routes/users.js";
import teacherRouter from "./routes/teacher.js";
import speechRouter from "./routes/speech.js";
import practiceWordsRouter from "./routes/practiceWords.js";
import listsRouter from "./routes/lists.js";

const router = Router();

router.use("/", uploadsRouter);
router.use("/lessons", lessonsRouter);
router.use("/users", usersRouter);
router.use("/teacher", teacherRouter);
router.use("/teacher/lists", listsRouter);
router.use("/speech", speechRouter);
router.use("/practice-words", practiceWordsRouter);

export default router;
