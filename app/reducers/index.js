const initalState = {
  'workspaces': [],
  'projects': [],
  'sections': [
    {
      'name': 'Todo:',
      'id': 92106379395349,
      'cards': [
        {
            'id': 92006189034921,
            'created_at': '2016-02-19T15:36:22.226Z',
            'modified_at': '2016-02-19T16:01:49.030Z',
            'name': 'Pick up and move headings with tasks below',
            'completed': false,
            'assignee_status': 'upcoming',
            'completed_at': null,
            'due_on': null,
            'due_at': null,
            'workspace': {
              'id': 3736871133687,
              'name': 'Smoof'
            },
            'parent': null,
            'projects': [
              {
                'id': 92006189034858,
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
      name: 'Completed:',
      cards: []
    }
  ]
};

export default function reducer(state = initalState, action) {
  switch(action.type) {
    case 'RECEIVE_WORKSPACES':
      return Object.assign({}, state, {
        workspaces: action.payload.workspaces
      });
    case 'GET_PROJECTS':
      console.log(action.payload.projects);

      return Object.assign({}, state, {
        projects: action.payload.projects
      });
    default:
      return state;
  }
}
