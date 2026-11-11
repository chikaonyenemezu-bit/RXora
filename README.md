# Rxora

[![CI](https://github.com/chikaonyenemezu-bit/manitoba-med-safety/actions/workflows/ci.yml/badge.svg)](https://github.com/chikaonyenemezu-bit/manitoba-med-safety/actions/workflows/ci.yml)

A medication lookup and reconciliation tool built on Manitoba formulary data, with a small FHIR R4 API on top.

Demo: https://rxora-med.vercel.app/

**Note:** this is a portfolio project, not a clinical tool. The formulary and EDS data come from published Manitoba Health and Health Canada files. All the patients and dispensing histories are made up. It does not connect to DPIN. Please don't use it for real clinical decisions.

## Why I built this

I'm a pharmacist working in digital health. Medication reconciliation at admission is one of those things that sounds simple and isn't. You compare what the patient says they take with what the pharmacy actually dispensed, and the gaps are where the problems are. Manitoba has DPIN for the dispensing side, so I wanted to see what a reconciliation workflow built around that idea could look like, using real formulary data and fake patients.

Some of the risk rules started out in my earlier project, [MedSync](https://github.com/chikaonyenemezu-bit/medsync), which was built for the German system. I rewrote them for Canadian DINs and Manitoba coverage rules.

## What it does

### Formulary search

Search the Manitoba Drug Benefits and Interchangeability Formulary by drug name or DIN (about 4,075 DINs). For each product you get:

- coverage status (General Benefit or EDS)
- interchangeable group
- unit price (CAD)
- manufacturer, with the full name looked up from Manitoba's abbreviation list
- active ingredients, pulled from Health Canada's Drug Product Database

### Med rec simulator

There are 10 made-up admission cases. Each one has a list of what the patient reports and a fake "DPIN" dispensing history. The app compares the two and flags:

- dose mismatches
- drugs in the dispensing history that the patient didn't mention
- drugs the patient mentioned that aren't in the history
- PRISCUS flags (potentially inappropriate meds in older adults)
- risky combinations, based on rules covering 17 drug classes

The cases:

| Case | Patient | What comes up |
|------|---------|---------------|
| PT-001 | 74F, hip fracture | metformin dose mismatch, unreported lorazepam, PRISCUS |
| PT-002 | 67M, COPD exacerbation | warfarin + clarithromycin, ramipril dose mismatch |
| PT-003 | 58F, elective knee replacement | methotrexate + celecoxib, celecoxib not in history |
| PT-004 | 82M, CHF | digoxin + amiodarone, furosemide dose mismatch, PRISCUS |
| PT-005 | 45F, new-onset seizure | unreported topiramate, sertraline dose mismatch |
| PT-006 | 8M, ALL maintenance | unreported allopurinol, mercaptopurine toxicity risk |
| PT-007 | 34F, gestational diabetes | labetalol dose mismatch |
| PT-008 | 71M, CKD stage 4 | metformin not in history, contraindicated in severe CKD |
| PT-009 | 45M, HIV on ART | atorvastatin dose mismatch, unreported sildenafil |
| PT-010 | 62F, rheumatoid arthritis | unreported ibuprofen, methotrexate + NSAID |

The reconciliation result can also be exported as FHIR `MedicationStatement` resources.

### EDS browser

772 Exception Drug Status entries across 14 categories, searchable, with the coverage criteria from Manitoba's EDS documents. It only shows the criteria. It doesn't decide anything.

### FHIR API

A few read-only FHIR R4 endpoints for Medication resources:

```
GET /api/fhir/metadata
GET /api/fhir/Medication?_text=metformin
GET /api/fhir/Medication?identifier=http://health.canada.ca/din|02223562
GET /api/fhir/Medication/02223562
```

DINs use the system `http://health.canada.ca/din`. I loosely followed the Infoway CA Core Medication profile (`http://infoway-inforoute.ca/fhir/StructureDefinition/profile-medication-ca-core`), but I haven't run it through any conformance testing.

## Stack

- Next.js 16 / React / TypeScript
- Tailwind CSS
- Supabase (Postgres)
- Python scripts for parsing the source PDFs and CSVs

Roughly how the data flows:

```
Manitoba formulary PDFs  \
Manitoba EDS PDFs         \
Manufacturer list PDF      +--> Python import scripts --> Supabase (Postgres)
Health Canada DPD CSV     /                                    |
                                                        Next.js API routes
                                                         /            \
                                                  FHIR API        med rec rules
                                                         \            /
                                                       React frontend
```

Most of the work went into the import scripts. Getting clean tables out of government PDFs took longer than building the UI.

## Data

| Source | From | Rows imported |
|--------|------|--------------:|
| Drug Benefits Formulary | Manitoba Health | 2,371 product names |
| Drug Interchangeability Formulary | Manitoba Health | 4,075 DINs |
| Exception Drug Status | Manitoba Health / MDSTC | 772 |
| Manufacturer abbreviations | Manitoba Health | 550 |
| Drug Product Database (human drugs) | Health Canada | 11,529 |

The formulary data is the version effective April 1, 2026. These are the counts I imported, so the current official files may be different.

## Running locally

```bash
git clone https://github.com/chikaonyenemezu-bit/manitoba-med-safety.git
cd manitoba-med-safety
npm ci
npm run dev
```

Then go to http://localhost:3000.

You'll need Supabase credentials in `.env.local` for the search and database features. Don't commit that file.

Other commands:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

CI (`.github/workflows/ci.yml`) runs install, lint and type check on pushes and PRs to `main`.

## MedSync

[MedSync](https://github.com/chikaonyenemezu-bit/medsync) is my other project. It does triage and care routing for German statutory insurance (Manchester Triage, SNOMED CT, ICD-10-GM, FHIR, provider search). Rxora takes the medication safety side of that and moves it to a Canadian setting.

## Disclaimer

This is a learning and portfolio project. It isn't connected to any provincial system, it doesn't make EDS decisions, and it hasn't been validated for clinical use. If you're building something real, check the data and rules yourself first.

## Contact

Built by Chika Onyenemezu. MSc Industrial Pharmacy, currently studying digital health. Feel free to open an issue if you spot something wrong in the data or the rules.
