import React from 'react';
import classNames from 'classnames';

import './style';

const Sidebar = ({workspaces, currentProjectId, visible, onProjectSelected}) => {
  const classes = classNames('sidebar', { active: visible });

  return (
    <div className={classes}>
      {
        workspaces.map((workspace) => {
          return (
            <div key={workspace.id}>
              <h4>{workspace.name}</h4>
              <ul>
                {
                  workspace.projects.map((project) => {
                    return (
                      <li
                        key={project.id}
                        className={ currentProjectId == project.id ? 'active' : '' }
                        onClick={onProjectSelected.bind(this, workspace.id, project.id)}>
                        { project.name }
                      </li>
                    );
                  })
                }
              </ul>
            </div>
          )
        })
      }
    </div>
  );
};

export default Sidebar;
