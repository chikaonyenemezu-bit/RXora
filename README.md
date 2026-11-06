<p align="center">
  <img src="public/images/rxora-logo.png" alt="Rxora" width="260" />
</p>

<h1 align="center">Rxora</h1>
<p align="center"><strong>Connected Medication Intelligence</strong></p>
<p align="center">
  Formulary intelligence · Medication reconciliation · FHIR R4 interoperability
</p>

<p align="center">
  <a href="https://github.com/chikaonyenemezu-bit/manitoba-med-safety/actions/workflows/ci.yml"><img src="https://github.com/chikaonyenemezu-bit/manitoba-med-safety/actions/workflows/ci.yml/badge.svg" alt="Rxora CI" /></a>
</p>

**Live application:** [Rxora](https://manitoba-med-safety.vercel.app) *(existing address; update to your confirmed new Rxora domain)*  
**Technology:** Next.js 16 · TypeScript · React · Tailwind CSS · Supabase · PostgreSQL · HL7 FHIR R4 · Python

> **Portfolio demonstration only.** Rxora is not a production clinical system or a live DPIN integration. The medication and formulary datasets are sourced from published Manitoba and Health Canada materials; patient cases and dispensing histories used for reconciliation are synthetic. Do not use the application to make clinical decisions.

## Overview

**Rxora** is a pharmacy informatics portfolio application that demonstrates how medication data, coverage information, and structured clinical workflows can work together. It combines Canadian Drug Identification Number (DIN)–based formulary search, Manitoba Exception Drug Status (EDS) information, simulated admission medication reconciliation, and a FHIR R4 Medication API.

Developed by a pharmacist and digital health informaticist, Rxora adapts medication risk rules previously explored in [MedSync](https://github.com/chikaonyenemezu-bit/medsync) to the Manitoba formulary context.

### Platform at a glance

| Capability | Scope |
| --- | --- |
| Formulary search | 4,075 DINs from Manitoba formulary data |
| EDS browser | 772 entries across 14 therapeutic categories |
| Medication reconciliation | 10 synthetic admission scenarios |
| Medication safety logic | Dose discrepancies, missing medicines, PRISCUS flags, high-risk combinations |
| Interoperability | FHIR R4 Medication endpoints and structured reconciliation output |
| Data protection | Synthetic patients only; no real personal health information |

## Modules

### 1. Formulary Search

Search the Manitoba Drug Benefits and Interchangeability Formulary by medication name or DIN. The interface displays the available:

- General Benefit or EDS coverage status and explanations
- Interchangeable group identifiers
- Per-unit prices in CAD
- Manufacturer abbreviations and associated legal names
- Active ingredients enriched with Health Canada Drug Product Database (DPD) data
- Source update information where available

### 2. Medication Reconciliation Simulator

Explore a **DPIN-style hospital admission workflow** that compares patient-reported medications with *synthetic* dispensing records. These records are not retrieved from Manitoba's actual Drug Programs Information Network (DPIN).

| Case | Presentation | Example discrepancy or safety issue |
| --- | --- | --- |
| PT-001 | Hip fracture, 74F | Metformin dose mismatch; unreported lorazepam; PRISCUS flag |
| PT-002 | COPD exacerbation, 67M | Warfarin–clarithromycin interaction; ramipril dose mismatch |
| PT-003 | Elective knee replacement, 58F | Methotrexate–celecoxib combination; celecoxib absent from simulated history |
| PT-004 | Congestive heart failure, 82M | Digoxin–amiodarone combination; furosemide dose mismatch; PRISCUS flag |
| PT-005 | New-onset seizure, 45F | Unreported topiramate; sertraline dose mismatch |
| PT-006 | Paediatric ALL maintenance, 8M | Unreported allopurinol; mercaptopurine toxicity risk |
| PT-007 | Gestational diabetes, 34F | Labetalol dose mismatch |
| PT-008 | CKD stage 4, 71M | Metformin absent from simulated history; severe CKD safety issue |
| PT-009 | HIV on antiretroviral therapy, 45M | Atorvastatin dose mismatch; unreported sildenafil |
| PT-010 | Rheumatoid arthritis, 62F | Unreported ibuprofen; methotrexate–NSAID interaction |

The simulator identifies:

- **Dose mismatch:** the reported dose differs from the simulated dispensing record.
- **Not reported:** a medication appears in dispensing history but is omitted by the synthetic patient.
- **Not in simulated DPIN history:** the patient reports a medication absent from the synthetic dispensing record.
- **PRISCUS flags:** rule-based warnings for potentially inappropriate medicines in older adults.
- **High-risk combinations:** rule-based checks drawing on 17 medication classes.

The reconciliation workflow also demonstrates FHIR R4 `MedicationStatement`-based structured output.

### 3. Exception Drug Status (EDS) Browser

Browse 772 EDS entries in 14 therapeutic categories, with full-text search and relevant coverage criteria from Manitoba's published EDS materials. EDS approval decisions are not made by this application.

### 4. FHIR API Explorer

Inspect example queries and structured JSON from the application's FHIR R4 medication endpoints:

```http
GET /api/fhir/metadata
GET /api/fhir/Medication?_text=metformin
GET /api/fhir/Medication?identifier=http://health.canada.ca/din|02223562
GET /api/fhir/Medication/02223562
```

The API uses Canadian DIN identifiers with the code system URI:

```text
http://health.canada.ca/din
```

The design references Canada Health Infoway's pan-Canadian Medication profile:

```text
http://infoway-inforoute.ca/fhir/StructureDefinition/profile-medication-ca-core
```

These endpoints demonstrate FHIR-oriented interoperability; formal standards conformance or certification is not claimed.

## Manitoba Health IT Context

**Drug Programs Information Network (DPIN).** The reconciliation experience is designed around the concept of comparing patient-reported medicines with provincial pharmacy dispensing history. **Rxora does not connect to DPIN**; it uses synthetic examples to illustrate the workflow.

**Manitoba Drug Benefits and Interchangeability Formulary.** Published formulary information supplies DINs, product names, coverage status, interchangeability, and pricing. The source dataset described in this project was effective April 1, 2026.

**Exception Drug Status.** Manitoba's EDS materials describe medications requiring additional coverage authorization and associated clinical criteria.

**Health Canada Drug Product Database.** DPD data enriches medication records with drug and manufacturer details.

**HL7 FHIR R4.** The application exposes structured medication data through Next.js API routes and demonstrates interoperability concepts relevant to Canadian health IT.

**Medication reconciliation and accreditation.** The simulator illustrates admission reconciliation and discrepancy review, activities relevant to medication safety and organisational practice requirements. It does not establish accreditation compliance.

**Manitoba PHIA.** The architecture is designed with privacy considerations in mind. No real patient information is required to use the demonstration cases.

## Data Sources

| Dataset | Publisher | Records represented in this project |
| --- | --- | ---: |
| Manitoba Drug Benefits Formulary | Manitoba Health | 2,371 product names |
| Manitoba Drug Interchangeability Formulary | Manitoba Health | 4,075 DINs |
| Exception Drug Status | Manitoba Health / MDSTC | 772 entries |
| Manufacturer Abbreviations | Manitoba Health | 550 records |
| Drug Product Database (human drugs subset) | Health Canada | 11,529 records |

The counts above describe the project's imported datasets, not necessarily the latest counts in the source registries.

## Technical Architecture

```text
Manitoba formulary PDFs ──────┐
Manitoba EDS PDFs ─────────────┤
Manufacturer reference PDFs ───┼──> Python ingestion ──> Supabase PostgreSQL
Health Canada DPD CSV ────────┘                              │
                                                            ▼
                                                   Next.js 16 API routes
                                                            │
                            ┌───────────────────────────────┴─────────────────────────────┐
                            ▼                                                             ▼
                 FHIR R4 Medication API                                       Reconciliation engine
                 DIN-based resources                                         Rule-based checks
                            │                                                Synthetic DPIN-style data
                            └───────────────────────────────┬─────────────────────────────┘
                                                            ▼
                                              React + TypeScript interface
                                                    Tailwind CSS
```

**Core engineering concepts:** data ingestion, normalization, PostgreSQL-backed lookup, rule-based reconciliation, FHIR-style resource serialization, and a responsive web UI.

## Local Development

```bash
git clone https://github.com/chikaonyenemezu-bit/manitoba-med-safety.git
cd manitoba-med-safety
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Configure the project's required environment variables in `.env.local` before using database-backed features. Do not commit credentials or real patient data.

Useful commands:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Continuous Integration

The CI badge at the top of this README points to `.github/workflows/ci.yml`. Add that GitHub Actions workflow to the repository to activate the badge. The supplied companion workflow runs dependency installation, linting, and TypeScript checks on pushes and pull requests to `main`.

## Relationship to MedSync

[MedSync](https://github.com/chikaonyenemezu-bit/medsync) is a separate clinical triage and care-routing project developed for the German statutory health insurance environment. It uses symptom assessment, Manchester Triage System concepts, SNOMED CT, ICD-10-GM, FHIR resources, and geospatial provider search.

**Rxora** takes the medication safety and polypharmacy theme into a different domain: Canadian DIN identifiers, Manitoba drug coverage, synthetic DPIN-style reconciliation, and medication interoperability. The two projects demonstrate how informatics concepts can be adapted for different health systems.

## Project Status and Safety

Rxora is an educational portfolio demonstration. It is not connected to live provincial patient systems, does not make EDS determinations, and has not been validated or authorized for clinical use. Data coverage, rules, and API responses should be independently verified before any real-world implementation.

## Author

Built by a pharmacist and digital health informaticist with an MSc in Industrial Pharmacy.

- **Rxora:** Medication intelligence, Manitoba formulary data, simulated reconciliation, and FHIR R4 interoperability.
- **[MedSync](https://github.com/chikaonyenemezu-bit/medsync):** Clinical triage, medication safety, FHIR, coding standards, and care routing for German healthcare.
