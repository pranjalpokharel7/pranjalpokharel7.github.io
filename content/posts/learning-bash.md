---
title: "Learning Bash Scripting"
date: 2021-03-08T23:36:14+05:45
draft: false
tags: ["programming"]
description: "Well Sort Of..."
---
While I have been using Linux for over 2 years now, frankly I had 
never thought about automating tasks using simple bash scripts. This
means that while I did not know about bash scripting from a syntactical
point of view, I was very comfortable using the command line and it's
various commands.\
\
And so my ~~journey~~ misadventures with bash scripting started with an idea, as always.
#### 1) Idea!
Need to switch to light theme on vim...wait! Do I manually edit my config file every time? Time to write my first bash script.
#### 2) Overview
I needed to start from the basics. Web search + Reddit later I landed on a website ‘learn-x-in-y-minutes’. 4 hrs to understand basic syntax while executing some code snippets.
#### 3) Implementation?
Fundamentally, the script would have to edit the vimrc file – 
```
set background=dark → set background=light
```
`sed` command for the rewriting job. 
I opened up the man page on `date` command and found that using format specifiers returned time in integer.
```bash
CURRENT_TIME=$(date +%H%M%S)
if [ "$CURRENT_TIME" -gt "$STARTING_TIME" ] && [ "$CURRENT_TIME" -lt "$END_TIME" ]
then
  sed -i "s/set\\ background=$LIGHT_THEME/set\\ background=$DARK_THEME/" ~/.vimrc
else
  sed -i "s/set\\ background=$DARK_THEME/set\\ background=$LIGHT_THEME/" ~/.vimrc
fi
  ```
Debugging! END_TIME less than STARTING_TIME. A swap function should account for that. 

#### 4) Issues!
Why is a file with name ‘180000’ created every time I execute the script? And why is my downloads folder so cluttered? Need a file organizing script…
#### 5) One day and `awk` later
Need a list of extensions in a directory. Kind stranger on StackOverflow, how do I  understand this insane syntax?
```bash
find . -type f | awk -F. '!a[$NF]++{print $NF}’
```
WHAT IS AWK? Okay, just need to go through the GNU manual...arrays in `awk` are super WEIRD! How about I use`sort`…
```bash
find . -maxdepth 1 -type f  |  awk -F . '{print $NF}' |  sort -u
```
My own solution that I UNDERSTAND! `mv`+ regex should finish the work.
#### 6) Send 100MB file over Facebook?
Honestly, I could have provided a drive link and be done. But something in me got excited over somehow bypassing the upload limit of 25 MB. Time to work.
#### 7) Split it!
In a GitHub repository I found the usage of `split` - so, I CAN SPLIT FILES into pieces without losing data.
Recombination? `cat` command to the rescue. I love Unix forums.
```bash
split --bytes=$CHUNK_SIZE --additional-suffix=$SPLIT_FILE_EXTENSION -d $FILENAME $PREFIX
```
#### 8) JUST ENCRYPT IT!	
It would be useful if I could implement something from Cryptography I course on Coursera  that I took. In a sense, I’d learn two things simultaneously.
Referred YouTube on openssl, went through the man page and added in some flags of my own:
```
openssl enc -aes-256-cbc -base64 -pbkdf2 -iter 100000 -pass pass:$PASSWORD -in $file -out fenc/$file
```
#### 9) Finally…?
IT WORKED! 100 MB pdf sent over Facebook, in chunks of 24 MB, with the decryption working on the other end just as I wanted!\
\
Wait, why are files of name ‘180000’ scattered around my storage? Oh no, forgot to turn off the buggy script...
#### References:
- **Learn x in y minutes:** https://learnxinyminutes.com/docs/bash/ 
- **Awk to get a list of file extensions:** https://stackoverflow.com/questions/1842254/how-can-i-find-all-of-the-distinct-file-extensions-in-a-folder-hierarchy
- **GNU Awk User’s Guide:** https://www.gnu.org/software/gawk/manual/gawk.html
- **Useful GitHub Repository:** https://github.com/jlevy/the-art-of-command-line
- **Split Command Usage:** https://unix.stackexchange.com/questions/24630/whats-the-best-way-to-join-files-again-after-splitting-them 
- **OpenSSL YouTube Video:** https://www.youtube.com/watch?v=-nEh7X4dtuw&t=196s 
- **‘Cryptography I’ on Coursera:** https://www.coursera.org/learn/crypto
- **Advanced Bash Scripting Guide:** https://tldp.org/LDP/abs/html/
- **Common Bash Pitfalls:** http://mywiki.wooledge.org/BashPitfalls
