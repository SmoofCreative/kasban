import { connect } from 'react-redux';
import _flow from 'lodash/flow';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import Project from '../components/Project';

const mapStateToProps = (state) => {
  const projects = state.entities.projects;

  let sections = [];

  if (typeof projects.records[projects.conditions.currentId] !== 'undefined') {
    sections = projects.records[projects.conditions.currentId].sections;
  }

  return {
    sections: sections,
    currentWorkspaceId: state.entities.workspaces.conditions.currentId,
    sectionEntities: state.entities.sections.records,
    cardEntities: state.entities.cards.records,
    currentProjectId: projects.conditions.currentId
  }
};

export default _flow(
  connect(mapStateToProps),
  DragDropContext(HTML5Backend)
)(Project)

