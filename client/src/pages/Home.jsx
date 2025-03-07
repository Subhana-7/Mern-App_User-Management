import React from "react";
import { motion } from "framer-motion";


const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white text-center p-6">
      <motion.h1
        className="text-4xl md:text-6xl font-bold"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to My Developer Space 🚀
      </motion.h1>
      
      <motion.p
        className="mt-4 text-lg md:text-xl text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Building cool things with MERN, Tailwind, and beyond!
      </motion.p>

      <motion.div
        className="mt-8 flex gap-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <a
          href="https://github.com/Subhana-7/Mern-App_User-Management"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/subhana-sn-4b4b50307/"
          className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg transition"
        >
          LinkedIn
        </a>
      </motion.div>
    </div>
  );
};

export default Home;
