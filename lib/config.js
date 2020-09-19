module.exports = {
    GITHUB_TOKEN                : process.env.GITHUB_TOKEN || '',
    WEBHOOK_HOST                : process.env.WEBHOOK_HOST || '0.0.0.0',
    WEBHOOK_PORT                : process.env.WEBHOOK_PORT || 3000,
    WEBHOOK_SIGNATURE           : process.env.WEBHOOK_SIGNATURE|| '',
    // AUTOMATED ISSUE CONFIGURATION
    ISSUE_BODY                  : process.env.ISSUE_BODY|| 'Master branch is auto-protected by @homeles',
    // BP (BRANCH PROTECTION CONFIGURATION)
    BP_PROTECTED_BRANCH                 : process.env.BP_PROTECTED_BRANCH|| 'master',
    BP_REQUIRED_STATUS_CHECK_STRICT     : process.env.BP_REQUIRED_STATUS_CHECK_STRICT|| true,
    BP_REQUIRED_STATUS_CHECK_CONTEXT    : process.env.BP_REQUIRED_STATUS_CHECK_CONTEXT|| 'contexts', // Array ie. 'user1,user2,user3'
    BP_ENFORCE_ADMINS                   : process.env.BP_ENFORCE_ADMINS|| false,
    BP_REQUIRED_CODE_OWNERS_REVIEW      : process.env.BP_REQUIRED_CODE_OWNERS_REVIEW|| true,
    BP_REQUIRED_APPROVING_REVIEWS_COUNT : process.env.BP_REQUIRED_APPROVING_REVIEWS_COUNT|| 1,
    BP_DISMISSAL_RESTRICTIONS_USERS     : process.env.BP_DISMISSAL_RESTRICTIONS_USERS|| 'users', // Array ie. 'user1,user2,user3'
    BP_DISMISSAL_RESTRICTIONS_TEAMS     : process.env.BP_DISMISSAL_RESTRICTIONS_TEAMS|| 'teams', // Array ie. 'team1,team2,team3'
    BP_DISMISS_STALE_REVIEWS            : process.env.BP_DISMISS_STALE_REVIEWS|| true,
    BP_RESTRICTIONS_USERS               : process.env.BP_RESTRICTIONS_USERS|| '', // Array ie. 'user1,user2,user3'
    BP_RESTRICTIONS_TEAMS               : process.env.BP_RESTRICTIONS_TEAMS|| '', // Array ie. 'team1,team2,team3'
    BP_RESTRICTIONS_APPS                : process.env.BP_RESTRICTIONS_APPS|| '', // Array ie. 'app1,app2,app3'
    BP_REQUIRED_LINEAR_HISTORY          : process.env.BP_REQUIRED_LINEAR_HISTORY|| false,
    BP_ALLOW_FORCE_PUSHES               : process.env.BP_ALLOW_FORCE_PUSHES|| true,
    BP_ALLOW_DELETIONS                  : process.env.BP_ALLOW_DELETIONS|| true
  };
