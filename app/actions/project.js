import Promise from 'bluebird';

const Project = (projectId = null) => {
  const id = projectId;

  const getTasks = (asana) => {
    if (id == null) {
      throw new Error('Project ID required to get sections');
    }

    return new Promise((resolve, reject) => {
      const data = {
        opt_fields: `
          id,name,notes,completed_at,completed,due_on,projects,
          assignee,assignee.name,assignee.photo,
          subtasks,subtasks.name,subtasks.due_on,subtasks.completed,
          subtasks.assignee, subtasks.assignee.name, subtasks.assignee.photo`
      }

      asana.tasks.findByProject(id, data)
      .then((collection) => {
        collection.fetch(1000).then((tasks) => {
          resolve(tasks);
        });
      })
      .catch((err) => { reject(err); });
    });
  };

  // Return our public API, this should be quite small
  return {
    getTasks: getTasks
  };
};

export default Project;
