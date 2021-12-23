
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import { useState } from "react"


interface iPros {
    code?: string
    readOnly: boolean,
    onChange: Function
}

function PipelineDetailPage({ code, readOnly, onChange}: iPros): JSX.Element {
    return (<CodeMirror
        onChange={(editor:any) => { onChange(editor.getValue())}}
        value={code}
        options={{
            theme: 'monokai',
            tabSize: 2,
            keyMap: 'sublime',
            mode: 'yaml',
            readOnly: readOnly,
        }}
    />
    );
}

export default PipelineDetailPage;
