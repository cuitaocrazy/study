// import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

// function createContext<ContextValueType extends object | null>(
//   rootComponentName: string,
//   defaultContext?: ContextValueType
// ) {
//   const Context = React.createContext<ContextValueType | undefined>(
//     defaultContext
//   );

//   function Provider(props: ContextValueType & { children: React.ReactNode }) {
//     const { children, ...context } = props;
//     // Only re-memoize when prop values change
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     const value = React.useMemo(
//       () => context,
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//       Object.values(context)
//     ) as ContextValueType;
//     return <Context.Provider value={value}>{children}</Context.Provider>;
//   }

//   function useContext(consumerName: string) {
//     const context = React.useContext(Context);
//     if (context) return context;
//     if (defaultContext !== undefined) return defaultContext;
//     // if a defaultContext wasn't specified, it's a required context.
//     throw new Error(
//       `\`${consumerName}\` must be used within \`${rootComponentName}\``
//     );
//   }

//   Provider.displayName = rootComponentName + "Provider";
//   return [Provider, useContext] as const;
// }

// /* -------------------------------------------------------------------------------------------------
//  * createContextScope
//  * -----------------------------------------------------------------------------------------------*/

// type Scope<C = any> = { [scopeName: string]: React.Context<C>[] } | undefined;
// type ScopeHook = (scope: Scope) => { [__scopeProp: string]: Scope };
// interface CreateScope {
//   scopeName: string;
//   (): ScopeHook;
// }

// function createContextScope(
//   scopeName: string,
//   createContextScopeDeps: CreateScope[] = []
// ) {
//   let defaultContexts: any[] = [];

//   /* -----------------------------------------------------------------------------------------------
//    * createContext
//    * ---------------------------------------------------------------------------------------------*/

//   function createContext<ContextValueType extends object | null>(
//     rootComponentName: string,
//     defaultContext?: ContextValueType
//   ) {
//     const BaseContext = React.createContext<ContextValueType | undefined>(
//       defaultContext
//     );
//     const index = defaultContexts.length;
//     defaultContexts = [...defaultContexts, defaultContext];

//     function Provider(
//       props: ContextValueType & {
//         scope: Scope<ContextValueType>;
//         children: React.ReactNode;
//       }
//     ) {
//       const { scope, children, ...context } = props;
//       const Context = scope?.[scopeName][index] || BaseContext;
//       // Only re-memoize when prop values change
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//       const value = React.useMemo(
//         () => context,
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//         Object.values(context)
//       ) as ContextValueType;
//       return <Context.Provider value={value}>{children}</Context.Provider>;
//     }

//     function useContext(
//       consumerName: string,
//       scope: Scope<ContextValueType | undefined>
//     ) {
//       const Context = scope?.[scopeName][index] || BaseContext;
//       const context = React.useContext(Context);
//       if (context) return context;
//       if (defaultContext !== undefined) return defaultContext;
//       // if a defaultContext wasn't specified, it's a required context.
//       throw new Error(
//         `\`${consumerName}\` must be used within \`${rootComponentName}\``
//       );
//     }

//     Provider.displayName = rootComponentName + "Provider";
//     return [Provider, useContext] as const;
//   }

//   /* -----------------------------------------------------------------------------------------------
//    * createScope
//    * ---------------------------------------------------------------------------------------------*/

//   const createScope: CreateScope = () => {
//     const scopeContexts = defaultContexts.map((defaultContext) => {
//       return React.createContext(defaultContext);
//     });
//     return function useScope(scope: Scope) {
//       const contexts = scope?.[scopeName] || scopeContexts;
//       return React.useMemo(
//         () => ({
//           [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts },
//         }),
//         [scope, contexts]
//       );
//     };
//   };

//   createScope.scopeName = scopeName;
//   return [
//     createContext,
//     composeContextScopes(createScope, ...createContextScopeDeps),
//   ] as const;
// }

// /* -------------------------------------------------------------------------------------------------
//  * composeContextScopes
//  * -----------------------------------------------------------------------------------------------*/

// function composeContextScopes(...scopes: CreateScope[]) {
//   const baseScope = scopes[0];
//   if (scopes.length === 1) return baseScope;

//   const createScope: CreateScope = () => {
//     const scopeHooks = scopes.map((createScope) => ({
//       useScope: createScope(),
//       scopeName: createScope.scopeName,
//     }));

//     return function useComposedScopes(overrideScopes) {
//       const nextScopes = scopeHooks.reduce(
//         (nextScopes, { useScope, scopeName }) => {
//           // We are calling a hook inside a callback which React warns against to avoid inconsistent
//           // renders, however, scoping doesn't have render side effects so we ignore the rule.
//           // eslint-disable-next-line react-hooks/rules-of-hooks
//           const scopeProps = useScope(overrideScopes);
//           const currentScope = scopeProps[`__scope${scopeName}`];
//           return { ...nextScopes, ...currentScope };
//         },
//         {}
//       );

//       return React.useMemo(
//         () => ({ [`__scope${baseScope.scopeName}`]: nextScopes }),
//         [nextScopes]
//       );
//     };
//   };

//   createScope.scopeName = baseScope.scopeName;
//   return createScope;
// }

// /* -----------------------------------------------------------------------------------------------*/

// export { createContext, createContextScope };
// export type { CreateScope, Scope };

// const [createTestContext, createTestScope] = createContextScope("Test");

// console.log(createTestScope.scopeName);

// const [TestProvider, useTestContext] = createTestContext("Test", { a: 1 });

// const useTestScope = createTestScope();

// function MyC() {
//   const v = useTestContext("Test", undefined);
//   console.log(v);
//   return <div>1</div>;
// }
// export default function Test() {
//   const scope = useTestScope(undefined);
//   console.log(scope);
//   return (
//     <TestProvider scope={scope["__scopTest"]} a={2}>
//       <MyC></MyC>
//     </TestProvider>
//   );
// }

function Mc() {
  return <div c="a">1</div>;
}

let a = {};
type A = typeof a;
let b = { a: 1 };
function fn(a: A) {
  console.log(a);
}

fn({ ...{ c: 1 } });

export default function Test() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <Button variant="link">Open popover</Button>popover
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input
                id="maxHeight"
                defaultValue="none"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
