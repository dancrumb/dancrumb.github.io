---
layout: post
type: post
title: Why is my React Context value undefined?
comments: true
categories:
 - Engineering
 - React
tags:
 - Adventures in Debugging
---
If you're a React developer using [React Contexts](https://react.dev/learn/passing-data-deeply-with-context), then there will no doubt be times when you try to retrieve a context that you've created, only for it to be undefined.

A common pattern you'll see is this:

```react
import {createContext, useContext} from 'react';

const ExampleContext = createContext(null);

/**
 * A Provider to wrap around your components
 */
export const ExampleProvider = ({children, startValue}) => {
    const [exampleValue, setExampleValue] = useState(startValue);

    useEffect(() => {
        //
        // Some code to initialize the exampleValue
        //
        setExampleValue(initializedValue);
    },[])

    return (
        <ExampleContext.Provider value={exampleValue}>
            {children}
        </ExampleContext.Provider>
    );
}

/**
 * A hook to get the current context value
 */
export const useExample = () => {
    const exampleValue = useContext(ExampleContext);
    if(exampleValue === undefined) {
        throw new Error('useExample returned undefined. Are you sure you component is inside an Example Provider?')
    }
    return exampleValue;
}
```

If you search online for "[React useContext returns undefined](https://www.google.com/search?q=React+useContext+returns+undefined)", you will generally be directed to ensure that the component calling `useExample` is a descendant of the `ExampleProvider`. However, this is not the only possibility.

Take note that the _default_ value for our `ExampleContext` is `null`, not `undefined`. Therefore, `exampleValue` has been updated.

During your debugging, you decide to call `console.log({initializedValue})` inside your `useEffect`, but you see that it's definitely defined just before you call `setExampleValue`.

What might be happening is what happened to me. I was creating an `IntercomProvider` for a React app so that components could make calls to [Intercom](https://www.intercom.com/). I was loading Intercom into my app, just fine, but `useIntercom` kept returning undefined.

I finally realized that the issue was a little wrinkle with my state-setter and the fact that `Intercom` is a function.

The setter returned by `useState` has two signatures. The first takes a value and just updates the state to that value. The second takes a function which takes the current state as a parameter and returns the new state.

This all works cleanly unless your state value also happens to be a function.

When I did this:

```javascript
setIntercom(intercom);
```

React saw that I was passing in a function and so called it and set the state to the return value of that function. The Intercom functions happens to be a `void` returning function, hence the `undefined` value.

Instead, I now do:

```javascript
setIntercom(() => intercom);
```

Everything now works as it should.

If you find yourself in a similar position, it's probably a good idea to throw a quick comment to explain why you're using the function form, so that someone doesn't come and "clean it up" later.