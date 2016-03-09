export function asanaUrl (params = []) {
  const baseUrl = 'https://app.asana.com/';
  let returnPath = '';

  // https://app.asana.com/0/:projectID/list
  if (params.length === 1) {
    returnPath = params[0] + '/list';
  }

  // https://app.asana.com/0/:projectID/:taskID
  if (params.length === 2) {
    returnPath = params[0] + '/' + params[1];
  }

  return baseUrl + returnPath;
}

export function oneHourFromNow () {
  let theFuture = Date.now() + 60*60*1000;
  return theFuture;
}
