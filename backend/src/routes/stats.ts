import { Router } from "express";
import { getStats, createStat, updateStat, deleteStat, reorderStats } from "../db";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const stat = await createStat(req.body);
    res.status(201).json(stat);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const stat = await updateStat(req.params.id, req.body);
    res.json(stat);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteStat(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post("/reorder", async (req, res, next) => {
  try {
    await reorderStats(req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
