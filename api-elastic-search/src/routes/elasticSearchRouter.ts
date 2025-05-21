import { Request, Response, Router } from "express";
import elasticClient from "../config/elasticSearch";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const result = await elasticClient.search({
    index: "spotify",
    query: {
      bool: {
        should: [
          {
            match: { track_name: "high" },
          },
          {
            match: { artist_name: "A" },
          },
          {
            match: { track_uri: "PTF" },
          },
        ],
        minimum_should_match: 1,
      },
    },
  });

  res.json(result.hits.hits);
});

export default router;
