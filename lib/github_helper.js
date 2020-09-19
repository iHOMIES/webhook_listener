'use strict';

const { Octokit } = require("@octokit/rest");
const config  = require('./config.js'),
      crypto  = require('crypto'),
      util    = require('util')

const octokit = new Octokit({
  auth: config.GITHUB_TOKEN,
});

module.exports = {

    verifyPostData: function(req, res, next) {
        const payload = JSON.stringify(req.body)
        if (!payload) {
            return next('Request body empty')
        }

        // Validate GitHub webhook payload matches the key defined in webhook.
        const sig = req.get('X-Hub-Signature') || ''
        const hmac = crypto.createHmac('sha1', config.WEBHOOK_SIGNATURE)
        const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8')
        const checksum = Buffer.from(sig, 'utf8')
        if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
            return next(`Request body digest (${digest}) did not match X-Hub-Signature (${checksum})`)
        }

        if (req.body.action != "created") {
            return next('Request body action is not from repo creation')
        }

        // Number to retries to wait for branch readiness
        const retry = 5;
        wait_for_branch(req.body, retry, function(err, resp) {
            if (err) {
                throw (err);
            }
            // If no error, continue with the configuration
            var setBranch = set_branch_protection(req.body);
            setBranch.then(function () {
                var createIssue =  create_issue(req.body);
                createIssue.then(function () {
                }).catch(function () {
                    console.error("Could not create issue");
                });
            }).catch(function () {
                console.error("Could not set branch protection");
            });
        });
        return next()
    }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

var wait_for_branch = async function(repo, retry, callback) {
    try {
        await sleep(2000);
        console.log("Retries left: ", retry);
        if (retry == 0){
            return callback(Error("out of retries"));
        }
        retry = retry - 1;
        var getBranch =  get_branch(repo);
        getBranch.then(function () {
            callback();
        }).catch(function () {
            wait_for_branch(repo, retry, callback);
            console.error("Branch does not exists");
        });
    } catch (e) {
        console.error(e);
        throw e;
    }

}

var get_branch = async function (repo) {
    var owner = repo.organization.login;
    var repo_name = repo.repository.name;
    try {
        await octokit.repos.getBranch({
            owner: repo.organization.login,
            repo: repo.repository.name,
            branch: config.BP_PROTECTED_BRANCH
        });
        console.log(`Branch exists for repo: ${owner}/${repo_name}`)
        return true;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

var set_branch_protection = async function (repo) {
    try {
        await octokit.repos.updateBranchProtection({
            owner: repo.organization.login,
            repo: repo.repository.name,
            branch: config.BP_PROTECTED_BRANCH,
            required_status_checks: {
                strict: config.BP_REQUIRED_STATUS_CHECK_STRICT,
                contexts: config.BP_REQUIRED_STATUS_CHECK_CONTEXT.split(",")
            },
            enforce_admins: config.BP_ENFORCE_ADMINS,
            required_pull_request_reviews: {
                require_code_owner_reviews: config.BP_REQUIRED_CODE_OWNERS_REVIEW,
                required_approving_review_count: config.BP_REQUIRED_APPROVING_REVIEWS_COUNT,
                dismissal_restrictions: {
                    users: config.BP_DISMISSAL_RESTRICTIONS_USERS.split(","),
                    teams: config.BP_DISMISSAL_RESTRICTIONS_TEAMS.split(",")
                },
                dismiss_stale_reviews: config.BP_DISMISS_STALE_REVIEWS
            },
            restrictions: {
                users: config.BP_RESTRICTIONS_USERS.split(","),
                teams: config.BP_RESTRICTIONS_TEAMS.split(","),
                apps: config.BP_RESTRICTIONS_APPS.split(",")
            },
            required_linear_history: config.BP_REQUIRED_LINEAR_HISTORY,
            allow_force_pushes: config.BP_ALLOW_FORCE_PUSHES,
            allow_deletions: config.BP_ALLOW_DELETIONS,
            headers: {
                accept: 'application/vnd.github.luke-cage-preview+json'
            }
        });
        console.log(`Branch protected for: ${repo.organization.login}/${repo.repository.name}`);
        return true;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

var create_issue = async function (repo) {
    var owner = repo.organization.login;
    var repo_name = repo.repository.name;
    try {
        await octokit.issues.create({
            owner: owner,
            repo: repo_name,
            title: `Master branch protected for: ${owner}/${repo_name}`,
            body: config.ISSUE_BODY
        });
        console.log(`Issue is created for repo: ${owner}/${repo_name}`)
        return true;
    } catch (e) {
        console.error(e);
        throw e;
    }
}



