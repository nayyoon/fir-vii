// src/pages/SignUpPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from '../utils/validationSchema';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { auth, db, googleProvider, appleProvider } from '../firebase';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getRedirectResult,
  signInWithRedirect,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { sendRegistrationEmail } from '../services/emailService';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

const SignUpPage = () => {
  const methods = useForm({ resolver: yupResolver(signUpSchema) });
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);

          if (signInMethods.length === 1) {
            await setDoc(doc(db, 'users', user.uid), {
              displayName: user.displayName,
              email: user.email,
              registeredAt: serverTimestamp(),
              provider: result.providerId,
            });

            await sendRegistrationEmail({
              firstName: user.displayName || 'User',
              email: user.email,
            });
          }

          setSuccess(true);
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Redirect login failed:', error);
        setErrorMessage('Redirect login failed: ' + error.message);
      }
    };

    checkRedirectResult();
  }, [navigate]);

  const onSubmit = async (data) => {
    setErrorMessage('');
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        registeredAt: serverTimestamp(),
      });

      await sendRegistrationEmail(data);

      setSuccess(true);
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered.');
      } else {
        setErrorMessage('Registration failed: ' + error.message);
      }
    }
  };

  const handleSocialLogin = async (provider) => {
    setErrorMessage('');
    try {
      await signInWithRedirect(auth, provider);
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        setErrorMessage('This email is already used with a different login method.');
      } else {
        setErrorMessage('Social login failed: ' + err.message);
      }
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex bg-dark text-white">
      <div className="d-none d-md-flex col-md-6 align-items-center justify-content-center bg-gradient" style={{
        background: 'linear-gradient(to right, #3f0d88, #6a1b9a)',
      }}>
        <h2 className="display-4">Welcome to PurpleLand 🌌</h2>
      </div>
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <div className="w-100 px-4" style={{ maxWidth: '400px' }}>
          <h2 className="mb-3">Create an account</h2>
          <p className="text-secondary mb-4">
            Already have an account? <a href="#" className="text-info">Log in</a>
          </p>

          {success ? (
            <div className="alert alert-success">🎉 Registration successful! Redirecting...</div>
          ) : (
            <>
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
                  <div className="d-flex gap-2">
                    <InputField name="firstName" placeholder="First Name" />
                    <InputField name="lastName" placeholder="Last Name" />
                  </div>
                  <InputField name="email" type="email" placeholder="Email" />
                  <InputField name="password" type="password" placeholder="Enter your password" />

                  <div className="form-check my-3">
                    <input className="form-check-input" type="checkbox" {...methods.register('terms')} id="terms" />
                    <label className="form-check-label" htmlFor="terms">
                      I agree to the <a href="#" className="text-info">terms & conditions</a>
                    </label>
                    {methods.formState.errors.terms && (
                      <div className="text-danger small">{methods.formState.errors.terms.message}</div>
                    )}
                  </div>

                  <Button type="submit">Create account</Button>
                </form>
              </FormProvider>
            </>
          )}

          <div className="text-center my-3 text-muted">Or register with</div>
          <div className="d-flex justify-content-between gap-2">
            <button className="btn btn-outline-light w-50" onClick={() => handleSocialLogin(googleProvider)}>
              <FcGoogle size={20} className="me-2" /> Google
            </button>
            <button className="btn btn-outline-light w-50" onClick={() => handleSocialLogin(appleProvider)}>
              <FaApple size={20} className="me-2" /> Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
