import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import useAPi from "../services/customHooks/useApi";
import { checkForCall } from "../services/apiServices/apiServices";

let useSlice = (route, name) => {
  //name for selector (should be the same one in combine reducer)
  //and alse fornaming the actions
  let { getAll, save: saveItem, remove: removeItem } = useAPi(route);

  let fetchAll = createAsyncThunk(
    `${route}/fetchAll`,
    async ({ route }, { getState }) => {
      let result = null;
      let { lastFetch } = getState()[name];
      let makeRequest = lastFetch ? checkForCall(lastFetch) : true;
      if (makeRequest) {
        let response = await getAll(route);
        if (response.status !== 204) {
          //not empty list
          result = response.data;
        } else {
          result = [];
        }
      }
      return result;
    }
  );

  let save = createAsyncThunk(`${route}/save`, async ({ item, route }) => {
    let { data } = await saveItem(item, route); //to be checked
    return item;
  });

  let remove = createAsyncThunk(`${route}remove`, async ({ id, route }) => {
    await removeItem(id, route);
    return id;
  });

  /**********************************************************/
  /**************** slice and entity adapter*****************/
  /**********************************************************/

  const entityAdapter = createEntityAdapter({
    selectId: (item) => item.id,
  });

  let slice = createSlice({
    name: `${route}`,
    initialState: entityAdapter.getInitialState({
      status: null,
      lastFetch: null,
    }),

    extraReducers: {
      [fetchAll.pending]: (state, payload) => {
        state.status = "loading";
      },
      [fetchAll.fulfilled]: (state, { payload }) => {
        if (payload !== null) {
          entityAdapter.addMany(state, payload);
          state.lastFetch = Date.now();
        }
        state.status = "success";
      },
      [fetchAll.rejected]: (state, payload) => {
        state.status = "failed";
      },
      /********************/
      [save.fulfilled]: (state, { payload }) => {
        state.status = "success";
        entityAdapter.upsertOne(state, payload);
      },
      [save.rejected]: (state, payload) => {
        state.status = "failed";
      },
      /********************/
      [remove.fulfilled]: (state, { payload }) => {
        state.status = "success";
        entityAdapter.removeOne(state, payload);
      },
      [remove.rejected]: (state, payload) => {
        state.status = "failed";
      },
    },
  });

  /**********************************************************/
  /*********************** selectors ************************/
  /**********************************************************/

  let entitySelector = entityAdapter.getSelectors((state) => state[name]);
  const { selectAll, selectById } = entitySelector;
  const selectStatus = (state) => state[name].status;

  return {
    fetchAll,
    save,
    remove,
    entityAdapter,
    slice,
    selectAll,
    selectById,
    selectStatus,
  };
};
export default useSlice;
