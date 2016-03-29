import React from 'react';
import classNames from 'classnames';

const AccordionSection = React.createClass({
  getInitialState() {
    return {
      open: this.props.active
    };
  },

  handleClick() {
    this.setState({
      open: !this.state.open
    });
  },

  render() {
    const { classname, title } = this.props;
    const sectionClasses = classNames(classname, { active: this.state.open });
    const headerClasses = `${classname}__header`


    return (
      <section className={sectionClasses}>
        <div className={headerClasses} onClick={this.handleClick}>{ title }</div>
        { this.props.children }
      </section>
    );
  }
});

export default AccordionSection;
