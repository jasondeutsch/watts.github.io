# Watts

## Agent adoption leaves the team process undefined

Engineers choose prompts, tools, reviews, and recovery independently.

Teams struggle to answer:

- Which process produced an accepted change?
- What did it cost, including failures and human review?
- Did the next workflow version improve the result?

<small>Customer hypothesis to validate; not a claim that all teams work this way.</small>

## Watts makes the development process explicit

**Define the workflow. Run it. Evaluate a revision.**

1. Describe agents, tools, checks, approvals, and rework in a versioned package.
2. Execute a pinned definition and retain its results and evidence.
3. Compare workflow versions on the same tasks and acceptance criteria.

<small>ACL is Watts’ authoring language. Comparable evaluation is the product goal; complete accounting remains open work.</small>

## Every accepted change needs an evidence record

**Connect the outcome to the process and resources that produced it.**

- Workflow version, attempts, and model usage.
- Verification results, review findings, and approval decisions.
- Available tokens, spend, elapsed time, and human intervention.

<small>This is the basis for observability, spend accountability, and governance. Enforced enterprise policy and protected audit retention are proposed capabilities.</small>

<details class="report-preview">
<summary>Explore the report and stage usage graphs</summary>
<p>A recorded Go feature task: input/output tokens, cache usage, rework, timing, and reported cost by stage. Explore the graphs and click an attempt to inspect its details. This is a static, sanitized prototype record; unavailable measurements remain unknown.</p>
<a class="report-link" href="./report.html#usage">Explore stage usage →</a>
<a class="report-link" href="./report.html">Open the full report →</a>
<iframe src="./report.html#usage" title="Watts stage usage graphs and task report" loading="lazy" sandbox></iframe>
</details>

## Managed execution for teams without a platform team

**A maintained starting workflow, customized for the team.**

Watts Platform would operate orchestration, workloads, evidence storage, and upgrades.

Teams retain their workflow definitions and customize agents, skills, tools, and approval policy.

<small>Initial customer hypothesis: smaller organizations and software teams in non-technology businesses, with a technical owner. The cloud service is proposed.</small>

## Open core; paid operations and organizational controls

| Offering | Proposed commercial basis |
| --- | --- |
| Watts Core | Free, MPL 2.0 |
| Watts Cloud | Organization subscription + metered compute and storage |
| Watts Enterprise | Annual contracts for organizational controls and support |

Customers bring their own provider keys initially. Inference charges remain separate.

<small>HashiCorp-inspired business structure. Paid editions, pricing, and customer demand are not established. Scoped onboarding and support are additional services.</small>

## A working prototype with clear product gaps

**One supervised CSS task passed independent acceptance checks.**

- About **22 minutes**; one planning rejection.
- **1.95 million** reported input + output tokens, including cached input.
- Billed cost unavailable; live visibility and report links needed improvement.

<small>Watts 0.1.0: local Docker execution and Temporal orchestration. This case demonstrates execution, not unattended reliability or measured productivity gains. Historical eval details are in the supporting notes.</small>

## Pilot the process against a real team baseline

**Start with bounded Go fixes and small feature changes.**

1. Record the team’s existing coding-agent and CI process.
2. Run comparable cases with Watts; retain failures and review effort.
3. Revise the workflow and assess quality, resource cost, and repeat use.

<small>Proposed next step: design-partner pilots. Willingness to pay and lower operating effort must be demonstrated before expanding the platform.</small>
