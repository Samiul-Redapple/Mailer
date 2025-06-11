import React, { useState } from 'react';
import axios from '../services/api';

const EmailForm = () => {
  const [inputMethod, setInputMethod] = useState('manual'); // 'manual' or 'excel'
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [fileName, setFileName] = useState('');

  // Reference to the file input element
  const fileInputRef = React.useRef();

  const clearForm = () => {
    setEmails('');
    setSubject('');
    setBody('');
    setFile(null);
    setFileName('');
    // Reset the file input
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = '';
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

  const handleManualInput = () => {
    setInputMethod('manual');
    setFile(null);
    setFileName('');
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
    
    setStatus('Sending...');
    
    try {
      const formData = new FormData();
      if (inputMethod === 'excel') {
        formData.append('file', file);
      } else {
        formData.append('emails', emails);
      }
      formData.append('subject', subject);
      formData.append('body', body);

      const res = await axios.post('/emails/send', formData);
      setStatus('Emails sent successfully!');
      console.log(res.data);
      
      // Clear all fields after successful submission
      clearForm();
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatus('');
      }, 3000);
    } catch (error) {
      setStatus('Error sending emails. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="w-full max-w-md">
      {status && (
        <div className={`mb-4 p-3 rounded text-center ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {status}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow w-full">
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
                // Delay the click to ensure the ref is available
                setTimeout(() => {
                  if (fileInputRef && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }, 100);
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
            <p className="text-xs text-gray-500 mt-1">Upload an Excel file with email addresses</p>
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
        
        <div className="flex items-center justify-between">
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Send Emails
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailForm;