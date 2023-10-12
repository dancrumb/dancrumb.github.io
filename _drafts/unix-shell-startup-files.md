---
layout: post
type: post
comments: true
categories:
 - Engineering
tags:
 - Unix
---
If you've been using a Unix-based system for a while now, you're no doubt familiar with a number of files that you sometimes have to update when you install something. Files like `~/.profile`, `~/.zshrc`, or `~/.bash_profile` may ring a bell.

If you've ever wondered what the difference between these files are, how and why they are called and which you should use and why, this is the post for you.

## Shells

A shell is a program that provided an interface for humans to talk to their operating system.

In addition, we often refer to a specific invocation of a shell program as a shell. However, this generally doesn't cause any significant confusion.

 - UI
   - A shell program can be a CLI (and, to be honest, when people talk about shells, this is usually what they mean)
   - A shell program can also be a GUI
 - Interactivity
   - An interactive shell is a form of invocation that involves a real human is actually using: typing commands, clicking icons, etc
   - A non-interactive shell is a form of invocation that does not involve any human interaction. 
 - Login
   - A login shell is what is invoked when you log in to a system; it's what handles commands when you SSH into a server or when you first log into Unix-based local computer
   - A non-login shell is what is invoked after you're already logged in. This could be an instance of iTerm on macOS, or could just be a shell invoked from a currently opened terminal

These three characteristics are independent of one another, so you could have an "interactive, login GUI shell", or a "non-interactive, non-login CLI shell".


## A brief history of Unix shells

The first CLI shell was called Multics, created in the mid-1960s by Glenda Schroeder at MIT (she also co-conceived the first e-mail system).

The first *Unix* shell was the Thompson shell, `sh`, which was created in 1971 and was modelled after Multics. This `sh`, however, is not the one you may have seen.

In 1979, the Bourne shell came out, also called `sh`. Around about the same time, the C shell was also released `csh`. These two shells (and their derivatives) are by far the most common shells you'll see.

Below, you can see the ancestry of these shells. For the rest of this post, I'll be focussing on `sh` and its descendants.

<img src="/assets/shell-ancestry.png" alt="Image showing the ancestry of common Unix shells" style="max-width: 400px; margin: 20px auto; display: block"/>

## Bourne-compatible shells

The Bourne-compatible shells share many common features. Unfortunately, is this commonality that can cause confusion, since it's easy to fall into the habit of thinking that they are the same. As a result, it can get confusing when things behave differently as you move between different shells and different invocations.

We'll look at the following shells:

 - Bourne Shell: `sh`
 - Korn Shell: `ksh`
 - Bourne Again Shell: `bash`
 - Z Shell: `zsh`

### A brief note on `sh`

The original Bourne Shell was a command called `sh`. In many modern Unix systems, the `sh` command could be a Bourne Shell or it could just as easily be a symlink to one of the other shells. When other shells are invoked via `sh`, they will often modify their start-up behavior to follow the Bourne Shell process.

### A brief note on `zsh`

The Z Shell was created as extended Bourne Shell that includes features of `bash` and `ksh`. As you'll see below, it has it's own particular set of configuration files and startup procedure. We'll go over how best to handle this later on.

## Shell configuration files

There are over a dozen different files that might be used when a shell starts up to control its behavior. Generally, they fall into four different types.

- Profile files:
  - `/etc/profile` and `/etc/zprofile`
  - `~/.profile`, `~/.bash_profile`, `~/.bash_login`, and `~/.zprofile`
- rc files:
  - `/etc/bash.bashrc`, `/etc/ksh.kshrc`, and `/etc/zshrc`
  - `~/.bashrc`, `~/.kshrc`, and `~/.zshrc`
- Configuration variables
  - `$ENV` and `$BASH_ENV`
- Z Shell specifics
  - `/etc/zshenv` and `~/.zshenv`
  - `/etc/zlogin` and `~/.zlogin`

### `/etc/...` vs `~/....`

Files that are in the `/etc` directory are run for everybody. As such, they should be limited to configuring things that affect all users.

Files that are in a user's home directory `~/` are specific to that user. You can use those to tailor your particular shell experience.

### Profile files

Profile files are used for login shells. 

Generally, these are used to define and export environment variables that should be available to sub-shells. A prime example would be `$PATH`.


## Shell startup

 1. sh (POSIX)
    1. Login
       1. `/etc/profile`
       2. `~/.profile`
    2. Interactive
       1. `$ENV`
 2. Bash
    1. Login Shell
       1. `/etc/profile`
       2. `~/.bash_profile` or `~/.bash_login` or `~/.profile`
    2. Interactive  
       1. `/etc/bash.bashrc`
       2. `~/.bashrc`
    3. Non-interactive
       1. `$BASH_ENV`
 3. Korn
    1. Login Shell
       1. `/etc/profile`
       2. `~/.profile`    
    2. Interactive
       1. `/etc/ksh.kshrc`
       2. `$ENV` (often `~/.kshrc`)
    3. Non-interactive
 4. Z Shell
    1. `/etc/zshenv`
    2. `~/.zshenv`
    3. Login
       1. `/etc/zprofile`
       2. `~/.zprofile`
    4. Interactive
       1. `/etc/zshrc`
       2. `~/.zshrc`
    5. Login (again)
       1. `/etc/zlogin`
       2. `~/.zlogin`
       

### Which configuration files do I have?



```sh
for startup_file in \
  /etc/ksh.kshrc \
  /etc/profile \
  /etc/zlogin \
  /etc/zprofile \
  /etc/zshenv \
  /etc/zshrc \
  ~/.bash_login \
  ~/.bash_profile \
  ~/.kshrc \
  ~/.profile \
  ~/.zlogin \
  ~/.zprofile \
  ~/.zshenv \
  ~/.zshrc
do
printf '%s %s\n' $([[ -f $startup_file ]] && printf "\u2705" || printf "\u274c" ) $startup_file
done
```