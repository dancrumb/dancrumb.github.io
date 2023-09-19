---
layout: post
type: post
comments: True
katex: True
categories:
 - Engineering
tags:
 - Twelve-Factor App
 - OpenTelemetry
 - NodeJS
---
If you've been exploring this site, you may know that I'm a fan of the [Twelve-Factor app](https://12factor.net/) methodology. I've also been getting familiar with the [OpenTelemetry](https://opentelemetry.io/) specifications. 

These two things overlap whem it comes to describe the use and importance of logging (see [OpenTelementry](https://opentelemetry.io/docs/concepts/signals/logs/) and [12-Factor App](https://12factor.net/logs)).

The Twelve-Factor App says:

> Logs are the stream of aggregated, time-ordered events collected from the output streams of all running processes and backing services.

OpenTelemetry says:

> A log is a timestamped text record, either structured (recommended) or unstructured, with metadata... any data that is not part of a distributed trace or a metric is a log. For example, events are a specific type of log.

The aim for a non-trivial system should be to treat logs as a stream of structured records directed to the output stream of each process.

## How streams behave

The vocabulary that is used when talking about data streams evoke the idea of flowing water and, in general, this is a useful metaphor. 

However, while the term `stream` might conjure up the idea of a gently flowing creek, it's really the term `pipe` that captures things most accurately. 

A pipe has one end where water is coming in and one where water goes out. If you're not letting the water out, there's only so much you can push in. If you keep going, the water pressure goes up and up until no more can be added. To further build on the water metaphor, the term "[backpressure](https://nodejs.org/en/docs/guides/backpressuring-in-streams)" is used to describe the mechanism whereby a `stream` can indicate that no more data should be passed in.

For data streams, the "water flowing in" represents the bytes being written and the "water flowing out" represents the bytes being read.

As a result of backpressure, the rate at which data can be written to a stream depends upon the rate at which data is being read from the stream.

To handle this a little more gracefully, a stream will generally have a buffer. A buffer acts as a storage tank in the pipe. If data is flowing in more quickly than its flowing out, the buffer will fill before backpressure starts being applied. Once the write rate drops below the read rate, the buffer can "drain" until its empty again.

Writes to a stream can be synchronous or asynchronous, depending on what the other end of the stream is connected to. From [the NodeJS docs](https://nodejs.org/dist/latest-v18.x/docs/api/process.html#a-note-on-process-io):

<table>
    <tr>
    <th class="empty"></th><th>Window</th><th>POSIX</th>
    </tr>
  <tr>
    <th>Files</th>
    <td>sync</td>
    <td>sync</td>
  </tr>
  <tr>
    <th>Terminals</th>
    <td>async</td>
    <td>sync</td>
  </tr>
  <tr>
    <th>Pipes</th>
    <td>sync</td>
    <td>async</td>
  </tr>
</table>

Since logging events are written to a stream by application processes, and stream writes are constrained by stream reads, it follows that logging can have an impact on an applications performance.

So let's look into that...

## Benchmarking the impact of logging

In order to explore the impact of logging, I created a benchmarking script to test two different approaches.

### The test function

I created a `test` function that takes a `logger` object to test, a number of `cycles` to run and a logging `payload` to pass to the logger.

{% highlight javascript %}
const test = (logger, cycles = 1e6, payload= 'Looped') => {
  let count = 0;
  performance.clearMarks();
  performance.mark("start");

  logger.onDone(() => performance.mark("end"));

  performance.mark("start_loop");
  for (let i = 1; i < cycles; i++) {
    logger.log(payload);
    count += Math.log(i);
  }
  performance.mark("end_loop");

  logger.log(`Count: ${count}`);

  return logger.done().then(() => ({
    loop: performance.measure("Loop", "start_loop", "end_loop").duration,
    drain: performance.measure("Drain", "end_loop", "end").duration,
    program: performance.measure("Program", "start", "end").duration,
  }));
};
{% endhighlight %}

The `logger` object has a `log` function, and `onDone` function to set a handler when the `logger` is finished write all its data, and a `done` function that can be called to tell the `logger` that no more data is coming..

I'm using the `performance` object from the [`node:perf_hooks`](https://nodejs.org/api/perf_hooks.html) module to perform our measurements.

To generate load on the CPU, I'm calling `Math.log` for each cycle.

The code measures three performance metrics:
 - **loop**: The time taken to execute all the iterations of the internal loop (from `start_loop` to `end_loop`)
 - **drain**: The time taken from `logger.done` being called to the logger reporting that it's done (i.e. the time taken to drain the logger's buffer) (from `end_loop` to `end`)
 - **program**: The time taken to execute the whole function (from `start` to `end`)

### The suite function

This test function is called by a suite function that calls `test` repeatedly, gathers performance statistics and then generates averages data.

{% highlight js %}
const runSuite = async (getLogger, { reps, cycles, payload } = {}) => {
  const suiteResults = {};
  for (let i = 0; i < reps; i++) {
    suiteResults[i] = await test(getLogger(), cycles, payload);
  }

  return getAverages(suiteResults);
};
{% endhighlight %}

The suite function makes `reps` calls of the test function, and provides the appropriate logger, cycle count and log payload being passed to the `test` function.

The following test suites were run:

{% highlight js %}
const SUITES = [
  ["console-string", getConsoleLogger, "Looped"],
  ["console-object", getConsoleLogger, { message: "Looped" }],
  ["child-string", getChildLogger, "Looped"],
  ["child-object", getChildLogger, { message: "Looped" }],
  ["no-log-string", getNoLogger, "Looped"],
  ["no-log-object", getNoLogger, { message: "Looped" }]
];
{% endhighlight %}

### The loggers

I tested three "loggers":
 
 - A `no` logger
 - A `console` logger
 - A `child` logger

#### The no logger

The `no` logger does nothing at all. Instead of logging the `payload`, it just drops it.

This lets us see how the test runs when no logging is done

#### The console logger

The `console` logger just uses `console.log` to emit the `payload` as a logging event. 

Most NodeJS applications either use `console.log` directly, or indirectly via some logging library.

For this logger, the `done` and `onDone` methods don't do anything.

#### The child logger

I created a very simple logging library that uses a separate child process to handle the logging stream. 

This relieves the application process from the burden of dealing with backpressure from the log stream.

{% highlight js %}
const { fork } = require("node:child_process");

module.exports = () => {
  const child = fork("./worker-log-child.js", [], {
    stdio: ["pipe", "inherit", "inherit", "ipc"],
  });

  let isDone = false;
  const log = (msg) => {
    if (!isDone) {
      if (typeof msg !== "string") {
        child.stdin.write(`${JSON.stringify(msg)}\n`);
      } else {
        child.stdin.write(`${msg}\n`);
      }
    }
  };

  let onDoneHandler = () => { };

  const done = () => {
    return new Promise((res) => {
      isDone = true;
      child.once("disconnect", () => {
        onDoneHandler();
        res();
      });
      child.stdin.end();
    });
  };

  const onDone = (handler = onDoneHandler) => (onDoneHandler = handler);

  return { log, done, onDone };
};

{% endhighlight %}

This library creates a child process (see below) to do the actual writing of log entries to an output stream. Whenever something is logged, the library serializes it, if necessary, and then writes to the `stdin` stream of the child process.

When `done` is called, the library sets a flag (to prevent further writes to the log), creates a handler for the `disconnect` event from the child process and then calls `end` on the `stdin` stream. By doing this, the library is telling the child process "Nothing else is coming," and then waits for the child process to say "OK, I'm done with my work."

This is what the child process looks like:

{% highlight js %}
// The message FIFO
const messages = [];

let isDone = false;

// Gets the next message from the FIFO and writes it to STDOUT (if there is one). Then tees up another call to `next`
// If there is nothing in the FIFO and the end of the input stream has been reached, disconnect from the parent process
const next = () => {
  const message = messages.shift();
  if (message) {
    process.stdout.write(`${message}`);
    process.nextTick(next);
  } else if (isDone) {
      process.stdout.end();
      process.disconnect();
  }
};

// When data comes it, it's just put into the message FIFO
process.stdin.on("data", (data) => {
  messages.push(data);
  process.nextTick(next);
});

process.stdin.on("end", () => {
  isDone = true;
});
{% endhighlight %}

It is intentionally simple for test purposes. In a real system, you'd definitely need to add some error handling to make things more robust.

All this process does is reads from `stdin` and puts it into a <abbr title="First In First Out">FIFO</abbr> queue (`messages`). It then proceeds to take items from the FIFO and write them to the `stdout` stream that it inherited from the library.

## Test environments

I ran these test suites in three different environments:

 - In a normal terminal, with the output scrolling by: `node ./index.js`
 - In a normal terminal, with the output redirected to a file : `node ./index.js > results.out`
 - In a detached [`screen` session](https://www.gnu.org/software/screen/manual/screen.html): `screen`, then `node ./index.js`, then <kbd><kbd>Ctrl</kbd>+<kbd>a</kbd></kbd>, <kbd><kbd>d</kbd></kbd>

## The results

For each round, I calculated the minimum and maximum run times for a `test` call, as well as a mean with outliers removed. Outliers were removed by calculating the interquartile range and only using values 

$$ Q_1 - 1.5 * \text{IQR} \leq value \leq Q_3 + 1.5 * \text{IQR} $$ 

where $$\text{IQR} = Q_3 - Q_1$$.

In the tables below, all times are in milliseconds and in the form: $$ \text{min} \leq \text{mean} \leq \text{max} $$

### The no logger

First, let's look at how long it took to run the tests with the `no` logger. This gives us a baseline on how much of a performance impact logging has. 

| Environment | Payload | Program | Loop | Drain |
|-------------|---------|---------|------|-------|
| Terminal    | string  | $$ 2.12 \leq \boldsymbol{2.23} \leq 3.08 $$ | $$ 2.11 \leq \boldsymbol{2.23} \leq 3.07 $$ | $$ 0.00 \leq \boldsymbol{0.00} \leq 0.3 $$ |
| Terminal    | object  | $$ 2.12 \leq \boldsymbol{2.20} \leq 2.77 $$ | $$ 2.11 \leq \boldsymbol{2.20} \leq 2.75 $$ | $$ 0.00 \leq \boldsymbol{0.00} \leq 0.2 $$ |
| Redirect    | string  | $$ 2.12 \leq \boldsymbol{2.19} \leq 3.01 $$ | $$ 2.11 \leq \boldsymbol{2.19} \leq 2.95 $$ | $$ 0.00 \leq \boldsymbol{0.00} \leq 0.3 $$ |
| Redirect    | object  | $$ 2.12 \leq \boldsymbol{2.21} \leq 2.73 $$ | $$ 2.11 \leq \boldsymbol{2.21} \leq 2.73 $$ | $$ 0.00 \leq \boldsymbol{0.00} \leq 0.2 $$ |
| Screen      | string  | $$ 2.12 \leq \boldsymbol{2.24} \leq 2.73 $$ | $$ 2.11 \leq \boldsymbol{2.21} \leq 2.73 $$ | $$ 0.00 \leq \boldsymbol{0.00} \leq 0.6 $$ |
| Screen      | object  | $$ 2.12 \leq \boldsymbol{2.28} \leq 9.25 $$ | $$ 2.12 \leq \boldsymbol{2.28} \leq 9.23 $$ | $$ 0.00 \leq \boldsymbol{0.00} \leq 0.3 $$ |

Unsurprisingly, the mean times are all pretty much the same. Since there's no logging, there is no data being streamed that could slow things down.

> The maximum time of 9.25ms for the Screen/object test is definitely an outlier and probably resulted from my laptop doing something else while I was running the test.

### The console logger

Next, let's look at the `console` logger, which is what most folks use for their logging

| Environment | Payload | Program | Loop | Drain |
|-------------|---------|---------|------|-------|
| Terminal    | string  | $$ \text{ }849 \leq \text{ }\boldsymbol{956} \leq 2842 $$         | $$ \text{ }849 \leq \text{ }\boldsymbol{956} \leq 2842 $$         | $$ 0.03 \leq \boldsymbol{0.04} \leq 0.18 $$ |
| Terminal    | object  | $$ \text{ }954 \leq \boldsymbol{1015} \leq 3553 $$                | $$ \text{ }954 \leq \boldsymbol{1015} \leq 3553 $$                | $$ 0.03 \leq \boldsymbol{0.03} \leq 0.06 $$ |
| Redirect    | string  | $$ \text{ }812 \leq \boldsymbol{1171} \leq 2150 $$                | $$ \text{ }812 \leq \boldsymbol{1171} \leq 2150 $$                | $$ 0.03 \leq \boldsymbol{0.04} \leq 0.18 $$ |
| Redirect    | object  | $$ 1296 \leq \boldsymbol{1340} \leq 1860 $$                       | $$ 1296 \leq \boldsymbol{1340} \leq 1860 $$                       | $$ 0.03 \leq \boldsymbol{0.04} \leq 0.06 $$ |
| Screen      | string  | $$ \text{ }810 \leq \text{ }\boldsymbol{823} \leq \text{ }929 $$  | $$ \text{ }810 \leq \text{ }\boldsymbol{823} \leq \text{ }929 $$  | $$ 0.03 \leq \boldsymbol{0.04} \leq 0.19 $$ |
| Screen      | object  | $$ \text{ }926 \leq \text{ }\boldsymbol{939} \leq 1184 $$         | $$ \text{ }926 \leq \text{ }\boldsymbol{939} \leq 1184 $$         | $$ 0.03 \leq \boldsymbol{0.04} \leq 0.05 $$ |

Perhaps the most glaring observation here is just how much logging slows things down. Now, before anyone gets carried away, this test is somewhat artificial, in that you would never really log every single iteration in a CPU-intensive workflow like this. However, it is worth taking a moment to note that logging _does_ have an impact. However, in general, the benefit of logging far outweighs the cost.

Perhaps not unexpectedly, it takes a little longer to log objects, rather than strings. This is due to the cost of serialization. In these tests, serialization added a 7-14% penalty.

Finally, all of the execution time of the test is spent in the loop. Essentially no time spent draining the stream buffer. This is to be expected, since writes to STDOUT are synchronous for both writes to the terminal and writes to a file.

> I was surprised to see that the slowest tests were the tests with redirected output. Generally, redirecting output sends data to a file, which is quicker than sending it to the screen. I don't really have a hypothesis for why this happened here, but it's not really important to the general point of this post.

### The child logger

Now, let's look at `child` logger.

| Environment | Payload | Program | Loop | Drain |
|-------------|---------|---------|------|-------|
| Terminal    | string  | $$ 711 \leq \boldsymbol{741} \leq 2017 $$         | $$ 11 \leq \boldsymbol{14} \leq 32 $$ | $$ 690 \leq \boldsymbol{725} \leq 1988 $$ |
| Terminal    | object  | $$ 752 \leq \boldsymbol{827} \leq 2017 $$         | $$ 41 \leq \boldsymbol{46} \leq 85 $$ | $$ 708 \leq \boldsymbol{780} \leq 1964 $$ |
| Redirect    | string  | $$ 114 \leq \boldsymbol{124} \leq \text{ }711 $$  | $$ 12 \leq \boldsymbol{13} \leq 34 $$ | $$ \text{ }97 \leq \boldsymbol{109} \leq \text{ }677 $$ |
| Redirect    | object  | $$ 140 \leq \boldsymbol{152} \leq \text{ }239 $$  | $$ 41 \leq \boldsymbol{44} \leq 51 $$ | $$ \text{ }94 \leq \boldsymbol{108} \leq \text{ }193 $$ |
| Screen      | string  | $$ 134 \leq \boldsymbol{142} \leq \text{ }763 $$  | $$ 11 \leq \boldsymbol{13} \leq 33 $$ | $$ 115 \leq \boldsymbol{128} \leq \text{ }731 $$ |
| Screen      | object  | $$ 190 \leq \boldsymbol{201} \leq \text{ }256 $$  | $$ 40 \leq \boldsymbol{43} \leq 51 $$ | $$ 146 \leq \boldsymbol{158}  \leq 212 $$ |

First of all, we can see that the tests complete way faster with the `child` logger than the `console` logger. Perhaps this is to be expected, since we have two processes running, rather than one.

We can see that the time spent in the loop is much lower for the `child` logger than the `console` logger. However, we're "paying" for this with a longer drain time.

What we can conclude from this is that the logging is less impactful for the CPU-intensive workload, but we are buffering the log entries in memory until we are able to write them to the output stream.

## The conclusion

When it comes to logging, you will get much better performance, if you offload the work of logging to a child process of your application process. 

There are, however, a few caveats here:

 1. There's a little overhead to creating a child process with `fork`. For long running application processes (such as a server), this will be insignificant, but for short scripts, it's simpler and quicker to just use `console.log`.
 2. Creating a child process brings the need to manage this process properly. The child process could fail, so failure recovery code is needed.
 3. Since the child process has its own internal buffer of pending log entries, it's important that the application process does its best to let the child process shutdown gracefully so that pending log entries are not lost.

You may be wondering why I didn't user Worker threads instead of a child process. Unfortunately, per the [Node docs](https://nodejs.org/dist/latest-v18.x/docs/api/worker_threads.html#synchronous-blocking-of-stdio):

> Workers utilize message passing via `<MessagePort>`` to implement interactions with stdio. This means that stdio output originating from a Worker can get blocked by synchronous code on the receiving end that is blocking the Node.js event loop.

Only by creating a separate process, can we be handling log entries while the application process does its thing.

## Next steps

My next steps are to get started on implementing a logging library that uses a child process. I'll be sure to add a link here, once it's ready.

As for you: well, for most people, `console.log` (or some library that wraps around it), is probably more than good enough. 

However, as an application scales and the number of log entries generated per second grow, there may come a time that you need to reassess your choice and switch to a dedicated logging process. When that happens, check back here for my library 😊