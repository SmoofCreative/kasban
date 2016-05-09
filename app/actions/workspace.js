import Promise from 'bluebird';
import debounce from 'debounce-promise';

const Workspace = () => {

  const getWorkspaces = (asana) => {
    return new Promise((resolve, reject) => {
      asana.users.me()
      .then((data) => { resolve(data.workspaces); })
      .catch((err) => { reject(err); })
    });
  };

  const getProjects = (id, asana) => {
    if (id == null) {
      throw new Error('Workspace ID required to get projects');
    }

    return new Promise((resolve, reject) => {
      asana.projects.findByWorkspace(id, { limit: 100, archived: false })
      .then((collection) => { resolve(collection.data); })
      .catch((err) => { reject(err); })
    });
  };

  const search = (id, params, asana) => {
    if (id == null) {
      throw new Error('Workspace ID required to search through a workspace');
    }

    params = { ...params, opt_fields: 'name, archived' };

    return new Promise((resolve, reject) => {
      asana.workspaces.typeahead(id, params)
      .then((collection) => { resolve(collection.data) })
      .catch((err) => { reject(err); });
    });
  };

  // Enum like object for the different available search types
  const searchTypes = {
    Project: 'project',
    User: 'user',
    Task: 'task'
  };

  // Return our public API, this should be quite small
  return {
    getProjects: getProjects,
    getWorkspaces: getWorkspaces,
    search: debounce(search, 300),
    searchTypes: searchTypes
  };
};

export default Workspace;
