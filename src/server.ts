import axios from "axios";
import "dotenv/config";

import LndGrpc from "lnd-grpc";
import onPayment from "./events/payment.js";
import { addListeners, subscribeSettledInvoices } from "./lib/utils.js";

const { WEBHOOK_ENDPOINT, LND_GRPC_HOST, LND_DIR } = process.env;

const getLastIndex = async () => {
  const url = `${WEBHOOK_ENDPOINT}/lnd-gateway/start`;
  const {
    data: { lastIndex },
  } = await axios.get(url);

  return lastIndex;
};

const connect = async (lastIndex) => {
  console.info("Starting...");

  const grpc = new LndGrpc({
    host: LND_GRPC_HOST,
    cert: `${LND_DIR}/tls.cert`,
    macaroon: `${LND_DIR}/data/chain/bitcoin/regtest/admin.macaroon`,
  });

  // Connect to LND gRPC server
  console.info("Connecting...");
  await grpc.connect();
  console.info("Connected!");

  subscribeSettledInvoices(grpc, onPayment, lastIndex);
  addListeners(grpc);
};

(async () => {
  connect(await getLastIndex());
})();
