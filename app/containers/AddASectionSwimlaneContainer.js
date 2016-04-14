import { connect } from 'react-redux';

import Swimlane from '../components/Swimlane';
import Actions from '../actions';

const mapStateToProps = (state) => {
  const currentProjectId = state.entities.projects.conditions.currentId;
  const sectionsList = state.entities.projects.records[currentProjectId].sections;

  // Get the last section (1 as 0 is uncategorised);
  const firstSectionId = sectionsList[1];

  return {
    firstSectionId: firstSectionId,
    currentProjectId: currentProjectId
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
     onNewTaskSubmit: (task, isSubTasks, sectionId, projectId) => {
      let options = {
        taskDetails: task
      };

      if (isSubTasks) {
        dispatch(Actions.createSubTask({
          ...options,
          parentId: sectionId
        }));
      } else {
        dispatch(Actions.createTask({
          ...options,
          sectionId: sectionId,
          projectId: projectId
        }));
      }
    },
    onSectionUpdated: (section, currentProjectId, firstSectionId, updateAsana) => {
      const options = {
        details: section,
        projectId: currentProjectId,
        firstSectionId: firstSectionId
      };

      if (updateAsana && section.name.trim() !== '') {
        dispatch(Actions.createSection(options));
      }
    },
    onCardMoved: () => {
      return false;
    }
  }
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { currentProjectId, firstSectionId } = stateProps;

  const functions = {
    onNewTaskSubmit: (task, isSubTasks) => {
      dispatchProps.onNewTaskSubmit(task, isSubTasks, 'uncategorised', currentProjectId);
    },
    onSectionUpdated: (section, updateAsana) => {
      dispatchProps.onSectionUpdated(section, currentProjectId, firstSectionId, updateAsana);
    }
  };

  const variables = {
    headerPlaceholder: 'Add a section...',
    isPlaceholder: true,
    cards: []
  };

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    ...functions,
    ...variables
  }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Swimlane);
