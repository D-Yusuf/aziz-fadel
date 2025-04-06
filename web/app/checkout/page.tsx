'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getCountries, getCountryCallingCode, getExampleNumber } from 'libphonenumber-js';
import ReCAPTCHA from 'react-google-recaptcha';
import Link from 'next/link';
import { IoIosArrowDown } from 'react-icons/io';
import phone from 'phone';
import { FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Header from '@/components/questions/Header';
import { subscriptions } from '@/data';
import Image from 'next/image';
import logo from '@/public/logo.svg';

interface Country {
  code: string;
  name: string;
  dialCode: string;
}

const countries: Country[] = getCountries().map(code => ({
  code,
  name: new Intl.DisplayNames(['ar'], { type: 'region' }).of(code) || code,
  dialCode: `+${getCountryCallingCode(code)}`
}));

export default function CheckoutPage() {
  const router = useRouter();
  const [storedUrl, setStoredUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    countryCode: '+965',
    country: 'Kuwait'
  });
  const [countryImage, setCountryImage] = useState<string>('https://flagcdn.com/24x18/kw.png');
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [phoneError, setPhoneError] = useState<string>('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const phoneData = phone(formData.countryCode + formData.phone);
    if (!phoneData.isValid) {
      setPhoneError('رقم الهاتف غير صحيح');
    } else {
      setPhoneError('');
      
    }
  }, [formData.countryCode, formData.phone]);

  useEffect(() => {
    const url = localStorage.getItem('prevUrl');
    if (url) {
      setStoredUrl(url);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (value: string) => {
    // Remove any non-numeric characters and leading zeros
    const numericValue = value.replace(/[^0-9]/g, '').replace(/^0+/, '');
    
    setFormData(prev => ({
      ...prev,
      phone: numericValue
    }));
    
    if (!numericValue) {
      setPhoneError('');
      return;
    }

    const phoneData = phone(formData.countryCode + numericValue);
    if (!phoneData.isValid) {
      setPhoneError('رقم الهاتف غير صحيح');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    if (phoneError || !formData.phone) {
      alert('Please enter a valid phone number');
      return;
    }
    if(!localStorage.getItem('package')){
      alert('لا توجد معلومات للمستخدم، يرجى التسجيل مجددا');
      return;
    }

    setIsSubmitting(true);
    try {
      const packageData = JSON.parse(localStorage.getItem('package') || '[]');
      localStorage.setItem('userInfo', JSON.stringify(formData));
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          package: packageData
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem('package');
        localStorage.removeItem('userInfo');
        router.push('/success');
      } else {
        alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    const selectedPackage = JSON.parse(localStorage.getItem('package') || '[]')[0].answer || null;
    if (!selectedPackage) {
      router.push('/');
      return;
    }
    console.log(selectedPackage);
    const packageId = subscriptions.find(subscription => subscription.name === selectedPackage)?.id;
    if (storedUrl) {
      router.push(storedUrl);
    } else {
      router.push(`/packages/${packageId}`);
    }
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-6">
      <div className="flex justify-center items-center relative mb-8 ">
        
      </div>
      <div className=" flex flex-col">
        {/* Header section */}
        <div className="p-4 md:p-6">
          <div className="max-w-2xl mx-auto flex justify-center relative items-center">
            <div className="w-8" />
         
            <h1 className="text-2xl md:text-3xl font-bold">ارسال طلب التسجيل</h1>
        <button 
          onClick={handlePrevious}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowRight className="w-6 h-6 text-gray-600" />
        </button>
          </div>
        </div>

        {/* Form section */}
        <div className="flex-1 flex items-start">
          <div className="w-full max-w-2xl mx-auto p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg md:text-xl mb-2 text-right">
                    الاسم الأول <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="فلان"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-right text-lg md:text-xl"
                  />
                </div>
                <div>
                  <label className="block text-lg md:text-xl mb-2 text-right">
                    اسم العائلة <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="الفلاني"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-right text-lg md:text-xl"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-lg md:text-xl mb-2 text-right">
                  الهاتف (واتساب) <span className="text-accent">*</span>
                </label>
                <div dir="ltr" className="flex gap-2">
                  <div className="relative flex items-center" ref={dropdownRef}>
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-lg h-[50px] min-w-[140px]">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className=" hover:bg-gray-50"
                    >
                      <IoIosArrowDown 
                        className={`w-5 h-5 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                      <img
                        src={countryImage}
                        alt="Country flag"
                        className="w-6 h-4"
                      />
                      <span className="text-lg">{formData.countryCode}</span>
                    </div>
                    
                    {isCountryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-[300px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="p-2 border-b">
                          <input
                            type="text"
                            placeholder="ابحث عن الدولة أو الرمز"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              
                            }}
                            className="text-right w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-lg"
                          />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          {filteredCountries.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  countryCode: country.dialCode,
                                  country: country.name
                                }));
                                // handlePhoneChange(country.dialCode);
                                setCountryImage(`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`);
                                setIsCountryDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                            >
                              <img
                                src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
                                srcSet={`https://flagcdn.com/48x36/${country.code.toLowerCase()}.png 2x`}
                                alt={`${country.name} flag`}
                                className="w-6 h-4"
                              />
                              <span className="text-lg">{country.name}</span>
                              <span className="text-lg text-gray-500 ml-auto">{country.dialCode}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="الرجاء إدخال رقم الهاتف"
                    value={formData.phone}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, '');
                      handlePhoneChange(numericValue);
                    }}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    className="flex-1 px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-right h-[50px] text-lg md:text-xl"
                  />
                </div>
                {phoneError && (
                  <p className="text-red-500 text-lg md:text-xl mt-2 text-right">{phoneError}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-lg md:text-xl mb-2 text-right">
                  البريد الإلكتروني <span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="البريد الإلكتروني"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-right text-lg md:text-xl"
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center gap-2">
                <label className="text-lg md:text-xl">
                  بالمتابعة فإنني أقر بموافقتي على <Link href="/terms" className="text-accent">الشروط والأحكام</Link>
                </label>
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                />
              </div>

              {/* ReCAPTCHA */}
              {/* <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                  onChange={(value) => setRecaptchaValue(value)}
                />
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg transition-colors text-lg md:text-xl font-semibold ${
                  isSubmitting 
                    ? 'bg-accent/50 cursor-not-allowed' 
                    : 'bg-accent hover:bg-accent/80'
                } text-white`}
              >
                {isSubmitting ? 'جاري الإرسال...' : 'تسجيل'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
