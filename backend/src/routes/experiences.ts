import { Router } from "express";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
} from "../db";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const experiences = await getExperiences();
    res.json(experiences);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const exp = await createExperience(req.body);
    res.status(201).json(exp);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const exp = await updateExperience(req.params.id, req.body);
    res.json(exp);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteExperience(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post("/reorder", async (req, res, next) => {
  try {
    await reorderExperiences(req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
