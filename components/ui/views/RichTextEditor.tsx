import React, { useRef, useState, useEffect } from 'react';

interface RichTextEditorProps {
    value?: string;
    setValue: (value: string) => void;
    className?: string;
    placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value = '',
    setValue,
    className = '',
    placeholder = 'Start typing...',
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [hasContent, setHasContent] = useState(!!value);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = value;
        }
    }, []);

    const handleInput = () => {
        if (editorRef.current) {
            setValue(editorRef.current.innerHTML);
            setHasContent(!!editorRef.current.innerText.trim());
        }
    };

    const execCommand = (command: string, value: string = '') => {
        document.execCommand(command, false, value);
        handleInput();
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    const handleBold = () => execCommand('bold');
    const handleItalic = () => execCommand('italic');
    const handleUnderline = () => execCommand('underline');
    const handleStrikethrough = () => execCommand('strikeThrough');

    const handleFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
        execCommand('fontSize', e.target.value);
    };

    const handleFontColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        execCommand('foreColor', e.target.value);
    };

    const handleLink = () => {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
            const url = prompt('Enter URL:', 'https://');
            if (url) {
                // Create a link with target="_blank" and color style
                document.execCommand('insertHTML', false,
                    `<a href="${url}" target="_blank" class="text-primary">${selection}</a>`);
                handleInput();
            }
        } else {
            alert('Please select text to create a link');
        }
    };

    const detectLinks = () => {
        if (editorRef.current) {
            // Simple URL detection regex
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const html = editorRef.current.innerHTML;
            const updatedHtml = html.replace(
                urlRegex,
                '<a href="$1" target="_blank" class="text-primary">$1</a>'
            );
            editorRef.current.innerHTML = updatedHtml;
            handleInput();
        }
    };

    return (
        <div className="flex flex-col border rounded-md">
            <div className="flex flex-wrap items-center p-2 border-b bg-gray-50">
                <button
                    type="button"
                    onClick={handleBold}
                    className="p-1 mx-1 hover:bg-gray-200 rounded"
                    title="Bold"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={handleItalic}
                    className="p-1 mx-1 hover:bg-gray-200 rounded"
                    title="Italic"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={handleUnderline}
                    className="p-1 mx-1 hover:bg-gray-200 rounded"
                    title="Underline"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={handleStrikethrough}
                    className="p-1 mx-1 hover:bg-gray-200 rounded"
                    title="Strikethrough"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z" />
                    </svg>
                </button>
                <div className="mx-1">
                    <select
                        onChange={handleFontSize}
                        className="p-1 border rounded hover:bg-gray-200"
                        title="Font Size"
                    >
                        <option value="">Size</option>
                        <option value="1">Small</option>
                        <option value="3">Normal</option>
                        <option value="5">Large</option>
                        <option value="7">Huge</option>
                    </select>
                </div>
                <div className="mx-1 flex items-center">
                    <span className="mr-1">Color:</span>
                    <input
                        type="color"
                        onChange={handleFontColor}
                        className="w-6 h-6 border rounded cursor-pointer"
                        title="Font Color"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleLink}
                    className="p-1 mx-1 hover:bg-gray-200 rounded"
                    title="Insert Link"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={detectLinks}
                    className="p-1 mx-1 hover:bg-gray-200 rounded"
                    title="Auto-detect Links"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" />
                    </svg>
                </button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                className={`p-3 min-h-[200px] focus:outline-none ${className}`}
                onInput={handleInput}
                onBlur={handleInput}
                data-placeholder={placeholder}
                style={{
                    position: 'relative',
                }}
            />
            {!hasContent && (
                <div
                    className="absolute text-gray-400 pointer-events-none p-3"
                    style={{ top: '2.5rem' }}
                >
                    {placeholder}
                </div>
            )}
        </div>
    );
};

export default RichTextEditor;
