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
        return next()
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
            title: `New repo created: ${owner}/${repo_name}`,
            body: config.ISSUE_BODY
        });
        console.log(`Issue is created for repo: ${owner}/${repo_name}`)
        return true;
    } catch (e) {
        console.error(e);
        throw e;
    }
}


