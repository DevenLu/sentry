import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
// import {action} from '@storybook/addon-actions';

import LazyLoad from 'sentry-ui/lazyLoad';

storiesOf('LazyLoad', module).add(
  'default',
  withInfo('Lazy loads a view/component')(() => {
    const MyComponent = () => (
      <div>View that is loaded after 1000ms to simulate dynamic import</div>
    );

    const getComponent = () =>
      new Promise(resolve => setTimeout(() => resolve(MyComponent), 1000));

    return <LazyLoad component={getComponent} />;
  })
);
