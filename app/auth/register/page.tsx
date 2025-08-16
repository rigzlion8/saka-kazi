'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Loader2, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Check,
  Edit
} from 'lucide-react';
import { config } from '@/lib/config';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'customer' | 'provider';
  location: string;
}

interface RegistrationStep {
  id: number;
  title: string;
  description: string;
  field: keyof FormData;
  type: 'text' | 'email' | 'tel' | 'password' | 'select' | 'role';
  placeholder: string;
  validation?: (value: string) => string | null;
}

const registrationSteps: RegistrationStep[] = [
  {
    id: 1,
    title: "What's your first name?",
    description: "We'll use this to personalize your experience",
    field: 'firstName',
    type: 'text',
    placeholder: 'Enter your first name',
    validation: (value) => value.trim().length < 2 ? 'First name must be at least 2 characters' : null
  },
  {
    id: 2,
    title: "And your last name?",
    description: "This helps providers and customers identify you",
    field: 'lastName',
    type: 'text',
    placeholder: 'Enter your last name',
    validation: (value) => value.trim().length < 2 ? 'Last name must be at least 2 characters' : null
  },
  {
    id: 3,
    title: "What's your email address?",
    description: "We'll use this for account verification and notifications",
    field: 'email',
    type: 'email',
    placeholder: 'Enter your email address',
    validation: (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : null
  },
  {
    id: 4,
    title: "What's your phone number?",
    description: "This helps with service coordination and verification",
    field: 'phone',
    type: 'tel',
    placeholder: '+254 710 101 010',
    validation: (value) => value.trim().length < 10 ? 'Please enter a valid phone number' : null
  },
  {
    id: 5,
    title: "What would you like to do?",
    description: "Choose how you want to use Saka-Kazi",
    field: 'role',
    type: 'role',
    placeholder: 'Select your role'
  },
  {
    id: 6,
    title: "Where are you located?",
    description: "This helps connect you with nearby services or customers",
    field: 'location',
    type: 'text',
    placeholder: 'Enter your city or address',
    validation: (value) => value.trim().length < 3 ? 'Please enter your location' : null
  },
  {
    id: 7,
    title: "Create a strong password",
    description: "Make it secure with at least 8 characters, including uppercase, lowercase, number, and special character",
    field: 'password',
    type: 'password',
    placeholder: 'Create your password'
  },
  {
    id: 8,
    title: "Confirm your password",
    description: "Please enter your password again to confirm",
    field: 'confirmPassword',
    type: 'password',
    placeholder: 'Confirm your password'
  }
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    location: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const currentStepData = registrationSteps.find(step => step.id === currentStep);
  const isLastStep = currentStep === registrationSteps.length;
  const isFirstStep = currentStep === 1;

  const validateCurrentStep = (): boolean => {
    if (!currentStepData) return false;
    
    const value = formData[currentStepData.field];
    const error = currentStepData.validation?.(value);
    
    if (error) {
      setErrors({ [currentStepData.field]: error });
      return false;
    }
    
    // Special validation for password confirmation
    if (currentStepData.field === 'confirmPassword' && value !== formData.password) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return false;
    }
    
    // Special validation for password strength
    if (currentStepData.field === 'password') {
      const passwordValidation = validatePassword(value);
      if (!passwordValidation.isValid) {
        setErrors({ password: passwordValidation.errors[0] });
        return false;
      }
    }
    
    setErrors({});
    return true;
  };

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (isLastStep) {
        setIsReviewMode(true);
      } else {
        setCurrentStep(currentStep + 1);
        // Auto-focus the next input field after a brief delay
        setTimeout(() => {
          const nextInput = document.querySelector('input, [tabindex="0"]') as HTMLElement;
          if (nextInput) {
            nextInput.focus();
          }
        }, 100);
      }
    }
  };

  const handlePrevious = () => {
    if (isReviewMode) {
      setIsReviewMode(false);
    } else {
      setCurrentStep(currentStep - 1);
      // Auto-focus the previous input field after a brief delay
      setTimeout(() => {
        const prevInput = document.querySelector('input, [tabindex="0"]') as HTMLElement;
        if (prevInput) {
          prevInput.focus();
        }
      }, 100);
    }
  };

  const handleChange = (value: string) => {
    const field = currentStepData?.field;
    if (field) {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isFirstStep) {
      e.preventDefault();
      handlePrevious();
    }
  };

  const handleRoleSelect = (role: 'customer' | 'provider') => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(config.getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
          location: {
            type: 'Point',
            coordinates: [0, 0], // Will be updated with actual coordinates
            address: formData.location
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 3000);
      } else {
        setErrors({ general: data.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field: keyof FormData) => {
    const stepIndex = registrationSteps.findIndex(step => step.field === field);
    if (stepIndex !== -1) {
      setIsReviewMode(false);
      setCurrentStep(stepIndex + 1);
      // Auto-focus the input field when editing
      setTimeout(() => {
        const inputField = document.querySelector('input, [tabindex="0"]') as HTMLElement;
        if (inputField) {
          inputField.focus();
        }
      }, 100);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm border rounded-lg sm:px-10 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
            <p className="text-gray-600 mb-4">
              Your account has been created successfully. You will be redirected to the login page shortly.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isReviewMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="bg-white py-8 px-4 shadow-sm border rounded-lg sm:px-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Review Your Information</h1>
              <p className="text-gray-600 mt-2">Please review your details before creating your account</p>
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div className="space-y-6 mb-8">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm text-gray-900">
                      {key === 'role' ? (value === 'customer' ? 'Hire Services' : 'Provide Services') : value}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEdit(key as keyof FormData)}
                    className="text-blue-600 hover:text-blue-700 p-2"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handlePrevious}
                className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Edit
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Create Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentStepData) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of {registrationSteps.length}</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / registrationSteps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / registrationSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow-sm border rounded-lg sm:px-10">
          {/* Step Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h1>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>

          {/* Form Field */}
          <div className="mb-8">
            {currentStepData.type === 'role' ? (
              <div className="grid grid-cols-1 gap-3">
                <label 
                  className="relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleRoleSelect('customer');
                      // Auto-advance to next step after role selection
                      setTimeout(() => handleNext(), 100);
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={formData.role === 'customer'}
                    onChange={() => handleRoleSelect('customer')}
                    className="sr-only"
                  />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">Hire Services</span>
                      <span className="mt-1 flex items-center text-sm text-gray-500">
                        I need help with tasks and services
                      </span>
                    </span>
                  </span>
                  <CheckCircle
                    className={`h-5 w-5 ${
                      formData.role === 'customer' ? 'text-blue-600' : 'text-gray-300'
                    }`}
                  />
                </label>

                <label 
                  className="relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleRoleSelect('provider');
                      // Auto-advance to next step after role selection
                      setTimeout(() => handleNext(), 100);
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="provider"
                    checked={formData.role === 'provider'}
                    onChange={() => handleRoleSelect('provider')}
                    className="sr-only"
                  />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">Provide Services</span>
                      <span className="mt-1 flex items-center text-sm text-gray-500">
                        I want to offer my skills and services
                      </span>
                    </span>
                  </span>
                  <CheckCircle
                    className={`h-5 w-5 ${
                      formData.role === 'provider' ? 'text-blue-600' : 'text-gray-300'
                    }`}
                  />
                </label>
              </div>
            ) : (
              <div className="relative">
                {currentStepData.type === 'password' && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                )}
                
                {currentStepData.type === 'password' && currentStepData.field === 'confirmPassword' && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                )}

                <input
                  type={
                    currentStepData.type === 'password' 
                      ? (currentStepData.field === 'confirmPassword' ? (showConfirmPassword ? 'text' : 'password') : (showPassword ? 'text' : 'password'))
                      : currentStepData.type
                  }
                  value={formData[currentStepData.field]}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onKeyDown={handleKeyDown}
                  className={`appearance-none block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg ${
                    errors[currentStepData.field] ? 'border-red-300' : 'border-gray-300'
                  } ${currentStepData.type === 'password' ? 'pr-12' : ''}`}
                  placeholder={currentStepData.placeholder}
                  autoFocus
                />
              </div>
            )}

            {errors[currentStepData.field] && (
              <p className="mt-2 text-sm text-red-600">{errors[currentStepData.field]}</p>
            )}
            
            {/* Keyboard hint - Hidden on mobile */}
            <p className="mt-2 text-xs text-gray-500 text-center hidden sm:block">
              💡 Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd> to continue
              {!isFirstStep && (
                <span className="ml-2">
                  • Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Esc</kbd> to go back
                </span>
              )}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-4">
            {!isFirstStep && (
              <button
                onClick={handlePrevious}
                className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
            )}
            
            <button
              onClick={handleNext}
              className={`flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isFirstStep ? 'w-full' : ''
              }`}
            >
              {isLastStep ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Review & Submit
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>

          {/* Skip to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
