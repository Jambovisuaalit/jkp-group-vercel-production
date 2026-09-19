/**
 * Customer-supplied reference list: Kotisivu korjausversio_1_4_Referenssit.pdf,
 * dated 18 September 2026. Do not replace with the older historical list.
 * Roles and project descriptions are retained in the customer's source language.
 */
export type ClientReference = {
  period: string;
  client: string;
  project?: string;
  role: string;
  scope: string;
  areas?: readonly string[];
};

export const clientReferences: readonly ClientReference[] = [
  {
    period: "2026 –",
    client: "GOOGLE Oy",
    role: "HVAC-Supervisor",
    scope: "HVAC-construction supervision, commissioning",
  },
  {
    period: "2025 –",
    client: "HELEN Oy",
    role: "HVAC-Supervisor",
    scope: "HVAC-planning and construction supervision, commissioning",
  },
  {
    period: "2024 – 2025",
    client: "UPM BIOCHEMICALS GmbH / Leuna, Germany",
    project: "EOS-project",
    role: "HVAC-Project Manager",
    scope: "HVAC-Supervisor and commissioning",
  },
  {
    period: "2020 – 2023",
    client: "METSÄ FIBRE OY / KEMI",
    project: "Bioproduct mill project",
    role: "HVAC-Project Manager",
    scope: "Planning and construction supervision, cost controller, lead of testing and commissioning",
    areas: [
      "Wood handling",
      "Fiberline",
      "Drying and bailing",
      "Recovery boiler",
      "Turbin",
      "Evaporation",
      "Causteicizing and lime kiln bot gasifier",
      "Effluent and sludge treatment",
      "Electricity distribution",
      "Water plant and pumping station",
      "Cooling towers",
      "ClO2-plant",
      "O2-plan",
      "Maintenance building",
      "Office building",
    ],
  },
  {
    period: "2020",
    client: "AGNICO EAGLE / Gold Mill",
    project: "Main level 900",
    role: "HVAC-supervisor",
    scope: "HVAC-planning and construction supervision, commissioning",
  },
  {
    period: "2019 – 2020",
    client: "LAHTI ENERGY / Kymijärvi III biopower plant",
    role: "HVAC-construction supervision",
    scope: "",
    areas: [
      "Biofuel reception station",
      "Storage silo and screening",
      "Boiler",
      "Fuel gas heat recovery plant",
    ],
  },
  {
    period: "2019",
    client: "FINAVIA / Helsinki-Vantaa airport",
    project: "Terminal 1, Gates 16-19",
    role: "HVAC-construction supervision",
    scope: "",
  },
  {
    period: "2017 – 2019",
    client: "FIMPEC",
    project: "OTHER CONSTRUCTION PROJECTS",
    role: "HVAC-planning and construction supervision, commissioning",
    scope: "",
    areas: [
      "Sports and activities center",
      "Retail and consumer goods stores",
      "Repair and maintenance centres",
      "Medical clinics",
      "Housing foundations",
    ],
  },
];
