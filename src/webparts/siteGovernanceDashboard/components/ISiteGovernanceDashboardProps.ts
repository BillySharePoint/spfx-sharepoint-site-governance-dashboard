/**
 * Props for the main SiteGovernanceDashboard component.
 */
export interface ISiteGovernanceDashboardProps {
  /** Whether the SharePoint theme is dark/inverted */
  isDarkTheme: boolean;
  /** Whether running inside Microsoft Teams context */
  hasTeamsContext: boolean;
  /** Display name of the current user */
  userDisplayName: string;
  /** URL of the current SharePoint site */
  siteUrl: string;
  /** Title of the current SharePoint site */
  siteTitle: string;
}
