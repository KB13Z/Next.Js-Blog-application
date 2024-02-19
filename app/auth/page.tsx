'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react';
import styles from './page.module.css'

const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result && result.error) {
            setLoginError(result.error);
        } else {
            router.push('/blogs');
        }
    };

    return (
        <div className={styles.loginFormContainer}>
            <h3>Sign in</h3>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <div className={styles.inputWrapper}>
                    <label>E-mail:</label>
                    <input 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type='email'
                        placeholder='john@email.com'
                        className={styles.loginFormInput}
                        required
                    />
                </div>
                <div className={styles.inputWrapper}>
                    <label>Password:</label>
                    <input 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type='password'
                        placeholder='********'
                        className={styles.loginFormInput}
                        required
                    />
                </div>
                <div className={styles.loginFormButtonWrapper}>
                    <button type='submit' className={styles.loginFormButton}>Sign in</button>
                </div>
                {loginError && <div className={styles.error}>{loginError}</div>}
            </form>
        </div>
    )
}

export default SignIn