---
title: "Flutter Series : Flutter Like A Butterfly... (Part 1)"
date: 2021-08-04T11:20:09+05:45
draft: false 
tags: ["programming", "flutter"]
description: "...Sudo Like A Linux Chump!"
---

Yet another poorly written article about Flutter setup on Linux. As the big brain monkey I am, I installed it on my machine about 4 weeks prior and so, due to reasons I did not document my steps then, I don't have screenshots to explain things more visually. The length of this article does not correlate to productive learning - feel free to skip certain sections then bash me about it on Twitter later.

Welcome to the rice fields [redacted]!

#### Step 1 : "I am simply too chad to read the official docs"

Easiest way is to simply git clone the flutter repository then setup the path. Why not download the tarball over git? This way any new release-police catches up, you can `git pull` over without a worry.

```bash
$ git clone https://github.com/flutter/flutter.git -b stable
```

We will clone the stable branch (omit everything after the `-b` branch if living on the edge is your thing). Wherever you clone it, the next step is to update the $PATH variable in your shell config file. 

Don't know how to do that? In your home directory `~/`, you should have a config file named `.bashrc` (bash) or `.zshrc` (zsh) or something else depending upon the shell you use. Simply open the file and add the following lines -

```bash
# inside .bashrc
export FLUTTER_HOME=~/flutter
export PATH=$FLUTTER_HOME/bin:$PATH
```

`FLUTTER_HOME` is the location to where you git cloned the flutter repo previously (mine is in the home directory). An experienced eye will notice that the PATH we provide is not the actual flutter directory, but the `bin` directory INSIDE the root `flutter` directory.

Confused about the mumbo-jumbo regarding $PATH variable? This person here explains it in a single minute read - https://linuxconfig.org/linux-path-environment-variable/

#### Step 2 : "Call a doctor...but not for me!"

If you've completed the first step, the following command should execute without the `flutter: command not found` error - 

```bash
$ flutter doctor
```

