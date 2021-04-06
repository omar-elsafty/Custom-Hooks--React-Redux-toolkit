import http from "../httpService";
import { apiEndPoint } from "../../config.json";

const useApi = (route) => {
  // specific api route
  const api = apiEndPoint + "/" + route;

  //check if there is a specific route 
  let getEndPoint = (customRoute) => {
    return customRoute ? api + "/" + customRoute : api;
  };

  let getAll = (customRoute) => {
    let endPoint = getEndPoint(customRoute);
    return http.get(endPoint);
  };

  let getById = (id, customRoute) => {
    let endPoint = getEndPoint(customRoute);
    return http.get(endPoint + "/" + id);
  };

  let save = (item, customRoute) => {
    let endPoint = getEndPoint(customRoute);
    //put action
    if (item.id) {
      return http.put(endPoint + "/" + item.id, item);
    }
    //post action
    return http.post(endPoint, item);
  };

  let remove = (id, customRoute) => {
    let endPoint = getEndPoint(customRoute);
    return http.delete(endPoint + "/" + id);
  };

  return { getAll, getById, save, remove };
};

export default useApi;
