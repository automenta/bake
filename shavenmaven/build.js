
var projectName = "shavenmaven";
var releaseVersion = "dev.build";

var baseDir = ".";

var srcPath = baseDir + "/src";
var testPath = baseDir + "/test";

//    <property name="build" value="${basedir}/build"/>
var buildPath = baseDir + "/build/";
//    <property name="artifacts" value="${build}/artifacts"/>
var artifactsPath = buildPath + "/artifacts";
//    <property name="reports" value="${artifacts}/reports"/>
//    <property name="src" value="${basedir}/src"/>
var buildClassesPath = buildPath + "/classes";
//    <property name="test" value="${basedir}/test"/>
//    <property name="release.version" value="${build.number}"/>
//    <property name="release.name" value="${ant.project.name}-${release.version}"/>
var releaseName = projectName + "-" + releaseVersion;
//    <property name="release.jar" value="${release.name}.jar"/>
var releaseJar = releaseName + ".jar";
//    <property name="release.dep" value="${release.name}-dep.jar"/>
//    <property name="release.pom" value="${release.name}.pom"/>
//    <property name="release.src" value="${release.name}-sources.jar"/>
//    <property name="release.jar.path" value="${artifacts}/${release.jar}"/>
var releaseJarPath = artifactsPath + "/" + releaseJar;
//    <property name="release.dep.path" value="${artifacts}/${release.dep}"/>
//    <property name="test.jar.path" value="${artifacts}/${release.name}.test.jar"/>
//    <property name="build.dependencies.dir" value="lib/build"/>
//    <property name="runtime.dependencies.dir" value="lib/runtime"/>


project = {
    compile: {
        description: "Compile the Java sources",
        depends: {target: buildClassesPath, source: srcPath},
        build: function () {
            mkdirs(buildClassesPath);

            task(ant.Javac, {
                srcdir: path(srcPath),
                destdir: file(buildClassesPath)});
        }
    },
    jar: {
        description: "Jar the Java classes into the target directory",
        depends: [
            "compile", 
            {target: releaseJarPath, source: buildClassesPath}
        ],
        build: function () {
            task(ant.Jar, {
                destFile: releaseJarPath,
                basedir: file(buildClassesPath)});
        }
    },
    clean: {
        description: "Delete target directory",
        depends: function () {
            return file(artifactsPath).exists();
        },
        build: function () {
            exec("rm -rf " + artifactsPath);
        }
    }


};
