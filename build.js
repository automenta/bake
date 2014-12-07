//This is bake's own packaging build script which simply creates a .zip file of the project.

version = "0.0.1";
zip_file_name = "bake_v" + version + ".zip";

project = {
    zip: {
        description: "Zip all this stuff up into bake.zip",
        depends: {target: zip_file_name, source: "."},
        build: function () {
            rm(zip_file_name);
            // TODO: doesn't keep executable flag on 'bake' script
            task(ant.Zip, {
                destFile: file(zip_file_name),
                basedir: file(".."),
                includes: "bake/**",
                excludes: "bake/.git/**"
            });
            println("(Re-)created: " + zip_file_name);
        }
    }

};
