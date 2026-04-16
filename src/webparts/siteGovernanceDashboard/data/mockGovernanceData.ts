/**
 * Mock Governance Data
 *
 * Provides three realistic demo scenarios to showcase the dashboard:
 *   1. Healthy Site    — Contoso Intranet (score ~92)
 *   2. Needs Review    — Marketing Portal (score ~68)
 *   3. High Risk       — Legacy Project Site (score ~35)
 */

import {
  ISiteInfo,
  IPermissionsSummary,
  IContentFreshnessSummary,
  IGovernanceTrendPoint
} from '../models/IGovernanceModels';

// ─── Scenario 1 : Healthy Site ───────────────────────────────

export const healthySiteInfo: ISiteInfo = {
  siteId: 'site-001-healthy',
  siteTitle: 'Contoso Intranet',
  siteUrl: 'https://contoso.sharepoint.com/sites/intranet',
  template: 'Communication Site',
  ownerNames: ['Alex Johnson', 'Maria Garcia'],
  ownerCount: 2,
  createdDate: '2023-03-15T00:00:00Z',
  lastModifiedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  storageUsedMB: 1200,
  storageQuotaMB: 5120,
  hubSiteName: 'Corporate Hub',
  privacy: 'Private',
  externalSharingEnabled: false
};

export const healthyPermissions: IPermissionsSummary = {
  totalGroups: 4,
  totalRoleAssignments: 6,
  uniquePermissionsCount: 3,
  inheritanceBrokenCount: 1
};

export const healthyContentFreshness: IContentFreshnessSummary = {
  totalDocuments: 340,
  documentsUpdatedLast6Months: 280,
  documentsUpdatedLast12Months: 40,
  documentsOlderThan18Months: 20,
  staleContentPercentage: 6
};

export const healthyCompliance = {
  hasClassification: true,
  hasReviewDate: true,
  hasBusinessOwner: true,
  hasPurpose: true,
  hasRetentionPolicy: true
};

export const healthyTrends: IGovernanceTrendPoint[] = [
  { date: '2025-11-01', score: 88 },
  { date: '2025-12-01', score: 89 },
  { date: '2026-01-01', score: 90 },
  { date: '2026-02-01', score: 91 },
  { date: '2026-03-01', score: 92 },
  { date: '2026-04-01', score: 92 }
];

// ─── Scenario 2 : Needs Review ───────────────────────────────

export const needsReviewSiteInfo: ISiteInfo = {
  siteId: 'site-002-review',
  siteTitle: 'Marketing Portal',
  siteUrl: 'https://contoso.sharepoint.com/sites/marketing',
  template: 'Team Site',
  ownerNames: ['Sarah Chen'],
  ownerCount: 1,
  createdDate: '2022-06-10T00:00:00Z',
  lastModifiedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
  storageUsedMB: 4200,
  storageQuotaMB: 5120,
  hubSiteName: 'Marketing Hub',
  privacy: 'Private',
  externalSharingEnabled: true
};

export const needsReviewPermissions: IPermissionsSummary = {
  totalGroups: 8,
  totalRoleAssignments: 14,
  uniquePermissionsCount: 12,
  inheritanceBrokenCount: 4
};

export const needsReviewContentFreshness: IContentFreshnessSummary = {
  totalDocuments: 580,
  documentsUpdatedLast6Months: 220,
  documentsUpdatedLast12Months: 160,
  documentsOlderThan18Months: 200,
  staleContentPercentage: 34
};

export const needsReviewCompliance = {
  hasClassification: true,
  hasReviewDate: false,
  hasBusinessOwner: true,
  hasPurpose: true,
  hasRetentionPolicy: false
};

export const needsReviewTrends: IGovernanceTrendPoint[] = [
  { date: '2025-11-01', score: 74 },
  { date: '2025-12-01', score: 72 },
  { date: '2026-01-01', score: 70 },
  { date: '2026-02-01', score: 69 },
  { date: '2026-03-01', score: 68 },
  { date: '2026-04-01', score: 68 }
];

// ─── Scenario 3 : High Risk ─────────────────────────────────

export const highRiskSiteInfo: ISiteInfo = {
  siteId: 'site-003-risk',
  siteTitle: 'Legacy Project Alpha',
  siteUrl: 'https://contoso.sharepoint.com/sites/project-alpha',
  template: 'Team Site (classic)',
  ownerNames: [],
  ownerCount: 0,
  createdDate: '2019-01-22T00:00:00Z',
  lastModifiedDate: new Date(Date.now() - 280 * 24 * 60 * 60 * 1000).toISOString(), // 280 days ago
  storageUsedMB: 4800,
  storageQuotaMB: 5120,
  hubSiteName: '',
  privacy: 'Public',
  externalSharingEnabled: true
};

export const highRiskPermissions: IPermissionsSummary = {
  totalGroups: 14,
  totalRoleAssignments: 38,
  uniquePermissionsCount: 42,
  inheritanceBrokenCount: 18
};

export const highRiskContentFreshness: IContentFreshnessSummary = {
  totalDocuments: 920,
  documentsUpdatedLast6Months: 30,
  documentsUpdatedLast12Months: 80,
  documentsOlderThan18Months: 810,
  staleContentPercentage: 88
};

export const highRiskCompliance = {
  hasClassification: false,
  hasReviewDate: false,
  hasBusinessOwner: false,
  hasPurpose: false,
  hasRetentionPolicy: false
};

export const highRiskTrends: IGovernanceTrendPoint[] = [
  { date: '2025-11-01', score: 42 },
  { date: '2025-12-01', score: 40 },
  { date: '2026-01-01', score: 38 },
  { date: '2026-02-01', score: 36 },
  { date: '2026-03-01', score: 35 },
  { date: '2026-04-01', score: 35 }
];
