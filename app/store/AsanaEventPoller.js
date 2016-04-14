import AsanaClient from '../utils/AsanaClient';
import Actions from '../actions';

const defaultInterval = 15 * 1000; // 15 seconds

const AsanaEventPoller = (store) => {

  let _projectId,
      _syncToken,
      _interval,
      _rerun = true;

  const init = (projectId, options = { syncToken: '', interval: defaultInterval }) => {
    _projectId = projectId;
    _syncToken = options.syncToken;
    _interval = options.interval;
  };

  const resetInterval = () => {
    _interval = defaultInterval;
  };

  const checkEvent = () => {
    AsanaClient.events
      .get(_projectId, _syncToken)
      .then((event) => {
        // 412 error means all good, ignore
        // success with empty event.type means all good, ignore

        // there has been an event
        if (event.data && event.data.length > 0) {
          // and that event is a project change
          if (event.data[0].action === 'changed') {

            store.dispatch({ type: 'RECEIVE_EVENT' });

            if (event.data[0].resource.id === _projectId) {
              store.dispatch(Actions.updateTasksForProject(_projectId));
            } else {
              store.dispatch(Actions.getTask(event.data[0].resource.id, _projectId));
            }
          }
        }

        if (event.sync) {
          _syncToken = event.sync;
        }

        if (_rerun) {
          setTimeout(() => { checkEvent(); }, _interval);
        }
      })
      .catch(() => {
        // backoff
        _interval = defaultInterval * 2;

        if (_rerun) {
          setTimeout(() => { checkEvent(); }, _interval);
        }
      });
  };

  const start = () => {
    _rerun = true;
    // reset default incase we've been uping it
    resetInterval();
    checkEvent();
  };

  const stop = () => {
    _rerun = false;
  };

  const changeProject = (projectId) => {
    stop();

    setTimeout(() => {
      _projectId = projectId;
      start();
    }, _interval + 100);
  };

  return {
    init: init,
    start: start,
    stop: stop,
    changeProject: changeProject
  };
};

export default AsanaEventPoller;
