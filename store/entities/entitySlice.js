import useSlice from "../useSlice";

//this will be only the code for generate your slice and it's selectors
//give it the specific api end point and the name in the reducer for naming the actions
 
export const {
  fetchAll,
  save,
  remove,
  entityAdapter,
  slice,
  selectAll,
  selectById,
  selectStatus,
} = (() => {
  return useSlice("apiRoute", "nameInReducer");
})();

export default slice.reducer;
