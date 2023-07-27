/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

import LndGrpc from "lnd-grpc";

export interface LndServiceConfig {
  host: string;
  cert: string;
  macaroon: string;
}

export class LndService {
  private grpc: any;

  constructor(config: LndServiceConfig) {
    this.grpc = new LndGrpc(config);
  }

  async connect() {
    return this.grpc.connect();
  }

  async subscribeSettledInvoices(callback, lastIndex = 0) {
    const { Lightning } = this.grpc.services;

    console.info("Subscribing to invoices");
    const call = await Lightning.subscribeInvoices({
      add_index: Infinity,
      settle_index: lastIndex,
    });
    console.info("Subscribed!");

    // Listen for subscription
    call.on("data", function (response) {
      console.info(response);
      if (response.state === "SETTLED") {
        callback(response);
      }
    });
    call.on("status", function (status) {
      // The current status of the stream.
      console.info("status", status);
    });
    call.on("end", function () {
      // The server has closed the stream.
      console.info("LND closed the stream");
    });
  }

  addListeners() {
    // Subscribe wallet events
    this.grpc.on(`locked`, () => console.log("wallet locked!"));
    this.grpc.on(`active`, () => console.log("wallet unlocked!"));
    this.grpc.on(`disconnected`, () => console.log("disconnected from lnd!"));
  }
}
