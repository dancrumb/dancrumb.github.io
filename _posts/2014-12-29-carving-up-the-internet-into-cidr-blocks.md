---
layout: post
title: Carving up the Internet into CIDR blocks.
date: 2014-12-29 04:59:42.000000000 -06:00
type: post
published: true
status: publish
categories:
  - networking
tags: []
---
I recently had to understand what CIDR blocks are and how they describe blocks of IP addresses and I figured I'd share what I learned.

I'll stick to IPv4 addresses here, since that's what most people are still dealing with these days.

# Anatomy of an IP address
The Internet Protocol (IP) provides every device on a network with an IP address. They take the form `a.b.c.d`, where `a`, `b`, `c` and `d` are numbers from 0 to 255.
Each of these four numbers is called an **octet**.
It's called an octet because it is a representation of 8 bits. If you're not comfortable with how binary numbers work, you should stop here and [take a quick tutorial](http://computer.howstuffworks.com/bytes.htm).

Since an IP address has four octets and each octet has a value from 0-255, there are a total of 256 × 256 × 256 × 256 or 4,294,967,296 possible IP addresses (incidentally, the 4 billion limit is one of the reasons IPv6 came about).

# Organisation of IP addresses
Although there are over 4 billion IP addresses available, they are not given out at random. There are specific IP ranges that are dedicated to specific purposes. For instance, you may have noticed that your home computer's IP address is something like `192.168.0.5` or `192.168.1.20`. That's because the group of IP addresses that start `192.168` has been reserved for private networks. Another group that has been reserved for private use is the group that starts with a `10`.

The Internet Assigned Numbers Authority (IANA) maintains the list of reserved IP addresses in [a publicly available list](http://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml). If you take a look you'll notice that they use a special notation to define groups of IP address (or "CIDR Blocks"). The format is `a.b.c.d/e`. In this notation, `e` is the number that indicates the CIDR block and is called the **prefix length**.

Outside of the reserved blocks, CIDR blocks of different sizes are given out to organizations of different sizes. For instance, IBM has the `9.0.0.0/8` block. The UK Ministry of Defence has the `25.0.0.0/8` block.

# CIDR blocks
The spectrum of IP address can be readily carved up into groups of IP addresses. Rather than create groups of arbitrary IP addresses, contiguous blocks are used; these blocks constitute networks within the Internet (the network of networks). As such, they are known as **subnets**.
The CIDR notation allows us to concisely express a block of IP address that make up a subnet.

Subnets are identified by an IP address and the CIDR prefix length. An IP address is in a `/e` subnet if the first `e` bits of that IP address match the first `e` bits of the subnet address. Let's see an example.

Suppose we have a subnet `192.168.1.0/24`. Is the IP address `192.168.1.34` in this subnet?

First, convert the IP address to bits:

```
     192 .      168 .        1 .       34
11000000 . 10101000 . 00000001 . 00100010

```

Then take the first 24 bits, replace the remainder with zeros and convert them back to octets

```
11000000 . 10101000 . 00000001 . 00100010
11000000 . 10101000 . 00000001 . 00000000
     192 .      168 .        1 .        0

```

Here, we have our subnet address, so this IP address _is_ in this subnet.

The prefix length tells us something about the size of the subnet. For a prefix length of _n_, we know that the last (32-_n_) bits of the IP address do not make a difference as to whether that IP address is in a given subnet. Thus, we can work out the size of the subnet.

| CIDR prefix length | Size of network | Notes |
| --- | --: | --- |
| 32 | 1 |
| 31 | 2 |
| 30 | 4 | For subnets this size and larger, the number of server IP addresses is usually reduced by 2\. The lowest IP address is used as the network's IP address and the highest IP address is used as the [broadcast address](http://en.wikipedia.org/wiki/Broadcast_address). |
| 29 | 8 |
| ... | ... |
| 16 | 65,536 | This is the size of the 192.168.x.x block, reserved for private networks |
| ... | ... |
| 8 | 16,777,216 | This is the size of the 10.x.x.x block, also reserved for private networks |
| ... | ... |
| 0 | 4,294,967,296 | This is the total set of IP addresses. Since many of the CIDR blocks are reserved, no practical network would have this prefix length. |

Using a prefix on its own can be used when talking about non-specific CIDR blocks. Thus, we can talk about a `/24` network and and know that we're talking about a network with 4096 IP addresses in it.

# CIDRs and subnet masks
If you've configured the network card of a computer before, you may recall that, along with the IP address of the computer, you sometime need to set the subnet mask. This is directly related to the CIDR prefix length. Essentially, the subnet mask for a prefix length _n_ is the four octets you get when you set the first _n_ bits to 1 and the remaining to 0\. For example

| CIDR prefix length | Subnet mask |
| --- | --: |
| 32 | 255.255.255.255 |
| 31 | 255.255.255.254 |
| 30 | 255.255.255.252 |
| 29 | 255.255.255.248 |
| ... | ... |
| 16 | 255.255.0.0 |
| ... | ... |
| 8 | 255.0.0.0 |
| ... | ... |
| 0 | 0.0.0.0 |

# What are they for?
The main use of CIDR blocks is routing. When you request a web page from a server, your request needs to get out of your network, onto the Internet, into the network that contains the target webserver and to that actual server.
In order to do this, it must go through several routers. These routers do not contain information about how to reach every single individual IP address on the internet. But the _do_ contain information about how to get to different CIDR blocks.

Thus, your request can be passed through the internet to the appropriate CIDR block. From there, the router might know about other subnets within that CIDR block. For instance, `16.128.0.0/9` can, potentially, contain any number of subnets, so long as they are smaller and fit within that IP range. For instance, it could contain `16.128.0.64/26` or `16.128.32.0/19`.
By comparing the target IP address with the CIDR blocks that a router knows about, it can figure out where to send the packets next.

CIDR blocks can also be used by firewalls. CIDR blocks can be used to define whether packets to or from a specific block should be accepted or dropped.
