'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getCountries, getCountryCallingCode, getExampleNumber } from 'libphonenumber-js';
import ReCAPTCHA from 'react-google-recaptcha';
import Link from 'next/link';
import { IoIosArrowDown } from 'react-icons/io';
import phone from 'phone';
import { FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
    
    if (!value) {
      setPhoneError('');
      return;
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

    setIsSubmitting(true);
    try {
      // Get package data from localStorage
      const packageData = JSON.parse(localStorage.getItem('package') || '[]');
      
      // Save to localStorage
      localStorage.setItem('userInfo', JSON.stringify(formData));
      
      // Send email with both form data and package data
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
        // Clear form data from localStorage
        localStorage.removeItem('package');
        localStorage.removeItem('userInfo');
        // Navigate to success page
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

  return (
    <div className="min-h-screen max-w-xl mx-auto p-6 flex flex-col gap-5 ">
      <div className="flex justify-center relative items-center">
        <div className="w-8" />
        <Link href="/" className="text-accent absolute right-0">
        
          <FaArrowRight className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold">تسجيل</h1>
      </div>
        
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-lg mb-1 text-right">
              الاسم الأول <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              required
              placeholder="الرجاء إدخال الاسم"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-right text-lg"
            />
          </div>
          <div>
            <label className="block text-lg mb-1 text-right">
              اسم العائلة <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              required
              placeholder="الرجاء إدخال اسم عائلتك"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-right text-lg"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="">
          <label className="block text-lg mb-1 text-right">
            الهاتف (واتساب) <span className="text-accent">*</span>
          </label>
          <div dir="ltr" className="flex gap-2">
            <div className="relative flex items-center" ref={dropdownRef}>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg h-[42px] min-w-[120px]">
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
                          handlePhoneChange(country.dialCode);
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
              className="flex-1 px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-right h-[42px] text-lg"
            />
          </div>
          {phoneError && (
            <p className="text-red-500 text-lg mt-1 text-right">{phoneError}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-lg mb-1 text-right">
            البريد الإلكتروني <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-right text-lg"
          />
        </div>

        {/* Terms and Conditions */}
        <div className="flex  items-center gap-2">
          <label className="">
            بالمتابعة فإنني أقر بموافقتي على <Link href="/terms" className="text-accent">الشروط والأحكام</Link>
          </label>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="rounded border-gray-300 text-accent focus:ring-accent"
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
          className={`w-full py-3 rounded-lg transition-colors text-base font-semibold ${
            isSubmitting 
              ? 'bg-accent/50 cursor-not-allowed' 
              : 'bg-accent hover:bg-accent/80'
          } text-white`}
        >
          {isSubmitting ? 'جاري الإرسال...' : 'تسجيل'}
        </button>
      </form>
    </div>
  );
}
