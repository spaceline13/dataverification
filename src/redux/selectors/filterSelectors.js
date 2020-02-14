const getFiltersState = store => store.filters;
const getRemoteProducts = store => (getFiltersState(store) ? getFiltersState(store).remoteProducts : []);
const getOriginalSources = store => (getFiltersState(store) ? getFiltersState(store).originalSources : []);
const getSelectedRemoteProducts = store => (getFiltersState(store) ? getFiltersState(store).selectedRemoteProducts : []);
const getSelectedOriginalSources = store => (getFiltersState(store) ? getFiltersState(store).selectedOriginalSources : []);
export { getRemoteProducts, getOriginalSources, getSelectedRemoteProducts, getSelectedOriginalSources };
