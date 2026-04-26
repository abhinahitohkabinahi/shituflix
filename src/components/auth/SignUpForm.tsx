'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { signUp } from '@/services/supabase/auth';

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Specific error states for the fields
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const validate = () => {
    let isValid = true;
    
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 4 || password.length > 60) {
      setPasswordError('Your password must contain between 4 and 60 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    
    if (!validate()) return;

    setLoading(true);
    try {
      await signUp(name, email, password);
      router.push('/profile-selection');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
        setEmailError('This email is already registered. Please sign in instead.');
      } else {
        setFormError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <h1 className="text-[32px] font-bold text-white mb-7">Sign In</h1>
      
      <div className="flex flex-col gap-4">
        <Input 
          label="Name" 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
        />

        <Input 
          label="Email address" 
          type="email" 
          value={email} 
          onChange={e => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }} 
          error={emailError}
          required 
        />

        <Input 
          label="Password" 
          type="password" 
          value={password} 
          onChange={e => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError('');
          }} 
          error={passwordError}
          required 
        />
      </div>

      {formError && (
        <div className="bg-[#e87c03] text-white p-3 rounded text-sm font-medium mt-4">
          {formError}
        </div>
      )}

      <Button 
        type="submit" 
        disabled={loading}
        className="mt-8 py-4 bg-[#e50914] hover:bg-[#b20710] font-bold text-lg rounded"
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>

      <p className="text-[#808080] text-[13px] mt-4 leading-relaxed">
        This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot.{' '}
        <span className="text-[#0071EB] cursor-pointer hover:underline">Learn more.</span>
      </p>
    </form>
  );
}
