import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white text-center p-6">
      <motion.h1
        className="text-4xl md:text-6xl font-bold"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About This Application ⚡
      </motion.h1>

      <motion.p
        className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        This is a User Management Application built using MERN stack, JWT
        authentication, and Tailwind CSS. It provides secure user authentication
        and management features.
      </motion.p>

      <motion.p
        className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        Designed for efficiency, security, and scalability, this app leverages
        modern web technologies to deliver a smooth experience.
      </motion.p>
    </div>
  );
};

export default About;
