import { Map } from 'immutable';

const initalState = Map({
  'data': [
    {
      'id': 92006189034861,
      'name': 'In Progress:'
    },
    {
      'id': 92006189034880,
      'name': 'As the owner i want i need a landing page to validate the concept'
    },
    {
      'id': 92106379395279,
      'name': 'Development env setup'
    },
    {
      'id': 92106379395349,
      'name': 'ToDo:'
    },
    {
      'id': 92205938529192,
      'name': 'Create a quick lean canvas for kassan'
    },
    {
      'id': 92106379395281,
      'name': 'Application dependency setup'
    },
    {
      'id': 92106379395300,
      'name': 'Create initial style guide'
    }
  ],
  'next_page': null,
  'workspaces': [],
  'projects': []
});

export default function reducer(state = initalState, action) {
  switch(action.type) {
    case 'RECEIVE_WORKSPACES':
      return state.set('workspaces', action.payload.workspaces);
    case 'GET_PROJECTS':
      console.log(action.payload.projects);
      return state.set('projects', action.payload.projects);
    default:
      return state;
  }
}