It will probably show you are missing the Android SDK and Android Studio (I'm assuming those are the flags that pop up). We will not touch that RAM gobbling monstrosity called Android Studio, but we will download the Android SDK which is super necessary.

#### Step 3: "Cool uncle Java"

If you have had any experience coding in Java before, this step should be over in a flash. If not, it should still be over in a flash. Linux makes things easier - just install the Java Development Kit (JDK minimum version 8). 
```bash
# command for arch based distros
$ pacman -Ss openjdk
```
The above command should fetch you a list of openjdk versions you can choose to install from. Any distro you use, finding openjdk for your system should be pretty easy from the official repositories (customary bow to Gentoo users).

**Note**: Some legacy flutter projects might not work on the latest jdk-16. If you encounter some weird error during the latter steps, make sure the jdk version is compatible with your project (openjdk-8 is always the safest bet). 

#### Step 4 : "Hey, are we all using Arch or what?"

The steps should not be that different if you are not on an Arch-based distro, just that you will have to install it from source or go the Android Studio route. Updates on this will arrive as soon as I move onto a Debian machine, which might never happen, just saying...

First things first - you will need the `android-tools` package that contains adb (android debug bridge), fastboot and some other tools, that will be useful if you plan not to use an emulator but a connected Android device for development. This should be available on the official repo - 
```bash
$ sudo pacman -S android-tools
```

Next, you will need to download the following four packages from the AUR - 
1. Command Line Tools ([android-sdk-cmdline-tools-latest](https://aur.archlinux.org/packages/android-sdk-cmdline-tools-latest/))
2. SDK Build-Tools ([android-sdk-build-tools](https://aur.archlinux.org/packages/android-sdk-build-tools/))
3. SDK Platform-Tools ([android-sdk-platform-tools](https://aur.archlinux.org/packages/android-sdk-platform-tools/))
4. SDK Platform ([android-platform](https://aur.archlinux.org/packages/android-platform/))

Whatever I write here is a shameless copy of the following link - https://wiki.archlinux.org/title/Android#SDK_packages. Credit where credit's due, ArchWiki is a Godsend. 

You can also install the [emulator](https://aur.archlinux.org/packages/android-emulator/) package, but configuring the emulator without Android Studio is a bit contrived (docs don't help), and I have had quite a miserable experience with it. Will save that for a future post.

#### Step 5 : "Reading licenses? We don't do that here!"

If you've successfully completed step 4, now's the time to accept some completely "innocuous" licenses. 
```bash
$ sudo flutter doctor --android-licenses
```
Notice the `sudo` access which is required. Flutter docs mention using an "elevated console", which is pretty easy to miss. Wasted an hour spamming this command and re-accepting android licenses without realizing I simply needed an "elevated console".

If you run `flutter doctor` now, the only warning you should get is `Android Studio missing` which is optional either way.

#### Step 6 : "Ahh shit, here we 'Hello World' again..."

Flutter docs have this part after setting up your editor. But I beg to differ - editors are secondary and running your first 'hello world' app comes first.

You will need one of three things to run your first app - an Android device connected with **USB debugging enabled**, a running Android emulator or a Chrome browser (flutter's default app runs on the web too) - simply because android apps do not run out of the box on your desktop Linux machine. To see the devices that are available to run your app - 
```bash
$ flutter devices
```

If it says `N devices connected` (N being a number) and lists the available devices, you are good to go. I will go into more details about setting up the emulator in future posts, since this post is already too long at this point. For now, go for Chrome, we are only looking to verify flutter setup anyway.

To set up the default flutter project, run the command -
```bash
# our-app is the name of the folder where we setup the project
$ flutter create our-app
$ cd our-app
```

This will create a folder with the project directory setup from the get-go. `cd` into the folder. Next, we will need to install flutter packages and then run the app, which can be done in a single step as, 
```bash
# requires internet connection
$ flutter run
```
First it will download all the packages (which is `flutter pub get` or `flutter install` if you run separately) into a system cache folder for use. If you have ever used the python package manager `pip` outside of the virtual environment, this process is similar to that. Which means if two projects share the same dependency and version, one install should work for both.

Wait for `assembleDebug` to complete. Basically this installs Gradle and then builds the app for use. First build can take a long time to complete, patience among Flutter devs is highly underrated. Once this process is complete, the default counter app should launch on your Chrome browser.

#### That's it folks!

Below this I have listed some errors I had to encounter during this process which might be common to you. I still left out a lot of things to cover, select few being setting up editors, configuring emulator, setting up Google sign-in for emulator, more command line usage in the absence of Android Studio and more. 

I have named this article Part 1 so that my future-self will not come up with excuses to not cover these areas. Hope we stay alive until then.

#### Step stderr : Handling Some Common Errors/Bugs

Any future errors I might encounter or possibly even help you to solve will be posted here.

**1. "assembleDebug fails because it does not have permission to write in the android-sdk directory"**

When you install packages from the AUR, by default it is stored in the `/opt/` directory. Usually, the files within this directory can only be modified with root access, hence the permission denied error. You can do one of the following things:

- Run `sudo flutter run` to bypass the permission restrictions. Even flutter itself tells you this is a **bad practice**, don't be me and spend your time cleaning up multiple root spawned process (more on that later).
- Move the `android-sdk` directory to someplace else where permissions are not an issue. You will need to update the $PATH variable for this one though, which was not the case for `/opt` directory.
- Use `chown` to modify user permissions to allow read/write access for normal users. This is what I did, just marking individual files that were causing the permission errors and chowning 777. 
- ArchWiki recommends creating new user and with permissions for that specific user to read/write into android-sdk folder (check the link I posted above under section 4 of installing SDK packages).

**2. "Do I always need to be online to run my app?"**

Nope, but you will need it for the first build and downloading packages that haven't been previously installed.

**3. "module java.base does not "opens java.io" to unnamed module"**

Refer to my note on newer versions of openjdk probably not supporting legacy code. The stackoverflow solution also seems to suggest the same thing - https://stackoverflow.com/questions/67782975/how-to-fix-the-module-java-base-does-not-opens-java-io-to-unnamed-module

**4. "I installed Google Chrome as a flatpak package, but it acts "wierd" when I run flutter"**

Apparently flatpak Chrome doesn't gel too well with flutter. Thanks to @badnick for pointing it our on Discord. Install from AUR from this one, might fix the issue. Anyway, unless you are programming for browser apps you might not need Chrome beyond this initial testing. So don't be too riled up by this one.

**5. "I close flutter but my computer seems to be getting slow every time I do so. What's happening?"**

Did you 'sudo flutter run'? Chances are the OS is not able to free up the resources because you ran flutter as root. Quick check with `htop` or `top` to verify. See if there are multiple `dart` processes still running even after you've closed flutter and `killall dart`. Sometimes this problem also persists when you close vscode even though you did not do anything `sudo` with it, I'm guessing it's got something to do with how the dart intellisense works, but it's just speculation on my part.
