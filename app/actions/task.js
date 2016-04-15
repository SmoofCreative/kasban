import Promise from 'bluebird';

const Task = (asana, taskId = null) => {
  const id = taskId;
  const asanaClient = asana;

  const create = (params) => {
    return new Promise((resolve, reject) => {
      asanaClient.tasks.create(params)
      .then((data) => { resolve(data); })
      .catch((err) => { reject(err); })
    });
  };

  const get = () => {
    if (id === null) {
      return new Error('No id provided');
    }

    const data = {
      opt_fields: `
        id,name,notes,completed_at,completed,due_on,projects,memberships.section,
        assignee,assignee.name,assignee.photo,
        subtasks,subtasks.name,subtasks.due_on,subtasks.completed,
        subtasks.assignee, subtasks.assignee.name, subtasks.assignee.photo`
    };

    return new Promise((resolve, reject) => {
      asanaClient.tasks.findById(id, data)
      .then((data) => { resolve(data); })
      .catch((err) => { reject(err); })
    });
  };

  const update = (params) => {
    return new Promise((resolve, reject) => {
      asanaClient.tasks.update(id, params)
      .then((data) => { resolve(data); })
      .catch((err) => { reject(err); })
    });
  };

  const complete = () => {
    return update({ completed: true }, asanaClient);
  };

  const move = (params) => {
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

  // Using remove as delete is a reserved word
  const remove = () => {
    return new Promise((resolve, reject) => {
      asanaClient.tasks.delete(id)
      .then((data) => { resolve(data); })
      .catch((err) => { reject(err); })
    });
  }

  const createSubTask = (params) => {
    return new Promise((resolve, reject) => {
      asanaClient.tasks.addSubtask(id, params)
      .then((data) => { resolve(data); })
      .catch((err) => { reject(err); })
    });
  };

  const getSubTasks = () => {
    const data = {
      opt_fields: `
        subtasks,subtasks.name,subtasks.due_on,subtasks.completed,
        subtasks.assignee, subtasks.assignee.name, subtasks.assignee.photo`
    };

    return new Promise((resolve, reject) => {
      asanaClient.tasks.findById(id, data)
      .then((data) => { resolve(data); })
      .catch((err) => { reject(err); })
    });
  };

  const getStories = () => {
    if (id === null) {
      return new Error('No id provided');
    }

    const options = {
      opt_expand: 'created_by'
    }

    return new Promise((resolve, reject) => {
      asanaClient.tasks.stories(id, options)
      .then((collection) => { resolve(collection.data); })
      .catch((err) => { reject(err); })
    });
  };

  const filterStories = (stories, type) => {
    return stories.filter((story) => {
      return story.type === type
    });
  };

  const getComments = () => {
    const stories = getStories(asanaClient);
    return filterStories(stories, 'comment');
  };

  // Return our public API, this should be quite small
  return {
    getInformation: get,
    create: create,
    complete: complete,
    move: move,
    update: update,
    delete: remove,
    createSubTask: createSubTask,
    getStories: getStories,
    getComments: getComments,
    getSubTasks: getSubTasks
  };
};

export default Task;
