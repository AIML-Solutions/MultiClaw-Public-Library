# AWS Free-Tier Plan (Preparation)

## We need from account owner
- AWS account ID
- preferred region(s)
- IAM user/role strategy
- monthly hard cap target

## Proposed free-tier-safe baseline
- S3: docs/artifacts buckets with lifecycle policies
- Lambda: lightweight automation jobs
- CloudWatch billing alarm + budgets
- Optional EC2 burstable micro only when needed

## Guardrails
- enforce budgets + alert thresholds
- tag every resource by department
- weekly cost report to MultiClaw core

Note: exact account-specific remaining free-tier limits require authenticated AWS API/console access.
