---
layout: post
title: Peculiar Perl problems...
date: 2009-07-03 17:20:37.000000000 -05:00
type: post
published: true
status: publish
categories:
- perl
- Programming
tags:
- errors
- perl
- Programming
meta:
  aktt_notify_twitter: 'yes'
  _edit_last: '1'
  _aioseop_description: A couple of common problems when uploading Perl files from
    a development system to a production system
  aktt_tweeted: '1'
author:
  login: admin
  email: dancrumb@gmail.com
  display_name: dancrumb
  first_name: ''
  last_name: ''
---
![]({{ site.baseurl }}/assets/perl.jpg "Perl Camel")

I've been coding in Perl for years and, generally, I think I'm a pretty competent coder. However, every now and again, I fall into a hole that takes me a loooong time to get out of. Invariably, these problems boil down to _upload_ issues, not code issues. As an aide-mémoire for myself and, hopefully, to you, I thought I'd jot down a few problems that I've seen and what the solution was.  

## Incorrect shebang

The 'shebang' is the first line of code in a Perl script. It consists of a hash character '#', followed by an exclamation mark '!', also know as a 'bang' (hence the name). Then, the full directory of the Perl binary should be given. As often as not, this will be:

```sh
#!/usr/bin/perl
```

or

```sh
#!/usr/local/bin/perl
```

This is actually a generic line and is not unique to Perl. It's a Unix device that tells the operating system that the program that is capable of interpreting the following script can be found here.

Now... if you get this wrong, it won't work. The problem is, if you're developing on one box with Perl in one location and you upload your scripts to another box, where Perl is located elsewhere, you'll have the phenomenon of your script working perfectly on your development box, but won't work on your production box. In addition, if you try to execute the script from the command line of your production box by invoking Perl directly and then provide the script name, that will _also_ work, because the shebang is ignored in this case. It's not until you try to execute your script via an HTTP request that it all falls apart. You will see the following in your error log:

```sh
[Fri Jul 03 16:57:14 2009] [error] [client xxx.xxx.xxx.xxx] suexec failure: could not open log file
[Fri Jul 03 16:57:14 2009] [error] [client xxx.xxx.xxx.xxx] fopen: Permission denied
[Fri Jul 03 16:57:14 2009] [error] [client xxx.xxx.xxx.xxx] Premature end of script headers: script.pl
```

This should be your indicator to check the shebang in the scripts on your production server and ensure that the point to the correct location for the Perl binary.

## Incorrect file formats

Sometimes, your Perl script works fine on your Windows development box, but when you transfer it to your Unix production box, it stops working. As above, it works fine when you run it directly from the command line and you invoke 'perl' directly, but an HTTP request results in a 404 error, even though the file _is_ actually in place.

The problem here is that DOS and Unix use different characters to indicate the end of a line and, if you have DOS endings in a Unix environment, the O/S is not able to parse the shebang correctly and so cannot locate the Perl binary. The way to fix this is to use the 'dos2unix' command. This will convery a DOS encoded file into a Unix encoded file and everything will be peachy.

This normally occurs if you're using an FTP client that is uploading Perl files in BINary mode instead of ASCII mode. It also occurs if you are transferring files via SCP, since SCP does not convert files as it copies them.
