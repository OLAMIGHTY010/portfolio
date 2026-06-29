import { Router } from "express";
import { getSiteSettings, updateSiteSettings } from "../db";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const settings = await getSiteSettings();
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const settings = await updateSiteSettings(req.body);
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

export default router;
