'use client';

import React, { useState } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput, { 
  isPossiblePhoneNumber, 
  isValidPhoneNumber,
  parsePhoneNumber
} from 'react-phone-number-input';
import type { Country } from 'react-phone-number-input';
import ReCAPTCHA from 'react-google-recaptcha';
import Link from 'next/link';

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    countryCode: '',
    phone: '',
    email: ''
  });
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [phoneError, setPhoneError] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<Country>('KW');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    const phoneNumber = formData.countryCode ? parsePhoneNumber(`+${formData.countryCode}${value}`) : parsePhoneNumber(value || '');
    // Update selected country when phone number changes
    if (phoneNumber?.country) {
      setSelectedCountry(phoneNumber.country);
    }

    setFormData(prev => ({
      ...prev,
      phone: value || ''
    }));
    
    if (!value) {
      setPhoneError('');
      return;
    }

    if (!isPossiblePhoneNumber(value)) {
      setPhoneError('رقم الهاتف غير صحيح');
    } else if (!isValidPhoneNumber(value)) {
      setPhoneError('رقم الهاتف غير صالح للدولة المحددة');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // if (!recaptchaValue) {
    //   alert('Please verify that you are not a robot');
    //   return;
    // }
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    if (phoneError || !formData.phone) {
      alert('Please enter a valid phone number');
      return;
    }

    // Save to local storage
    localStorage.setItem('userInfo', JSON.stringify(formData));
    console.log('Form submitted and saved to local storage:', formData);
  };

  return (
    <div className="min-h-screen max-w-xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="w-8" />
        <h1 className="text-2xl font-bold">تسجيل</h1>
        <Link href="/" className="text-accent">En</Link>
      </div>
        
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-right">
              الاسم الأول <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              required
              placeholder="الرجاء إدخال الاسم"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-right"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-right">
              اسم العائلة <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              required
              placeholder="الرجاء إدخال اسم عائلتك"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-right"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm mb-1 text-right">
            الهاتف (واتساب) <span className="text-accent">*</span>
          </label>
          <div className="flex gap-2 flex-row-reverse">
            <div className="w-32">
              <PhoneInput
                international
                defaultCountry="KW"
                value={formData.countryCode}
                onChange={(value) => {
                    console.log(value);
                  setFormData(prev => ({
                    ...prev,
                    countryCode: value || ''
                  }));
                }}
                className="bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-right h-[42px]"
                countrySelectProps={{
                  className: "!bg-[#F8FAFC]"
                }}
              />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="الرجاء إدخال رقم الهاتف"
              value={formData.phone}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '');
                handlePhoneChange(numericValue);
              }}
              className="flex-1 px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-right h-[42px]"
              dir="rtl"
            />
          </div>
          {phoneError && (
            <p className="text-red-500 text-sm mt-1 text-right">{phoneError}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1 text-right">
            البريد الإلكتروني <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-right"
          />
        </div>

        {/* Terms and Conditions */}
        <div className="flex justify-end items-center gap-2">
          <label className="text-sm text-right">
            بالمتابعة فإنني أقر بموافقتي على <Link href="#" className="text-accent">الشروط والأحكام</Link>
          </label>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="rounded border-gray-300 text-accent focus:ring-accent"
          />
        </div>

        {/* ReCAPTCHA */}
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
            onChange={(value) => setRecaptchaValue(value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/80 transition-colors text-lg font-semibold"
        >
          تسجيل
        </button>
      </form>
    </div>
  );
}
