/**
 * DomainDetailTabs Component
 *
 * Tabbed interface showing detailed governance information for each
 * domain. Each tab presents the domain score, summary, findings,
 * and specific metrics where applicable.
 */

import * as React from 'react';
import { Stack, Text, Icon, Pivot, PivotItem } from '@fluentui/react';
import {
  IDomainResult,
  GovernanceDomain,
  IPermissionsSummary,
  IContentFreshnessSummary
} from '../models/IGovernanceModels';
import { getStatusColor, getSeverityColor } from '../utils/statusHelpers';
import { StatusBadge } from './StatusBadge';

export interface IDomainDetailTabsProps {
  domainResults: IDomainResult[];
  permissionsSummary: IPermissionsSummary;
  contentFreshness: IContentFreshnessSummary;
}

/** Renders a simple metric row */
const MetricRow: React.FC<{ label: string; value: string | number; highlight?: boolean }> = ({ label, value, highlight }) => (
  <Stack horizontal horizontalAlign="space-between" styles={{ root: { padding: '6px 0', borderBottom: '1px solid #F3F2F1' } }}>
    <Text variant="small" styles={{ root: { color: '#605E5C' } }}>{label}</Text>
    <Text variant="small" styles={{ root: { fontWeight: 600, color: highlight ? '#D83B01' : '#323130' } }}>
      {value}
    </Text>
  </Stack>
);

