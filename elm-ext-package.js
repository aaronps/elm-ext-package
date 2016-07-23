#!/usr/bin/env node

var fs = require('fs-extra');
var path = require('path');

console.log("elm-ext-package 0.1.4");

if (process.argv.length > 2) {
    switch (process.argv[2]) {
        case "apply": enableExtPackages(); break;
        case "revert": disableExtPackages(); break;
        default: console.log("Don't know what is " + process.argv[2]);
    }
} else {
	console.log("Available commands: apply | revert");
}
return;

function loadJSon(name) {
    if (!fs.existsSync(name))
        return null;

    return JSON.parse(fs.readFileSync(name, "utf8"));
}

function readConfig() {
    if (!fs.existsSync("elm-ext-package.json"))
        return null;

    return JSON.parse(fs.readFileSync("elm-ext-package.json"));
}

function enableExtPackages() {
    console.log("Enabling Ext Packages");
    var elmPackage = fs.readJsonSync("elm-package.json",{throws:false});
    var extPackage = fs.readJsonSync("elm-ext-package.json",{throws:false});
    var exactDependencies = fs.readJsonSync("elm-stuff/exact-dependencies.json",{throws:false});

    if ( elmPackage === null ) {
        console.log("Can't load elm-package.json, bye");
        process.exit(1);
    }
    
    if ( extPackage === null ) {
        console.log("Can't load elm-ext-package.json, nothing to do, bye");
        process.exit(1);
    }

    if ( exactDependencies === null ) {
        console.log("Can't load elm-stuff/exact-dependencies.json, maybe you didn't init the project, bye");
        process.exit(1);
    }

    var ext_dependencies = extPackage.dependencies;
    var dependencies = elmPackage.dependencies;

    for ( var k in ext_dependencies ) {
        if ( ext_dependencies.hasOwnProperty(k) ) {
            var extJson = fs.readJsonSync('elm-stuff/ext-packages/' + k + '/elm-package.json', {throws: false});
            if ( extJson === null ) {
                console.log("Package '" + k + "' problem: Cannot load it's elm-package.json file");
                process.exit(1);
            }

            deletePackageDir(k);
            copyExtPackage(k, extJson.version);

            dependencies[k] = ext_dependencies[k];
            exactDependencies[k] = extJson.version;
        }
    }

    // save the modified json files

    fs.writeJsonSync("elm-stuff/exact-dependencies.json", exactDependencies, null, 4);
    fs.writeJsonSync("elm-package.json", elmPackage, null, 4);

}

function deletePackageDir(package_name) {
    var package_dir = 'elm-stuff/packages/' + package_name;
    if ( fs.existsSync(package_dir) ) {
        fs.removeSync(package_dir);
    }

    var package_parent = path.dirname(package_dir);

    if ( fs.existsSync(package_parent) ) {
        if ( fs.readdirSync(package_parent).length === 0 ) {
            fs.rmdirSync(package_parent);
        }
    }
}

function copyExtPackage(package_name, version) {
    var src = 'elm-stuff/ext-packages/' + package_name;
    if ( ! fs.existsSync(src) ) {
        console.log("Cannot copy package '" + package_name + "' because source directoy doesn't exists");
        return false;
    }

    var dst = 'elm-stuff/packages/' + package_name + '/' + version;

    console.log("Copying " + package_name + " version " + version + " to packages");
    fs.copySync(src,dst);
}

function disableExtPackages() {
    console.log("Disabling Ext Packages");
    var elmPackage = fs.readJsonSync("elm-package.json",{throws:false});
    var extPackage = fs.readJsonSync("elm-ext-package.json",{throws:false});
    var exactDependencies = fs.readJsonSync("elm-stuff/exact-dependencies.json",{throws:false});

    if ( elmPackage === null ) {
        console.log("Can't load elm-package.json, bye");
        process.exit(1);
    }
    
    if ( extPackage === null ) {
        console.log("Can't load elm-ext-package.json, nothing to do, bye");
        process.exit(1);
    }

    if ( exactDependencies === null ) {
        console.log("Can't load elm-stuff/exact-dependencies.json, maybe you didn't init the project, bye");
        process.exit(1);
    }

    var ext_dependencies = extPackage.dependencies;
    var dependencies = elmPackage.dependencies;

    for ( var k in ext_dependencies ) {
        if ( ext_dependencies.hasOwnProperty(k) ) {
            deletePackageDir(k);

            delete dependencies[k]
            delete exactDependencies[k]
        }
    }

    // save the modified json files

    fs.writeJsonSync("elm-stuff/exact-dependencies.json", exactDependencies, null, 4);
    fs.writeJsonSync("elm-package.json", elmPackage, null, 4);


}
