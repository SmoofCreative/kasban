const initialState = {
  isAsanaAuthed: false,
  checkInProgress: false
}

export default function auth(state = initialState, action) {
  switch (action.type) {
    case 'STARTING_ASANA_AUTH': {
      console.log('Inside reducer STARTING_ASANA_AUTH');
      return Object.assign({}, state, { checkInProgress: true });
    }

    case 'ASANA_AUTH_COMPLETE': {

      console.log('Inside reducer ASANA_AUTH_COMPLETE');
      return Object.assign({}, state, {
        isAsanaAuthed: action.payload.isAsanaAuthed,
        checkInProgress: false
      });
    }

    default: {
      return state;
    }
  }
}
