import React from 'react';

import './style';
import Swimlane from '../Swimlane';

const Project = (props) => {
  return (
    <div className="container">
      <div className="flex-container">
        {
          props.sections.map((section) => (
            <Swimlane key={section.id}
                      cards={section.cards}
                      name={section.name}
                      moveCard={props.onCardMove}
                      newTaskSubmit={props.onNewTaskSubmit}
                      taskUpdate={props.onTaskUpdate}
                      onTaskSelected={props.onTaskSelected}
                      id={section.id} />
          ))
        }
      </div>
    </div>
  );
};

export default Project;
