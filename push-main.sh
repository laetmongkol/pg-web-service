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

# Production push needs a human. If stdin is not a terminal (CI, an agent, a pipe),
# fall back to /dev/tty; if that is not there either, refuse rather than assume yes.
confirm() {
    local answer
    printf '%s [y/N] ' "$1" >&2
    if [[ -t 0 ]]; then
        read -r answer || fail "Aborted: no answer."
    else
        { read -r answer </dev/tty; } 2>/dev/null \
            || fail "No terminal available to confirm a $MAIN_BRANCH push. Run this script yourself in an interactive shell."
    fi
    [[ "$answer" =~ ^[Yy]([Ee][Ss])?$ ]] || fail "Aborted by user."
}

[[ -n "$FEATURE_BRANCH" ]] || fail "Not on a branch (detached HEAD?)."
for protected in "$DEVELOP_BRANCH" "$STAGING_BRANCH" "$MAIN_BRANCH"; do
    [[ "$FEATURE_BRANCH" != "$protected" ]] || fail "Already on $protected. Create a feature branch off $DEVELOP_BRANCH first: git checkout -b {initials}/{feat|fix|chore|refac}/{action} $DEVELOP_BRANCH"
done
[[ -z "$(git status --porcelain)" ]] || fail "Working tree is dirty. Commit (or stash) your changes first."

# staging/develop does not exist in every repo (e.g. sriwilai-cms-db-service).
HAS_STAGING=0
if git show-ref --verify --quiet "refs/heads/$STAGING_BRANCH" \
    || git ls-remote --exit-code --heads origin "$STAGING_BRANCH" >/dev/null 2>&1; then
    HAS_STAGING=1
    MAIN_SOURCE="$STAGING_BRANCH"
    PIPELINE="$DEVELOP_BRANCH → $STAGING_BRANCH → $MAIN_BRANCH"
else
    MAIN_SOURCE="$DEVELOP_BRANCH"
    PIPELINE="$DEVELOP_BRANCH → $MAIN_BRANCH (no $STAGING_BRANCH in this repo)"
fi

echo "Feature branch: $FEATURE_BRANCH"
echo "Pipeline:       $PIPELINE"
echo
confirm "This deploys to PRODUCTION ($MAIN_BRANCH). Continue?"
echo

# --- develop (required; do not skip) ---
run_git "switch to $DEVELOP_BRANCH" git switch "$DEVELOP_BRANCH"
run_git "pull origin $DEVELOP_BRANCH" git pull origin "$DEVELOP_BRANCH"
run_git "switch to $FEATURE_BRANCH" git switch "$FEATURE_BRANCH"
run_git "rebase $FEATURE_BRANCH onto $DEVELOP_BRANCH" git rebase "$DEVELOP_BRANCH"
run_git "switch to $DEVELOP_BRANCH" git switch "$DEVELOP_BRANCH"
run_git "merge $FEATURE_BRANCH into $DEVELOP_BRANCH" git merge --no-ff --no-edit "$FEATURE_BRANCH"
run_git "push origin $DEVELOP_BRANCH" git push origin "$DEVELOP_BRANCH"

# --- staging/develop (required where it exists; do not skip) ---
if [[ "$HAS_STAGING" -eq 1 ]]; then
    run_git "switch to $STAGING_BRANCH" git switch "$STAGING_BRANCH"
    run_git "pull origin $STAGING_BRANCH" git pull origin "$STAGING_BRANCH"
    run_git "merge $DEVELOP_BRANCH into $STAGING_BRANCH" git merge --no-ff --no-edit "$DEVELOP_BRANCH"
    run_git "push origin $STAGING_BRANCH" git push origin "$STAGING_BRANCH"
fi

# --- main ---
run_git "switch to $MAIN_BRANCH" git switch "$MAIN_BRANCH"
run_git "pull origin $MAIN_BRANCH" git pull origin "$MAIN_BRANCH"
run_git "merge $MAIN_SOURCE into $MAIN_BRANCH" git merge --no-ff --no-edit "$MAIN_SOURCE"
run_git "push origin $MAIN_BRANCH" git push origin "$MAIN_BRANCH"

# --- return to feature branch (steps 11-12 of the flow; deferred to here because
#     the staging and main merges cannot move develop, so the rebase result is identical) ---
run_git "switch back to $FEATURE_BRANCH" git switch "$FEATURE_BRANCH"
run_git "rebase $FEATURE_BRANCH onto $DEVELOP_BRANCH" git rebase "$DEVELOP_BRANCH"

echo
echo "Done. Pushed $FEATURE_BRANCH → $PIPELINE"
