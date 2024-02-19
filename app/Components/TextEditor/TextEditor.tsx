import React, { useEffect, useState } from 'react';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './TextEditor.css';

interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
    description: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange, description }) => {
    const [editorState, setEditorState] = useState(() => {
        const contentState = convertFromHTML(value || '');
        return EditorState.createWithContent(ContentState.createFromBlockArray(contentState.contentBlocks));
    });

    const [startedTyping, setStartedTyping] = useState<boolean>(false);

    useEffect(() => {
        if (description.trim() !== '') {
            setStartedTyping(true);
        }
    }, [description]);

    const handleEditorChange = (editorState: EditorState) => {
        setEditorState(editorState);
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        const htmlContent = draftToHtml(rawContentState);
        const plainText = htmlContent.replace(/<[^>]+>/g, '');
        onChange(plainText);
        setStartedTyping(true);
    };

    return (
        <>
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
                toolbar={{
                    options: ['inline', 'list', 'textAlign']
                }}
            />
            {startedTyping && (description.length < 10 || description.length > 300) && (
                <p className="error-message">Description must be between 10 and 300 characters long</p>
            )}
        </>
    )
}

export default TextEditor;