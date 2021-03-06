import { useLayoutEffect } from 'react';
import { useMapContext, useFormContext } from 'globalState';
import Button from 'components/shared/Button/Button';
import BusStopAutoComplete from 'components/shared/BusStopAutoComplete/BusStopAutoComplete';

import ClearSearch from 'components/shared/ClearSearch/ClearSearch';
import BusAreaKey from 'components/shared/BusAreaKey/BusAreaKey';
import BusStopResult from '../BusStopAutoComplete/BusStopResult/BusStopResult';
import s from './BusStopSearch.module.scss';

const BusStopSearch = ({ onComplete }: { onComplete?: () => void }) => {
  const [{ listView, selectedStops }, formDispatch] = useFormContext();
  const [{ isMapCleared }, mapDispatch] = useMapContext();

  // Force autocomplete components to unmount to reset all of the data
  useLayoutEffect(() => {
    if (isMapCleared) {
      mapDispatch({ type: 'RESET_FORM', payload: false });
    }
  }, [isMapCleared, mapDispatch]);

  const additionalStops = selectedStops.filter(
    (stop) => stop.autoCompleteId !== 'selectedStopFrom' && stop.autoCompleteId !== 'selectedStopTo'
  );
  const addBusStop = () => {
    formDispatch({ type: 'ADD_STOP', payload: `additionalStop${additionalStops.length}` });
  };
  return (
    <div className={`${s.traySearchContainer} wmnds-p-b-lg`}>
      {!listView && <ClearSearch />}
      <p className="h3">All companies (nBus and nNetwork)</p>
      <p className="h4 wmnds-m-b-lg">Find out which bus areas specific stops are in</p>
      <ol className="wmnds-in-text-step">
        <li className="wmnds-in-text-step__item">
          Search for a postcode, road name or point of interest
        </li>
        <li className="wmnds-in-text-step__item">
          Select a bus stop from the {listView ? 'list' : 'map'}
        </li>
      </ol>
      {listView && <ClearSearch />}
      {!isMapCleared && (
        <>
          <BusStopAutoComplete id="selectedStopFrom" label="From:" name="BusStopFrom" />
          {selectedStops.length > 0 && (
            <BusStopAutoComplete id="selectedStopTo" label="To:" name="BusStopTo" />
          )}
          {additionalStops.map((stop, i) => (
            <BusStopAutoComplete
              key={stop.autoCompleteId}
              id={`additionalStop${i}`}
              name={`additionalStop${i}`}
            />
          ))}
        </>
      )}
      {selectedStops.length >= 2 && (
        <div className={`wmnds-grid wmnds-m-b-lg ${!listView ? '' : 'wmnds-grid--spacing-2-md'}`}>
          <div className={!listView ? 'wmnds-col-1' : 'wmnds-col-1-2'}>
            <Button
              btnClass={`wmnds-btn--primary wmnds-col-1 ${s.addBtn}`}
              iconRight="general-expand"
              text="Add another stop"
              onClick={addBusStop}
              disabled={selectedStops.length >= 12}
            />
          </div>
          {listView && (
            <div className="wmnds-col-1-2">
              <Button
                btnClass="wmnds-col-1"
                iconRight="general-chevron-right"
                text="Search for bus area"
                onClick={onComplete}
              />
            </div>
          )}
        </div>
      )}
      {!listView && (
        <div>
          {selectedStops.length > 1 && selectedStops.every((stop) => stop.properties) && (
            <>
              <BusStopResult />
              <BusAreaKey />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BusStopSearch;
