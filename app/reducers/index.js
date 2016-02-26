const initalState = {
  'workspaces': [],
  'projects': [],
  'sections': [
    {
      'name': 'Todo:',
      'id': 3,
      'cards': [
        {
          'id': 4,
          'name': 'Select a workspace',
          'completed': false,
          'assignee_status': 'upcoming',
          'completed_at': null,
          'due_on': null,
          'due_at': null,
          'workspace': {
            'id': 1,
            'name': 'Smoof'
          },
          'projects': [
            {
              'id': 2,
              'name': 'Kasban Asana Board'
            }
          ],
          'memberships': [
            {
              'project': {
                'id': 92006189034858,
                'name': 'Kasban Asana Board'
              },
              'section': {
                'id': 92106379395235,
                'name': 'Icebox:'
              }
            }
          ]
        },
        {
          'id': 5,
          'name': 'Select a project',
          'completed': false,
          'assignee_status': 'upcoming',
          'completed_at': null,
          'due_on': null,
          'due_at': null,
          'workspace': {
            'id': 1,
            'name': 'Smoof'
          },
          'projects': [
            {
              'id': 2,
              'name': 'Kasban Asana Board'
            }
          ],
          'memberships': [
            {
              'project': {
                'id': 92006189034858,
                'name': 'Kasban Asana Board'
              },
              'section': {
                'id': 92106379395235,
                'name': 'Icebox:'
              }
            }
          ]
        }
      ]
    },
    {
      'name': 'Completed:',
      'cards': []
    }
  ]
};

export default function reducer(state = initalState, action) {
  switch(action.type) {
    case 'RECEIVE_WORKSPACES':
      return Object.assign({}, state, {
        workspaces: action.payload.workspaces
      });
    case 'RECEIVE_PROJECTS':
      return Object.assign({}, state, {
        projects: action.payload.projects
      });
    case 'SET_SWIMLANES_AND_INITIAL_TASKS':
      return Object.assign({}, state, {
        sections: action.payload.swimlanes
      });

    case 'RECEIVE_TASK_DETAILS':
      // return Object.assign({}, state, {
      //   card: action.payload.card
      // });

    default:
      return state;
  }
}
