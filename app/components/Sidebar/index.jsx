import React from 'react';
import classNames from 'classnames';

import './style';

import AccordionSection from './accordion-section';
import Loading from '../Loading';

const renderWorkspaces = ({ workspaces, workspaceEntities, projectEntities, currentProjectId, onProjectSelected }) => {
  return workspaces.map((workspaceId) => {
    const workspace = workspaceEntities[workspaceId];

    return (
      <AccordionSection
        key={workspace.id}
        classname="sidebar__section"
        title={workspace.name}>
        <ul className="sidebar__projects">
          {
            workspace.projects.map((projectId) => {
              const project = projectEntities[projectId];
              const projectClasses = classNames('sidebar__project', { active: currentProjectId == project.id });

              return (
                <li
                  key={project.id}
                  className={ projectClasses }
                  onClick={onProjectSelected.bind(this, project.id)}>
                  { project.name }
                </li>
              );
            })
          }
        </ul>
      </AccordionSection>
    );
  })
};

const handleBackdropClick = (onBackdropClick, e) => {
  e.stopPropagation();
  onBackdropClick();
};

const Sidebar = (params) => {
  const { visible, showSidebarLoading, onBackdropClick } = params;
  const sidebarClasses = classNames('sidebar', { active: visible });
  const backdropClasses = classNames('sidebar__backdrop', { active: visible });

  return (
    <div>
      <div className={backdropClasses} onClick={handleBackdropClick.bind(this, onBackdropClick)}></div>
      <div className={sidebarClasses}>
        <div className="sidebar__sections">
          { showSidebarLoading ? <Loading text="Fetching workspaces" /> : renderWorkspaces(params) }
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
