import dayjs from "dayjs";

export const convertTimestampToDateTime = (timestamp: Date) => {
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
};
