//Example
project = {

	compile: {
	    description: "Compiles the Java sources",
	    depends: { target: "target/classes", source: "src/main/java" },
		build: function() {
            mkdirs("target/classes");
			task(ant.Javac, {
					srcdir: path("src/main/java"),
					destdir: file("target/classes") });
		}
	},

	jar: {
	    description: "Jars up the Java classes into the target directory",
		depends: [ "compile" ],
        depends: { target: "target/my-stuff.jar", source: "target/classes" },
		build: function() {
			task(ant.Jar, {
					destFile: file("target/my-stuff.jar"),
					basedir: file("target/classes") } );
		}
	}

};
