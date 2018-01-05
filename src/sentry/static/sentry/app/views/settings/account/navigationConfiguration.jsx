import {t} from '../../../locale';

const pathPrefix = '/settings/account';

const accountNavigation = [
  {
    name: t('Account'),
    items: [
      {
        path: `${pathPrefix}/avatar`,
        title: t('Avatar'),
      },
      {
        path: `${pathPrefix}/notifications/`,
        title: t('Notifications'),
      },
      {
        path: `${pathPrefix}/emails/`,
        title: t('Emails'),
      },
    ],
  },
  {
    name: t('API'),
    items: [
      {
        path: `${pathPrefix}/api/applications/`,
        title: t('Applications'),
      },
    ],
  },
];

export default accountNavigation;
