
version = "0.0.1";

project = {
    compile: {
        description: "Compile the Java sources",
        depends: {target: "target/classes", source: "src"},
        build: function () {
            mkdirs("target/classes");

            task(ant.Javac, {
                srcdir: path("src"),
                destdir: file("target/classes")});
        }
    },
    jar: {
        description: "Jar the Java classes into the target directory",
        depends: [
            "compile", 
            {target: "target/shavenmaven.jar", source: "target/classes"}
        ],
        build: function () {
            task(ant.Jar, {
                destFile: file("target/my-stuff.jar"),
                basedir: file("target/classes")});
        }
    },
    clean: {
        description: "Delete target directory",
        depends: function () {
            return file("target").exists();
        },
        build: function () {
            exec("rm -rf target");
        }
    }


};
