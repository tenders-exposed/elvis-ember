CONTRIBUTING TO ELVIS FRONTEND
---

# Git workflow

We loosely follow the
[Git-flow branching model](http://nvie.com/posts/a-successful-git-branching-model/).
While not religiously adhering to it, it defines some of the good practices
we're trying to be consistent with:

* Every feature/bugfix has its own branch
* We only work on the `develop` branch
* No code should be pushed to `develop`, but instead land there via Pull Requests
* Every merged PR must be approved by at least one team member
* Whenever new code gets from `develop` to `master`, it is tagged as a new release

# Tech setup

## Requirements

First of all, make sure you have the following requirements installed on the
machine you plan to use for development:

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
  * Version `7.9.x` is reccommended
  * `yarn` is also reccommended over `npm`
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)

Other reccommended tools would be:

* [nvm](https://gtihub.com/creationix/nvm) - a Node Version Manager
* A code editor capable of ES6 highlighting and linting

## Running

* `ember serve` (or just `ember s`)
* Visit your app at [localhost:4200](http://localhost:4200).

## Development

The `app` directory contains all the frontend logic, following the Ember conventions applicable for the Ember release mentioned in the `package.json` file.

The web app should restart automatically **if** the Ember server is started at
the moment of saving any of the project files. If it doesn't, make sure your
browser is up to date and behaves properly.

### Editing a template

In order to edit the template of any page, you will have to (all steps listed, assuming your node version is already set up – if it isn't, see the section about `nvm` above):

* `git clone https://github.com/tenders-exposed/elvis-ember && cd elvis-ember`
* `npm install`
* `git checkout -b feature/your-new-branch-name`
* `ember s`
* edit whatever you want
* when you are ready to share your work, `git add .`
* `git commit -m "One short phrase about what you did"`
* `git push -u origin feature/your-new-branch-name`
* then on GitHub, open a new Pull Request, comparing `develop` branch with your own

## Communication

We try to keep most of our communication in our GitHub issues. But every once in
a while, we might end up talking about project things in
our [Discourse](https://talk.tenders.exposed) installation.

There's also a [Waffle board](https://waffle.io/tenders-exposed/elvis-ember) for
those of you preferring a Kanban style issue tracking.

And last but not least, you can drop an email to tech@tenders.exposed and one of
us will get back to you.
