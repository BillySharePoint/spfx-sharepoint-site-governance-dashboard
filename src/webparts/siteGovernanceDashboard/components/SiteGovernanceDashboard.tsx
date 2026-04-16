/**
 * SiteGovernanceDashboard — Main Container Component
 *
 * Orchestrates the full governance dashboard experience including
 * data loading, scenario selection, and rendering all sub-components.
 */

import * as React from 'react';
import { Stack, Spinner, SpinnerSize, MessageBar, MessageBarType, Text, Icon } from '@fluentui/react';
import styles from './SiteGovernanceDashboard.module.scss';
import type { ISiteGovernanceDashboardProps } from './ISiteGovernanceDashboardProps';
import { IGovernanceSummary } from '../models/IGovernanceModels';
import { MockGovernanceService } from '../services/MockGovernanceService';
import { DashboardHeader } from './DashboardHeader';
import { GovernanceScoreCard } from './GovernanceScoreCard';
import { SiteProfileCard } from './SiteProfileCard';
import { SummaryCards } from './SummaryCards';
import { GovernanceAlerts } from './GovernanceAlerts';
import { RecommendationsPanel } from './RecommendationsPanel';
import { DomainDetailTabs } from './DomainDetailTabs';

interface IDashboardState {
  governanceData: IGovernanceSummary | undefined;
  isLoading: boolean;
  error: string | undefined;
  selectedScenario: string;
  scenarios: { id: string; title: string }[];
}

export default class SiteGovernanceDashboard extends React.Component<ISiteGovernanceDashboardProps, IDashboardState> {
  private _service: MockGovernanceService;

  constructor(props: ISiteGovernanceDashboardProps) {
    super(props);
    this._service = new MockGovernanceService();
    this.state = {
      governanceData: undefined,
      isLoading: true,
      error: undefined,
      selectedScenario: 'healthy',
      scenarios: []
    };
  }

  public async componentDidMount(): Promise<void> {
    try {
      const scenarios = await this._service.getAvailableScenarios();
      this.setState({ scenarios });
      await this._loadData('healthy');
    } catch {
      this.setState({ error: 'Failed to initialize the dashboard.', isLoading: false });
    }
  }

  private async _loadData(scenarioId: string): Promise<void> {
    this.setState({ isLoading: true, error: undefined });
    try {
      const data = await this._service.getGovernanceSummary(scenarioId);
      this.setState({ governanceData: data, isLoading: false });
    } catch {
      this.setState({ error: 'Failed to load governance data. Please try again.', isLoading: false });
    }
  }

  private _onScenarioChange = (scenarioId: string): void => {
    this.setState({ selectedScenario: scenarioId });
    this._loadData(scenarioId).catch(() => { /* handled in _loadData */ });
  };

  public render(): React.ReactElement<ISiteGovernanceDashboardProps> {
    const { hasTeamsContext, userDisplayName } = this.props;
    const { governanceData, isLoading, error, selectedScenario, scenarios } = this.state;

    return (
      <section className={`${styles.siteGovernanceDashboard} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.dashboardContainer}>
          {/* Dashboard Header with Scenario Selector */}
          <DashboardHeader
            userDisplayName={userDisplayName}
            scenarios={scenarios}
            selectedScenario={selectedScenario}
            onScenarioChange={this._onScenarioChange}
          />

          {/* Error State */}
          {error && (
            <MessageBar
              messageBarType={MessageBarType.error}
              isMultiline={false}
              dismissButtonAriaLabel="Close"
              onDismiss={() => this.setState({ error: undefined })}
              styles={{ root: { borderRadius: 8, marginBottom: 16 } }}
            >
              {error}
            </MessageBar>
          )}

          {/* Loading State */}
          {isLoading && (
            <Stack
              horizontalAlign="center"
              verticalAlign="center"
              tokens={{ childrenGap: 12, padding: '60px 0' }}
            >
              <Spinner size={SpinnerSize.large} label="Analyzing governance health..." />
            </Stack>
          )}

          {/* Dashboard Content */}
          {!isLoading && !error && governanceData && (
            <Stack tokens={{ childrenGap: 20 }}>
              {/* Row 1: Score Card + Site Profile */}
              <Stack
                horizontal
                wrap
                tokens={{ childrenGap: 20 }}
              >
                <GovernanceScoreCard
                  score={governanceData.overallScore}
                  status={governanceData.overallStatus}
                  trendData={governanceData.trendData}
                  alertCount={governanceData.alertCount}
                  lastAssessedDate={governanceData.lastAssessedDate}
                />
                <SiteProfileCard siteInfo={governanceData.siteInfo} />
              </Stack>

              {/* Row 2: Domain Summary Cards */}
              <SummaryCards domainResults={governanceData.domainResults} />

              {/* Row 3: Alerts + Recommendations */}
              <Stack
                horizontal
                wrap
                tokens={{ childrenGap: 20 }}
              >
                <GovernanceAlerts findings={governanceData.findings} />
                <RecommendationsPanel domainResults={governanceData.domainResults} />
              </Stack>

              {/* Row 4: Domain Detail Tabs */}
              <DomainDetailTabs
                domainResults={governanceData.domainResults}
                permissionsSummary={governanceData.permissionsSummary}
                contentFreshness={governanceData.contentFreshness}
              />

              {/* Footer */}
              <Stack
                horizontal
                horizontalAlign="center"
                verticalAlign="center"
                tokens={{ childrenGap: 8, padding: '16px 0 8px' }}
                styles={{ root: { borderTop: '1px solid #EDEBE9' } }}
              >
                <Icon iconName="Info" styles={{ root: { fontSize: 12, color: '#A19F9D' } }} />
                <Text variant="tiny" styles={{ root: { color: '#A19F9D' } }}>
                  SharePoint Site Governance Dashboard — Demo Mode — Built with SPFx, React &amp; Fluent UI
                </Text>
              </Stack>
            </Stack>
          )}
        </div>
      </section>
    );
  }
}
