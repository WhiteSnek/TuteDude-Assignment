import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users, MessageSquare } from "lucide-react";

const features = [
  {
    icon: <UserPlus className="text-indigo-600 w-12 h-12 mb-4" />,
    title: "Easy Connections",
    description: "Find and connect with people who share your interests.",
  },
  {
    icon: <Users className="text-indigo-600 w-12 h-12 mb-4" />,
    title: "Community Groups",
    description: "Join groups to share experiences and ideas.",
  },
  {
    icon: <MessageSquare className="text-indigo-600 w-12 h-12 mb-4" />,
    title: "Seamless Communication",
    description: "Chat and stay in touch with your network.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-12">
          Features Designed for You
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 bg-white rounded-lg"
            >
              <CardHeader className="flex flex-col items-center">
                {feature.icon}
                <CardTitle className="text-xl font-semibold mt-4 text-gray-800">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
