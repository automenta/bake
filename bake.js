//This file is not meant to be called directly.  Use the 'bake' script.

var bake_home = "."; //arguments[0];


var prefix = "[bake] ";


var ant = new JavaImporter(
        org.apache.tools.ant,
        org.apache.tools.ant.types,
        org.apache.tools.ant.taskdefs);

function task(taskClass, properties) {
    var antTask = new taskClass;
    for (var property in properties) {
        var methodName = "set" + property.substr(0, 1).toUpperCase() + property.substr(1);
        var value = properties[property];
        antTask[methodName](value);
    }
    antTask.setProject(new ant.Project());
    antTask.execute();
};

function path(pathString) {
    var path = new ant.Path(new ant.Project());
    path.setLocation(file(pathString));
    return path;
}
function file(fileString) {
    return new java.io.File(fileString);
}

bake = {
    print_targets: function () {
        println(prefix + "Goals:");
        for (i in project) {
            var line = "\t" + i;
            if (project[i].description) {
                line += "\t\t" + project[i].description;
            }
            println(line);
        }
    },
    run_task: function (task_name) {
        var task = project[task_name];

        if (!task) {
            println("Task '" + task_name + "' does not exist");
            new java.lang.Exception().printStackTrace();
            exit(1);
        }

        if (task.depends) {
            println(prefix + "Ensuring '" + task_name + "' dependencies");
            if (!Array.isArray(task.depends))
                task.depends = [ task.depends ];
            
            for (i in task.depends) {
                var dependentTarget = task.depends[i];
                if (typeof dependentTarget === "string")
                    bake.run_task(dependentTarget);
            }
        }

        if (bake.check_if_depends(task)) {
            println(prefix + "Running: '" + task_name + "'");
            task.build();
        }
        else {
            println(prefix + "'" + task_name + "' not necessary");
        }
    },
    check_if_depends: function (task) {
        if (!task.depends) {
            return true;
        }
        
        var deps = task.depends;
        if (!Array.isArray(deps)) {
            deps = [ deps ]; 
        }
        
        for (var i = 0; i < deps.length; i++) {

            var dep = deps[i];
            var depType = typeof dep;
            
            if (depType === "string") continue;
            
            else if (depType === 'function') {
                if (dep()) {
                    return true;
                }
            }
            else if (depType === "object") {

                if (!dep.target || !dep.source) {
                    println(prefix + "Error: 'depends' element requires 'target' and 'source' properties if not a function:");
                    println("\t" + JSON.stringify(dep));
                    exit(1);
                }

                var targetFile = file(dep.target);
                var sourceFile = file(dep.source);

                if (!targetFile.exists()) {
                    return true;
                }

                if (!sourceFile.exists()) {
                    println(prefix + "Error: target's source doesn't exist (" + dep.source + ")");
                    exit(1);
                }

                var targetTime = targetFile.isDirectory() ? bake.oldest_file_time(dep.target) : targetFile.lastModified();
                var sourceTime = sourceFile.isDirectory() ? bake.newest_file_time(dep.source) : sourceFile.lastModified();

                return sourceTime > targetTime;
            }
        }
        return false;
    },
    newest_file_time: function (start_dir) {
        var newest = 0;
        find(start_dir, /.*/, function (class_file) {
            var modified = file(class_file).lastModified();
            if (modified > newest) {
                newest = modified;
            }
        });
        return newest;
    },
    oldest_file_time: function (start_dir) {
        var oldest = null;
        find(start_dir, /.*/, function (class_file) {
            var modified = file(class_file).lastModified();
            if (oldest === null) {
                oldest = modified;
            }
            else if (modified < oldest) {
                oldest = modified;
            }
        });
        return oldest;
    }

};



// parse build file
try {
    load("build.js");
}
catch (e if e.javaException instanceof javax.script.ScriptException) {
    println(prefix + "There was an error parsing your build file: " + e);
    exit(1);
}
catch (e) {
    println(prefix + "Couldn't load 'build.js' in the current directory");
    // TODO: "...do you want me to create one?"
    exit(1);
}


// print targets if there are no args
if (arguments.length < 1) {
    bake.print_targets();
    exit(0);
}

// run target
bake.run_task(arguments[0]);

println(prefix + "Finished.");

