import Promise from 'bluebird';

const Section = (asana) => {
  const asanaClient = asana;

  const create = (params) => {
    // Check the name has colon at the end
    if (params.name.slice(-1) !== ':') {
      params.name = params.name + ':';
    }

    return new Promise((resolve, reject) => {
      asanaClient.tasks.create(params)
      .then((data) => { resolve(data); })
      .catch((err) => { reject(err); })
    });
  };

  // Return our public API, this should be quite small
  return {
    create: create
  };
};

export default Section;
