
project = {

	compile: {
	    description: "Compiles the Java sources",
	    depends: { target: "target/classes", source: "src/main/java" },
		build: function() {
            mkdirs("target/classes");
			task(ant.Javac, {
					srcdir: ant.create_path("src/main/java"),
					destdir: new java.io.File("target/classes") });
		}
	},

	jar: {
	    description: "Jars up the Java classes into the target directory",
		depends: [ "compile" ],
        depends: { target: "target/my-stuff.jar", source: "target/classes" },
		build: function() {
			task(ant.Jar, {
					destFile: new java.io.File("target/my-stuff.jar"),
					basedir: new java.io.File("target/classes") } );
		}
	},

	clean: {
		description: "Deletes target directory",
		depends: function() { return new java.io.File("target").exists(); },
		build: function() { exec("rm -rf target"); }
	}

};
