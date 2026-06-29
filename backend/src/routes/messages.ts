import { Router } from "express";
import {
  getMessages,
  getUnreadMessageCount,
  sendMessage,
  markMessageAsRead,
  deleteMessage,
} from "../db";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const messages = await getMessages();
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

router.get("/unread-count", async (req, res, next) => {
  try {
    const count = await getUnreadMessageCount();
    res.json({ count });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const message = await sendMessage(req.body);
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
});

router.put("/:id/read", async (req, res, next) => {
  try {
    await markMessageAsRead(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteMessage(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
