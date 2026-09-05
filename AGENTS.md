# Agent instructions

## Dependency security

Never bypass package-manager security controls without permission, including Bun's
`minimumReleaseAge`. If dependency installation is blocked, stop and ask the
user. Do not use `--minimum-release-age=0` or alter security configuration without approval.
