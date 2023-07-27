import "dotenv/config";

import onPayment from "./events/payment.js";
import { getLastIndex } from "./lib/utils.js";
import { LndService } from "./services/lnd.js";

import "./services/express.js";

const { WEBHOOK_ENDPOINT, LND_GRPC_HOST, LND_DIR } = process.env;

const connect = async (lastIndex: number) => {
  console.info("Starting...");
  const lndService = new LndService({
    host: LND_GRPC_HOST,
    cert: `${LND_DIR}/tls.cert`,
    macaroon: `${LND_DIR}/data/chain/bitcoin/regtest/admin.macaroon`,
  });

  // Connect to LND gRPC server
  console.info("Connecting...");
  await lndService.connect();
  console.info("Connected!");

  void lndService.subscribeSettledInvoices(onPayment, lastIndex);
  lndService.addListeners();
};

const fetchLastIndex = async () => {
  try {
    console.info("Fetching...");
    const lastIndex = await getLastIndex(WEBHOOK_ENDPOINT);
    void connect(lastIndex);
  } catch (e) {
    console.info("Error fetching last index...");
    console.info("Retrying in 5 seconds ...");
    setTimeout(() => {
      void fetchLastIndex();
    }, 5000);
  }
};

(() => {
  void fetchLastIndex();
})();
