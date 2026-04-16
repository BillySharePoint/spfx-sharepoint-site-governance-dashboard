/**
 * Governance Domain Models and Interfaces
 *
 * Core type definitions for the SharePoint Site Governance Dashboard.
 * These models represent governance assessment data, domain results,
 * findings, and site metadata used throughout the solution.
 */

/** Overall governance health status based on score bands */
export enum GovernanceStatus {
  Excellent = 'Excellent',
  Good = 'Good',
  NeedsReview = 'Needs Review',
  Warning = 'Warning',
  Critical = 'Critical'
}

/** Severity level for individual governance findings */
export enum GovernanceSeverity {
  Info = 'Info',
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

/** Governance assessment domains */
export enum GovernanceDomain {
  Ownership = 'Ownership',
  Permissions = 'Permissions',
  ExternalSharing = 'External Sharing',
  ContentFreshness = 'Content Freshness',
  Activity = 'Activity & Lifecycle',
  Storage = 'Storage',
  Compliance = 'Compliance Signals'
}

/** SharePoint site metadata */
export interface ISiteInfo {
  siteId: string;
  siteTitle: string;
  siteUrl: string;
  template: string;
  ownerNames: string[];
  ownerCount: number;
  createdDate: string;
  lastModifiedDate: string;
  storageUsedMB: number;
  storageQuotaMB: number;
  hubSiteName: string;
  privacy: string;
  externalSharingEnabled: boolean;
}

/** Individual governance issue or observation */
export interface IGovernanceFinding {
  id: string;
  domain: GovernanceDomain;
  severity: GovernanceSeverity;
  title: string;
  description: string;
  recommendation: string;
}

/** Assessment result for a single governance domain */
export interface IDomainResult {
  domain: GovernanceDomain;
  score: number;
  status: GovernanceStatus;
  summary: string;
  findings: IGovernanceFinding[];
  recommendations: string[];
  icon: string;
}

/** Permissions complexity snapshot */
export interface IPermissionsSummary {
  totalGroups: number;
  totalRoleAssignments: number;
  uniquePermissionsCount: number;
  inheritanceBrokenCount: number;
}

/** Content freshness distribution */
export interface IContentFreshnessSummary {
  totalDocuments: number;
  documentsUpdatedLast6Months: number;
  documentsUpdatedLast12Months: number;
  documentsOlderThan18Months: number;
  staleContentPercentage: number;
}

/** Historical governance score data point */
export interface IGovernanceTrendPoint {
  date: string;
  score: number;
}

/** Complete governance assessment summary for a site */
export interface IGovernanceSummary {
  siteInfo: ISiteInfo;
  overallScore: number;
  overallStatus: GovernanceStatus;
  domainResults: IDomainResult[];
  findings: IGovernanceFinding[];
  trendData: IGovernanceTrendPoint[];
  permissionsSummary: IPermissionsSummary;
  contentFreshness: IContentFreshnessSummary;
  lastAssessedDate: string;
  alertCount: number;
}
