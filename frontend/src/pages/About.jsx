import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">About AutoMailer</h2>
        <p className="text-gray-600">Your efficient solution for personalized bulk email campaigns</p>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-full mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-blue-600">What is AutoMailer?</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          AutoMailer is a powerful web application designed to simplify the process of sending personalized 
          emails to multiple recipients simultaneously. Whether you're sending newsletters, promotional offers, 
          event invitations, or important announcements, AutoMailer streamlines your email marketing workflow.
        </p>
        
        <h3 className="text-xl font-semibold mb-3 text-blue-600">Key Features</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700">
          <li><span className="font-medium">Flexible Input Options:</span> Enter email addresses manually or upload an Excel spreadsheet with recipient information.</li>
          <li><span className="font-medium">File Attachments:</span> Include important documents, images, or other files with your emails.</li>
          <li><span className="font-medium">Detailed Results:</span> Get comprehensive reports on successful deliveries and failed attempts.</li>
          <li><span className="font-medium">User-Friendly Interface:</span> Intuitive design makes it easy to compose and send emails without technical expertise.</li>
          <li><span className="font-medium">Secure Processing:</span> Your data and email content are handled with strict security measures.</li>
        </ul>
        
        <h3 className="text-xl font-semibold mb-3 text-blue-600">Why Use AutoMailer?</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Time Efficiency</h4>
            <p className="text-gray-700">Send hundreds of personalized emails in minutes instead of hours, freeing up valuable time for other important tasks.</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Cost-Effective</h4>
            <p className="text-gray-700">Eliminate the need for expensive email marketing platforms while maintaining professional communication standards.</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Improved Engagement</h4>
            <p className="text-gray-700">Personalized emails have higher open and response rates compared to generic mass mailings.</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Detailed Tracking</h4>
            <p className="text-gray-700">Monitor which emails were successfully delivered and identify any delivery issues for follow-up.</p>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-blue-600">Ideal For</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700">
          <li><span className="font-medium">Small Businesses:</span> Send promotional offers, product updates, and customer communications.</li>
          <li><span className="font-medium">Educational Institutions:</span> Distribute announcements, event invitations, and important notices to students and staff.</li>
          <li><span className="font-medium">Non-Profit Organizations:</span> Keep donors and volunteers informed about upcoming events and initiatives.</li>
          <li><span className="font-medium">HR Departments:</span> Send company-wide announcements and updates to employees.</li>
          <li><span className="font-medium">Event Organizers:</span> Distribute invitations, schedules, and follow-up communications to attendees.</li>
        </ul>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700 italic">
            "AutoMailer was developed with a focus on simplicity and efficiency, making email campaigns accessible to everyone 
            regardless of technical expertise. We believe effective communication should be straightforward and hassle-free."
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;