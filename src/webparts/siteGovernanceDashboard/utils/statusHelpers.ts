/**
 * Governance Status & Scoring Helpers
 *
 * Utility functions for mapping governance scores to visual
 * representations including colors, icons, and labels.
 */

import { GovernanceStatus, GovernanceSeverity } from '../models/IGovernanceModels';

/** Returns the status band for a given numeric score (0–100) */
export function getStatusFromScore(score: number): GovernanceStatus {
  if (score >= 90) return GovernanceStatus.Excellent;
  if (score >= 75) return GovernanceStatus.Good;
  if (score >= 60) return GovernanceStatus.NeedsReview;
  if (score >= 40) return GovernanceStatus.Warning;
  return GovernanceStatus.Critical;
}

/** Maps a GovernanceStatus to a theme-friendly hex color */
export function getStatusColor(status: GovernanceStatus): string {
  switch (status) {
    case GovernanceStatus.Excellent: return '#107C10';
    case GovernanceStatus.Good: return '#0078D4';
    case GovernanceStatus.NeedsReview: return '#FFB900';
    case GovernanceStatus.Warning: return '#D83B01';
    case GovernanceStatus.Critical: return '#A80000';
    default: return '#605E5C';
  }
}

/** Maps a GovernanceSeverity to a hex color */
export function getSeverityColor(severity: GovernanceSeverity): string {
  switch (severity) {
    case GovernanceSeverity.Critical: return '#A80000';
    case GovernanceSeverity.High: return '#D83B01';
    case GovernanceSeverity.Medium: return '#FFB900';
    case GovernanceSeverity.Low: return '#0078D4';
    case GovernanceSeverity.Info: return '#605E5C';
    default: return '#605E5C';
  }
}

/** Returns a Fluent UI icon name for a governance status */
export function getStatusIcon(status: GovernanceStatus): string {
  switch (status) {
    case GovernanceStatus.Excellent: return 'CompletedSolid';
    case GovernanceStatus.Good: return 'Completed';
    case GovernanceStatus.NeedsReview: return 'InfoSolid';
    case GovernanceStatus.Warning: return 'WarningSolid';
    case GovernanceStatus.Critical: return 'ErrorBadge';
    default: return 'StatusCircleQuestionMark';
  }
}

/** Returns a Fluent UI icon name for a severity level */
export function getSeverityIcon(severity: GovernanceSeverity): string {
  switch (severity) {
    case GovernanceSeverity.Critical: return 'ErrorBadge';
    case GovernanceSeverity.High: return 'Warning';
    case GovernanceSeverity.Medium: return 'Info';
    case GovernanceSeverity.Low: return 'Info';
    case GovernanceSeverity.Info: return 'Info';
    default: return 'StatusCircleQuestionMark';
  }
}

/** Returns a domain-specific Fluent UI icon name */
export function getDomainIcon(domain: string): string {
  switch (domain) {
    case 'Ownership': return 'People';
    case 'Permissions': return 'Permissions';
    case 'External Sharing': return 'Share';
    case 'Content Freshness': return 'DocumentSet';
    case 'Activity & Lifecycle': return 'ActivityFeed';
    case 'Storage': return 'Cloud';
    case 'Compliance Signals': return 'Shield';
    default: return 'PageList';
  }
}

/** Formats a date string to a human-readable format */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/** Formats storage size in MB to a readable string */
export function formatStorage(mb: number): string {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`;
  }
  return `${mb} MB`;
}
