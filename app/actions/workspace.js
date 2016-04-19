import Promise from 'bluebird';

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

  // Return our public API, this should be quite small
  return {
    getProjects: getProjects,
    getWorkspaces: getWorkspaces
  };
};

export default Workspace;
