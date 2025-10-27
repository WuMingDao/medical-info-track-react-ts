import dayjs from "dayjs";

export const convertTimestampToDateTime = (timestamp: string) => {
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
};
