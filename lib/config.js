module.exports = {
    GITHUB_TOKEN                : process.env.GITHUB_TOKEN || "",
    GITHUB_API                  : process.env.GITHUB_API || "https://api.github.com", // for GHE use. http(s)://hostname/api/v3/
    WEBHOOK_HOST                : process.env.WEBHOOK_HOST || "0.0.0.0",
    WEBHOOK_PORT                : process.env.WEBHOOK_PORT || 3000,
    WEBHOOK_SSL_CERT            : process.env.WEBHOOK_SSL_CERT || "",
    WEBHOOK_SSL_KEY             : process.env.WEBHOOK_SSL_KEY || "",
    WEBHOOK_SSL_CERT_PATH       : process.env.WEBHOOK_SSL_CERT_PATH || "",
    WEBHOOK_SSL_KEY_PATH        : process.env.WEBHOOK_SSL_KEY_PATH || "",
    WEBHOOK_SIGNATURE           : process.env.WEBHOOK_SIGNATURE|| "",
    // When a new repo is created, the default branch creation takes a couple of seconds, so we need a retry option.
    // Retries executes every 2 seconds.
    RETRY_EXECUTIONS          : process.env.RETRY_EXECUTIONS|| 10,
    // AUTOMATED ISSUE CONFIGURATION
    ISSUE_BODY                  : process.env.ISSUE_BODY|| "Master branch is auto-protected by @homeles",
    // BP (BRANCH PROTECTION CONFIGURATION)
    BP_PROTECTED_BRANCH                 : process.env.BP_PROTECTED_BRANCH|| "master",
    BP_REQUIRED_STATUS_CHECK_STRICT     : process.env.BP_REQUIRED_STATUS_CHECK_STRICT|| true,
    BP_REQUIRED_STATUS_CHECK_CONTEXT    : process.env.BP_REQUIRED_STATUS_CHECK_CONTEXT|| "ci pipeline", // Array ie. 'user1,user2,user3'
    BP_ENFORCE_ADMINS                   : process.env.BP_ENFORCE_ADMINS|| false,
    BP_REQUIRED_CODE_OWNERS_REVIEW      : process.env.BP_REQUIRED_CODE_OWNERS_REVIEW|| true,
    BP_REQUIRED_APPROVING_REVIEWS_COUNT : process.env.BP_REQUIRED_APPROVING_REVIEWS_COUNT|| 1,
    BP_DISMISSAL_RESTRICTIONS_USERS     : process.env.BP_DISMISSAL_RESTRICTIONS_USERS|| "homeles", // Array ie. 'user1,user2,user3'
    BP_DISMISSAL_RESTRICTIONS_TEAMS     : process.env.BP_DISMISSAL_RESTRICTIONS_TEAMS|| "", // Array ie. 'team1,team2,team3'
    BP_DISMISS_STALE_REVIEWS            : process.env.BP_DISMISS_STALE_REVIEWS|| true,
    BP_RESTRICTIONS_USERS               : process.env.BP_RESTRICTIONS_USERS|| "homeles", // Array ie. 'user1,user2,user3'
    BP_RESTRICTIONS_TEAMS               : process.env.BP_RESTRICTIONS_TEAMS|| "", // Array ie. 'team1,team2,team3'
    BP_RESTRICTIONS_APPS                : process.env.BP_RESTRICTIONS_APPS|| "", // Array ie. 'app1,app2,app3'
    BP_REQUIRED_LINEAR_HISTORY          : process.env.BP_REQUIRED_LINEAR_HISTORY|| false,
    BP_ALLOW_FORCE_PUSHES               : process.env.BP_ALLOW_FORCE_PUSHES|| true,
    BP_ALLOW_DELETIONS                  : process.env.BP_ALLOW_DELETIONS|| true
  };
