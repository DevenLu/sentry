import {browserHistory} from 'react-router';
import DocumentTitle from 'react-document-title';
import React from 'react';

import {API_SCOPES, DEFAULT_API_SCOPES} from '../../../constants';
import {t, tct} from '../../../locale';
import ApiForm from '../../../components/forms/apiForm';
import MultipleCheckboxField from '../../../components/forms/multipleCheckboxField';
import Panel from '../components/panel';
import PanelBody from '../components/panelBody';
import PanelHeader from '../components/panelHeader';
import SettingsPageHeader from '../components/settingsPageHeader';

const SORTED_DEFAULT_API_SCOPES = DEFAULT_API_SCOPES.sort();
const API_CHOICES = API_SCOPES.map(s => [s, s]);
const API_INDEX_ROUTE = '/settings/account/api/auth-tokens';

export default class ApiNewToken extends React.Component {
  onCancel = () => {
    browserHistory.push(API_INDEX_ROUTE);
  };

  onSubmitSuccess = () => {
    browserHistory.push(API_INDEX_ROUTE);
  };

  render() {
    return (
      <DocumentTitle title="Create API Token">
        <div>
          <SettingsPageHeader label={t('Create New Token')} />
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
          <Panel>
            <PanelHeader>{t('Create New Token')}</PanelHeader>
            <PanelBody>
              <ApiForm
                apiMethod="POST"
                apiEndpoint="/api-tokens/"
                className="form-stacked api-new-token"
                initialData={{scopes: SORTED_DEFAULT_API_SCOPES}}
                onSubmitSuccess={this.onSubmitSuccess}
                onCancel={this.onCancel}
              >
                <MultipleCheckboxField
                  name="scopes"
                  choices={API_CHOICES}
                  label={t('Scopes')}
                  required={true}
                />
              </ApiForm>
            </PanelBody>
          </Panel>
        </div>
      </DocumentTitle>
    );
  }
}
