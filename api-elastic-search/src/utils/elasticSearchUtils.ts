import path from "path";
import elasticClient from "../config/elasticSearch";
import fs from "fs";
import csvParser from "csv-parser";

export async function createIndexIfNotExists(indexName: string) {
  // check if index exists
  const exists = await elasticClient.indices.exists({ index: indexName });

  if (!exists) {
    const result = await elasticClient.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            track_uri: { type: "text" },
            ts: { type: "date", format: "yyyy-MM-dd HH:mm:ss" },
            platform: { type: "keyword" },
            track_name: { type: "text" },
            artist_name: { type: "text" },
            album_name: { type: "text" },
            reason_start: { type: "keyword" },
            reason_end: { type: "keyword" },
            shuffle: { type: "keyword" },
            skipped: { type: "keyword" },
          },
        } as any,
      },
    });

    console.log(result, " index created");

    await addDataToElasticSearchIndex(process.env.FILE_PATH ?? "", "spotify");
  }
}

async function addDataToElasticSearchIndex(
  filePath: string,
  indexName: string
) {
  const records: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => records.push(row))
    .on("end", async () => {
      const body = records.flatMap((doc) => [
        { index: { _index: indexName } },
        doc,
      ]);
      const { errors, items } = await elasticClient.bulk({
        refresh: true,
        body,
      });

      console.log(errors, "errors after doc insertion", items[0].index?.error);
    });
}
