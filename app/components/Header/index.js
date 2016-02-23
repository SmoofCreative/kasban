import './style.scss';

export default () => {
  let element = document.createElement('h1');
  element.innerHTML = 'Hello world.';

  return element;
};
