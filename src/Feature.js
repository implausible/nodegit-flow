const NodeGit = require('nodegit');
const Config = require('./Config');

const constants = require('./constants');
const utils = require('./utils');

/**
 * All of this class' functions are attached to `NodeGit.Flow` or a `Flow` instance object
 * @class
 */
class Feature {
  constructor(repo, config) {
    this.repo = repo;
    this.config = config;
  }

  /**
   * Starts a git flow "feature"
   * @async
   * @param {Object}  repo        The repository to start a feature in
   * @param {String}  featureName The name of the feature to start
   * @param {Object}  options     Options for start feature
   * @return {Branch}   The nodegit branch for the feature
   */
  static startFeature(repo, featureName, options = {}) {
    const {sha} = options;

    if (!repo) {
      return Promise.reject(new Error(constants.ErrorMessage.REPO_REQUIRED));
    }

    if (!featureName) {
      return Promise.reject(new Error('Feature name is required'));
    }

    let featureBranchName;
    let featureBranch;

    return Config.getConfig(repo)
      .then((config) => {
        const featurePrefix = config['gitflow.prefix.feature'];
        const developBranchName = config['gitflow.branch.develop'];

        featureBranchName = featurePrefix + featureName;
        if (sha) {
          return NodeGit.Commit.lookup(repo, sha);
        }

        return NodeGit.Branch.lookup(
          repo,
          developBranchName,
          NodeGit.Branch.BRANCH.LOCAL
        )
        .then((developBranch) => NodeGit.Commit.lookup(repo, developBranch.target()));
      })
      .then((fromCommit) => repo.createBranch(featureBranchName, fromCommit))
      .then((_featureBranch) => {
        featureBranch = _featureBranch;
        return repo.checkoutBranch(featureBranch);
      })
      .then(() => featureBranch);
  }

  /**
   * Finishes a git flow "feature"
   * @async
   * @param {Object}  repo        The repository to finish a feature in
   * @param {String}  featureName The name of the feature to finish
   * @param {Object}  options     Options for finish feature
   * @return {Commit}   The commit created by finishing the feature
   */
  static finishFeature(repo, featureName, options = {}) {
    const {keepBranch, isRebase} = options;

    if (!repo) {
      return Promise.reject(new Error('Repo is required'));
    }

    if (!featureName) {
      return Promise.reject(new Error('Feature name is required'));
    }

    let developBranch;
    let featureBranch;
    let developCommit;
    let featureCommit;
    let cancelDevelopMerge;
    let mergeCommit;
    let featureBranchName;
    return Config.getConfig(repo)
      .then((config) => {
        const developBranchName = config['gitflow.branch.develop'];
        featureBranchName = config['gitflow.prefix.feature'] + featureName;

        return Promise.all(
          [developBranchName, featureBranchName]
            .map((branchName) => NodeGit.Branch.lookup(repo, branchName, NodeGit.Branch.BRANCH.LOCAL))
        );
      })
      .then((branches) => {
        developBranch = branches[0];
        featureBranch = branches[1];

        return Promise.all(branches.map((branch) => repo.getCommit(branch.target())));
      })
      .then((commits) => {
        developCommit = commits[0];
        featureCommit = commits[1];

        // If the develop branch and feautre branch point to the same thing do not merge them
        // or if the `isRebase` parameter is true do not merge
        const isSameCommit = developCommit.id().toString() === featureCommit.id().toString();
        cancelDevelopMerge = isSameCommit || isRebase;

        if (!cancelDevelopMerge) {
          return utils.Repo.merge(developBranch, featureBranch, repo);
        } else if (isRebase && !isSameCommit) {
          return utils.Repo.rebase(developBranch, featureBranch, repo);
        }
        return Promise.resolve();
      })
      .then((_mergeCommit) => {
        mergeCommit = _mergeCommit;
        if (cancelDevelopMerge) {
          return repo.checkoutBranch(developBranch);
        }
        return Promise.resolve();
      })
      .then(() => {
        if (keepBranch) {
          return Promise.resolve();
        }

        return NodeGit.Branch.lookup(repo, featureBranchName, NodeGit.Branch.BRANCH.LOCAL)
          .then((branch) => branch.delete());
      })
      .then(() => mergeCommit);
  }

  /**
   * Starts a git flow "feature"
   * @async
   * @param {String}  featureName The name of the feature to start
   * @param {Object}  options     Options for start feature
   * @return {Branch}   The nodegit branch for the feature
   */
  startFeature() {
    return Feature.startFeature(this.repo, ...arguments);
  }

  /**
   * Finishes a git flow "feature"
   * @async
   * @param {String}  featureName The name of the feature to finish
   * @param {Object}  options     Options for finish feature
   * @return {Commit}   The commit created by finishing the feature
   */
  finishFeature() {
    return Feature.finishFeature(this.repo, ...arguments);
  }
}

module.exports = Feature;
