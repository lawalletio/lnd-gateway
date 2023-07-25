import axios from "axios";

const { WEBHOOK_ENDPOINT } = process.env;

export const onPayment = async (payment) => {
  console.info("!!! Factura pagada !!!!", payment.payment_addr.toString("hex"));
  //   console.dir(payment);

  // Webhook event
  const result = await axios.post(
    `${WEBHOOK_ENDPOINT}/lnd-gateway/payment`,
    payment
  );

  console.dir(result);
};

export default onPayment;
