![base](https://raw.githubusercontent.com/automenta/bake/master/logo.jpg)
Bake
====

Bake is an adapter for the Apache 'ant' Java build tool which involves pure Javascript (already bundled with JDK6+).  There's no need for XML, a special scripting language, or DSL -- just some readable, declarative code in build.js.
Bake build scripts have access to all Ant tasks and all Java classes in the JDK.

This project has basic functionality working, but is still in proof of concept phase.  There are no tests around the code.  Windows environment is unsupported as yet.


Example
-------

The following is an example bake script (which can be found in the project at bake/examples/simple/build.js),

```
project = {

    compile: {
        description: "Compiles the Java sources",
        needed: { target: "target/classes", source: "src/main/java" },
        build: function() {
            mkdirs("target/classes");
            ant_helper.call_task(ant_imports.Javac, {
                    srcdir: ant_helper.create_path("src/main/java"),
                    destdir: new java.io.File("target/classes") });
        }
    },

    jar: {
        description: "Jars up the Java classes into the target directory",
        depends: [ "compile" ],
        needed: { target: "target/my-stuff.jar", source: "target/classes" },
        build: function() {
            ant_helper.call_task(ant_imports.Jar, {
                    destFile: new java.io.File("target/my-stuff.jar"),
                    basedir: new java.io.File("target/classes") } );
        }
    },

    clean: {
        description: "Deletes target directory",
        needed: function() { return new java.io.File("target").exists(); },
        build: function() { exec("rm -rf target"); }
    }

};
```

Important Files
-----

**build.js**
Where a project is defined.  replaces what would ordinarily be in build.xml with task definitions in pure Javascript

**bake**
Call this executable SH script with an argument to execute a task, or no arguments to list those available.

**build.xml**
Stub which proxies to 'bake' allowing 'ant' to function somewhat.  Good for tricking an IDE into thinking it's an empty ANT project.

**bake.js**
The Javascript 'ant' wrapper code.  Not for executing directly.


Getting Started
---------------

- git clone, or download and unzip bake.zip where you want it installed

- You may have to make the 'bake' script executable (eg. 'cd $BAKE_HOME/bin && chmod +x bake')

- Create a 'build.js' file in the root of your fancy new project

  - Create a 'project' variable inside the build.js file which is an object

  - Each attribute of the 'project' object will be taken as a build target

  - The following attributes are looked for on each target,
    - 'description': Not required. Description of the target, this is displayed in the target list.
    - 'depends': Not required. Names other targets in order that need to be run before this one.
    - 'needed': Not required. Used to determine if the target actually needs to be executed. Is either a function that returns true of false, or an object with 'target' and 'source' attributes. In the case of the latter, bake will decide if the task needs to be run based on the modified times of the files or directories named with the 'target' and 'source' attributes.
    - 'build': Required. A function containing the steps to build the target.


Built-in Features
-----------

The following utilities are available within your build script,

- Any classes loaded by the JVM. For example you can create a Java File object with 'var file = new java.io.File(".");'.  For more info on this stuff, have a look at the "Java Scripting Programmer's Guide" on the Java site (at the time of writing, at http://java.sun.com/javase/6/docs/technotes/guides/scripting/programmer_guide/index.html) and Mozilla's Rhino documentation (https://developer.mozilla.org/en/Rhino_documentation).

- Some nice utility functions which are included by 'jrunscript' including some very handy file system level commands like 'mkdirs()' and 'mv()'. These are also documented on the Java web site (at the time of writing, at http://java.sun.com/javase/7/docs/technotes/tools/share/jsdocs/index.html).

- All Ant classes. The common packages are included in a variable called 'ant_imports'. These are 'org.apache.tools.ant', 'org.apache.tools.ant.types' and 'org.apache.tools.ant.taskdefs'. When using Ant tasks, take a look at the task descriptions in the Ant manual (http://ant.apache.org/manual/index.html) and what Java types are expected in the API (http://www.jajakarta.org/ant/ant-1.6.1/docs/en/manual/api/index.html).

- Some helpers included with bake
    - 'ant_helper.call_task': Takes the task class at the first parameter. The second parameter is a list of attributes to set. An empty Ant 'Project' object is created in this method (this may need to change for complex builds).
    
    - 'ant_helper.create_path': Makes it possible to create an Ant 'Path' object on one line
    
