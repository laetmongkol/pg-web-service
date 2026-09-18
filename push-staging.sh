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

git show-ref --verify --quiet "refs/heads/$STAGING_BRANCH" \
    || git ls-remote --exit-code --heads origin "$STAGING_BRANCH" >/dev/null 2>&1 \
    || fail "$STAGING_BRANCH does not exist in this repo. Use ./push-develop.sh instead."

echo "Feature branch: $FEATURE_BRANCH"
echo "Pipeline:       $DEVELOP_BRANCH → $STAGING_BRANCH"
echo

# --- develop (required; do not skip) ---
run_git "switch to $DEVELOP_BRANCH" git switch "$DEVELOP_BRANCH"
run_git "pull origin $DEVELOP_BRANCH" git pull origin "$DEVELOP_BRANCH"
run_git "switch to $FEATURE_BRANCH" git switch "$FEATURE_BRANCH"
run_git "rebase $FEATURE_BRANCH onto $DEVELOP_BRANCH" git rebase "$DEVELOP_BRANCH"
run_git "switch to $DEVELOP_BRANCH" git switch "$DEVELOP_BRANCH"
run_git "merge $FEATURE_BRANCH into $DEVELOP_BRANCH" git merge --no-ff --no-edit "$FEATURE_BRANCH"
run_git "push origin $DEVELOP_BRANCH" git push origin "$DEVELOP_BRANCH"

# --- staging/develop ---
run_git "switch to $STAGING_BRANCH" git switch "$STAGING_BRANCH"
run_git "pull origin $STAGING_BRANCH" git pull origin "$STAGING_BRANCH"
run_git "merge $DEVELOP_BRANCH into $STAGING_BRANCH" git merge --no-ff --no-edit "$DEVELOP_BRANCH"
run_git "push origin $STAGING_BRANCH" git push origin "$STAGING_BRANCH"

# --- return to feature branch (steps 11-12 of the flow; deferred to here because
#     the staging merge cannot move develop, so the rebase result is identical) ---
run_git "switch back to $FEATURE_BRANCH" git switch "$FEATURE_BRANCH"
run_git "rebase $FEATURE_BRANCH onto $DEVELOP_BRANCH" git rebase "$DEVELOP_BRANCH"

echo
echo "Done. Pushed $FEATURE_BRANCH → origin/$DEVELOP_BRANCH → origin/$STAGING_BRANCH"
