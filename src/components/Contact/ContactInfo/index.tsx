import { MapPin, Phone, Mail } from 'lucide-react';

const contactItems = [
  {
    icon: MapPin,
    text: 'London, 121 B Baker street',
  },
  {
    icon: Phone,
    text: '+994 77 323 12 07',
  },
  {
    icon: Mail,
    text: 'contact@looker.com',
  },
];

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Let&apos;s talk with us
        </h2>
        <p className="text-gray-600 text-lg w-2/3">
          Questions, comments, or suggestions? Simply fill in the form and{' '}
          we&apos;ll be in touch shortly.
        </p>
      </div>

      <div className="space-y-6">
        {contactItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Icon className="w-6 h-6 text-[#1C5858] mt-1" />
              </div>
              <div>
                <p className="text-gray-600">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
