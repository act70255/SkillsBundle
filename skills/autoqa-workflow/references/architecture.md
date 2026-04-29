# AutoQA Skills Architecture (Portable Bundle)

This skill package is designed for standard, complete, portable, reusable usage.

Layering:
1. autoqa-governance-core -> cross-project governance rules
2. autoqa-workflow -> reusable process + artifact contract
3. autoqa-step-* -> step execution modules
4. autoqa-project-profile-* -> project-specific configuration only

Portability rule:
- Runtime templates/scripts required by core workflow are bundled under this skill directory.
- External copies under workflow/template and workflow/scripts are compatibility mirrors only.
