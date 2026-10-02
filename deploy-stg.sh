#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

DEVELOP_BRANCH="develop"
STAGING_BRANCH="staging/develop"
CURRENT_BRANCH="$(git branch --show-current)"
DID_STASH=0

fail() {
    echo "Error: $*" >&2
    if [[ "$DID_STASH" -eq 1 ]]; then
        echo "Your uncommitted changes are still in the stash. Once fixed: git switch $CURRENT_BRANCH && git stash pop" >&2
    fi
    exit 1
}

is_in_conflict_state() {
    [[ -f .git/MERGE_HEAD ]] || [[ -d .git/rebase-merge ]] || [[ -d .git/rebase-apply ]]
}

run_git() {
    local description="$1"
    shift

    echo "→ $description"
    if ! "$@"; then
        if is_in_conflict_state; then
            fail "Conflict during: $description. Resolve manually, then re-run."
        fi
        fail "Failed: $description"
    fi
}

[[ -n "$CURRENT_BRANCH" ]] || fail "Not on a branch (detached HEAD?)."

echo "Current branch: $CURRENT_BRANCH"
echo "Force deploy:   $DEVELOP_BRANCH → $STAGING_BRANCH"
echo "(does not merge your feature branch)"
echo

# Fetch first: a branch someone else created (e.g. staging/develop) has no local
# remote-tracking ref until then, and `git switch` would fail halfway through.
run_git "fetch origin" git fetch origin

# --- stash current work ---
if [[ -n "$(git status --porcelain)" ]]; then
    run_git "stash working tree" git stash push -u -m "auto-stash before deploy-stg"
    DID_STASH=1
else
    echo "→ no local changes to stash"
fi

# --- develop (pull latest from others) ---
run_git "switch to $DEVELOP_BRANCH" git switch "$DEVELOP_BRANCH"
run_git "pull origin $DEVELOP_BRANCH" git pull origin "$DEVELOP_BRANCH"

# --- staging/develop ---
run_git "switch to $STAGING_BRANCH" git switch "$STAGING_BRANCH"
run_git "pull origin $STAGING_BRANCH" git pull origin "$STAGING_BRANCH"
run_git "merge $DEVELOP_BRANCH into $STAGING_BRANCH" git merge --no-ff --no-edit "$DEVELOP_BRANCH"
run_git "push origin $STAGING_BRANCH" git push origin "$STAGING_BRANCH"

# --- return to original branch ---
run_git "switch back to $CURRENT_BRANCH" git switch "$CURRENT_BRANCH"
if [[ "$DID_STASH" -eq 1 ]]; then
    run_git "restore stash" git stash pop
fi

echo
echo "Done. Force deployed origin/$DEVELOP_BRANCH → origin/$STAGING_BRANCH"
