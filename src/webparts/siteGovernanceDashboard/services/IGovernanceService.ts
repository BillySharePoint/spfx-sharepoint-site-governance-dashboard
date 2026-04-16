/**
 * Governance Service Interface
 *
 * Defines the contract for governance data retrieval.
 * Implementations can source data from mock scenarios, SharePoint
 * lists, or Microsoft Graph depending on the deployment context.
 */

import { IGovernanceSummary } from '../models/IGovernanceModels';

export interface IGovernanceService {
  /** Retrieve the full governance summary for a given scenario or site */
  getGovernanceSummary(scenarioId: string): Promise<IGovernanceSummary>;

  /** List available scenarios or sites */
  getAvailableScenarios(): Promise<{ id: string; title: string }[]>;
}
