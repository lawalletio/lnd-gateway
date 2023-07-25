export const subscribeSettledInvoices = async (
  grpc,
  callback,
  lastIndex = 0
) => {
  const { Lightning } = grpc.services;

  console.info("Subscribing to invoices");
  const call = await Lightning.subscribeInvoices({
    add_index: Infinity,
    settle_index: lastIndex,
  });
  console.info("Subscribed!");

  // Listen for subscription
  call.on("data", async function (response) {
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
};

export const addListeners = (grpc) => {
  // Subscribe wallet events
  grpc.on(`locked`, () => console.log("wallet locked!"));
  grpc.on(`active`, () => console.log("wallet unlocked!"));
  grpc.on(`disconnected`, () => console.log("disconnected from lnd!"));
};
