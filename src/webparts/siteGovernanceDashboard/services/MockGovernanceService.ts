/**
 * Mock Governance Service
 *
 * Provides realistic demo data for three governance scenarios.
 * This service enables the dashboard to render a polished experience
 * without any dependency on a live SharePoint tenant.
 */

import { IGovernanceService } from './IGovernanceService';
import {
  IGovernanceSummary,
  IDomainResult,
  IGovernanceFinding,
  ISiteInfo,
  IPermissionsSummary,
  IContentFreshnessSummary,
  IGovernanceTrendPoint
} from '../models/IGovernanceModels';
import {
  evaluateOwnership,
  evaluatePermissions,
  evaluateExternalSharing,
  evaluateContentFreshness,
  evaluateActivity,
  evaluateStorage,
  evaluateCompliance,
  calculateOverallScore
} from '../utils/governanceScoring';
import { getStatusFromScore } from '../utils/statusHelpers';
import {
  healthySiteInfo, healthyPermissions, healthyContentFreshness, healthyCompliance, healthyTrends,
  needsReviewSiteInfo, needsReviewPermissions, needsReviewContentFreshness, needsReviewCompliance, needsReviewTrends,
  highRiskSiteInfo, highRiskPermissions, highRiskContentFreshness, highRiskCompliance, highRiskTrends
} from '../data/mockGovernanceData';

/** Simulates a slight network delay for realism */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildSummary(
  siteInfo: ISiteInfo,
  permissions: IPermissionsSummary,
  freshness: IContentFreshnessSummary,
  compliance: { hasClassification: boolean; hasReviewDate: boolean; hasBusinessOwner: boolean; hasPurpose: boolean; hasRetentionPolicy: boolean },
  trends: IGovernanceTrendPoint[]
): IGovernanceSummary {
  const domainResults: IDomainResult[] = [
    evaluateOwnership(siteInfo),
    evaluatePermissions(permissions),
    evaluateExternalSharing(siteInfo),
    evaluateContentFreshness(freshness),
    evaluateActivity(siteInfo),
    evaluateStorage(siteInfo),
    evaluateCompliance(compliance)
  ];

  const overallScore = calculateOverallScore(domainResults);
  const allFindings: IGovernanceFinding[] = domainResults.reduce<IGovernanceFinding[]>(
    (acc, dr) => [...acc, ...dr.findings], []
  );

  return {
    siteInfo,
    overallScore,
    overallStatus: getStatusFromScore(overallScore),
    domainResults,
    findings: allFindings,
    trendData: trends,
    permissionsSummary: permissions,
    contentFreshness: freshness,
    lastAssessedDate: new Date().toISOString(),
    alertCount: allFindings.length
  };
}

export class MockGovernanceService implements IGovernanceService {

  public async getGovernanceSummary(scenarioId: string): Promise<IGovernanceSummary> {
    await delay(600); // simulate network latency

    switch (scenarioId) {
      case 'healthy':
        return buildSummary(healthySiteInfo, healthyPermissions, healthyContentFreshness, healthyCompliance, healthyTrends);
      case 'needs-review':
        return buildSummary(needsReviewSiteInfo, needsReviewPermissions, needsReviewContentFreshness, needsReviewCompliance, needsReviewTrends);
      case 'high-risk':
        return buildSummary(highRiskSiteInfo, highRiskPermissions, highRiskContentFreshness, highRiskCompliance, highRiskTrends);
      default:
        return buildSummary(healthySiteInfo, healthyPermissions, healthyContentFreshness, healthyCompliance, healthyTrends);
    }
  }

  public async getAvailableScenarios(): Promise<{ id: string; title: string }[]> {
    await delay(200);
    return [
      { id: 'healthy', title: 'Contoso Intranet (Healthy)' },
      { id: 'needs-review', title: 'Marketing Portal (Needs Review)' },
      { id: 'high-risk', title: 'Legacy Project Alpha (High Risk)' }
    ];
  }
}
