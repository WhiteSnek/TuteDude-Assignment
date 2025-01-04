import React from 'react';
import { Button } from "@/components/ui/button";
import { heroImage } from '@/assets';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      ></div>
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl font-extrabold mb-6">
          Discover & Connect
        </h1>
        <p className="text-lg mb-8">
          Meet new people, build meaningful relationships, and grow your network effortlessly.
        </p>
        <div className="space-x-4">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md">
            Get Started
          </Button>
          <Button className="bg-white text-indigo-600 hover:bg-gray-200 px-6 py-3 rounded-md">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
