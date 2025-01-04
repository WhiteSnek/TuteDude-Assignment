import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "John Doe",
    feedback: "This platform helped me find amazing people to collaborate with!",
    avatar: "https://via.placeholder.com/150",
  },
  {
    name: "Jane Smith",
    feedback: "A fantastic way to build a professional network!",
    avatar: "https://via.placeholder.com/150",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-4xl font-extrabold text-gray-800 mb-12">
          What Our Users Say
        </h2>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 text-left border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">

                <Avatar className="w-14 h-14">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>

                <p className="font-bold text-lg text-gray-800">
                  {testimonial.name}
                </p>
              </div>

              <div className="relative px-10">
                <span className="absolute ml-16 -left-6 -top-4 text-indigo-500 text-6xl font-serif leading-none">
                  “
                </span>
                <p className="text-gray-800 font-light text-lg pl-6">{testimonial.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
