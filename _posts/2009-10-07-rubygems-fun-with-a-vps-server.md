---
layout: post
title: RubyGems fun with a VPS server
date: 2009-10-07 19:01:20.000000000 -05:00
type: post
published: true
status: publish
categories:
- Programming
- Rails
tags:
- Rails
- ruby
- rubygems
---
All of my websites are currently running on a VPS server provided by HostIcan. I recently discovered a little quirk involving VPS servers and RubyGems.

I've started learning Ruby on Rails and the Ruby part uses things called 'Gems' in a similar way to Perl using Modules. Where you read 'gem', thing 'cpan'.

I wanted to install a new gem on my server to support some Paypal integration, but 'gem' kept segfaulting on me.

If you're like me, you'll see this behaviour:

```sh
root@server [~]# gem install rubygems-update
Bulk updating Gem source index for: http://gems.rubyforge.org
Terminated
```

It turns out that 'Bulk updating...' part gobbles up memory like it's going spare and leads to a segfault.

The way to avoid this problem is to update RubyGems... but to do that, you need to use 'gem'... and that leads to a segfault... and around we go again.

To break the cycle, you simply use:

```sh
gem update --system --no-update-sources
```

to prevent the updating of sources.

Once I'd done that, I found that I was **still** getting segmentation faults. Also, when I ran:

```sh
root@server [~]# gem install activemerchant --no-update-sources
```

I now got

```sh
 ERROR:  could not find activemerchant locally or in a repository
 ```

So the problem still wasn't resolved!

The only solution was to force my system to the latest version of RubyGems. Unfortunately, this was not in my local repository. However, a manual update was pretty simple:

```sh
cd /tmp
wget http://rubyforge.org/frs/download.php/60718/rubygems-1.3.5.tgz
tar -xvzf rubygems-1.3.5.tgz
cd rubygems-1.3
ruby setup.rb
```

Job done!
