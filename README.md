# video-sum

Command line app for summing lengths of all video files in specific directories.
App is given list of directories, which it traverse through to find all video files.
It then sums their lengths together and print total time.

## Installation

App is written in [node.js](https://nodejs.org/en/), therefore you must install it.
You also must have **node** and **npm** executables on the **PATH**.

Clone this repository:

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

## Usage

It uses [ffmpeg](http://www.ffmpeg.org/) for opening and reading metadata from video files. 
Therefore both **ffmpeg** and **ffprobe** must be installed and on the **PATH**.

## Running

To print all command line options run:

```sh
node dist/vide-sum
```

or 

```sh
node dist/vide-sum --help
```
## Examples

### Default output

If you specify for example two directories with 12 files by using *--dir* option, you will get this kind of output

```sh
node dist/vide-sum --dir '/path/to/directory/videos1' '/path/to/directory/videos2'

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

## License

MIT