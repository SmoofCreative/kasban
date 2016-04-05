import { connect } from 'react-redux';

import Swimlane from '../components/Swimlane';

const mapStateToProps = (state) => {
  return {
    cardEntities: state.entities.cards.records
  }
};

export default connect(mapStateToProps)(Swimlane);
