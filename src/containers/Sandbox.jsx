/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable no-undef */
/* eslint-disable react/self-closing-comp */

import React, { useState, useEffect, useRef } from "react";
import Editor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";
import { display } from "@mui/system";

const initialValue = `# A demo of \`react-markdown\`
  \`react-markdown\` is a markdown component for React.
  // 👉 Changes are re-rendered as you type.
  👈 Try writing some markdown on the left.
  ## Overview
  * Follows [CommonMark](https://commonmark.org)
  * Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)
  * Renders actual React elements instead of using \`dangerouslySetInnerHTML\`
  * Lets you define your own components (to render \`MyHeading\` instead of \`h1\`)
  * Has a lot of plugins
  ## Table of contents
  Here is an example of a plugin in action
  ([\`remark-toc\`](https://github.com/remarkjs/remark-toc)).
  This section is replaced by an actual table of contents.
  ## Syntax highlighting
  Here is an example of a plugin to highlight code:
  [\`rehype-highlight\`](https://github.com/rehypejs/rehype-highlight).
  \`\`\`js
  import React from 'react'
  import ReactDOM from 'react-dom'
  import ReactMarkdown from 'react-markdown'
  import rehypeHighlight from 'rehype-highlight'
  ReactDOM.render(
    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{'# Your markdown here'}</ReactMarkdown>,
    document.querySelector('#content')
  )
  \`\`\`
  Pretty neat, eh?
  ## GitHub flavored markdown (GFM)
  For GFM, you can *also* use a plugin:
  [\`remark-gfm\`](https://github.com/remarkjs/react-markdown#use).
  It adds support for GitHub-specific extensions to the language:
  tables, strikethrough, tasklists, and literal URLs.
  These features **do not work by default**.
  👆 Use the toggle above to add the plugin.
  | Feature    | Support              |
  | ---------: | :------------------- |
  | CommonMark | 100%                 |
  | GFM        | 100% w/ \`remark-gfm\` |
  ~~strikethrough~~
  * [ ] task list
  * [x] checked item
  https://example.com
  ## HTML in markdown
  ⚠️ HTML in markdown is quite unsafe, but if you want to support it, you can
  use [\`rehype-raw\`](https://github.com/rehypejs/rehype-raw).
  You should probably combine it with
  [\`rehype-sanitize\`](https://github.com/rehypejs/rehype-sanitize).
  <blockquote>
    👆 Use the toggle above to add the plugin.
  </blockquote>
  ## Components
  You can pass components to change things:
  \`\`\`js
  import React from 'react'
  import ReactDOM from 'react-dom'
  import ReactMarkdown from 'react-markdown'
  import MyFancyRule from './components/my-fancy-rule.js'
  ReactDOM.render(
    <ReactMarkdown
      components={{
        // Use h2s instead of h1s
        h1: 'h2',
        // Use a component instead of hrs
        hr: ({node, ...props}) => <MyFancyRule {...props} />
      }}
    >
      # Your markdown here
    </ReactMarkdown>,
    document.querySelector('#content')
  )
  \`\`\`
  ## More info?
  Much more info is available in the
  [readme on GitHub](https://github.com/remarkjs/react-markdown)!
  ***
  A component by [Espen Hovlandsdal](https://espen.codes/)`;

