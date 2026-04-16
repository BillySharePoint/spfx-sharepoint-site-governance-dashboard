/**
 * SummaryCards Component
 *
 * Renders a responsive row of KPI cards, one per governance domain.
 * Each card shows the domain icon, score, and status with color coding.
 */

import * as React from 'react';
import { Stack, Text, Icon } from '@fluentui/react';
import { IDomainResult } from '../models/IGovernanceModels';
import { getStatusColor } from '../utils/statusHelpers';
import { StatusBadge } from './StatusBadge';

export interface ISummaryCardsProps {
  domainResults: IDomainResult[];
}

export const SummaryCards: React.FC<ISummaryCardsProps> = ({ domainResults }) => {
  return (
    <Stack
      horizontal
      wrap
      tokens={{ childrenGap: 14 }}
      styles={{ root: { marginBottom: 4 } }}
    >
      {domainResults.map((result) => {
        const color = getStatusColor(result.status);
        return (
          <Stack
            key={result.domain}
            styles={{
              root: {
                background: '#ffffff',
                borderRadius: 10,
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                padding: '18px 20px',
                border: '1px solid #EDEBE9',
                borderTop: `3px solid ${color}`,
                minWidth: 155,
                maxWidth: 200,
                flex: '1 1 155px',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                selectors: {
                  ':hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }
              }
            }}
          >
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }} styles={{ root: { marginBottom: 10 } }}>
              <Icon
                iconName={result.icon}
                styles={{ root: { fontSize: 18, color } }}
              />
              <Text variant="small" styles={{ root: { fontWeight: 600, color: '#323130', lineHeight: '16px' } }}>
                {result.domain}
              </Text>
            </Stack>

            <Text
              variant="xxLarge"
              styles={{ root: { fontWeight: 700, color, lineHeight: '32px', marginBottom: 4 } }}
            >
              {result.score}
            </Text>

            <StatusBadge status={result.status} size="small" />
          </Stack>
        );
      })}
    </Stack>
  );
};
