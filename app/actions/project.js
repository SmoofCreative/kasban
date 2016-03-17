import Promise from 'bluebird';

const Project = (projectId = null) => {
  const id = projectId;

  const getTasks = (asana) => {
    if (id == null) {
      throw new Error('Project ID required to get sections');
    }

    return new Promise((resolve, reject) => {
      const data = {
        limit: 100,
        opt_fields: 'id,name,completed_at,completed,due_on,projects'
      }

      asana.tasks.findByProject(id, data)
      .then((collection) => { resolve(collection.data); })
      .catch((err) => { reject(err); });
    });
  };

  // Return our public API, this should be quite small
  return {
    getTasks: getTasks
  };
};

export default Project;
