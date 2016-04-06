import React from 'react';

import './style';
import Swimlane from '../../containers/SwimlaneContainer';

const Project = (props) => {
  return (
    <div className="container">
      <div className="flex-container">
        {
          props.sections.map((sectionId) => {
            const section = props.sectionEntities[sectionId];
            return <Swimlane key={section.id} {...section} />;
          })
        }
      </div>
    </div>
  );
};

export default Project;
