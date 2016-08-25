# gulp-local-build
Stable local build system for WP Parent - Child theming.
-Integrates parent/child SCSS and JS,  Passes SCSS variables and controls cross dependencies.
-Allows for rapid deployment of new projects.
-Manages SASS/Js compilation, concatination, linting and minification.
-Provides immediate feedback on build failure.

Developed

## File structure

	ROOT: *project*/wp-content/themes/
	├── ├── gulpfile.js         - Build Config
        ├── package.json        - Specifies dependencies on JS assets.
        ├── bower.json          - Specifies dependencies on static assets and client side modules.
        ├── .scss-lint.yml      - SASS Linter.
        ├── .jshintrc           - Js Linter.
        ├── js-style-guide.md   - Js style guide
        ├── .gitignore          - Default git config for WordPress projects.
        └── readme.md
            ├── childTheme          - set dynamically in gulpflie.js Line #1
                ├── function.php    - Enq. local script "/js/project.js" - dependent on "parent.js"
                ├── style.css       - Compiled output of both parent and child theme scss.
                    ├── js          - Contains your custom js for current project.
                    ├── scss        - Contains your custom Scss for current project.
                        ├── style.scss - @imports parent SCSS - set your theme info
                        ├── child-settings.scss - set your project specific variables - required by parent styles.scss
                            ├── pages - page specific styles
                            ├── partials - common section styles
            ├── parentTheme - set dynamically in gulpflie.js Line #4
                ├── function.php - Enq. parent theme script bundle "/js/parent.js"
                    ├── js - Contains custom js framework and common libraries.
                    ├── scss - Contains custom Scss framework and mixins.
                        ├── style.scss - @imports parent SCSS for compilation
                        ├── child-settings.scss - set project specific variables - required by parent styles.scss
                            ├── mixins - reuseable mixins
                            ├── plugins - default styles for integrated 'plugin' style functions
                            ├── partials - defaults for common section styles
                            ├── resources - additional resources such as icon scss

## Prerequisites

Make sure that you have root access to the project directory.  If you are on Mac, you need to make sure that command line dev tools are installed.

This project is designed for WordPress, so you will need to setup a new project, along with a MySql database and MAMP.
    - [Installing Wordpress] (https://codex.wordpress.org/Installing_WordPress).

You will also need to have a Node Js installed.
    - [Installing Node] (https://docs.npmjs.com/getting-started/installing-node).

The build system uses Gulp.  Client side dependencies can be managed using bower. Both of these can be installed via NPM:

    $ npm install -g gulp
    $ npm install -g bower


## Getting Started
Note: You should already have a vanilla WordPress install connecting to your database and accessible on a local URL.

1. Navigate to *your project folder*/wp-content/themes.

2. Git clone the repository.
    $ git clone https://github.com/whiterosecoffee/gulp-local-build.git

    Optional: Check your updated folder contents  $ ls

3. Install dependencies:
	$ npm install

If you have any errors in this step, first troubleshoot by $ npm cache clear, then retry OR delete your

4. Set project variables in gulpfile.js.  Note: Js and Scss resources will not normally change.
    1 - var theme = './sebastian';                      // your theme name
    2 - var parent = './core';                          // your parent theme name
    3 - var styleFiles = theme + '/scss/style.scss';    // child root style.scss file location
    4 - var jsFiles = theme + '/js/*.js';               // child root js file location
    5 - var projectURL = 'http://localhost/sebastian/'; // project URL - needs to match your MAMP configuration.

5.  Run Gulp and Test
	 $ gulp watch

If everything is working properly, Gulp Notify pop up a success notification.  If the build fails, you will hear 3 beeps, and will need to check your error status.

### Optional Settings



