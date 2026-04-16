/**
 * DashboardHeader Component
 *
 * Top header bar for the governance dashboard displaying the title,
 * current user greeting, and a scenario selector for demo mode.
 */

import * as React from 'react';
import { Stack, Text, Dropdown, Icon, IDropdownOption } from '@fluentui/react';

export interface IDashboardHeaderProps {
  userDisplayName: string;
  scenarios: { id: string; title: string }[];
  selectedScenario: string;
  onScenarioChange: (scenarioId: string) => void;
}

export const DashboardHeader: React.FC<IDashboardHeaderProps> = ({
  userDisplayName,
  scenarios,
  selectedScenario,
  onScenarioChange
}) => {
  const options: IDropdownOption[] = scenarios.map(s => ({
    key: s.id,
    text: s.title
  }));

  return (
    <Stack
      horizontal
      verticalAlign="center"
      horizontalAlign="space-between"
      tokens={{ padding: '16px 24px' }}
      styles={{
        root: {
          background: 'linear-gradient(135deg, #0078D4 0%, #106EBE 100%)',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          marginBottom: 20
        }
      }}
    >
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
        <Icon
          iconName="ShieldSolid"
          styles={{ root: { fontSize: 28, color: '#ffffff' } }}
        />
        <Stack tokens={{ childrenGap: 2 }}>
          <Text
            variant="xLarge"
            styles={{ root: { color: '#ffffff', fontWeight: 700, letterSpacing: '-0.3px' } }}
          >
            Site Governance Dashboard
          </Text>
          <Text
            variant="small"
            styles={{ root: { color: 'rgba(255,255,255,0.85)' } }}
          >
            Welcome, {userDisplayName} — Monitor and assess your SharePoint governance health
          </Text>
        </Stack>
      </Stack>

      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <Stack tokens={{ childrenGap: 2 }}>
          <Text variant="tiny" styles={{ root: { color: 'rgba(255,255,255,0.7)', textAlign: 'right' } }}>
            Demo Scenario
          </Text>
          <Dropdown
            selectedKey={selectedScenario}
            options={options}
            onChange={(_e, option) => option && onScenarioChange(option.key as string)}
            styles={{
              root: { minWidth: 260 },
              dropdown: {
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.3)',
                selectors: {
                  ':hover': { borderColor: 'rgba(255,255,255,0.5)' }
                }
              },
              title: {
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 4
              },
              caretDown: { color: '#ffffff' }
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
