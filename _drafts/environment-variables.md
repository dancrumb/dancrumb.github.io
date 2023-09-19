---
layout: post
type: post
comments: true
categories:
 - Engineering
tags:
 - Twelve-Factor App
---
I'm a big fan of the [Twelve-Factor app](https://12factor.net/) methodology. One factor that is useful to introduce to any app is number three: [_Config: Store config in the environment_](https://12factor.net/config). A key component of this is that configuration values should not be stored in code. Instead, they should be entirely separate. The 12FA site specifically calls out environment variables as the way to provide config values to your application. In this post, I'll talk about environment variables and a few ways to work with them.

## Environments

First, let's talk about **environments**. These shouldn't be confused with deployment environments such as "staging" or "production". Instead, what we're talking about are the virtual space within which applications execute.

Such spaces include "runtime environments" (such as Node or an operating system), engines (such as the JVM and web browsers' JS engines) and interpreters (such as Perl, Python and Ruby). In most systems that you'll come across, these spaces are nested; each one runs inside another with the exception of some parent space that talks directly to hardware (either bare metal or virtualized).

Here's what this hierarchy of environments might look like from a user running `node foo.js` in a Linux shell on a laptop.

<iframe src="https://link.excalidraw.com/readonly/F9hMPJzuz0JCCygioiBd" width="100%" height="100%" style="border: none;"></iframe>

Each environment inherits a clone of the one above it. This will be important as we discuss environment variables.

## Environment variables

Environment variables were introduced to Unix way back in 1979. From then on, Unix-based OSes such as macOS and Linux, and Microsoft OSes, such as Windows and OS/2 have included support for environment variable.

In all cases, an environment variable is a key-value pair. All environment variable values are strings. These can, of course, be serialized versions of other data types. However, as far as any environment is concerned, these are opaque strings that undergo no interpretation or valuation when they are set or when they are read.

One of the easiest ways to see them is to open a terminal on your machine.

On a Unix system a simple

```sh
echo ${HOME}
```

should show you the name of your home directory. What you have done here is accessed the value of the `HOME` environment variable.

On a Windows system, the equivalent would be

```sh
echo %HOMEPATH%
```

or

```powershell
echo $env:homepath
``` 