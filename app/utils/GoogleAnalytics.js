import ga from 'react-ga';

const options = { debug: process.env.NODE_ENV === 'development' };

ga.initialize(process.env.GOOGLE_ANALYTICS_ID, options);

export default ga;
