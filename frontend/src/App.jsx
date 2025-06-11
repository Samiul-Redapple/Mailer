import React from 'react';
import Home from './pages/Home';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AutoMailer</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:text-blue-200">Home</a></li>
              <li><a href="#" className="hover:text-blue-200">About</a></li>
              <li><a href="#" className="hover:text-blue-200">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto py-10 px-4 flex justify-center">
        <Home />
      </main>
      
      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} AutoMailer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;