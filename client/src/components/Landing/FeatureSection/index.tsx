import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users, MessageSquare } from "lucide-react";

const features = [
  {
    icon: <UserPlus className="text-indigo-600 w-10 h-10 mb-4" />,
    title: "Easy Connections",
    description: "Find and connect with people who share your interests.",
  },
  {
    icon: <Users className="text-indigo-600 w-10 h-10 mb-4" />,
    title: "Community Groups",
    description: "Join groups to share experiences and ideas.",
  },
  {
    icon: <MessageSquare className="text-indigo-600 w-10 h-10 mb-4" />,
    title: "Seamless Communication",
    description: "Chat and stay in touch with your network.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 px-8 bg-gray-100">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6">
              <CardHeader>
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
