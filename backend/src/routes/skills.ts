import { Router } from "express";
import {
  getSkillCategories,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  reorderSkillCategories,
} from "../db";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const categories = await getSkillCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const cat = await createSkillCategory(req.body);
    res.status(201).json(cat);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const cat = await updateSkillCategory(req.params.id, req.body);
    res.json(cat);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteSkillCategory(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post("/reorder", async (req, res, next) => {
  try {
    await reorderSkillCategories(req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
