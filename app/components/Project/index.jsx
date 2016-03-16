import React from 'react';

import './style';
import Swimlane from '../Swimlane';

const Project = (props) => {
  console.log(props);
  return (
    <main className="main">
      <div className="container">
        <div className="flex-container">
          {
            props.sections.map((section) => (
              <Swimlane key={section.id}
                        cards={section.cards}
                        swimlaneId={section.id}
                        moveCard={props.onCardMove}
                        newTaskSubmit={props.onNewTaskSubmit}
                        taskUpdate={props.onTaskUpdate} />
            ))
          }
        </div>
      </div>
    </main>
  );
};

export default Project;
