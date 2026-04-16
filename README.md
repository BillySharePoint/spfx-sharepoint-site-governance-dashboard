# SharePoint Site Governance Dashboard

A practical **SharePoint Framework (SPFx) 1.22.2** dashboard for monitoring SharePoint site governance health. This solution provides visibility into site ownership, permissions complexity, external sharing, content freshness, storage usage, and other governance indicators through a clean and business-friendly dashboard experience.

This project demonstrates how SPFx can be used to support SharePoint governance, operational review, and Microsoft 365 best practices — designed as a realistic portfolio solution that reflects real-world enterprise needs.

![SPFx Version](https://img.shields.io/badge/SPFx-1.22.2-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-22.x-brightgreen.svg)
![React](https://img.shields.io/badge/React-17-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## Why This Project Exists

Organizations often manage hundreds or thousands of SharePoint sites, but governance visibility is usually fragmented. Site owners may not know whether their site is stale, over-permissioned, externally exposed, or missing key ownership and lifecycle controls.

This dashboard provides a consolidated view that helps SharePoint administrators, site owners, and governance teams quickly assess site health and take informed action.

---

## Key Features

- **Overall Governance Score** — Weighted score (0–100) across seven governance domains
- **Domain Health Breakdown** — Individual assessments for Ownership, Permissions, External Sharing, Content Freshness, Activity & Lifecycle, Storage, and Compliance Signals
- **Interactive Score Visualization** — SVG donut chart with trend sparkline
- **Governance Alerts** — Prioritized findings sorted by severity (Critical → Info)
- **Actionable Recommendations** — Domain-specific guidance derived from assessment results
- **Site Profile Card** — Key site metadata including owners, template, storage, and sharing status
- **Domain Detail Tabs** — Deep-dive view with metrics, findings, and content distribution charts
- **Demo Mode** — Three built-in scenarios (Healthy, Needs Review, High Risk) for instant demonstrations
- **Responsive Design** — Works on desktop and tablet form factors
- **Theme Support** — Integrates with SharePoint and Teams theming

---

## Demo Scenarios

The dashboard ships with three realistic scenarios to showcase different governance postures:

| Scenario | Site Name | Score | Profile |
|----------|-----------|-------|---------|
| **Healthy** | Contoso Intranet | ~92 | 2 owners, low permissions complexity, fresh content, sharing disabled |
| **Needs Review** | Marketing Portal | ~68 | Single owner, moderate permissions, some stale content, sharing enabled |
| **High Risk** | Legacy Project Alpha | ~35 | No owner, high permissions complexity, mostly stale content, public + shared |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | SharePoint Framework (SPFx) 1.22.2 |
| **UI Library** | React 17 with Fluent UI 8 |
| **Language** | TypeScript 5.8 |
| **Build System** | Heft (Rush Stack) |
| **Styling** | SCSS Modules + Fluent UI inline styles |
| **Data** | Mock service layer (extensible to live SharePoint / Microsoft Graph) |

---

## Architecture

```
src/webparts/siteGovernanceDashboard/
├── components/              # React components
│   ├── SiteGovernanceDashboard.tsx    # Main container
│   ├── DashboardHeader.tsx           # Header with scenario selector
│   ├── GovernanceScoreCard.tsx       # SVG donut + trend sparkline
│   ├── SiteProfileCard.tsx           # Site metadata display
│   ├── SummaryCards.tsx              # Domain KPI card row
│   ├── GovernanceAlerts.tsx          # Severity-sorted findings
│   ├── RecommendationsPanel.tsx      # Actionable recommendations
│   ├── DomainDetailTabs.tsx          # Tabbed domain deep-dive
│   └── StatusBadge.tsx               # Reusable status indicator
├── models/                  # TypeScript interfaces & enums
│   └── IGovernanceModels.ts
├── services/                # Data retrieval layer
│   ├── IGovernanceService.ts         # Service contract
│   └── MockGovernanceService.ts      # Demo data implementation
├── data/                    # Sample data
│   └── mockGovernanceData.ts         # Three demo scenarios
├── utils/                   # Scoring & helpers
│   ├── governanceScoring.ts          # Domain evaluation + weighted scoring
│   └── statusHelpers.ts             # Color, icon, and formatting helpers
└── loc/                     # Localization strings
```

### Design Principles

- **Layered architecture** — Presentation, service, domain, and data layers are cleanly separated
- **Interface-driven services** — `IGovernanceService` enables swapping mock data for live SharePoint or Graph API calls
- **Extensible scoring engine** — Domain weights and rules are configurable and easy to add to
- **Component reusability** — Small, focused components that can be composed in different layouts

---

## Governance Domains & Scoring

### Domain Weights

| Domain | Weight | What It Measures |
|--------|--------|-----------------|
| Ownership | 20% | Whether the site has one or more valid owners |
| Permissions | 20% | Complexity of unique permissions and broken inheritance |
| External Sharing | 15% | Whether sharing is enabled and risk level |
| Content Freshness | 15% | Percentage of stale content (18+ months) |
| Activity & Lifecycle | 10% | Days since last meaningful update |
| Storage | 10% | Percentage of storage quota consumed |
| Compliance Signals | 10% | Completeness of governance metadata |

### Score Bands

| Score Range | Status | Color |
|------------|--------|-------|
| 90–100 | Excellent | Green |
| 75–89 | Good | Blue |
| 60–74 | Needs Review | Amber |
| 40–59 | Warning | Orange |
| 0–39 | Critical | Red |

---

## Local Development Setup

### Prerequisites

- **Node.js** 22.14.x or later (use [nvm](https://github.com/coreybutler/nvm-windows) for version management)
- **npm** 10.x or later

### Steps

```bash
# Clone the repository
git clone https://github.com/BP-CA/spfx-sharepoint-site-governance-dashboard.git
cd spfx-sharepoint-site-governance-dashboard

# Install dependencies
npm install

# Build the project
npx heft build --clean

# Start the local development server
npx heft start --clean
```

Then open your SharePoint workbench:
```
https://<your-tenant>.sharepoint.com/_layouts/15/workbench.aspx
```

### Building for Production

```bash
# Production build
npx heft build --clean --production

# Package the solution
npx heft package-solution --production
```

The `.sppkg` file will be output to `sharepoint/solution/`.

---

## Deployment

1. Build and package the solution (see above)
2. Upload the `.sppkg` file to your SharePoint App Catalog
3. Deploy the app and approve any permission requests
4. Add the **Site Governance Dashboard** web part to any SharePoint page

---

## Roadmap

Future enhancements under consideration:

- [ ] Live SharePoint data source using PnPjs and Microsoft Graph
- [ ] Multi-site selector for tenant-wide governance overview
- [ ] Governance trend history with persistent storage
- [ ] Export assessments to PDF / CSV
- [ ] Admin configuration panel for threshold management
- [ ] Power BI integration for advanced reporting
- [ ] Microsoft Teams notification integration
- [ ] Scheduled automated governance scans

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## About the Author

**Billy Peralta** — SharePoint & Microsoft 365 Professional

This project is part of a public portfolio demonstrating expertise in SharePoint Framework development, governance design, and Microsoft 365 solution architecture.

- [GitHub](https://github.com/BP-CA)
