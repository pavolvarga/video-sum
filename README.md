# video-sum

Command line app for summing lengths of all video files in specific directories.
App is given list of directories, which it traverse through to find all video files.
It then sums their lengths together and print total time.

# Usage

You can install and run the application directly on your computer.
Or you can use docker and use an existing image.

## Direct usage

App is written in [node.js](https://nodejs.org/en/), therefore you must install it.
You also must have **node** and **npm** executables on the **PATH**.
It uses [ffmpeg](http://www.ffmpeg.org/) for opening and reading metadata from video files.
Therefore both **ffmpeg** and **ffprobe** must be installed and on the **PATH**.

### Installation

```sh
git clone https://github.com/pavolvarga/video-sum.git
```

Go to the directory:

```sh
cd video-sum
```

Install dependencies:

```sh
npm install
```

Build:

```sh
npm run build
```

### Running

To print all command line options run:

```sh
node dist/video-sum
```

or

```sh
node dist/video-sum --help
```

### Examples

**Specify input directories on command line**</br>
If you specify for example two directories with 12 files by using *--dir* option, you will get this kind of output:

```sh
node dist/video-sum --dir /path/to/directory/videos1 /path/to/directory/videos2

/path/to/directory/videos1
        - files count: 10
        - errorFiles count: 0
        - total time: 0y 0m 0w 0d 10h 10m 45s
/path/to/directory/videos2
        - files count: 2
        - errorFiles count: 0
        - total time: 0y 0m 0w 0d 1h 39m 5s
Total
        - files count: 12
        - errorFiles count: 0
        - total time: 0y 0m 0w 0d 11h 49m 50s
```

**Specify input directories in input file**<br></br>
If you specify a file (named *list* in the example) with paths to directories (for example same paths as above), you will get same output:

```sh
node dist/video-sum -l list

/path/to/directory/videos1
        - files count: 10
        - errorFiles count: 0
        - total time: 0y 0m 0w 0d 10h 10m 45s
/path/to/directory/videos2
        - files count: 2
        - errorFiles count: 0
        - total time: 0y 0m 0w 0d 1h 39m 5s
Total
        - files count: 12
        - errorFiles count: 0
        - total time: 0y 0m 0w 0d 11h 49m 50s
```

## Usage via docker

You must have installed docker. On how to install docker check its [installation documentation](https://docs.docker.com/engine/installation/).

### Installation

Pull the latest image from the docker hub:

```sh
docker pull pavolvarga1024/video-sum
```

Tag the image so that you don't have use full name *pavolvarga1024/video-sum*. This step is optional.</br>
If you prefer using full name, then skip this step and replace *video-sum* with *pavolvarga1024/video-sum* in following commands.

```sh
docker image tag pavolvarga1024/video-sum:latest video-sum:latest
```

### Running

To print all command line options just create container from the image.
Application is started automatically.

```sh
docker container run video-sum
```

or

```
docker container run video-sum --help
```

### Examples

Because the video-sum is reading directories on host's filesystem, you must use docker [volume](https://docs.docker.com/engine/tutorials/dockervolumes/) to allow
access to them.

**Specify input directories on command line**</br>
If you specify for example two directories with 12 files by using *--dir* option, you will get this kind of output:

```sh
docker container run \
    -v /path/to/directory/videos1:/videos1 \
    -v /path/to/directory/videos2:/videos2 \
    video-sum --dir /videos1 /videos2

/videos1
        - files count: 10
        - errorFiles count: 0
        - total time: 0y 0m 0w 0d 10h 10m 45s
/videos2
        - files count: 2
        - errorFiles count: 0
        - total time: 0y 0m 0w 0d 1h 39m 5s
Total
        - files count: 12
        - errorFiles count: 0
        - total time: 0y 0m 0w 0d 11h 49m 50s
```

You must mount each directory video-sum is supposed to access.

**Specify input directories through input file**</br>
If you specify a file (named *list* in the example) with paths to directories (for example same paths as above), you will get same output:

```sh
docker container run \
    -v $(pwd)/list \
    -v /path/to/directory/videos1:/videos1 \
    -v /path/to/directory/videos2:/videos2 \
    video-sum --dir /videos1 /videos2

/videos1
        - files count: 10
        - errorFiles count: 0
        - total time: 0y 0m 0w 0d 10h 10m 45s
/videos2
        - files count: 2
        - errorFiles count: 0
        - total time: 0y 0m 0w 0d 1h 39m 5s
Total
        - files count: 12
        - errorFiles count: 0
        - total time: 0y 0m 0w 0d 11h 49m 50s
```

You must mount the input file and each directory it references.

# License

MIT