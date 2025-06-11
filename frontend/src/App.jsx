import React, { useState } from 'react';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AutoMailer</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('home');
                  }}
                  className={`hover:text-blue-200 ${currentPage === 'home' ? 'font-bold underline' : ''}`}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('about');
                  }}
                  className={`hover:text-blue-200 ${currentPage === 'about' ? 'font-bold underline' : ''}`}
                >
                  About
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto py-10 px-4 flex justify-center flex-grow">
        {renderPage()}
      </main>
      
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} AutoMailer. All rights reserved.</p>
          <p className="text-sm mt-1 text-gray-400">Created by <a href="https://github.com/isksamiul" target="_blank" rel="noopener noreferrer" className="text-blue-300 font-medium hover:text-blue-200 hover:underline">isksamiul</a></p>
        </div>
      </footer>
    </div>
  );
}

export default App;