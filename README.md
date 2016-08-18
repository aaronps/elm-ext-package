# elm-ext-package V 0.1.7

Tool to use external packages not published in package.elm-lang.org.


## Installing

Use `npm` to install it globally.

```shell
$ npm install -g elm-ext-package
```

After that you can use the command `elm-ext-package`


## Introduction

`elm-make` relies on the information in `elm-package.json` to compile. If you
are using modules not published in package.elm-lang.org you might be doing one
of these:

* Adding the source folder of the external packages to your `source-directories`
array in `elm-package.json`
* Copying the source of the external packages to your project directory
* _... other ways ..._

But if you use native code (as in `import Native.xxx`) you might find difficult
to make it working between projects, mostly due to the namespace.

Also, Elm packages using native javascript code, effect or port modules cannot
be published on package.elm-lang.org using the normal procedures, it must pass a
[native review](https://github.com/elm-lang/package.elm-lang.org) and conform to
some guidelines.

Last but not least, you might not want (or _not allowed by management_) to
publish your modules publicly.

Instead of copying the code, or linking to it, it would be so much better if you
could have packages like the official ones and use in multiple projects. This
can be done manually modifying some files (like `elm-package.json`), but it
makes you unable to download or update official packages until you remove your
changes.

This tool may be able to help you in these cases.


## Usage

_Example project [elm-ext-package-example](https://github.com/aaronps/elm-ext-package-example)_

In your project, you must add the file `elm-ext-package.json` with a
dependencies field like the one in `elm-package.json`, example:

```json
{
    "dependencies": {
        "aaronps/elm-arraylist": "1.0.0 <= v < 2.0.0"
    }
}
```

You must copy or download the ext-packages to the folder
`elm-stuff/ext-packages` under your project, following the previous example, the
final location would be `elm-stuff/ext-packages/aaronps/elm-arraylist`.

Now you are almost ready, there are 2 things to do:

* Compiling your project with the ext-modules
* Downloading or updating elm packages from package.elm-lang.org


### Compiling with ext-modules

You need to activate, or apply the changes to the files, use:

```shell
$ elm-ext-package apply

elm-ext-package 0.1.5
Enabling Ext Packages
Copying aaronps/elm-arraylist version 1.0.0 to packages
```

Now you can work with the external modules, just use them like
they were standard ones (`import Some.Module`).


### Downloading standard packages

You need to deactivate on revert the changes done to the files, use:

```shell
$ elm-ext-package revert

elm-ext-package 0.1.5
Disabling Ext Packages
```

Now you can `elm-package install` the normal modules.


## Creating a package

Packages are created the same way as any Elm package or application is done,
there is no need to do anything special, just do it. 



## Missing functionality

- Downloading of packages: currently you must download or copy the packages
yourself, this might change in the future.

- Dependency checks: currently this tool is not checking any dependency, if the
packages depends on others (either standard packages or ext-packages) you must 
add the dependencies yourself, this might change in the future.

- Listing of ext-packages: there is no centralized location for the
ext-packages. You must either have it locally or at least know its repository
address, this might change in the future.


