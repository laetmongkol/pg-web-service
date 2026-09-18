#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

DEVELOP_BRANCH="develop"
STAGING_BRANCH="staging/develop"
MAIN_BRANCH="main"
FEATURE_BRANCH="$(git branch --show-current)"

fail() {
    echo "Error: $*" >&2
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

[[ -n "$FEATURE_BRANCH" ]] || fail "Not on a branch (detached HEAD?)."
for protected in "$DEVELOP_BRANCH" "$STAGING_BRANCH" "$MAIN_BRANCH"; do
    [[ "$FEATURE_BRANCH" != "$protected" ]] || fail "Already on $protected. Create a feature branch off $DEVELOP_BRANCH first: git checkout -b {initials}/{feat|fix|chore|refac}/{action} $DEVELOP_BRANCH"
done
[[ -z "$(git status --porcelain)" ]] || fail "Working tree is dirty. Commit (or stash) your changes first."

echo "Feature branch: $FEATURE_BRANCH"
echo "Target branch:  $DEVELOP_BRANCH"
echo

run_git "switch to $DEVELOP_BRANCH" git switch "$DEVELOP_BRANCH"
run_git "pull origin $DEVELOP_BRANCH" git pull origin "$DEVELOP_BRANCH"
run_git "switch to $FEATURE_BRANCH" git switch "$FEATURE_BRANCH"
run_git "rebase $FEATURE_BRANCH onto $DEVELOP_BRANCH" git rebase "$DEVELOP_BRANCH"
run_git "switch to $DEVELOP_BRANCH" git switch "$DEVELOP_BRANCH"
run_git "merge $FEATURE_BRANCH into $DEVELOP_BRANCH" git merge --no-ff --no-edit "$FEATURE_BRANCH"
run_git "push origin $DEVELOP_BRANCH" git push origin "$DEVELOP_BRANCH"
run_git "switch back to $FEATURE_BRANCH" git switch "$FEATURE_BRANCH"
run_git "rebase $FEATURE_BRANCH onto $DEVELOP_BRANCH" git rebase "$DEVELOP_BRANCH"

echo
echo "Done. Merged and pushed $FEATURE_BRANCH → origin/$DEVELOP_BRANCH"
