/**
 * Governance Scoring Engine
 *
 * Evaluates SharePoint site data against governance rules and produces
 * weighted domain scores and an overall governance health score.
 *
 * Scoring weights:
 *   Ownership ........... 20%
 *   Permissions ......... 20%
 *   External Sharing .... 15%
 *   Content Freshness ... 15%
 *   Activity / Lifecycle  10%
 *   Storage ............. 10%
 *   Compliance Signals .. 10%
 */

import {
  GovernanceDomain,
  GovernanceSeverity,
  IGovernanceFinding,
  IDomainResult,
  ISiteInfo,
  IPermissionsSummary,
  IContentFreshnessSummary
} from '../models/IGovernanceModels';
import { getStatusFromScore, getDomainIcon } from './statusHelpers';

/** Domain weight configuration */
interface IDomainWeight {
  domain: GovernanceDomain;
  weight: number;
}

const DOMAIN_WEIGHTS: IDomainWeight[] = [
  { domain: GovernanceDomain.Ownership, weight: 0.20 },
  { domain: GovernanceDomain.Permissions, weight: 0.20 },
  { domain: GovernanceDomain.ExternalSharing, weight: 0.15 },
  { domain: GovernanceDomain.ContentFreshness, weight: 0.15 },
  { domain: GovernanceDomain.Activity, weight: 0.10 },
  { domain: GovernanceDomain.Storage, weight: 0.10 },
  { domain: GovernanceDomain.Compliance, weight: 0.10 }
];

// ─── Ownership ────────────────────────────────────────────────

export function evaluateOwnership(siteInfo: ISiteInfo): IDomainResult {
  const findings: IGovernanceFinding[] = [];
  let score: number;

  if (siteInfo.ownerCount === 0) {
    score = 10;
    findings.push({
      id: 'OWN-001',
      domain: GovernanceDomain.Ownership,
      severity: GovernanceSeverity.Critical,
      title: 'No site owner assigned',
      description: 'This site does not have any assigned owners. Sites without owners lack accountability and governance oversight.',
      recommendation: 'Assign at least one primary and one backup site owner.'
    });
  } else if (siteInfo.ownerCount === 1) {
    score = 60;
    findings.push({
      id: 'OWN-002',
      domain: GovernanceDomain.Ownership,
      severity: GovernanceSeverity.Medium,
      title: 'Only one site owner',
      description: 'This site has a single owner. If that person leaves the organization or changes roles, the site may become orphaned.',
      recommendation: 'Add a backup site owner to ensure continuity.'
    });
  } else {
    score = 100;
  }

  const recommendations = findings.map(f => f.recommendation);
  return {
    domain: GovernanceDomain.Ownership,
    score,
    status: getStatusFromScore(score),
    summary: siteInfo.ownerCount === 0
      ? 'No owners assigned — immediate attention required'
      : siteInfo.ownerCount === 1
        ? `Single owner (${siteInfo.ownerNames[0]}) — consider adding a backup`
        : `${siteInfo.ownerCount} owners assigned — ownership is healthy`,
    findings,
    recommendations,
    icon: getDomainIcon('Ownership')
  };
}

// ─── Permissions ──────────────────────────────────────────────

