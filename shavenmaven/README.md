*This is a mirror and soon-to-be-fork of ShavenMaven, which is located at:*

https://code.google.com/p/shavenmaven/

What is it?
====


 - 99.9999999% smaller than Maven
 - 99.9999999% faster than Maven (even faster with Pack200 files)
 - No XML just URLs
 - No transitive dependencies
 - No confusion
 - No binaries need to be checked into version control
 - Even your mum would be proud

Example
=====

Create a text file with some dependencies in it. Lets call it build.dependencies
```
mvn:org.hamcrest:hamcrest-core:jar:1.2.1
mvn://repo.bodar.com/com.googlecode.totallylazy:totallylazy:pack|sources:1125
s3://repo.bodar.com/com.googlecode.yadic:yadic:jar:151
http://jarjar.googlecode.com/files/jarjar-1.1.jar
file:///home/dan/Project/foo.jar
# coment lines begin with hash
```
ShavenMaven uses an extended form of the BuildR mvn url. (This means when you use sites like http://mvnrepository.com/ you can click on the BuildR tab and just prefix it with "mvn:")

 1. The first line after the comment will download hamcrest-core jar
    from the central repository
    
 2. The second line will download totallylazy pack200 file (and unpack it to a jar) and sources from a custom repository repo.bodar.com.
 3. The third line will download 'yadic' jar from repo.bodar.com.s3.amazonaws.com'
 4. The fourth line will do a plain HTTP GET request to non mavenised jar.
 5. The last line will look for a local file called foo.jar

You can also specify an alternative default repo for mvn urls with 
```
-Dshavenmaven.default-repository=http://uk.maven.org/maven2/
```

Command line usage
=====

To download the jars, run the following:
```
java -jar shavenmaven.jar build.dependencies lib/build
```

Where lib/build is a directory where you want to download the jars to.


You can also update multiple dependencies files and directories at the same time by providing 2 directories:

```
java -jar shavenmaven.jar build lib
```

This will find all ".dependencies" files in "build" and create a directory with a matching name in "lib" so:

```
build
build.dependencies
runtime.dependencies
optional.dependencies
```

Would create the following structure:

```
lib
build
runtime
optional
```

ANT usage
======

To make life easy in ANT, ShavenMaven provides a macro file. Obviously ANT is primarily XML based but it's all just syntactic sugar over the command line interface.

Importing this macro file will allow you to install ShavenMaven with a single line:

```
<install version="37"/>
```

You can then update a directory just like in the command line version

```
<update dependencies="build.dependencies" directory="lib/build"/>
```

or to do multiple files and directories in one go

```
<update dependencies="build" directory="lib"/>
```

Generating Maven 'pom.xml'
====
You can also generate a maven pom from the dependencies file with something like:

```
<generate.pom artifact.uri="mvn:${groupid}:${artifactid}:jar:${version}"
 dependencies="lib/runtime.dependencies" directory="${artifacts}"/>
```


----------


*To see all of this put together. open ShavenMaven's own build file.*
