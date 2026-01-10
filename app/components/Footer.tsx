
"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
      &copy; {new Date().getFullYear()} My Dashboard. All rights reserved.
    </footer>
  );
}
