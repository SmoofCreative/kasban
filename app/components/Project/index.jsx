import React from 'react';
import { connect } from 'react-redux';
import _flow from 'lodash/flow';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import './style';
import Swimlane from '../Swimlane';
import Actions from '../../actions';

const Project = React.createClass({

  handleCardMove(idToMove, idToInsertAfter) {
    const { dispatch, currentProjectId } = this.props;
    dispatch(Actions.moveCard(idToMove, idToInsertAfter, currentProjectId));
  },

  handleNewTaskSubmit(task, swimlaneId) {
    const { dispatch, currentWorkspaceId, currentProjectId } = this.props;

    dispatch(Actions.createTask({
      taskDetails: task,
      workspaceId: currentWorkspaceId,
      projectId: currentProjectId,
      sectionId: swimlaneId
    }));
  },

  handleTaskUpdate(task) {
    const { dispatch } = this.props;

    dispatch(Actions.updateTask({
      taskDetails: task
    }));
  },

  renderSwimlanes () {
    return this.props.sections.map((section) => (
      <Swimlane key={section.id}
                cards={section.cards}
                name={section.name}
                id={section.id}
                moveCard={this.handleCardMove}
                newTaskSubmit={this.handleNewTaskSubmit}
                taskUpdate={this.handleTaskUpdate} />
    ));
  },

  render() {
    return (
      <main className="main">
        <div className="container">
          <div className="flex-container">

            { this.renderSwimlanes() }

          </div>
        </div>
      </main>
    );
  }
});

const mapStateToProps = (state) => ({
  sections: state.boards.sections,
  currentProjectId: state.boards.currentProjectId,
  currentWorkspaceId: state.boards.currentWorkspaceId
});

export default _flow(
  connect(mapStateToProps),
  DragDropContext(HTML5Backend)
)(Project);
