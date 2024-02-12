import { CONFIG } from "./utils/config";

async function Run() {
  console.log(`[${CONFIG.NODE_ENV}] Default tools script`);
}

Run()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
