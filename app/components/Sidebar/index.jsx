import React from 'react';
import classNames from 'classnames';

import './style';

import AccordionSection from './accordion-section';

const renderLoading = () => {
  return (
    <div className="v-wrap">
      <div className="v-content">
        <img className="sidebar__loading" src="loading.gif" />
      </div>
    </div>
  )
}

const renderWorkspaces = ({ workspaces, currentWorkspaceId, currentProjectId, onProjectSelected }) => {
  return workspaces.map((workspace) => {
    return (
      <AccordionSection
        key={workspace.id}
        classname="sidebar__section"
        title={workspace.name}
        active={ currentWorkspaceId == workspace.id}>
        <ul className="sidebar__projects">
          {
            workspace.projects.map((project) => {
              let projectClasses = classNames('sidebar__project', { active: currentProjectId == project.id });
              return (
                <li
                  key={project.id}
                  className={ projectClasses }
                  onClick={onProjectSelected.bind(this, workspace.id, project.id)}>
                  { project.name }
                </li>
              );
            })
          }
        </ul>
      </AccordionSection>
    );
  })
}

const Sidebar = (params) => {
  const { visible, showSidebarLoading } = params;
  const sidebarClasses = classNames('sidebar', { active: visible });

  return (
    <div className={sidebarClasses}>
      { showSidebarLoading ? renderLoading() : renderWorkspaces(params) }
    </div>
  );
};

export default Sidebar;
