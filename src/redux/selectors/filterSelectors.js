const getFiltersState = store => store.filters;

const getName = store => (getFiltersState(store) ? getFiltersState(store).name : null);
const getLoadingCuration = store => (getFiltersState(store) ? getFiltersState(store).loading : null);
const getRemoteProducts = store => (getFiltersState(store) ? getFiltersState(store).remoteProducts : []);
const getOriginalSources = store => (getFiltersState(store) ? getFiltersState(store).originalSources : []);
const getSelectedRemoteProducts = store => (getFiltersState(store) ? getFiltersState(store).selectedRemoteProducts : []);
const getSelectedOriginalSources = store => (getFiltersState(store) ? getFiltersState(store).selectedOriginalSources : []);
const getSelectedSupplier = store => (getFiltersState(store) ? getFiltersState(store).selectedSupplier : []);
const getSelectedDateRange = store => (getFiltersState(store) ? getFiltersState(store).selectedDateRange : { from: null, to: null });
export { getFiltersState, getName, getLoadingCuration, getRemoteProducts, getOriginalSources, getSelectedRemoteProducts, getSelectedOriginalSources, getSelectedSupplier, getSelectedDateRange };
