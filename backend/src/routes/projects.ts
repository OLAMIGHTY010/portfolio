import { Router } from "express";
import {
  getProjects,
  getFeaturedProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../db";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const publishedOnly = req.query.publishedOnly !== "false";
    const featured = req.query.featured === "true";

    if (featured) {
      const projects = await getFeaturedProjects();
      return res.json(projects);
    }

    const projects = await getProjects(publishedOnly);
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

router.get("/slug/:slug", async (req, res, next) => {
  try {
    const project = await getProjectBySlug(req.params.slug);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const project = await createProject(req.body);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const project = await updateProject(req.params.id, req.body);
    res.json(project);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteProject(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
