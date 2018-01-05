import {Box, Flex} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';

import {t, tct} from '../../../locale';
import AsyncView from '../../asyncView';
import AutoSelectText from '../../../components/autoSelectText';
import Button from '../../../components/buttons/button';
import DateTime from '../../../components/dateTime';
import EmptyMessage from '../components/emptyMessage';
import IndicatorStore from '../../../stores/indicatorStore';
import Panel from '../components/panel';
import PanelBody from '../components/panelBody';
import PanelHeader from '../components/panelHeader';
import Row from '../components/row';
import SettingsPageHeader from '../components/settingsPageHeader';

class ApiTokenRow extends React.Component {
  static propTypes = {
    token: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  onRemove = () => {
    this.props.onRemove(this.props.token);
  };

  render() {
    let token = this.props.token;

    return (
      <Row justify="space-between" px={2} py={2}>
        <Box flex="1">
          <div style={{marginBottom: 5}}>
            <small>
              <AutoSelectText>{token.token}</AutoSelectText>
            </small>
          </div>
          <div style={{marginBottom: 5}}>
            <small>
              Created <DateTime date={token.dateCreated} />
            </small>
          </div>
          <div>
            <small style={{color: '#999'}}>{token.scopes.join(', ')}</small>
          </div>
        </Box>

        <Flex align="center">
          <Box pl={2}>
            <Button onClick={this.handleRemove}>
              <span className="icon icon-trash" />
            </Button>
          </Box>
        </Flex>
      </Row>
    );
  }
}

class ApiTokens extends AsyncView {
  getTitle() {
    return 'API Tokens - Sentry';
  }

  getDefaultState() {
    return {
      loading: true,
      error: false,
      tokenList: [],
    };
  }

  getEndpoints() {
    return [['tokenList', '/api-tokens/']];
  }

  handleRemoveToken = token => {
    let loadingIndicator = IndicatorStore.add(t('Saving changes..'));
    this.api.request('/api-tokens/', {
      method: 'DELETE',
      data: {token: token.token},
      success: data => {
        IndicatorStore.remove(loadingIndicator);
        this.setState({
          tokenList: this.state.tokenList.filter(tk => tk.token !== token.token),
        });
      },
      error: () => {
        IndicatorStore.remove(loadingIndicator);
        IndicatorStore.add(t('Unable to remove token. Please try again.'), 'error');
      },
    });
  };

  renderBody() {
    let {tokenList} = this.state;

    let isEmpty = tokenList.length === 0;

    let action = (
      <Button
        priority="primary"
        size="small"
        to="/settings/account/api/auth-tokens/new-token/"
        className="ref-create-token"
      >
        {t('Create New Token')}
      </Button>
    );

    return (
      <div>
        <SettingsPageHeader label="Auth Tokens" action={action} />
        <p>
          {t(
            "Authentication tokens allow you to perform actions against the Sentry API on behalf of your account. They're the easiest way to get started using the API."
          )}
        </p>
        <p>
          {tct(
            'For more information on how to use the web API, see our [link:documentation].',
            {
              link: <a href="https://docs.sentry.io/hosted/api/" />,
            }
          )}
        </p>
        <p>
          <small>
            psst. Looking for the <strong>DSN</strong> for an SDK? You'll find that under{' '}
            <strong>[Project] » Settings » Client Keys</strong>
            .
          </small>
        </p>
        <Panel>
          <PanelHeader disablePadding>
            <Flex align="center">
              <Box px={2} flex="1">
                {t('Auth Token')}
              </Box>
            </Flex>
          </PanelHeader>

          <PanelBody>
            {isEmpty && (
              <EmptyMessage>
                {t("You haven't created any authentication tokens yet.")}
              </EmptyMessage>
            )}

            {!isEmpty &&
              tokenList.map(token => {
                return (
                  <ApiTokenRow
                    key={token.token}
                    token={token}
                    onRemove={this.handleRemoveToken}
                  />
                );
              })}
          </PanelBody>
        </Panel>
      </div>
    );
  }
}

export default ApiTokens;
