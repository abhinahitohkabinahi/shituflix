'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { signIn } from '@/services/supabase/auth';

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

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
      await signIn(email, password);
      router.push('/profile-selection');
    } catch {
      setFormError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <h1 className="text-[32px] font-bold text-white mb-7">Sign In</h1>
      
      <div className="flex flex-col gap-4">
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
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="flex items-center justify-between mt-4">
        <label className="flex items-center gap-2 text-[#b3b3b3] text-sm cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-[#b3b3b3]" />
          Remember me
        </label>
        <span className="text-[#b3b3b3] text-sm hover:underline cursor-pointer">Need help?</span>
      </div>

      <p className="text-white/70 text-base mt-12">
        New to shituFlix?{' '}
        <a href="/signup" className="text-white font-semibold hover:underline">Sign up now.</a>
      </p>

      <p className="text-[#808080] text-[13px] mt-4 leading-relaxed">
        This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot.{' '}
        <span className="text-[#0071EB] cursor-pointer hover:underline">Learn more.</span>
      </p>
    </form>
  );
}
