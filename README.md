# MultiClaw-Public-Library 📚🦞

[![Library Quality Gate](https://github.com/AIML-Solutions/multiclaw-public-library/actions/workflows/ci.yml/badge.svg)](https://github.com/AIML-Solutions/multiclaw-public-library/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e.svg)](LICENSE)

The **MultiClaw-Public-Library** is the living documentation layer for AIML Solutions.

It turns active engineering work into teachable, reusable references for both humans and agents.

**Stack note:** MultiClawOS is the orchestration and policy layer for the MultiClaw fintech stack (agent routing, permissions, runbooks). It is not a general-purpose operating system like Windows or Linux; it functions as a FinTechOS-style layer on top of your environment.

## Mission

- keep architecture + implementation docs synchronized
- make onboarding practical for new contributors
- publish playbooks that are action-ready, not theoretical
- provide an operator-facing docs/workflow UI (MDV + TEB)

## Primary sections

- `docs/departments/` — organizational model and ownership
- `docs/stack/` — framework/tooling references
- `docs/playbooks/` — operational and launch playbooks
- `examples/` — runnable or near-runnable examples

## Recommended reading path

1. [docs/README.md](docs/README.md)
2. [docs/departments/overview.md](docs/departments/overview.md)
3. [docs/stack/tooling-index.md](docs/stack/tooling-index.md)
4. [docs/playbooks/aws-free-tier-plan.md](docs/playbooks/aws-free-tier-plan.md)
5. [docs/playbooks/linkedin-launch-post.md](docs/playbooks/linkedin-launch-post.md)
6. [docs/playbooks/mdv-teb-spec.md](docs/playbooks/mdv-teb-spec.md)
7. [docs/playbooks/moltbook-campaign.md](docs/playbooks/moltbook-campaign.md)

## MDV + TEB front-end

A lightweight static front-end is included in `site/`:
- **MDV** = MultiClaw Docs Viewer
- **TEB** = Tracked Execution Board

Once Pages deploys, expected URL:
- `https://aiml-solutions.github.io/multiclaw-public-library/`

## Related repos

- `MultiClaw-Core`
- `MultiClaw-Quant-Tools`
- `MultiClaw-MLFlow`
- `MultiClaw-Blockchain`
- `MultiClaw-LLM`
- `MultiClaw-Frontend`
- `MultiClaw-Public-Library`
- `ProRepoAgentOps`
- `SnorkelTools`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
