# FileMaker source inputs

This directory contains immutable structural source inputs used by code generation.

## Canonical path shape

`source/filemaker/<application-slug>/<extractor-slug>-output/`

Current input:

- `source/filemaker/funkis-authoring-tool/fm-xml-export-exploder-output/`

## Provenance

- Application: `Funkis Authoring Tool` (FileMaker file)
- Structural XML export: FileMaker "Save as XML"
- Exploder tool: `fm-xml-export-exploder`

## Rules

- Do not hand-edit files under extractor output folders.
- Treat extractor output as immutable generator input.
- Regenerate from upstream export + exploder tool when source changes.
- Keep new imports under the canonical path shape so provenance remains explicit.
