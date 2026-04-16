/**
 * SiteProfileCard Component
 *
 * Displays key metadata about the SharePoint site being assessed,
 * including ownership, template, storage, and sharing configuration.
 */

import * as React from 'react';
import { Stack, Text, Icon } from '@fluentui/react';
import { ISiteInfo } from '../models/IGovernanceModels';
import { formatDate, formatStorage } from '../utils/statusHelpers';

export interface ISiteProfileCardProps {
  siteInfo: ISiteInfo;
}

interface IProfileField {
  label: string;
  value: string;
  icon: string;
}

export const SiteProfileCard: React.FC<ISiteProfileCardProps> = ({ siteInfo }) => {
  const fields: IProfileField[] = [
    { label: 'Site URL', value: siteInfo.siteUrl, icon: 'Link' },
    { label: 'Template', value: siteInfo.template, icon: 'PageList' },
    { label: 'Owner(s)', value: siteInfo.ownerNames.length > 0 ? siteInfo.ownerNames.join(', ') : 'None assigned', icon: 'People' },
    { label: 'Created', value: formatDate(siteInfo.createdDate), icon: 'Calendar' },
    { label: 'Last Modified', value: formatDate(siteInfo.lastModifiedDate), icon: 'Edit' },
    { label: 'Storage', value: `${formatStorage(siteInfo.storageUsedMB)} / ${formatStorage(siteInfo.storageQuotaMB)}`, icon: 'Cloud' },
    { label: 'Hub Site', value: siteInfo.hubSiteName || 'Not associated', icon: 'Org' },
    { label: 'Visibility', value: siteInfo.privacy, icon: 'Lock' },
    { label: 'External Sharing', value: siteInfo.externalSharingEnabled ? 'Enabled' : 'Disabled', icon: 'Share' }
  ];

  return (
    <Stack
      styles={{
        root: {
          background: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          padding: '28px 32px',
          border: '1px solid #EDEBE9',
          flex: 1,
          minWidth: 300
        }
      }}
    >
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }} styles={{ root: { marginBottom: 20 } }}>
        <Icon iconName="Globe" styles={{ root: { fontSize: 20, color: '#0078D4' } }} />
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600, color: '#323130' } }}>
          {siteInfo.siteTitle}
        </Text>
      </Stack>

      <Stack tokens={{ childrenGap: 10 }}>
        {fields.map((field, idx) => (
          <Stack key={idx} horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
            <Icon
              iconName={field.icon}
              styles={{ root: { fontSize: 14, color: '#A19F9D', width: 18 } }}
            />
            <Text variant="small" styles={{ root: { color: '#605E5C', minWidth: 110, fontWeight: 600 } }}>
              {field.label}
            </Text>
            <Text
              variant="small"
              styles={{
                root: {
                  color: '#323130',
                  wordBreak: 'break-word',
                  flex: 1,
                  ...(field.label === 'External Sharing' && siteInfo.externalSharingEnabled
                    ? { color: '#D83B01', fontWeight: 600 }
                    : {}),
                  ...(field.label === 'Owner(s)' && siteInfo.ownerCount === 0
                    ? { color: '#A80000', fontWeight: 600 }
                    : {})
                }
              }}
            >
              {field.value}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
