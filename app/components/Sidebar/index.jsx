import React from 'react';
import classNames from 'classnames';

import './style';

import AccordionSection from './accordion-section';
import Loading from '../Loading';

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