export function evaluatePermissions(permissions: IPermissionsSummary): IDomainResult {
  const findings: IGovernanceFinding[] = [];
  let score: number;

  if (permissions.uniquePermissionsCount > 30) {
    score = 15;
    findings.push({
      id: 'PERM-001',
      domain: GovernanceDomain.Permissions,
      severity: GovernanceSeverity.Critical,
      title: 'Very high permissions complexity',
      description: `${permissions.uniquePermissionsCount} unique permission entries detected. This level of complexity makes it difficult to audit access and increases security risk.`,
      recommendation: 'Conduct a full permissions audit and simplify where possible.'
    });
  } else if (permissions.uniquePermissionsCount > 15) {
    score = 40;
    findings.push({
      id: 'PERM-002',
      domain: GovernanceDomain.Permissions,
      severity: GovernanceSeverity.High,
      title: 'High permissions complexity',
      description: `${permissions.uniquePermissionsCount} unique permission entries detected. Consider reviewing and consolidating permissions.`,
      recommendation: 'Review unique permissions and consolidate into SharePoint groups where possible.'
    });
  } else if (permissions.uniquePermissionsCount > 5) {
    score = 70;
    findings.push({
      id: 'PERM-003',
      domain: GovernanceDomain.Permissions,
      severity: GovernanceSeverity.Low,
      title: 'Moderate permissions complexity',
      description: `${permissions.uniquePermissionsCount} unique permission entries found. This is within acceptable range but should be monitored.`,
      recommendation: 'Monitor permissions complexity over time.'
    });
  } else {
    score = 100;
  }

  if (permissions.inheritanceBrokenCount > 5) {
    score = Math.max(score - 20, 10);
    findings.push({
      id: 'PERM-004',
      domain: GovernanceDomain.Permissions,
      severity: GovernanceSeverity.Medium,
      title: 'Multiple broken inheritance instances',
      description: `${permissions.inheritanceBrokenCount} items have broken permission inheritance. This can lead to inconsistent access.`,
      recommendation: 'Review items with broken inheritance and restore where appropriate.'
    });
  }

  const recommendations = findings.map(f => f.recommendation);
  return {
    domain: GovernanceDomain.Permissions,
    score,
    status: getStatusFromScore(score),
    summary: score >= 90
      ? 'Permissions are clean and well-structured'
      : score >= 60
        ? `${permissions.uniquePermissionsCount} unique permissions — moderate complexity`
        : `${permissions.uniquePermissionsCount} unique permissions — review recommended`,
    findings,
    recommendations,
    icon: getDomainIcon('Permissions')
  };
}

// ─── External Sharing ─────────────────────────────────────────

export function evaluateExternalSharing(siteInfo: ISiteInfo): IDomainResult {
  const findings: IGovernanceFinding[] = [];
  let score: number;

  if (!siteInfo.externalSharingEnabled) {
    score = 100;
  } else {
    score = 55;
    findings.push({
      id: 'SHARE-001',
      domain: GovernanceDomain.ExternalSharing,
      severity: GovernanceSeverity.Medium,
      title: 'External sharing is enabled',
      description: 'This site allows external sharing. While this may be intentional, it should be reviewed periodically to ensure only authorized content is shared externally.',
      recommendation: 'Review external sharing settings and audit shared content.'
    });

    if (siteInfo.privacy === 'Public') {
      score = 30;
      findings.push({
        id: 'SHARE-002',
        domain: GovernanceDomain.ExternalSharing,
        severity: GovernanceSeverity.High,
        title: 'Public site with external sharing enabled',
        description: 'This site is set to Public visibility and has external sharing enabled. This combination increases the risk of unintended data exposure.',
        recommendation: 'Consider restricting site visibility to Private or disabling external sharing.'
      });
    }
  }

  const recommendations = findings.map(f => f.recommendation);
  return {
    domain: GovernanceDomain.ExternalSharing,
    score,
    status: getStatusFromScore(score),
    summary: !siteInfo.externalSharingEnabled
      ? 'External sharing is disabled — low risk'
      : siteInfo.privacy === 'Public'
        ? 'External sharing enabled on a Public site — elevated risk'
        : 'External sharing is enabled — periodic review recommended',
    findings,
    recommendations,
    icon: getDomainIcon('External Sharing')
  };
}

// ─── Content Freshness ────────────────────────────────────────

