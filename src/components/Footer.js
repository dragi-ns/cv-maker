import { Component } from 'react';

export default class Footer extends Component {
  render() {
    return (
      <footer className="app-footer">
        <p>
          &copy; 2022{' '}
          <a
            href="https://github.com/dragi-ns/cv-maker"
            target="_blank"
            rel="noopener noreferrer">
            dragi-ns
          </a>
        </p>
      </footer>
    );
  }
}
