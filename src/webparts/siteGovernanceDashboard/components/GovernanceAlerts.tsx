/**
 * GovernanceAlerts Component
 *
 * Displays a prioritized list of governance findings / alerts
 * with severity indicators, descriptions, and quick recommendations.
 */

import * as React from 'react';
import { Stack, Text, Icon } from '@fluentui/react';
import { IGovernanceFinding, GovernanceSeverity } from '../models/IGovernanceModels';
import { getSeverityColor } from '../utils/statusHelpers';

export interface IGovernanceAlertsProps {
  findings: IGovernanceFinding[];
}

/** Severity sort order (highest first) */
const severityOrder: Record<string, number> = {
  [GovernanceSeverity.Critical]: 0,
  [GovernanceSeverity.High]: 1,
  [GovernanceSeverity.Medium]: 2,
  [GovernanceSeverity.Low]: 3,
  [GovernanceSeverity.Info]: 4
};

export const GovernanceAlerts: React.FC<IGovernanceAlertsProps> = ({ findings }) => {
  if (findings.length === 0) {
    return (
      <Stack
        styles={{
          root: {
            background: '#ffffff',
            borderRadius: 12,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            padding: '28px 32px',
            border: '1px solid #EDEBE9',
            flex: 1
          }
        }}
      >
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600, color: '#323130', marginBottom: 16 } }}>
          Governance Alerts
        </Text>
        <Stack horizontalAlign="center" tokens={{ padding: '24px 0', childrenGap: 8 }}>
          <Icon iconName="CompletedSolid" styles={{ root: { fontSize: 32, color: '#107C10' } }} />
          <Text styles={{ root: { color: '#605E5C' } }}>No governance issues detected. Great job!</Text>
        </Stack>
      </Stack>
    );
  }

  const sorted = [...findings].sort((a, b) =>
    (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99)
  );

  return (
    <Stack
      styles={{
        root: {
          background: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          padding: '28px 32px',
          border: '1px solid #EDEBE9',
          flex: 1
        }
      }}
    >
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }} styles={{ root: { marginBottom: 16 } }}>
        <Icon iconName="AlertSolid" styles={{ root: { fontSize: 18, color: '#D83B01' } }} />
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600, color: '#323130' } }}>
          Governance Alerts
        </Text>
        <Stack
          styles={{
            root: {
              background: '#D83B01',
              borderRadius: 10,
              padding: '1px 8px',
              minWidth: 20,
              textAlign: 'center'
            }
          }}
        >
          <Text variant="small" styles={{ root: { color: '#fff', fontWeight: 600 } }}>
            {findings.length}
          </Text>
        </Stack>
      </Stack>

      <Stack tokens={{ childrenGap: 8 }}>
        {sorted.map((finding) => {
          const sevColor = getSeverityColor(finding.severity);
          return (
            <Stack
              key={finding.id}
              styles={{
                root: {
                  background: '#FAF9F8',
                  borderRadius: 8,
                  padding: '12px 16px',
                  borderLeft: `3px solid ${sevColor}`
                }
              }}
            >
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: sevColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {finding.severity}
                </span>
                <Text variant="small" styles={{ root: { color: '#A19F9D' } }}>
                  {finding.domain}
                </Text>
              </Stack>
              <Text variant="smallPlus" styles={{ root: { fontWeight: 600, color: '#323130', margin: '4px 0 2px' } }}>
                {finding.title}
              </Text>
              <Text variant="small" styles={{ root: { color: '#605E5C', lineHeight: '18px' } }}>
                {finding.description}
              </Text>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};
