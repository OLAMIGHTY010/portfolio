import { Router } from "express";
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "../db";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const certificates = await getCertificates();
    res.json(certificates);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const certificate = await createCertificate(req.body);
    res.status(201).json(certificate);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const certificate = await updateCertificate(req.params.id, req.body);
    res.json(certificate);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteCertificate(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
