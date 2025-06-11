import React from 'react';
import EmailForm from '../components/EmailForm';

const Home = () => (
  <div className="flex flex-col items-center w-full max-w-4xl">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Bulk Email Service</h2>
      <p className="text-gray-600">Send personalized emails to multiple recipients with just a few clicks</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-lg w-full mb-8">
      <h3 className="text-xl font-semibold mb-4 text-blue-600">How It Works</h3>
      <ol className="list-decimal pl-5 space-y-2 mb-4">
        <li>Choose between manual input or Excel file upload</li>
        <li>For manual input: Enter email addresses separated by commas</li>
        <li>For Excel upload: The first row must have 'Email' as the field name, with email addresses starting from the second row</li>
        <li>Write your email subject and body</li>
        <li>Click "Send Emails" to deliver your message</li>
      </ol>
      <p className="text-sm text-gray-500">All fields will be cleared after successful submission</p>
    </div>
    <EmailForm />
  </div>
);

export default Home;