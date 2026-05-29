'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import apiClient from '@/api';
import type { ContactDict } from '@/components/Contact/translations';

interface ContactFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactForm({ t }: { t: ContactDict['form'] }) {
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      setSubmitStatus({ type: 'success', message: t.success });
      setFormData({ name: '', surname: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus({ type: 'error', message: t.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700';
  const inputCls =
    'border-gray-200 focus-visible:border-[#006653] focus-visible:ring-[#006653]/20';

  return (
    <Card className="border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] w-full">
      <CardContent className="p-6 sm:p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelCls}>
                {t.firstName} <span className="text-[#006653]">*</span>
              </label>
              <Input
                id="name"
                name="name"
                className={inputCls}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="surname" className={labelCls}>
                {t.lastName} <span className="text-[#006653]">*</span>
              </label>
              <Input
                id="surname"
                name="surname"
                className={inputCls}
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={labelCls}>
              {t.email} <span className="text-[#006653]">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              className={inputCls}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelCls}>
              {t.phone} <span className="text-[#006653]">*</span>
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              className={inputCls}
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="message" className={labelCls}>
              {t.message}
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder={t.message}
              className={`${inputCls} min-h-[130px] resize-none`}
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          {submitStatus.type && (
            <div
              className={`flex items-center gap-2 rounded-lg p-4 text-sm ${
                submitStatus.type === 'success'
                  ? 'border border-green-200 bg-green-50 text-green-800'
                  : 'border border-red-200 bg-red-50 text-red-800'
              }`}>
              {submitStatus.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0" />
              )}
              {submitStatus.message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full rounded-xl bg-[#006653] py-6 text-base font-semibold text-white transition-colors hover:bg-[#00543f]"
            disabled={isSubmitting}>
            {isSubmitting ? t.submitting : t.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
