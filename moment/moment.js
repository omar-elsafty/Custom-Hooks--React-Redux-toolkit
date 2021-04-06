import { maxFetchTime } from "../../config.json";
import moment from "moment";

export const checkForCall = (lastFetch) => {
  let result = false;
  let diffInMins = moment().diff(moment(lastFetch), "minutes");
  if (diffInMins > maxFetchTime) {
    result = true;
  }
  return result;
};

