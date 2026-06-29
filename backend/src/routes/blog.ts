import { Router } from "express";
import {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../db";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const publishedOnly = req.query.publishedOnly !== "false";
    const posts = await getBlogPosts(publishedOnly);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get("/slug/:slug", async (req, res, next) => {
  try {
    const post = await getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const post = await createBlogPost(req.body);
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const post = await updateBlogPost(req.params.id, req.body);
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteBlogPost(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
