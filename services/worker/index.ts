import { startWorker } from "./runner";
startWorker();
import { pollAndRunJobs } from "./jobRunner";

async function main() {
  console.log("worker: starting...");
  await pollAndRunJobs();
}

main().catch((e) => {
  console.error("worker: fatal", e);
  process.exit(1);
});
