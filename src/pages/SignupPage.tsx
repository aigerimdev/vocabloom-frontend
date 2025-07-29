// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { registerUser } from '../api/auth'; // Make sure the path matches your file structure

// const SignupPage = () => {
//     const [form, setForm] = useState({
//         username: '',
//         password: '',
//         confirmPassword: '',
//     });

//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleRegister = async () => {
//         setError('');
//         if (form.password !== form.confirmPassword) {
//             setError('Passwords do not match');
//             return;
//         }

//         try {
//             await registerUser(form.username, form.password);
//             navigate('/login'); // Navigate to login after successful registration
//         } catch (err: any) {
//             setError(err.message);
//         }
//     };

//     return (
//         <div className="signup-page">
//             <h2>Sign up</h2>
//             <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
//             <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Password"
//             />
//             <input
//                 type="password"
//                 name="confirmPassword"
//                 value={form.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="Confirm Password"
//             />
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             <button onClick={handleRegister}>Register</button>
//             <p>
//                 Have account? <span onClick={() => navigate('/login')}>Sign in</span>
//             </p>
//         </div>
//     );
// };

// export default SignupPage;
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const SignupPage = () => {
//     // Store form input values in state
//     const [form, setForm] = useState({
//         username: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         first_name: '',
//         last_name: ''
//     });

//     const navigate = useNavigate();

//     // Update state when input fields change
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     // Send registration data to backend
//     const handleRegister = async () => {
//         try {
//             const response = await fetch("https://vocabloom-backend.onrender.com/api/register/", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(form)
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.detail || "Registration failed");
//             }

//             // Redirect user to login page after successful signup
//             navigate('/login');
//         } catch (error) {
//             console.error("Registration error:", error);
//             alert("Error: " + error);
//         }
//     };

//     return (
//         <div className="signup-page">
//             <h2>Sign up</h2>

//             {/* Input fields for user data */}
//             <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" />
//             <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" />
//             <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
//             <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
//             <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" />
//             <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />

//             {/* Register button */}
//             <button onClick={handleRegister}>Register</button>

//             {/* Navigation to login page */}
//             <p>
//                 Have an account? <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: 'blue' }}>Sign in</span>
//             </p>
//         </div>
//     );
// };

// export default SignupPage;

// src/pages/SignupPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth'; // Make sure this path is correct

const SignupPage = () => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle the signup form submission
    const handleRegister = async () => {
        if (form.password !== form.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const result = await registerUser({
                username: form.username,
                email: form.email,
                password: form.password,
                first_name: form.firstName,
                last_name: form.lastName,
            });

            console.log('Registered:', result);
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. See console for details.');
        }
    };

    return (
        <div className="signup-page">
            <h2>Sign up</h2>
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" />
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" />
            <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="E-mail" />
            <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
            />
            <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
            />
            <button onClick={handleRegister}>Register</button>
            <p>
                Have an account? <span onClick={() => navigate('/login')}>Sign in</span>
            </p>
        </div>
    );
};

export default SignupPage;
