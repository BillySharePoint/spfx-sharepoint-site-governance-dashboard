/**
 * GovernanceScoreCard Component
 *
 * Hero card displaying the overall governance score as an animated
 * SVG donut chart with the numeric score, status label, and trend indicator.
 */

import * as React from 'react';
import { Stack, Text } from '@fluentui/react';
import { GovernanceStatus, IGovernanceTrendPoint } from '../models/IGovernanceModels';
import { getStatusColor } from '../utils/statusHelpers';
import { StatusBadge } from './StatusBadge';

export interface IGovernanceScoreCardProps {
  score: number;
  status: GovernanceStatus;
  trendData: IGovernanceTrendPoint[];
  alertCount: number;
  lastAssessedDate: string;
}

export const GovernanceScoreCard: React.FC<IGovernanceScoreCardProps> = ({
  score,
  status,
  trendData,
  alertCount,
  lastAssessedDate
}) => {
  const color = getStatusColor(status);
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Calculate trend direction
  const trend = trendData.length >= 2
    ? trendData[trendData.length - 1].score - trendData[trendData.length - 2].score
    : 0;
  const trendLabel = trend > 0 ? `+${trend}` : trend < 0 ? `${trend}` : '—';
  const trendColor = trend > 0 ? '#107C10' : trend < 0 ? '#A80000' : '#605E5C';

  const assessedDate = new Date(lastAssessedDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
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
          flex: 1,
          minWidth: 300
        }
      }}
    >
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600, color: '#323130', marginBottom: 20 } }}>
        Overall Governance Score
      </Text>

      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 32 }}>
        {/* SVG Donut Chart */}
        <Stack horizontalAlign="center">
          <svg width="150" height="150" viewBox="0 0 130 130">
            {/* Background ring */}
            <circle
              cx="65" cy="65" r={radius}
              fill="none"
              stroke="#F3F2F1"
              strokeWidth="10"
            />
            {/* Score arc */}
            <circle
              cx="65" cy="65" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 65 65)"
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            />
            {/* Score number */}
            <text
              x="65" y="60"
              textAnchor="middle"
              fontSize="32"
              fontWeight="700"
              fill={color}
              fontFamily="Segoe UI, sans-serif"
            >
              {score}
            </text>
            {/* "out of 100" label */}
            <text
              x="65" y="78"
              textAnchor="middle"
              fontSize="11"
              fill="#A19F9D"
              fontFamily="Segoe UI, sans-serif"
            >
              out of 100
            </text>
          </svg>
        </Stack>

        {/* Score details */}
        <Stack tokens={{ childrenGap: 12 }} styles={{ root: { flex: 1 } }}>
          <Stack tokens={{ childrenGap: 6 }}>
            <Text variant="small" styles={{ root: { color: '#605E5C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' } }}>
              Health Status
            </Text>
            <StatusBadge status={status} size="large" />
          </Stack>

          <Stack horizontal tokens={{ childrenGap: 24 }}>
            <Stack tokens={{ childrenGap: 2 }}>
              <Text variant="small" styles={{ root: { color: '#A19F9D' } }}>Trend</Text>
              <Text variant="mediumPlus" styles={{ root: { fontWeight: 600, color: trendColor } }}>
                {trendLabel} pts
              </Text>
            </Stack>
            <Stack tokens={{ childrenGap: 2 }}>
              <Text variant="small" styles={{ root: { color: '#A19F9D' } }}>Active Alerts</Text>
              <Text variant="mediumPlus" styles={{ root: { fontWeight: 600, color: alertCount > 0 ? '#D83B01' : '#107C10' } }}>
                {alertCount}
              </Text>
            </Stack>
          </Stack>

          <Text variant="tiny" styles={{ root: { color: '#A19F9D' } }}>
            Last assessed: {assessedDate}
          </Text>
        </Stack>
      </Stack>

      {/* Mini trend sparkline */}
      {trendData.length > 1 && (
        <Stack styles={{ root: { marginTop: 16, borderTop: '1px solid #F3F2F1', paddingTop: 12 } }}>
          <Text variant="small" styles={{ root: { color: '#605E5C', marginBottom: 6 } }}>
            Score Trend (6 months)
          </Text>
          <svg width="100%" height="40" viewBox="0 0 300 40" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
              points={trendData.map((p, i) => {
                const x = (i / (trendData.length - 1)) * 296 + 2;
                const y = 38 - ((p.score - 20) / 80) * 36;
                return `${x},${y}`;
              }).join(' ')}
            />
            {trendData.map((p, i) => {
              const x = (i / (trendData.length - 1)) * 296 + 2;
              const y = 38 - ((p.score - 20) / 80) * 36;
              return (
                <circle key={i} cx={x} cy={y} r="3" fill={color} />
              );
            })}
          </svg>
        </Stack>
      )}
    </Stack>
  );
};
