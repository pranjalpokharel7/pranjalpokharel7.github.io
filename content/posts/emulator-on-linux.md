---
title: "Flutter Series : Emulate Like A Pro! (Part 2)"
date: 2021-08-15T21:20:09+05:45
draft: false 
tags: ["programming"]
description: "Memory <= 4GB ? Take A Hike!"
---

As you can guess from the description, emulators are in fact a "luxury" item only for soydevs with more memory on their PCs than subscribers to PewDiePie. Turns out, I am one of those and my laptop can handle me running an emulator and writing this on Emacs simultaneously. Peace peace - I say with a posed look.

On a side note, if your RAM isn't soldered and/or you have some extra slots, just get an upgrade dude. It doesn't cost much compared to how much headaches you need to go through on a 4GB ENIAC, flutter or not.

#### Step 1 : "Back to the rice fields"

We just planted our first flutter grain a while back and while it was "fun" playing with the counter app on Chrome, we will now bring out the 'heavy' guns. First, we re-open the ArchWiki page on Android and download that emulator package. Again, if you're on other distros, look up the specific installation, cause I'm not that dedicated to writing tech articles yet :).

Link - [Emulator Package (AUR)](https://aur.archlinux.org/packages/android-emulator/)

#### Step 2 : "From DVDs to AVDs, we all grew up"

The fundamental thing about emulators is that they only go as far as to emulate a specific hardware layout. You need some software to run over the emulated hardware. 

Think of Android Virtual Devices (AVDs) as something that contains configuration on how an Android device should run. A virtual android device, as the abbreviation says, over which you will be able to run your app. There are a lot of AVDs you can choose from, seeing that you have Android running on everywhere ranging from mobile devices to smart watches. 

If you completed the installation of `android-sdk` properly as a part of the previous article, you should have `sdkmanager` available from the command line (might need to log out or restart the system to have `sdkamanager` available after initial install.

```bash
$ sdkmanager --list
```

The above command will list out all the available android system-images from which you can create an AVD - you will download a system-image depending on the architecture you're working on.

```bash
# expected output
...
platforms;android-30
platforms;android-31 ... # Android SDK Platform
...
system-images;android-31;google_apis;arm64-v8a ...
system-images;android-31;google_apis;x86_64 ... # Google APIs Intel x86 Atom_64 System Image
system-images;android-31;google_apis_playstore;arm64-v8a ...
system-images;android-31;google_apis_playstore;x86_64 ... 
...
```

The number 31 is just the Android API version - newer the better, unless you are specific in not using the latest one. I am on an x86_64 architecture (i.e. my laptop) so I will download the latest system-image and SDK platform correspondingly.

```bash
$ sdkmanager "platforms;android-31" 
$ sdkmanager "system-images;android-31;google_apis;x86_64" 
```

Following this (and successful installation based on part 1), you should have `avdmanager` available from the command line - as the name suggests, we will be using this tool to manage our AVDs. 

```bash
$ avdmanager create avd -n myavdname -k "system-images;android-31;google_apis;x86_64"
```

The above command creates an AVD with the name 'myavdname'. Do not choose custom hardware profile for now, just go for default option. You can always edit the config files later if necessary.

Two links that will certainly be useful to you in the future -
- [skdmanger - official guide](https://developer.android.com/studio/command-line/sdkmanager)
- [avdmanager - official guide](https://developer.android.com/studio/command-line/avdmanager)

Hopefully this section hasn't been too lengthy. Next, we boot up our emulator. About damn time.


#### Step 3 : "You made it, you absolute madlad!"

On your console, type the following command - 

```bash
$ emulator -list-avds
```

If your newly created AVD pops up on the list, congratulations, it's your birthday today!

```bash
$ emulator -no-snapshot -avd myavdname 
```

The `-no-snapshot` command makes sure the emulator does not save state on exit i.e. your emulator will boot up as if your Android phone is on cold boot every time. Just my preference, you can remove this and your emulator should launch just fine. Refer to the official android developer article on [other command line options](https://developer.android.com/studio/run/emulator-commandline).

If you are having problems related to hardware acceleration, refer to [this article](https://developer.android.com/studio/run/emulator-acceleration). Reason I won't explain this over here is because I've never had problems with it, and better not take word from a developer who hasn't had a bug on the issue. Honestly, it wouldn't hurt to go through the emulator section on the linked website.

#### Step 4 : "Counting like a true soydev"

`cd` into your flutter project directory. Time to run your flutter app on the emulator. Start the emulator, and check if flutter has detected your emulator.

```bash
$ flutter devices
```

If it shows your shiny emulator, it's now time to run the counter app - 

```bash
$ flutter run
```

#### And watch the sunrise on a grateful universe... 

As with the previous article, some common bugs and/or errors are listed below, though not as much as on the side of quantity. Mention or DM me on Twitter to send your suggestions/query through, link is at the bottom of this website. 

Also, let me know if you want something more related to flutter, can be setting up editors for example. Honestly though, I am just tired and need some rest from this app development hangover.

#### Step stderr : Handling Some Common Errors/Bugs

Any future errors I might encounter, or possibly even help you to solve, will be posted here.

**1. "Navigation buttons on the emulator don't work"**

Honestly, I never got them to work. By default, the on-screen navigation buttons are hidden - I enabled them and used them as substitute. You'll need to modify some config files for this. Navigate inside your `~/.android` directory (usually located in the home page) and then `avd/[avd-name]` within which you should see the `config.ini` file. 

Full path might be something like, `~/.android/avd/myavdname/config.ini`. Inside the file, edit the line,

```
hw.keyboard = yes
```

to 

```
hw.keyboard = no
```

This should bring up your on-screen navigation keys. However, this can disable your keyboard to emulator input, and you'll have to press the touch screen keyboard manually. Well, let's just hope you are not working on a blogging app :eyes:.

You can go through other configuration parameters as well and change them as required.

**2. "Emulator shut down takes a lot of time, just says saving state and gets stuck there."**

Launch emulator with `-no-snapshot` option. I was getting pretty irritated by this and I stopped saving state once and for all. You can also try wiping the previously stored snapshots, simply pass in the `-wipe-data` parameter.

**3. "Installing system-image (sdkmanager) is stuck at x%"**

You can try downloading from the source directly, which is our little overlord called Google. 

https://dl.google.com/android/repository/sys-img/google_apis/x86_64-30_r10.zip - this link downloads the system-image for android-30 SDK, just replace the `x86_64-30` with the match from your `sdkmanger --list` output. 

Extract the downloaded zip to the `system-images` folder inside `/opt/android-sdk/` (assuming you installed from AUR there) and rename it appropriately. For instance, my final full path is - `/opt/android-sdk/system-images/android-30/google_apis/x86_64`.
