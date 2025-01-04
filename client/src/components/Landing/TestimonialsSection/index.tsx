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
    <section className="py-16 px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
        <div className="space-y-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={testimonial.avatar} />
                <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-gray-600">{testimonial.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
