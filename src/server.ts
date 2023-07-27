import "dotenv/config";

import onPayment from "./events/payment.js";
import { getLastIndex } from "./lib/utils.js";
import { LndService } from "./services/lnd.js";

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

void (async () => {
  void connect(await getLastIndex(WEBHOOK_ENDPOINT));
})();
