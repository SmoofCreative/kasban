import { connect } from 'react-redux';

import UIActions from '../actions/ui';
import TaskDetailsSidebar from '../components/TaskDetailsSidebar';

const mapStateToProps = (state) => {
  const boards = state.boards;

  let currentCard = {};

  // Urgh this needs data needs to be sorted A.S.A.P
  if (boards.currentTaskId !== null) {
    boards.workspaces.filter((workspace) => {
      if (workspace.id == boards.currentWorkspaceId) {

        workspace.projects.filter((project) => {
          if (project.id == boards.currentProjectId) {

            project.sections.filter((section) => {
              if (section.id == boards.currentSectionId) {

                section.cards.filter((card) => {
                  if (card.id === boards.currentTaskId) {
                    currentCard = card;
                  }
                });
              }
            });
          }
        });
      }
    })[0];
  }

  return {
    card: currentCard,
    visible: state.ui.showTaskDetailsSidebar
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSidebarClose: () => {
      dispatch(UIActions.hideTaskDetailsSidebar());
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetailsSidebar);
