const getFiltersState = store => store.filters;

const getName = store => (getFiltersState(store) ? getFiltersState(store).name : null);
const getLoadingCuration = store => (getFiltersState(store) ? getFiltersState(store).loading : null);
const getRemoteProducts = store => (getFiltersState(store) ? getFiltersState(store).remoteProducts : []);
const getRemoteHazards = store => (getFiltersState(store) ? getFiltersState(store).remoteHazards : []);
const getOriginalSources = store => (getFiltersState(store) ? getFiltersState(store).originalSources : []);
const getSelectedRemoteProducts = store => (getFiltersState(store) ? getFiltersState(store).selectedRemoteProducts : []);
const getSelectedRemoteHazards = store => (getFiltersState(store) ? getFiltersState(store).selectedRemoteHazards : []);
const getSelectedOriginalSources = store => (getFiltersState(store) ? getFiltersState(store).selectedOriginalSources : []);
const getSelectedSupplier = store => (getFiltersState(store) ? getFiltersState(store).selectedSupplier : []);
const getSelectedDateRange = store => (getFiltersState(store) ? getFiltersState(store).selectedDateRange : { from: null, to: null });
const getPossiblyOk = store => (getFiltersState(store) ? getFiltersState(store).possiblyOk : []);
const getOneHazard = store => (getFiltersState(store) ? getFiltersState(store).oneHazard : []);

export {
    getFiltersState,
    getName,
    getLoadingCuration,
    getRemoteProducts,
    getRemoteHazards,
    getOriginalSources,
    getSelectedRemoteProducts,
    getSelectedRemoteHazards,
    getSelectedOriginalSources,
    getSelectedSupplier,
    getSelectedDateRange,
    getPossiblyOk,
    getOneHazard
};
