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

interface PaymentMethod {
  PaymentMethodId: number;
  PaymentMethodAr: string;
  PaymentMethodEn: string;
  ImageUrl: string;
  ServiceCharge: number;
  TotalAmount: number;
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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

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

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const packageData = JSON.parse(localStorage.getItem('package') || '[]');
        const selectedPackage = packageData[0].answer;
        const subscription = subscriptions.find(sub => sub.name === selectedPackage);
        
        if (!subscription) {
          throw new Error('الباقة غير موجودة');
        }

        const response = await fetch('/api/create-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            price: subscription.price,
          }),
        });

        const data = await response.json();
        console.log('Payment Methods Response:', data);

        if (data.success && Array.isArray(data.paymentMethods)) {
          // Filter payment methods by specific IDs
          const allowedIds = [2, 1, 32, 11];
          const filteredMethods = data.paymentMethods.filter((method: any) => 
            allowedIds.includes(method.PaymentMethodId)
          );
          
          setPaymentMethods(filteredMethods);
          if (filteredMethods.length > 0) {
            setSelectedPaymentMethod(filteredMethods[0].PaymentMethodId);
          }
        } else {
          throw new Error(data.message || 'فشل في جلب طرق الدفع');
        }
      } catch (error: any) {
        console.error('Error fetching payment methods:', error);
        alert(error.message || 'حدث خطأ أثناء جلب طرق الدفع');
      } finally {
        setIsLoadingPaymentMethods(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    const packageData = JSON.parse(localStorage.getItem('package') || '[]');
    const selectedPackage = packageData[0].answer;
    const subscription = subscriptions.find(sub => sub.name === selectedPackage);
    
    if (subscription) {
      setSubscription(subscription);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    console.log(formData);
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
    console.log(formData);
    if (!agreedToTerms) {
      alert('يرجى الموافقة على الشروط والأحكام');
      return;
    }
    if (phoneError || !formData.phone) {
      alert('يرجى إدخال رقم هاتف صحيح');
      return;
    }
    if (!selectedPaymentMethod) {
      alert('يرجى اختيار طريقة الدفع');
      return;
    }
    if(!localStorage.getItem('package')){
      alert('لا توجد معلومات للمستخدم، يرجى التسجيل مجددا');
      return;
    }

    setIsSubmitting(true);
    try {
      const packageData = JSON.parse(localStorage.getItem('package') || '[]');
      const selectedPackage = packageData[0].answer;
      const subscription = subscriptions.find(sub => sub.name === selectedPackage);
      
      if (!subscription) {
        throw new Error('الباقة غير موجودة');
      }

      // Execute payment with selected method
      const paymentResponse = await fetch('/api/execute-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: subscription.price,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.countryCode + formData.phone,
          paymentMethodId: selectedPaymentMethod,
        }),
      });

      const paymentData = await paymentResponse.json();
      console.log('Payment Response:', paymentData);

      if (paymentData.success) {
        // Store user info and package data
        localStorage.setItem('userInfo', JSON.stringify({
          ...formData,
          package: packageData,
          subscription: subscription
        }));
        
        // Redirect to payment page
        window.location.href = paymentData.paymentUrl;
      } else {
        // Redirect to error page with message
        const errorMessage = encodeURIComponent(paymentData.message || 'فشل في إنشاء الدفع');
        router.push(`/payment-error?message=${errorMessage}`);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert(error.message || 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
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
      <div className="flex justify-center items-center relative mb-8">
        <button 
          onClick={handlePrevious}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowRight className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold">ارسال طلب التسجيل</h1>
      </div>

      <div className="flex flex-col">
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
                <div dir="ltr" className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex items-center" ref={dropdownRef}>
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-lg h-[50px] w-full sm:w-[140px]">
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        className="hover:bg-gray-50"
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
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                setCountryImage(`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`);
                                setIsCountryDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                            >
                              <img
                                src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
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

              {/* Order Summary */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-4 text-right">ملخص الطلب</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative">
                      <Image
                        src={subscription?.image || '/workout.png'}
                        alt={subscription?.name || 'Package'}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-right">
                      <h3 className="text-lg font-medium">{subscription?.name}</h3>
                      <p className="text-gray-600">{subscription?.description}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-semibold">${subscription?.price}</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-lg md:text-xl mb-2 text-right">
                  طريقة الدفع <span className="text-accent">*</span>
                </label>
                {isLoadingPaymentMethods ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600">جاري تحميل طرق الدفع...</p>
                  </div>
                ) : paymentMethods.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.PaymentMethodId}
                        type="button"
                        onClick={() => setSelectedPaymentMethod(method.PaymentMethodId)}
                        className={`p-4 border-2 rounded-lg transition-colors duration-200 ${
                          selectedPaymentMethod === method.PaymentMethodId
                            ? 'border-accent bg-accent/5'
                            : 'border-gray-200 hover:border-accent'
                        }`}
                      >
                        <div className="flex items-center justify-center h-12">
                          <img
                            src={method.ImageUrl}
                            alt={method.PaymentMethodAr}
                            className="h-8 object-contain"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-500 text-center">لا توجد طرق دفع متاحة</p>
                )}
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
