'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import apiClient from '@/api';

interface ContactFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    surname: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const queryParams = new URLSearchParams({
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      }).toString();

      await apiClient.post(`/contact?${queryParams}`);

      setSubmitStatus({
        type: 'success',
        message: 'Your message has been sent successfully!',
      });

      // Reset form
      setFormData({
        name: '',
        surname: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-xs border border-[#ECECECEE] w-[100%]">
      <CardContent className="p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                id="name"
                name="name"
                placeholder="First Name*"
                className="border-[#ececec]"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                id="surname"
                name="surname"
                placeholder="Last Name*"
                className="border-[#ececec]"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email*"
              className="border-[#ececec]"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Phone Number*"
              className="border-[#ececec]"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Textarea
              id="message"
              name="message"
              placeholder="Your message..."
              className="border-[#ececec] min-h-[120px] resize-none"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          {submitStatus.type && (
            <div
              className={`p-4 rounded-lg text-sm ${
                submitStatus.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
              {submitStatus.message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#F57D0D] hover:bg-[#f57d0db9] text-white py-3 text-lg font-semibold rounded-[12px] p-3"
            disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}