import React, { useState } from 'react';
import axios from '../services/api';

const EmailForm = () => {
  const [inputMethod, setInputMethod] = useState('manual'); // 'manual' or 'excel'
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [status, setStatus] = useState('');
  const [fileName, setFileName] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  // References to the file input elements
  const fileInputRef = React.useRef();
  const attachmentInputRef = React.useRef();

  const clearForm = () => {
    setEmails('');
    setSubject('');
    setBody('');
    setFile(null);
    setAttachment(null);
    setFileName('');
    setAttachmentName('');
    
    // Reset the file inputs
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (attachmentInputRef && attachmentInputRef.current) {
      attachmentInputRef.current.value = '';
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setInputMethod('excel');
    } else {
      setFile(null);
      setFileName('');
    }
  };

  const handleAttachmentChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setAttachment(selectedFile);
      setAttachmentName(selectedFile.name);
    } else {
      setAttachment(null);
      setAttachmentName('');
    }
  };

  const handleManualInput = () => {
    setInputMethod('manual');
    setFile(null);
    setFileName('');
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentName('');
    if (attachmentInputRef && attachmentInputRef.current) {
      attachmentInputRef.current.value = '';
    }
  };

  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResults(null);
    setShowResults(false);
    
    // Validation
    if (inputMethod === 'manual' && !emails.trim()) {
      setStatus('Error: Please enter email recipients');
      return;
    }
    
    if (inputMethod === 'excel' && !file) {
      setStatus('Error: Please upload an Excel file');
      return;
    }
    
    if (!subject.trim()) {
      setStatus('Error: Please enter a subject');
      return;
    }
    
    if (!body.trim()) {
      setStatus('Error: Please enter an email body');
      return;
    }
    
    setStatus('Sending emails... This may take a moment.');
    
    try {
      const formData = new FormData();
      if (inputMethod === 'excel') {
        formData.append('file', file);
      } else {
        formData.append('emails', emails);
      }
      
      // Add attachment if exists
      if (attachment) {
        formData.append('attachment', attachment);
      }
      
      formData.append('subject', subject);
      formData.append('body', body);

      const res = await axios.post('/emails/send', formData);
      
      // Store results for display
      setResults(res.data);
      setShowResults(true);
      
      // Set success message with summary
      const { summary } = res.data;
      setStatus(`Success! Sent ${summary.sent} of ${summary.total} emails.`);
      
      // Clear all fields after successful submission
      clearForm();
      
      // Don't auto-clear status when showing results
      if (summary.failed === 0) {
        // Only auto-clear if all emails were sent successfully
        setTimeout(() => {
          setStatus('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Handle specific error messages from the backend
      if (error.response && error.response.data && error.response.data.error) {
        setStatus(`Error: ${error.response.data.error}`);
      } else {
        setStatus('Error sending emails. Please try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      {status && (
        <div className={`mb-4 p-3 rounded text-center ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {status}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow w-full mb-4">
        <div className="mb-6">
          <div className="flex border rounded overflow-hidden">
            <button 
              type="button" 
              onClick={handleManualInput}
              className={`flex-1 py-2 px-4 text-center ${inputMethod === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              Manual Input
            </button>
            <button 
              type="button" 
              onClick={() => {
                setInputMethod('excel');
                // Don't automatically open file dialog
              }}
              className={`flex-1 py-2 px-4 text-center ${inputMethod === 'excel' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              Excel Upload
            </button>
          </div>
        </div>
        
        {inputMethod === 'manual' ? (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emails">
              Email Recipients
            </label>
            <input 
              id="emails"
              type="text" 
              placeholder="Emails (comma separated)" 
              value={emails} 
              onChange={(e) => setEmails(e.target.value)} 
              className="border p-2 w-full rounded" 
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
              Excel File with Email Addresses
            </label>
            <div className="flex items-center">
              <input 
                id="file"
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx,.xls"
                className="hidden" 
              />
              <div className="flex-1 border rounded p-2 bg-gray-50 truncate">
                {fileName || 'No file selected'}
              </div>
              <button 
                type="button"
                onClick={() => {
                  if (fileInputRef && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
              >
                Browse
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Upload an Excel file with the first row containing an 'Email' column</p>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
            Subject
          </label>
          <input 
            id="subject"
            type="text" 
            placeholder="Subject" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            className="border p-2 w-full rounded" 
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">
            Email Body
          </label>
          <textarea 
            id="body"
            placeholder="Body" 
            value={body} 
            onChange={(e) => setBody(e.target.value)} 
            className="border p-2 w-full rounded min-h-[100px]"
          ></textarea>
        </div>
        
        {/* Attachment Section */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attachment">
            Attachment (Optional)
          </label>
          <div className="flex items-center">
            <input 
              id="attachment"
              type="file" 
              ref={attachmentInputRef}
              onChange={handleAttachmentChange}
              className="hidden" 
            />
            <div className="flex-1 border rounded p-2 bg-gray-50 truncate">
              {attachmentName || 'No attachment selected'}
            </div>
            <button 
              type="button"
              onClick={() => {
                if (attachmentInputRef && attachmentInputRef.current) {
                  attachmentInputRef.current.click();
                }
              }}
              className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
            >
              Browse
            </button>
            {attachment && (
              <button 
                type="button"
                onClick={removeAttachment}
                className="ml-2 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded"
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Supported file types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, ZIP, JPG, JPEG, PNG, GIF
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Send Emails
          </button>
        </div>
      </form>
      
      {/* Results Display */}
      {showResults && results && (
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Email Sending Results</h3>
          
          <div className="flex mb-4">
            <div className="bg-blue-100 p-3 rounded flex-1 text-center mr-2">
              <div className="text-xl font-bold">{results.summary.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-green-100 p-3 rounded flex-1 text-center mr-2">
              <div className="text-xl font-bold text-green-700">{results.summary.sent}</div>
              <div className="text-sm text-gray-600">Sent</div>
            </div>
            <div className="bg-red-100 p-3 rounded flex-1 text-center">
              <div className="text-xl font-bold text-red-700">{results.summary.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
          
          {results.summary.failed > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Failed Emails:</h4>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                <ul className="text-sm">
                  {results.results
                    .filter(item => item.status === 'failed')
                    .map((item, index) => (
                      <li key={index} className="mb-1 pb-1 border-b border-gray-100 last:border-0">
                        <span className="font-medium">{item.email}</span>: {item.error}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
          
          <button 
            onClick={() => setShowResults(false)} 
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded w-full"
          >
            Hide Results
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailForm;