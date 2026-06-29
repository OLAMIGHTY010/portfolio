import { Router } from "express";
import {
  getTimeline,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
  reorderTimeline,
} from "../db";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const timeline = await getTimeline();
    res.json(timeline);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const item = await createTimelineItem(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const item = await updateTimelineItem(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteTimelineItem(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post("/reorder", async (req, res, next) => {
  try {
    await reorderTimeline(req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