export function evaluateContentFreshness(freshness: IContentFreshnessSummary): IDomainResult {
  const findings: IGovernanceFinding[] = [];
  let score: number;

  const stalePercent = freshness.staleContentPercentage;

  if (stalePercent > 50) {
    score = 25;
    findings.push({
      id: 'FRESH-001',
      domain: GovernanceDomain.ContentFreshness,
      severity: GovernanceSeverity.High,
      title: 'Majority of content is stale',
      description: `${stalePercent}% of documents have not been updated in over 18 months. This may indicate the site is no longer actively maintained.`,
      recommendation: 'Review stale content and archive or delete documents that are no longer needed.'
    });
  } else if (stalePercent > 30) {
    score = 50;
    findings.push({
      id: 'FRESH-002',
      domain: GovernanceDomain.ContentFreshness,
      severity: GovernanceSeverity.Medium,
      title: 'Significant stale content detected',
      description: `${stalePercent}% of documents are older than 18 months without updates.`,
      recommendation: 'Schedule a content review to identify documents for archival.'
    });
  } else if (stalePercent > 10) {
    score = 75;
    findings.push({
      id: 'FRESH-003',
      domain: GovernanceDomain.ContentFreshness,
      severity: GovernanceSeverity.Low,
      title: 'Some stale content present',
      description: `${stalePercent}% of documents are older than 18 months. This is within acceptable limits but worth monitoring.`,
      recommendation: 'Monitor content freshness and review older documents periodically.'
    });
  } else {
    score = 100;
  }

  const recommendations = findings.map(f => f.recommendation);
  return {
    domain: GovernanceDomain.ContentFreshness,
    score,
    status: getStatusFromScore(score),
    summary: stalePercent <= 10
      ? `Content is fresh — only ${stalePercent}% older than 18 months`
      : `${stalePercent}% stale content — review recommended`,
    findings,
    recommendations,
    icon: getDomainIcon('Content Freshness')
  };
}

// ─── Activity / Lifecycle ─────────────────────────────────────

export function evaluateActivity(siteInfo: ISiteInfo): IDomainResult {
  const findings: IGovernanceFinding[] = [];
  const now = new Date();
  const lastModified = new Date(siteInfo.lastModifiedDate);
  const daysSinceUpdate = Math.floor((now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24));
  let score: number;

  if (daysSinceUpdate <= 30) {
    score = 100;
  } else if (daysSinceUpdate <= 90) {
    score = 70;
    findings.push({
      id: 'ACT-001',
      domain: GovernanceDomain.Activity,
      severity: GovernanceSeverity.Low,
      title: 'Site has not been updated recently',
      description: `Last modification was ${daysSinceUpdate} days ago. The site may be entering an inactive period.`,
      recommendation: 'Verify the site is still actively used by its intended audience.'
    });
  } else if (daysSinceUpdate <= 180) {
    score = 40;
    findings.push({
      id: 'ACT-002',
      domain: GovernanceDomain.Activity,
      severity: GovernanceSeverity.Medium,
      title: 'Site appears inactive',
      description: `No meaningful updates for ${daysSinceUpdate} days. This site may need a lifecycle review.`,
      recommendation: 'Contact the site owner to confirm whether the site is still needed.'
    });
  } else {
    score = 15;
    findings.push({
      id: 'ACT-003',
      domain: GovernanceDomain.Activity,
      severity: GovernanceSeverity.High,
      title: 'Site appears abandoned',
      description: `The site has not been updated in over ${daysSinceUpdate} days. It may be a candidate for archival or deletion.`,
      recommendation: 'Initiate a site lifecycle review. Consider archiving this site.'
    });
  }

  const recommendations = findings.map(f => f.recommendation);
  return {
    domain: GovernanceDomain.Activity,
    score,
    status: getStatusFromScore(score),
    summary: daysSinceUpdate <= 30
      ? `Active — last updated ${daysSinceUpdate} days ago`
      : `Last updated ${daysSinceUpdate} days ago — ${daysSinceUpdate > 180 ? 'may be abandoned' : 'activity declining'}`,
    findings,
    recommendations,
    icon: getDomainIcon('Activity & Lifecycle')
  };
}

// ─── Storage ──────────────────────────────────────────────────

