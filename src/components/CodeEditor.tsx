import React, { useEffect, useState } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import useIsBrowser from '@docusaurus/useIsBrowser';

import {Packages, usePython} from "react-py";

import Controls from './Controls'
import Loader from './Loader'
import Input from './Input'

import "./CodeEditor.css"

const editorOptions = {
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  highlightActiveLine: false,
  showPrintMargin: false
}

const editorOnLoad = (editor) => {
  editor.renderer.setScrollMargin(10, 10, 0, 0)
  editor.moveCursorTo(0, 0)
}

interface CodeEditorProps {
  code: string
  packages?: Packages
}

const isMobile = () => (
    !!navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)/i)
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
)

export default function CodeEditor(props: CodeEditorProps) {
  const { code, packages } = props
  const [input, setInput] = useState(code.trimEnd())
  const [showOutput, setShowOutput] = useState(false)
  const [playFocus, setplayFocus] = useState(false);
  const [resetFocus, setresetFocus] = useState(false);

  useEffect(() => {
    setInput(code.trimEnd())
    setShowOutput(false)
  }, [code])

  const isBrowser = useIsBrowser();
  let AceEditor = null;
  if (isBrowser) {
    AceEditor = require('react-ace').default;
    require("ace-builds/src-noconflict/mode-python");
    require("ace-builds/src-noconflict/theme-textmate");
    require("ace-builds/src-noconflict/theme-idle_fingers");
    require("ace-builds/src-noconflict/ext-language_tools");
  }

  const {
    runPython,
    stdout,
    stderr,
    isLoading,
    isRunning,
    interruptExecution,
    isAwaitingInput,
    sendInput,
    prompt
  } = usePython({ packages })

  function run() {
    runPython(input)
    setShowOutput(true)
  }

  function stop() {
    interruptExecution()
    setShowOutput(false)
  }


  function reset() {
    setShowOutput(false)
    setInput(code.trimEnd())
  }

  function buttons() {
    return <>
      {!isRunning ?
        <button
          className={"icon-button"}
   	  disabled={isLoading || isRunning}
          onClick={run}
          onFocus={() => setplayFocus(true)}
          onBlur={() => setplayFocus(false)}
          aria-label={"Run Code"}
          title={"Run Code"}
        >
        <span className={"icon lsf-icon"} title={"play"}></span>
      </button>
      :
      <button
        className={"icon-button"}
        disabled={isLoading || !isRunning}
        onClick={stop}
        onFocus={() => setplayFocus(true)}
        onBlur={() => setplayFocus(false)}
        aria-label={"Stop Code"}
        title={"Stop Code"}
      >
        <span className={"icon lsf-icon"} title={"stop"}></span>
      </button>
    }
    <button
      className={"icon-button"}
      onClick={reset}
      onFocus={() => setresetFocus(true)}
      onBlur={() => setresetFocus(false)}
      aria-label={"Reset Code Window"}
      title={"Reset Code Window"}
    >
      <span className={"icon lsf-icon"} title={"refresh"}></span>
    </button>
    </>;
  }

  function output() {
    return (
      <pre className={"output-window"}>
        <span>{stdout}</span>
        <span style={{color: "var(--text-code-error)"}}>{stderr}</span>
      </pre>
    );
  }

  function editor() {
    return <AceEditor
      value={input}
      mode="python"
      name="CodeBlock"
      fontSize={'0.9rem'}
      onChange={(newValue, e) => setInput(newValue)}
      width='100%'
      maxLines={Infinity}
      style={{backgroundColor: "rgba(0, 0, 0, 0)"}}
      onLoad={editorOnLoad}
      editorProps={{$blockScrolling: true}}
      setOptions={editorOptions}
    />;
  }

  function showButtons() {
    return props.showButtons || isMobile() || playFocus || resetFocus;
  }

  const fallback = <pre style={{margin: 0, padding: "0.55rem"}}>{input}</pre>;

  return <BrowserOnly fallback={fallback}>
    {() => (
      <div className={"code-editor"} onMouseLeave={() => {
        setplayFocus(false);
        setresetFocus(false);
      }}>
        <div className={"code-editor-window"} style={showOutput ? {borderRadius: ".25em .25em 0 0"} : {}}>
          {editor()}
          <div className={"button-container"} style={showButtons() ? {opacity: 100} : {}}>
            {isLoading ? <span>Loading...</span> : buttons()}
          </div>
        </div>
        {showOutput && output()}
      </div>
    )}
  </BrowserOnly>
}
