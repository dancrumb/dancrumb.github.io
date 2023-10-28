---
layout: post
type: post
comments: true
categories:
 - Engineering
tags:
 - Twelve-Factor App
---
I'm a big fan of the [Twelve-Factor app](https://12factor.net/) methodology. One factor that is useful to introduce to any app is number three: [_Config: Store config in the environment_](https://12factor.net/config). 

A key component of this is that configuration values should not be stored in code. Instead, they should be entirely separate. The 12FA site specifically calls out environment variables as the way to provide config values to your application. 

In this post, I'll talk about environment variables and a few ways to work with them.

## Environments

First, let's talk about **environments**. Now, these shouldn't be confused with deployment environments such as "staging" or "production". What we're talking about are the virtual space within which applications execute.

Such spaces include "runtime environments" (such as Node or an operating system), engines (such as the JVM and web browsers' JS engines) and interpreters (such as Perl, Python and Ruby). In most systems that you'll come across, these spaces are nested; each one runs inside another with the exception of some parent space that talks directly to hardware (either bare metal or virtualized).

Here's what this hierarchy of environments might look like from a user running `node foo.js` in a Linux shell on a laptop.

<iframe src="https://link.excalidraw.com/readonly/F9hMPJzuz0JCCygioiBd" width="100%" height="100%" style="border: none; height: 300px"></iframe>

Each environment inherits a clone of the one above it. This will be important as we discuss environment variables.

## Environment variables

Environment variables were introduced to Unix way back in 1979. From then on, Unix-based operating systems such as macOS and Linux, and Microsoft operating systems, such as Windows and OS/2 have included support for environment variable.

In all cases, an environment variable is a key-value pair. All environment variable values are strings. These can, of course, be serialized versions of other data types. However, as far as any environment is concerned, these are opaque strings that undergo no interpretation or valuation when they are set or when they are read.

One of the easiest ways to see them is to open a terminal on your machine.

On a Unix system a simple

{% highlight sh %}
echo ${HOME}
{% endhighlight %}

should show you the name of your home directory. What you have done here is accessed the value of the `HOME` environment variable.

On a Windows system, the equivalent would be

{% highlight msshell %}
echo %HOMEPATH%
{% endhighlight %}

or

{% highlight powershell %}
echo $env:homepath
{% endhighlight %}

Environment variables can control the behaviour of your shell; for instance, the appearance of your command prompt is usually controlled by an environment variable (such as `$PS1`). They can tell the shell where to look for commands (i.e. `PATH`). They can tell commands how to behave (which is what we're talking about here).

> From this point onward, I'll be using Unix conventions. For Windows and PowerShell, you'll have to read the relevant documentation.

### Setting and exporting variables

When you have a terminal open at your shell prompt, setting a variable is easy:

{% highlight sh %}
NAME=VALUE
{% endhighlight %}

This sets the `NAME` variable to be equal to `VALUE`. You can then access this with `$NAME`.

However, at this point, `NAME` will not be cloned into sub-processes. In order to make an environment available in a subprocess, you'll need to export it. This can be done in one of two ways:

{% highlight sh %}
NAME=VALUE
export NAME
{% endhighlight %}

or

{% highlight sh %}
export NAME=VALUE
{% endhighlight %}

If you want to make an environment variable available to a sub-process without modifying your current environment, you can do:

{% highlight sh %}
NAME=VALUE ./subprocess.sh
{% endhighlight %}

Within the `subprocess.sh` process, the environment variable `NAME` will be set to `VALUE` only.

## Environment variables for your shell

Each shell (bash, zsh, etc.) has its own standard files that users can modify to establish environment variables.

## Managing environment variables for an application

When you're building a 12-Factor App, you'll often find that there are quite a few environment variables in play. Common examples include:
 
 - A database connection string
 - API Keys for third-party services
 - Feature flags
 - Some variable indicating the deployment environment (e.g. `NODE_ENV=development`)

Having to export these manually every time you open a terminal would be incredibly annoying. Fortunately, there are a few, commonly used, mechanisms that make this simpler.

### .env files

When Heroku developers first came up the 12-Factor App idea, they also came up with the idea of `.env` files.

A `.env` file is a simple file that lists key/value pairs for injecting into an execution environment. An example file might look like:

{% highlight powershell %}
DB_CONNECTION_STRING=mysql://root:password@localhost/db

FF_SHOW_DEBUG=true
FF_COOL_THING=true

SERVICE_PUBLIC_KEY=abcde12345
SERVICE_PRIVATE_KEY=xxxxxxx9999999
{% endhighlight %}

The key/value pair format should seem pretty familiar to you.

This file provides a good starting point, but we still need to inject these values into our execution context. There are a few approaches, but they boil down to one of two options:

1. Inject the variables into the current environment and then run your application
2. Run your application and then inject the variables into the application's execution environment

There's a purist view that says that an application shouldn't be modifying its own environment and so (1) is superior. However, practically speaking, there's not a great deal of difference, so you should choose whichever approach works best for you. As you'll see soon, a combination may be the best approach.

### .envrc files

Another way to manage environment variables is with `.envrc` files and the [`direnv`](https://direnv.net/) shell extension.

Unix systems have a variety of files that can be used to configure users' environments.