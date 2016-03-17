import Promise from 'bluebird';

const Task = (taskId = null) => {
  const id = taskId;

  const create = (params, asanaClient) => {
    return new Promise((resolve, reject) => {
      asanaClient.tasks.create(params)
      .then((data) => { resolve(data); })
      .catch((err) => { reject(err); })
    });
  };

  const update = (params, asanaClient) => {
    return new Promise((resolve, reject) => {
      asanaClient.tasks.update(id, params)
      .then((data) => { resolve(data); })
      .catch((err) => { reject(err); })
    });
  }

  const complete = (asanaClient) => {
    return update({ completed: true }, asanaClient);
  };

  const move = (params, asanaClient) => {
    const data = {
      project: params.projectId,
      insert_after: params.insertAfter
    };

    return new Promise((resolve, reject) => {
      asanaClient.tasks.addProject(id, data)
      .then((data) => { resolve(data); })
      .catch((err) => { reject(err); })
    });
  };

  // Return our public API, this should be quite small
  return {
    create: create,
    complete: complete,
    move: move,
    update: update
  };
};

export default Task;
