---
layout: post
type: post
comments: true
categories:
  - Engineering
tags:
  - TypeScript
---

TypeScript was introduced to the world in 2012, bringing support for types to the JavaScript ecosystem. The TypeScript language is a superset of the JavaScript language, meaning that any valid JS program is also a valid TS program. This was vital, since JavaScript was introduced in 1995. There was seventeen years' worth of libraries and frameworks out there that TS developers would want to use.

The subsequent challenge was this: these JS libraries had no type information. Bringing them into a TS program meant bringing in the dreaded `any` type and weakening the safety provided by a strict type system. What to do... what to do?

The solution was to create the [DefinitelyTyped repository][1]. Within this repo, type declaration files are stored for pre-existing JS libraries, bringing type safety.

## @types/xxx modules

The DefinitelyTyped repo contains thousands of type declarations. Each one is published as a Node module. For a JS library called `foo`, there (may) be a DefinitelyTyped module called `@types/foo`. These modules are community maintained. This brings all the benefits and risks of any open source project: if you're using a popular library, there's a good chance that there's a `@types/` module for it. However, it may contain mistakes or may not be fully up to date with the latest release of the library you are using.

On the whole, though, these modules are exactly what you need.

Within the type module, there are a set of TypeScript declaration files (`*.d.ts`). These files declare the types of the entities that the library provides. This can include types, interfaces, constants, etc.

Since modules like `@types/foo` and `foo` are entirely separate, we have to _trust_ that `@types/foo` accurately represents `foo`. When it doesn't it can bring about a number of failure modes:

- Your TypeScript compiler reports a type error when it shouldn't because the `@types/` module is out of date
- Your TypeScript compiler does not report a type error, but you get a runtime error because the `@types/` module declares the types incorrectly and you attempt to interact with something that doesn't exist

The first error is annoying, but not too problematic. Your development progress will be slowed, but your program will be as type-safe as it was before.

The second error is much more egregious. The whole point of a type system is to avoid the class of runtime errors cause by acceesing something that doesn't exist, or in a way that is incompatible with that thing. By misrepresenting types, you erode the safety of an otherwise correct program.

## Modules

We'll take a quick digression here to talk about imports and exports.

A major challenge in the early (and not so early) days of JavaScript was how to handle dependencies. I'm not talking package management here (i.e. `npm`, `yarn`, `pnpm`, etc). I'm talking about how a single source file may depend upon other files within an application, or files within a third-party library. We call these files "modules".

The fundamental operations of a module systems are Import and Export. A module provides code entities to others via an Export operation. A module consumes code entities provided by others via an Import operation.

Throughout the history of JavaScript, a number of solutions have arisen:

- CJS [CommonJS][2]: 2009
- AMD [Asynchronous module definition][3]: 2011
- UMD [Universal Module Definition][4]: 2011
- ESM [ECMAScript Modules][5]: 2015

Node introduced CommonJS as a way to manage dependencies. Browser developers wanted a piece of the action, and AMD came along. However CommonJS and AMD were not compatible, so UMD was introduced as a way to make modules available to both frontend and backend programs.
Finally, in 2015, ECMA introduced modules to the ECMAScript spec, to provide an official standard.

### CommonJS modules

CommonJS modules use the `require` function for the Import operation and the `module.exports` object for the Export operation.

The `require` function takes a "module identifier". The CJS loader then performs a [resolution operation][6] to map this to a specific file. That file is then loaded synchronously.

The "load" operation takes the code in the module file, wraps it in the function below and then calls that function. In doing this, the contents of the module file are fully executed.

```javascript
(function (exports, require, module, __filename, __dirname) {
  // Module code
});
```

This is where `require`, `exports`, `module`, `__filename`, and `__dirname` come from, so that they can be used within a CJS module.

To begin with `exports` is a shortcut to `module.exports`. If a value is directly assigned to `module.exports` or `exports`, then this connection is broken.

The entities exported by are module are determined by what is assigned to `module.exports`

In CommonJS, `require` returns whatever value was assigned to `module.exports`. If this is an object, these can be immediately destructured:

```javascript
// foo.js
module.exports = { bar: 42 };

// baz.js
const { bar } = require("./foo.js");
```

### ECMAScript Modules

ECMAScript modules use the `import` declaration and function for the Import operation and the `export` declaration for the Export operation.

[1]: https://github.com/DefinitelyTyped/DefinitelyTyped "DefinitelyTyped repo"
[2]: https://commonjs.org "CommonJS offical site"
[3]: https://github.com/amdjs/amdjs-api/wiki/AMD "AMD spec"
[4]: https://github.com/imdjs/umd "UMD spec"
[5]: https://tc39.es/ecma262/#sec-modules
[6]: https://nodejs.org/api/modules.html#all-together
