import PropTypes from 'prop-types';
import Raven from 'raven-js';
import React from 'react';

import {t} from '../locale';
import LoadingError from './loadingError';
import LoadingIndicator from '../components/loadingIndicator';

class LazyLoad extends React.Component {
  static propTypes = {
    hideBusy: PropTypes.bool,
    hideError: PropTypes.bool,
    /**
     * Function that returns a promise of a React.Component
     * Alias property for `getComponent` to maintain compatibility
     */
    component: PropTypes.func,

    /**
     * Function that returns a promise of a React.Component
     */
    getComponent: PropTypes.func,

    /**
     * Also accepts a route object from react-router that has a `getComponent` property
     */
    route: PropTypes.shape({
      getComponent: PropTypes.func,
    }),
  };

  constructor(...args) {
    super(...args);
    this.state = {
      Component: null,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchComponent();
  }

  getComponentGetter = () =>
    this.props.component || this.props.getComponent || this.props.route.getComponent;

  fetchComponent = () => {
    let getComponent = this.getComponentGetter();

    getComponent()
      .then(
        Component => {
          this.setState({
            Component,
          });
        },
        err => {
          this.setState({
            error: err,
          });
        }
      )
      .catch(err => {
        // eslint-disable-next-line no-console
        console.warn(err);
        Raven.captureException(err);
        this.setState({
          error: err,
        });
      });
  };

  fetchRetry = () => {
    this.setState(
      {
        error: null,
      },
      () => this.fetchComponent()
    );
  };

  render() {
    let {Component, error} = this.state;
    // eslint-disable-next-line no-unused-vars
    let {hideBusy, hideError, component, getComponent, ...otherProps} = this.props;

    if (error && !hideError) {
      return (
        <LoadingError
          onRetry={this.fetchRetry}
          message={t('There was an error loading a component.')}
        />
      );
    }

    if (!Component && !hideBusy) return <LoadingIndicator />;

    return <Component {...otherProps} />;
  }
}

export default LazyLoad;
