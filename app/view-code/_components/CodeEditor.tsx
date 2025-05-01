// import React from "react";
// import {
//   Sandpack,
//   SandpackCodeEditor,
//   SandpackLayout,
//   SandpackProvider,
// } from "@codesandbox/sandpack-react";
// import { aquaBlue } from "@codesandbox/sandpack-themes";
// import constant from "../../../data/constant";

// function CodeEditor({ codeResp, isReady }: any) {
//   return (
//     <div>
//       {isReady ? (
//         <Sandpack
//           template="react"
//           theme={aquaBlue}
//           options={{
//             externalResources: ["https://cdn.tailwindcss.com"],
//             showNavigator: true,
//             showTabs: true,
//             editorHeight: 600,
//           }}
//           customSetup={{
//             dependencies: {
//               ...constant.DEPENDANCY,
//             },
//           }}
//           files={{
//             "/App.js": `${codeResp}`,
//           }}
//         />
//       ) : (
//         <SandpackProvider
//           template="react"
//           theme={aquaBlue}
//           files={{
//             "/app.js": {
//               code: `${codeResp}`,
//               active: true,
//             },
//           }}
//           customSetup={{
//             dependencies: {
//               ...constant.DEPENDANCY,
//             },
//           }}
//           options={{
//             externalResources: ["https://cdn.tailwindcss.com"],
//           }}
//         >
//           <SandpackLayout>
//             <SandpackCodeEditor showTabs={true} style={{ height: "70vh" }} />
//           </SandpackLayout>
//         </SandpackProvider>
//       )}
//     </div>
//   );
// }

// export default CodeEditor;


import React from "react";
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { aquaBlue } from "@codesandbox/sandpack-themes";
import constant from "../../../data/constant";

interface CodeEditorProps {
  codeResp: string;
  isReady: boolean;
}

function CodeEditor({ codeResp, isReady }: CodeEditorProps) {
  // Clean the code response if needed
  const cleanedCode = codeResp.replace(/```jsx|```js|```react|```tsx|```/g, '').trim();
  
  return (
    <div className="transition-all duration-300">
      {!isReady ? (
        // When code is being generated or not fully ready, show edit-only view
        <SandpackProvider
          template="react"
          theme={aquaBlue}
          files={{
            "/App.js": {
              code: cleanedCode || "// Code will appear here as it's being generated...",
              active: true,
            },
          }}
          customSetup={{
            dependencies: {
              ...constant.DEPENDANCY,
            },
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
        >
          <SandpackLayout>
            <SandpackCodeEditor 
              showTabs={true} 
              style={{ height: "70vh" }}
              readOnly={true} // Make it read-only during generation
              showReadOnly={false} // Hide the read-only indicator
            />
          </SandpackLayout>
        </SandpackProvider>
      ) : (
        // When code is ready, show the full preview with code editor
        <Sandpack
          template="react"
          theme={aquaBlue}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            showNavigator: true,
            showTabs: true,
            editorHeight: 600,
            autorun: true,
          }}
          customSetup={{
            dependencies: {
              ...constant.DEPENDANCY,
            },
          }}
          files={{
            "/App.js": cleanedCode,
          }}
        />
      )}
    </div>
  );
}

export default CodeEditor;