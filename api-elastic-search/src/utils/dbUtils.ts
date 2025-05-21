import csvParser from "csv-parser";
import fs from "fs";
import pool from "../config/dbConfig";

export function addDataToDb(filePath: string) {
  const results: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      console.log(`Read ${results.length} rows`);

      const keys = Object.keys(results[0]); // get column names

      console.log(keys.join(","), "keys");
      const placeholders = `(${keys.map(() => "?").join(",")})`;

      try {
        for (let i = 0; i < 500; i += 5) {
          const chunk = results.slice(i, i + 5);
          const values = chunk.flatMap((row) =>
            keys.map((k) => (row[k] !== undefined ? row[k] : null))
          );

          const query = `
            INSERT INTO spotify_history (${keys.join(",")})
            VALUES ${chunk.map(() => placeholders).join(",")}
          `;

          console.log(query);

          await pool.query(query, values);
          console.log(`Inserted records ${i + 1}–${i + chunk.length}`);
        }
        console.log("✅ All data imported!");
      } catch (err) {
        console.error("❌ Import error:", err);
      }
    });
}
