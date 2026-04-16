/**
 * RecommendationsPanel Component
 *
 * Displays actionable governance recommendations derived from
 * findings across all domains. Each recommendation includes the
 * source domain and a clear action statement.
 */

import * as React from 'react';
import { Stack, Text, Icon } from '@fluentui/react';
import { IDomainResult } from '../models/IGovernanceModels';
import { getDomainIcon, getStatusColor } from '../utils/statusHelpers';

export interface IRecommendationsPanelProps {
  domainResults: IDomainResult[];
}

export const RecommendationsPanel: React.FC<IRecommendationsPanelProps> = ({ domainResults }) => {
  // Collect unique recommendations across all domains
  const allRecs: { domain: string; recommendation: string; icon: string; color: string }[] = [];

  domainResults.forEach(dr => {
    dr.recommendations.forEach(rec => {
      if (!allRecs.find(r => r.recommendation === rec)) {
        allRecs.push({
          domain: dr.domain,
          recommendation: rec,
          icon: getDomainIcon(dr.domain),
          color: getStatusColor(dr.status)
        });
      }
    });
  });

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
        <Icon iconName="Lightbulb" styles={{ root: { fontSize: 18, color: '#0078D4' } }} />
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600, color: '#323130' } }}>
          Recommendations
        </Text>
      </Stack>

      {allRecs.length === 0 ? (
        <Stack horizontalAlign="center" tokens={{ padding: '24px 0', childrenGap: 8 }}>
          <Icon iconName="Like" styles={{ root: { fontSize: 32, color: '#107C10' } }} />
          <Text styles={{ root: { color: '#605E5C' } }}>No recommendations — governance is in great shape!</Text>
        </Stack>
      ) : (
        <Stack tokens={{ childrenGap: 8 }}>
          {allRecs.map((rec, idx) => (
            <Stack
              key={idx}
              horizontal
              verticalAlign="start"
              tokens={{ childrenGap: 12 }}
              styles={{
                root: {
                  background: '#FAF9F8',
                  borderRadius: 8,
                  padding: '12px 16px'
                }
              }}
            >
              <Icon
                iconName={rec.icon}
                styles={{ root: { fontSize: 16, color: rec.color, marginTop: 2, flexShrink: 0 } }}
              />
              <Stack tokens={{ childrenGap: 2 }}>
                <Text variant="small" styles={{ root: { color: '#A19F9D', fontSize: 11 } }}>
                  {rec.domain}
                </Text>
                <Text variant="smallPlus" styles={{ root: { color: '#323130', lineHeight: '18px' } }}>
                  {rec.recommendation}
                </Text>
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
