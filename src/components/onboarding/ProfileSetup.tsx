import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, GraduationCap, AlertCircle } from 'lucide-react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import toast from 'react-hot-toast';

interface ProfileSetupProps {
  onNext: () => void;
  onUpdate: (data: any) => void;
  data: any;
}

const gradeOptions = [
  '5th Grade', '6th Grade', '7th Grade', '8th Grade', 
  '9th Grade', '10th Grade', '11th Grade', '12th Grade'
];

export function ProfileSetup({ onNext, onUpdate, data }: ProfileSetupProps) {
  const [formData, setFormData] = useState({
    firstName: data.profileData?.firstName || '',
    lastName: data.profileData?.lastName || '',
    birthday: data.profileData?.birthday || '',
    gradeLevel: data.profileData?.gradeLevel || '',
  });
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.gradeLevel) {
      newErrors.gradeLevel = 'Please select your grade level';
    }

    if (formData.birthday) {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 5 || age > 20) {
        newErrors.birthday = 'Please enter a valid birth date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdate({ profileData: formData });
      onNext();
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
          <User className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's Set Up Your Profile</h2>
        <p className="text-gray-600">
          We just need a few basic details to personalize your experience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="Enter your first name"
              error={errors.firstName}
              icon={<User className="w-5 h-5" />}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Enter your last name"
              error={errors.lastName}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade Level *
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={formData.gradeLevel}
              onChange={(e) => handleChange('gradeLevel', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none ${
                errors.gradeLevel ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select your grade level</option>
              {gradeOptions.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          {errors.gradeLevel && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.gradeLevel}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birthday (Optional)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={formData.birthday}
              onChange={(e) => handleChange('birthday', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                errors.birthday ? 'border-red-500' : 'border-gray-300'
              }`}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          {errors.birthday && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.birthday}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            This helps us provide age-appropriate content
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            <strong>Privacy Note:</strong> Your information is kept secure and is only used 
            to personalize your learning experience. We never share your data with third parties.
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Continue to Voice Interview
          </Button>
        </div>
      </form>
    </motion.div>
  );
}