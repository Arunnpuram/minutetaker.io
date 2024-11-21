import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="bg-gray-800 p-4 shadow">
        <h1 className="text-xl font-bold">minutetaker.io</h1>
      </header>
      <main className="flex-1 p-6">{children}</main>
      <footer className="bg-gray-800 p-4 text-center text-sm">
        © 2024 minutetaker.io - All Rights Reserved.
      </footer>
    </div>
  );
};

export default Layout;
