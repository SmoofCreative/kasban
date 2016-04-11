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
  };

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

  const createSubTask = (params, asanaClient) => {
    return new Promise((resolve, reject) => {
      asanaClient.tasks.addSubtask(id, params)
      .then((data) => { resolve(data); })
      .catch((err) => { reject(err); })
    });
  };

  const getStories = (asanaClient) => {
    if (id === null) {
      return new Error('No id provided');
    }

    return new Promise((resolve, reject) => {
      asanaClient.tasks.stories(id)
      .then((collection) => { resolve(collection.data); })
      .catch((err) => { reject(err); })
    });
  };

  const filterStories = (stories, type) => {
    return stories.filter((story) => {
      return story.type === type
    });
  };

  const getComments = (asanaClient) => {
    const stories = getStories(asanaClient);
    return filterStories(stories, 'comment');
  };

  // Return our public API, this should be quite small
  return {
    create: create,
    complete: complete,
    move: move,
    update: update,
    createSubTask: createSubTask,
    getStories: getStories,
    getComments: getComments
  };
};

export default Task;
