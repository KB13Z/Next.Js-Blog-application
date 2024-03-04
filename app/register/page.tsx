'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

const Register = () => {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({ username: '', email: '', password: '' })
    const [registrationMessage, setRegistrationMessage] = useState('');
    const [redirectMessage, setRedirectMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
        if (!passwordPattern.test(userInfo.password)) {
            setPasswordError('Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol, and be at least 8 characters long');
            return;
        }

        try {
          const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
          });
    
          if (response.ok) {
            setRegistrationMessage('Registration successful!');
            setRedirectMessage('Redirecting to login page in 3 seconds...');
            setUserInfo({ username: '', email: '', password: '' });

            setTimeout(() => {
                router.push('/auth');
              }, 3000); 
          } else {
            const data = await response.json();
            setRegistrationMessage(`Registration failed: ${data.message}`);
          }
        } catch (error) {
          console.error('Registration error:', error);
          setRegistrationMessage('Registration error. Please try again later.');
        }
      };
    
    
    return (
        <div>
            <div className={styles.successMessage}>{registrationMessage}</div>
            <div className={styles.successMessage}>{redirectMessage}</div>
            <div className={styles.registerFormContainer}>
                <h3 className={styles.registerFormHeading}>Register</h3>
                <form className={styles.registerForm} onSubmit={handleSubmit}>
                    <div className={styles.inputWrapper}>
                        <label>Username:</label>
                        <input 
                            type='text'
                            value={userInfo.username}
                            onChange={({ target }) => setUserInfo({ ...userInfo, username: target.value })}
                            className={styles.registerFormInput}
                            minLength={3}
                            maxLength={25}
                            required
                        />
                    </div>
                    <div className={styles.inputWrapper}> 
                        <label>E-mail:</label>
                        <input 
                            type='email' 
                            value={userInfo.email}
                            onChange={({ target }) => setUserInfo({ ...userInfo, email: target.value })}
                            className={styles.registerFormInput}
                            required
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        <label>Password:</label>
                        <input 
                            type='password'
                            value={userInfo.password}
                            onChange={({ target }) => setUserInfo({ ...userInfo, password: target.value })}
                            className={styles.registerFormInput} 
                            minLength={8}
                            maxLength={25}
                            required
                        />
                        <div className={styles.errorMessage}>{passwordError}</div>
                    </div>
                    <button type='submit' className={styles.registerButton}>Register</button>
                </form>
            </div>
        </div>
    )
}

export default Register