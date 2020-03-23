import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// eslint-disable-next-line
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// eslint-disable-next-line jest/expect-expect
it('renders without crashing', () => {
  const div = document.createElement('div'); // eslint-disable-line
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
