import React from 'react';
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-16 px-8 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6">Discover & Connect</h1>
        <p className="text-lg mb-8">
          Meet new people, build meaningful relationships, and grow your network effortlessly.
        </p>
        <Button className="bg-white text-indigo-600 hover:bg-gray-200">
          Get Started
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
