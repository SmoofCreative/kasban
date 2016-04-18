import GoogleAnalytics from '../utils/GoogleAnalytics';

const EventActions = {};

EventActions.openProjectsSidebar = () => {
  GoogleAnalytics.event({
    category: 'General',
    action: 'Opened projects sidebar'
  });
};

EventActions.selectProject = (id) => {
  GoogleAnalytics.event({
    category: 'General',
    action: 'Selected project',
    value: id
  });
};

EventActions.selectTask = (id) => {
  GoogleAnalytics.event({
    category: 'General',
    action: 'Selected task',
    value: id
  });
};

EventActions.addTask = () => {
  GoogleAnalytics.event({
    category: 'General',
    action: 'Added task'
  });
};

EventActions.updateTask = (id) => {
  GoogleAnalytics.event({
    category: 'General',
    action: 'Updated task',
    value: id
  });
};

EventActions.moveTask = (id) => {
  GoogleAnalytics.event({
    category: 'General',
    action: 'Moved task',
    value: id
  });
};

EventActions.deleteTask = (id) => {
  GoogleAnalytics.event({
    category: 'General',
    action: 'Deleted task',
    value: id
  });
};

EventActions.convertTaskToSection = (id) => {
  GoogleAnalytics.event({
    category: 'General',
    action: 'Converted task to section',
    value: id
  });
};

export default EventActions;