export default function Sandbox() {
  const mdEditor = useRef(null);
  const [value, setValue] = useState(initialValue);
  const [singleView, setSingleView] = useState(false);
  const [rerender, triggerRerender] = useState(true);
  const [allowEdit, setAllowEdit] = useState(true);

  const handleClick = () => {
    if (mdEditor.current) {
      alert(mdEditor.current.getMdValue());
    }
  };

  // mdEditor.current.

  const handleGetMdValue = () => {
    if (mdEditor) {
      alert(mdEditor.getMdValue());
    }
  };

  const handleGetHtmlValue = () => {
    if (mdEditor) {
      alert(mdEditor.getHtmlValue());
    }
  };

  const handleSetValue = () => {
    const text = window.prompt("Content");
    setValue(text);
  };

  const renderHTML = (text) => {
    React.createElement(ReactMarkdown, {
      source: text,
    });
  };

  const handleEditorChange = ({ html, text }) => {
    const newValue = text.replace(/\d/g, "");
    console.log(newValue);
    setValue(newValue);
  };

  const handleImageUpload = (file) =>
    new Promise((resolve) => {
      // eslint-disable-next-line no-undef
      const reader = new FileReader();
      reader.onload = (data) => {
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    }); 
  
    const handleRerender = () => {
      triggerRerender(!rerender);
    }

  //   onCustomImageUpload = (event) => {
  //     console.log("onCustomImageUpload", event);
  //     return new Promise((resolve, reject) => {
  //       const result = window.prompt("Please enter image url here...");
  //       resolve({ url: result });
  //       // custom confirm message pseudo code
  //       // YourCustomDialog.open(() => {
  //       //   setTimeout(() => {
  //       //     // setTimeout 模拟oss异步上传图片
  //       //     // 当oss异步上传获取图片地址后，执行calback回调（参数为imageUrl字符串），即可将图片地址写入markdown
  //       //     const url = 'https://avatars0.githubusercontent.com/u/21263805?s=80&v=4'
  //       //     resolve({url: url, name: 'pic'})
  //       //   }, 1000)
  //       // })
  //     });
  //   };
  
  return (
    <div className="App">
      <button onClick={handleClick}>Get value</button>
      <button onClick={() => {
        setSingleView(!singleView);
        triggerRerender(!rerender);
        handleRerender();
        }} >Change View</button>
      {rerender === true ? 
      <Editor
        ref={mdEditor}
        value={value}
        style={{
          height: "500px",
        }}
        // this config probably isn't very useful, atm, because I can display the raw MD using React-Markdown.
        // config={{
        //   view: {
        //     menu: allowEdit,
        //     // eslint-disable-next-line no-unneeded-ternary
        //     md: singleView === false ? true : false,
        //     html: singleView,
        //     fullScreen: true,
        //     hideMenu: allowEdit,
        //   },
        //   table: {
        //     maxRow: 5,
        //     maxCol: 6,
        //   },
        //   imageUrl: "https://octodex.github.com/images/minion.png",
        //   syncScrollMode: ["leftFollowRight", "rightFollowLeft"],
        // }}
        onImageUpload={handleImageUpload}
        onChange={handleEditorChange}
        // readOnly={singleView}
        // canView={{ menu: true, md: true, html: true, fullScreen: true, hideMenu: false } }
        renderHTML={(text) => <ReactMarkdown children={text} /> }
      /> : null }
    </div>
  );
}

// import React, { Component } from "react";
// import ReactDOM from "react-dom";
// import ReactMarkdown from "react-markdown";
// import MdEditor, { Plugins } from "react-markdown-editor-lite";

// const PLUGINS = undefined;
// // const PLUGINS = ['header', 'divider', 'image', 'divider', 'font-bold', 'full-screen'];

// // MdEditor.use(Plugins.AutoResize, {
// //   min: 200,
// //   max: 800
// // });

// MdEditor.use(Plugins.TabInsert, {
//   tabMapValue: 1, // note that 1 means a '\t' instead of ' '.
// });

// export default class Sandbox extends React.Component {
//   mdEditor = undefined;

//   constructor(props) {
//     super(props);
//     this.renderHTML = this.renderHTML.bind(this);
//     this.state = {
//       value: "# Hello",
//     };
//   }

//   handleEditorChange = (it, event) => {
//     // console.log('handleEditorChange', it.text, it.html, event);
//     this.setState({
//       value: it.text,
//     });
//   };

//   render() {
//     return (
//       <div className="demo-wrap">
//         <h3>react-markdown-editor-lite demo</h3>
//         <nav className="nav">
//           <button onClick={this.handleGetMdValue}>getMdValue</button>
//           <button onClick={this.handleGetHtmlValue}>getHtmlValue</button>
//           <button onClick={this.handleSetValue}>setValue</button>
//         </nav>
//         <div className="editor-wrap" style={{ marginTop: "30px" }}>
//           <MdEditor
//             // eslint-disable-next-line no-return-assign
//             ref={(node) => (this.mdEditor = node || undefined)}
//             value={this.state.value}
//             style={{ height: "500px", width: "100%" }}
//             renderHTML={this.renderHTML}
//             plugins={PLUGINS}
            // config={{
            //   view: {
            //     menu: true,
            //     md: true,
            //     html: true,
            //     fullScreen: true,
            //     hideMenu: true,
            //   },
            //   table: {
            //     maxRow: 5,
            //     maxCol: 6,
            //   },
            //   imageUrl: "https://octodex.github.com/images/minion.png",
            //   syncScrollMode: ["leftFollowRight", "rightFollowLeft"],
            // }}
//             onChange={this.handleEditorChange}
//             onImageUpload={this.handleImageUpload}
//             onFocus={(e) => console.log("focus", e)}
//             onBlur={(e) => console.log("blur", e)}
//             // onCustomImageUpload={this.onCustomImageUpload}
//           />
//           <MdEditor
//             style={{ height: "500px", width: "100%", backgroundColor: "black" }}
//             renderHTML={this.renderHTML}
//           />
//         </div>
//         <div style={{ marginTop: "30px" }}>
//           <MdEditor
//             value={MOCK_DATA}
//             style={{ height: "200px", width: "100%" }}
//             config={{
//               view: {
//                 menu: true,
//                 md: true,
//                 html: true,
//               },
//               imageUrl: "https://octodex.github.com/images/minion.png",
//             }}
//             onChange={this.handleEditorChange}
//           />
//         </div>
//       </div>
//     );
//   }
// }