export function evaluateStorage(siteInfo: ISiteInfo): IDomainResult {
  const findings: IGovernanceFinding[] = [];
  const usagePercent = siteInfo.storageQuotaMB > 0
    ? Math.round((siteInfo.storageUsedMB / siteInfo.storageQuotaMB) * 100)
    : 0;
  let score: number;

  if (usagePercent > 90) {
    score = 20;
    findings.push({
      id: 'STOR-001',
      domain: GovernanceDomain.Storage,
      severity: GovernanceSeverity.Critical,
      title: 'Storage capacity nearly exhausted',
      description: `The site is using ${usagePercent}% of its storage quota. Users may soon be unable to upload content.`,
      recommendation: 'Clean up large or unnecessary files, or request a quota increase.'
    });
  } else if (usagePercent > 75) {
    score = 50;
    findings.push({
      id: 'STOR-002',
      domain: GovernanceDomain.Storage,
      severity: GovernanceSeverity.Medium,
      title: 'Storage usage is high',
      description: `The site is using ${usagePercent}% of its storage quota.`,
      recommendation: 'Monitor storage growth and plan for cleanup if usage continues to increase.'
    });
  } else if (usagePercent > 50) {
    score = 75;
    findings.push({
      id: 'STOR-003',
      domain: GovernanceDomain.Storage,
      severity: GovernanceSeverity.Low,
      title: 'Moderate storage usage',
      description: `The site is using ${usagePercent}% of its storage quota. No immediate action needed.`,
      recommendation: 'Continue monitoring storage usage trends.'
    });
  } else {
    score = 100;
  }

  const recommendations = findings.map(f => f.recommendation);
  return {
    domain: GovernanceDomain.Storage,
    score,
    status: getStatusFromScore(score),
    summary: usagePercent <= 50
      ? `${usagePercent}% used — storage is healthy`
      : `${usagePercent}% used — ${usagePercent > 90 ? 'critical' : 'monitor growth'}`,
    findings,
    recommendations,
    icon: getDomainIcon('Storage')
  };
}

// ─── Compliance Signals ───────────────────────────────────────

interface IComplianceInput {
  hasClassification: boolean;
  hasReviewDate: boolean;
  hasBusinessOwner: boolean;
  hasPurpose: boolean;
  hasRetentionPolicy: boolean;
}

export function evaluateCompliance(compliance: IComplianceInput): IDomainResult {
  const findings: IGovernanceFinding[] = [];
  const fields = [
    { key: 'classification', present: compliance.hasClassification, label: 'Data classification' },
    { key: 'reviewDate', present: compliance.hasReviewDate, label: 'Review date' },
    { key: 'businessOwner', present: compliance.hasBusinessOwner, label: 'Business owner' },
    { key: 'purpose', present: compliance.hasPurpose, label: 'Site purpose' },
    { key: 'retention', present: compliance.hasRetentionPolicy, label: 'Retention policy' }
  ];

  const missingCount = fields.filter(f => !f.present).length;
  const missingLabels = fields.filter(f => !f.present).map(f => f.label);

  let score: number;
  if (missingCount === 0) {
    score = 100;
  } else if (missingCount === 1) {
    score = 70;
  } else if (missingCount <= 3) {
    score = 40;
  } else {
    score = 15;
  }

  if (missingCount > 0) {
    findings.push({
      id: 'COMP-001',
      domain: GovernanceDomain.Compliance,
      severity: missingCount > 3 ? GovernanceSeverity.High : missingCount > 1 ? GovernanceSeverity.Medium : GovernanceSeverity.Low,
      title: `${missingCount} governance metadata field${missingCount > 1 ? 's' : ''} missing`,
      description: `The following governance fields are not set: ${missingLabels.join(', ')}. Complete metadata improves discoverability and policy compliance.`,
      recommendation: 'Update the site governance metadata to ensure all required fields are populated.'
    });
  }

  const recommendations = findings.map(f => f.recommendation);
  return {
    domain: GovernanceDomain.Compliance,
    score,
    status: getStatusFromScore(score),
    summary: missingCount === 0
      ? 'All governance metadata is complete'
      : `${missingCount} field${missingCount > 1 ? 's' : ''} missing — ${missingLabels.join(', ')}`,
    findings,
    recommendations,
    icon: getDomainIcon('Compliance Signals')
  };
}

// ─── Overall Score Calculation ────────────────────────────────

export function calculateOverallScore(domainResults: IDomainResult[]): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const result of domainResults) {
    const weightEntry = DOMAIN_WEIGHTS.find(w => w.domain === result.domain);
    if (weightEntry) {
      weightedSum += result.score * weightEntry.weight;
      totalWeight += weightEntry.weight;
    }
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}
