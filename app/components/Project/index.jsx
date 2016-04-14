import React from 'react';

import './style';
import Swimlane from '../../containers/SwimlaneContainer';
import AddASectionSwimlane from '../../containers/AddASectionSwimlaneContainer';

const Project = (props) => {
  return (
    <div className="container">
      <div className="flex-container">
        {
          props.sections.map((sectionId) => {
            const section = props.sectionEntities[sectionId];
            return <Swimlane
                      key={section.id}
                      isFullWidth={false}
                      isStatic={false}
                      showInteractiveIcons={false}
                      isSubTasks={false}
                      fullHeight={false}
                      hasGutter={true}
                      {...section}
                  />;
          })
        }
        <AddASectionSwimlane />
      </div>
    </div>
  );
};

export default Project;
