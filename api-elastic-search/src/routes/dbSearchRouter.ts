import { Request, Response, Router } from "express";
import pool from "../config/dbConfig";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const [result] = await pool.query(
    "SELECT * from spotify_history WHERE track_name LIKE '%high%' OR artist_name LIKE '%A%' OR track_uri LIKE 'PTF'"
  );
  //    send response to client
  res.json(result);
});

export default router;