/** Renders findings for a domain */
const DomainFindings: React.FC<{ result: IDomainResult }> = ({ result }) => {
  if (result.findings.length === 0) {
    return (
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }} styles={{ root: { padding: '12px 0' } }}>
        <Icon iconName="CompletedSolid" styles={{ root: { color: '#107C10', fontSize: 16 } }} />
        <Text variant="small" styles={{ root: { color: '#605E5C' } }}>
          No issues detected in this domain.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack tokens={{ childrenGap: 8 }} styles={{ root: { marginTop: 8 } }}>
      {result.findings.map(f => (
        <Stack
          key={f.id}
          styles={{
            root: {
              background: '#FAF9F8',
              borderRadius: 6,
              padding: '10px 14px',
              borderLeft: `3px solid ${getSeverityColor(f.severity)}`
            }
          }}
        >
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
            <Text variant="tiny" styles={{ root: { color: getSeverityColor(f.severity), fontWeight: 700, textTransform: 'uppercase' } }}>
              {f.severity}
            </Text>
            <Text variant="tiny" styles={{ root: { color: '#A19F9D' } }}>#{f.id}</Text>
          </Stack>
          <Text variant="smallPlus" styles={{ root: { fontWeight: 600, color: '#323130', margin: '4px 0 2px' } }}>
            {f.title}
          </Text>
          <Text variant="small" styles={{ root: { color: '#605E5C', lineHeight: '18px' } }}>
            {f.description}
          </Text>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }} styles={{ root: { marginTop: 6 } }}>
            <Icon iconName="Lightbulb" styles={{ root: { fontSize: 12, color: '#0078D4' } }} />
            <Text variant="small" styles={{ root: { color: '#0078D4', fontStyle: 'italic' } }}>
              {f.recommendation}
            </Text>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

export const DomainDetailTabs: React.FC<IDomainDetailTabsProps> = ({
  domainResults,
  permissionsSummary,
  contentFreshness
}) => {

  /** Render extra metrics for specific domains */
  const renderDomainMetrics = (domain: GovernanceDomain): React.ReactNode => {
    if (domain === GovernanceDomain.Permissions) {
      return (
        <Stack styles={{ root: { marginTop: 12 } }}>
          <Text variant="small" styles={{ root: { fontWeight: 600, color: '#323130', marginBottom: 8 } }}>
            Permissions Breakdown
          </Text>
          <MetricRow label="SharePoint Groups" value={permissionsSummary.totalGroups} />
          <MetricRow label="Role Assignments" value={permissionsSummary.totalRoleAssignments} />
          <MetricRow label="Unique Permissions" value={permissionsSummary.uniquePermissionsCount} highlight={permissionsSummary.uniquePermissionsCount > 15} />
          <MetricRow label="Broken Inheritance" value={permissionsSummary.inheritanceBrokenCount} highlight={permissionsSummary.inheritanceBrokenCount > 5} />
        </Stack>
      );
    }

    if (domain === GovernanceDomain.ContentFreshness) {
      const totalDocs = contentFreshness.totalDocuments;
      return (
        <Stack styles={{ root: { marginTop: 12 } }}>
          <Text variant="small" styles={{ root: { fontWeight: 600, color: '#323130', marginBottom: 8 } }}>
            Content Distribution
          </Text>
          <MetricRow label="Total Documents" value={totalDocs} />
          <MetricRow label="Updated (last 6 months)" value={`${contentFreshness.documentsUpdatedLast6Months} (${Math.round(contentFreshness.documentsUpdatedLast6Months / totalDocs * 100)}%)`} />
          <MetricRow label="Updated (6–12 months)" value={`${contentFreshness.documentsUpdatedLast12Months} (${Math.round(contentFreshness.documentsUpdatedLast12Months / totalDocs * 100)}%)`} />
          <MetricRow label="Stale (18+ months)" value={`${contentFreshness.documentsOlderThan18Months} (${contentFreshness.staleContentPercentage}%)`} highlight={contentFreshness.staleContentPercentage > 30} />

          {/* Simple bar visualization */}
          <Stack styles={{ root: { marginTop: 12 } }}>
            <Text variant="small" styles={{ root: { color: '#605E5C', marginBottom: 4 } }}>Freshness Distribution</Text>
            <Stack horizontal styles={{ root: { height: 12, borderRadius: 6, overflow: 'hidden', width: '100%' } }}>
              <div style={{ width: `${Math.round(contentFreshness.documentsUpdatedLast6Months / totalDocs * 100)}%`, background: '#107C10', height: '100%' }} />
              <div style={{ width: `${Math.round(contentFreshness.documentsUpdatedLast12Months / totalDocs * 100)}%`, background: '#FFB900', height: '100%' }} />
              <div style={{ width: `${contentFreshness.staleContentPercentage}%`, background: '#A80000', height: '100%' }} />
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 16 }} styles={{ root: { marginTop: 6 } }}>
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#107C10' }} />
                <Text variant="tiny" styles={{ root: { color: '#605E5C' } }}>Fresh</Text>
              </Stack>
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFB900' }} />
                <Text variant="tiny" styles={{ root: { color: '#605E5C' } }}>Aging</Text>
              </Stack>
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#A80000' }} />
                <Text variant="tiny" styles={{ root: { color: '#605E5C' } }}>Stale</Text>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      );
    }

    return null;
  };

  return (
    <Stack
      styles={{
        root: {
          background: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          padding: '24px 32px',
          border: '1px solid #EDEBE9'
        }
      }}
    >
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }} styles={{ root: { marginBottom: 8 } }}>
        <Icon iconName="ViewAll" styles={{ root: { fontSize: 18, color: '#0078D4' } }} />
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600, color: '#323130' } }}>
          Domain Details
        </Text>
      </Stack>

      <Pivot
        styles={{
          root: { marginBottom: 16 },
          link: { fontSize: 13 },
          linkIsSelected: { fontSize: 13 }
        }}
      >
        {domainResults.map((result) => {
          const color = getStatusColor(result.status);
          return (
            <PivotItem
              key={result.domain}
              headerText={result.domain}
              itemIcon={result.icon}
            >
              <Stack tokens={{ childrenGap: 12 }} styles={{ root: { padding: '16px 0' } }}>
                {/* Domain header */}
                <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
                  <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
                    <Icon iconName={result.icon} styles={{ root: { fontSize: 22, color } }} />
                    <Stack>
                      <Text variant="large" styles={{ root: { fontWeight: 600, color: '#323130' } }}>
                        {result.domain}
                      </Text>
                      <Text variant="small" styles={{ root: { color: '#605E5C' } }}>
                        {result.summary}
                      </Text>
                    </Stack>
                  </Stack>
                  <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
                    <Text variant="xLarge" styles={{ root: { fontWeight: 700, color } }}>{result.score}</Text>
                    <StatusBadge status={result.status} />
                  </Stack>
                </Stack>

                {/* Domain-specific metrics */}
                {renderDomainMetrics(result.domain)}

                {/* Findings */}
                <Stack styles={{ root: { marginTop: 8 } }}>
                  <Text variant="small" styles={{ root: { fontWeight: 600, color: '#323130', marginBottom: 4 } }}>
                    Findings ({result.findings.length})
                  </Text>
                  <DomainFindings result={result} />
                </Stack>
              </Stack>
            </PivotItem>
          );
        })}
      </Pivot>
    </Stack>
  );
};
