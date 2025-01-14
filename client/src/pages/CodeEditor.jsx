import { useEffect, useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import FileTree from "../components/Tree";
import { useSocket } from "../context/SocketContext";
import { getFileMode } from "../utils/getFileMode";
import { backendurl } from "../utils/urls";
import Terminal from "../components/Terminal";
import '../App.css';

function CodeEditor() {
  const [fileTree, setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState("/Readme.txt");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const { User } = useSocket();

  const isSaved = selectedFileContent === code;

  // File tree fetching
  const getFileTree = useCallback(async () => {
    try {
      const response = await axios.get(`${User.socketUrl}/files`);
      setFileTree(response.data.tree);
      setError(null);
    } catch (error) {
      console.error("Error fetching file tree:", error);
      setError("Failed to load file structure");
    }
  }, []);

  // File content fetching
  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;
    
    try {
      const response = await fetch(
        `${User.socketUrl}/files/content?path=${selectedFile}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setSelectedFileContent(result.content);
      setError(null);
    } catch (error) {
      console.error("Error fetching file contents:", error);
      setError("Failed to load file contents");
    }
  }, [selectedFile]);

  // Initial file tree load
  useEffect(() => {
    
    getFileTree();
  }, [getFileTree]);

  // Socket event handling
  useEffect(() => {
    if (!User.Socket) return;

    User.Socket.on("file:refresh", getFileTree);
    
    return () => {
      User.Socket.off("file:refresh", getFileTree);
    };
  }, [User.Socket, getFileTree]);

  // File change handling with debounce
  useEffect(() => {
    if (!User.Socket || isSaved || !code) return;

    const timer = setTimeout(() => {
      User.Socket.emit("file:change", {
        path: selectedFile,
        content: code,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [code, selectedFile, isSaved, User.socket]);

  // Reset code when selecting new file
  useEffect(() => {
    setCode("");
  }, [selectedFile]);

  // Update code when file content changes
  useEffect(() => {
    setCode(selectedFileContent);
  }, [selectedFileContent]);

  // Fetch file contents when selected file changes
  useEffect(() => {
    if (selectedFile) getFileContents();
  }, [getFileContents, selectedFile]);

  const handleFileSelect = (path) => {
    setSelectedFileContent("");
    setSelectedFile(path);
    setError(null);
  };

  return (
    <div>
      <div className="playground-container">
        <div className="editor-container">
          <div className="files">
            <FileTree
              onSelect={handleFileSelect}
              tree={fileTree}
            />
          </div>
          <div className="editor">
            {error && (
              <div className="error-message" style={{ color: 'red', padding: '10px' }}>
                {error}
              </div>
            )}
            {selectedFile && (
              <p className="file-path">
                {selectedFile.replaceAll("/", ">")}
              </p>
            )}
            <Editor
              onChange={setCode}
              value={code}
              height="60vh"
              theme="vs-dark"
              defaultLanguage={getFileMode({ selectedFile })}
              loading={<div>Loading editor...</div>}
            />
          </div>
        </div>
      </div>
      <div className="terminal-container">
        <Terminal />
      </div> 
    </div>
  );
}

export default CodeEditor;