#!/usr/bin/env bash
# Vercel "Ignored Build Step" — exit 0 = skip, exit 1 = build.
# Allow: pre/*, staging/develop, main
#
# Project Settings → Git → Ignored Build Step:
#   bash vercel-ignore-build-script.sh

set -euo pipefail

REF="${VERCEL_GIT_COMMIT_REF:-}"

if [ -z "$REF" ]; then
  echo "▶ no VERCEL_GIT_COMMIT_REF — proceed with build"
  exit 1
fi

case "$REF" in
  main|staging/develop|pre/*)
    echo "▶ branch '$REF' allowed — proceed with build"
    exit 1
    ;;
  *)
    echo "⏭ branch '$REF' not in (pre/*, staging/develop, main) — skip build"
    exit 0
    ;;
esac
