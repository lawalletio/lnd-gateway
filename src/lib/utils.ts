import axios from "axios";

export const getLastIndex = async (endpoint: string): Promise<number> => {
  const url = `${endpoint}/lnd-gateway/start`;
  const {
    data: { lastIndex },
  } = await axios.get<{ lastIndex: number }>(url);

  return lastIndex;
};
