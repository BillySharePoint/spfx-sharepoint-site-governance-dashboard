/**
 * StatusBadge Component
 *
 * Renders a color-coded governance status badge with icon.
 * Used throughout the dashboard to indicate health levels.
 */

import * as React from 'react';
import { Icon, Text } from '@fluentui/react';
import { GovernanceStatus } from '../models/IGovernanceModels';
import { getStatusColor, getStatusIcon } from '../utils/statusHelpers';

export interface IStatusBadgeProps {
  status: GovernanceStatus;
  size?: 'small' | 'medium' | 'large';
}

export const StatusBadge: React.FC<IStatusBadgeProps> = ({ status, size = 'medium' }) => {
  const color = getStatusColor(status);
  const iconName = getStatusIcon(status);

  const fontSize = size === 'small' ? 11 : size === 'large' ? 14 : 12;
  const padding = size === 'small' ? '2px 8px' : size === 'large' ? '5px 14px' : '3px 10px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding,
        borderRadius: 12,
        backgroundColor: `${color}14`,
        border: `1px solid ${color}40`,
        color,
        fontWeight: 600,
        fontSize,
        lineHeight: 1.4,
        whiteSpace: 'nowrap'
      }}
    >
      <Icon iconName={iconName} style={{ fontSize: fontSize + 1 }} />
      <Text variant="small" style={{ color, fontWeight: 600, fontSize }}>{status}</Text>
    </span>
  );
};
