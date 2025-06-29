## Technical Questions

1. **How much time did you spend on the engineering task?**

   - 15% debugging dependency issue
   - 30% trying to understand the codebase
   - 10% reading documentation for antd
   - 35% refactoring work
   - 10% unit test?

2. **What would you add to your solution if you’d had more time?**
   - Refactoring all the stying, too many inline styles on the component, and leverage the use of CSS variables for theme toggling.
   - Replacing components/icon that can be replaced with `antd` library
3. **What do you think is the most useful feature added to the latest version of JS/TS?**

   - **Include a code snippet that shows how you've used it.**<br>
     Not necessarily brand new, but I just started to use this 2 years ago.

     ```ts
     // destructuring
     const [state, setState] = React.useState();
     const {
       hard: {
         to: {
           reach: { vars },
         },
       },
     } = someVars;

     // Using Map and Set in JavaScript/TypeScript
     const fruits = new Map<string, number>();
     fruits.set("apple", 10);
     fruits.set("banana", 5);

     const uniqueFruits = new Set<string>();
     uniqueFruits.add("apple");
     uniqueFruits.add("banana");
     uniqueFruits.add("apple"); // Duplicate, will not be added

     console.log(fruits.get("apple")); // 10
     console.log(uniqueFruits.has("banana")); // true
     ```

     Cool thing about `Map` is you are no longer restricted to use `string` as key, it can be an object as well.

4. **How would you track down a performance issue in production?**<br>
   By using inspector tools, typically crashes are easier to track and fix, versus app slowing down or becoming non-responsive over time.
   - **Have you ever had to do this?**<br>
     **For Crashes.**
     Ideally we should have a generic error handler that can track users states in memory, when crash happens, we should be able to get the latest state (or few last step before crash happens) with users consent, for diagnostic. I have never implement it myself, but the idea come across multiple times.<br>
     **Slowing Down**
     Yes, one of the app that we build have memory leaking, and performance issues. Took 3 - 4 developers to figure out the problem by reading cpu, memory usage, and a lot of speculating and guess works.
