import React, { useState } from 'react';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/useAuth";
import { useForm } from "react-hook-form";
import 'react-toastify/dist/ReactToastify.css'

interface Props {}

type LoginFormsInputs = {
    email: string;
    password: string;
};

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

const LoginPage: React.FC<Props> = () => {
    const { loginUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormsInputs>({
        resolver: yupResolver(validationSchema)
    });

    const handleLogin = async (form: LoginFormsInputs) => {
        try {
            setIsSubmitting(true);
            await loginUser(form.email, form.password);
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section 
            className="min-vh-80 d-flex align-items-center" 
            style={{ backgroundColor: "rgb(145, 188, 193)" }} 
        >
                <div className="container mb-5"  style={{ backgroundColor: "rgb(145, 188, 193)" }}>
                <div className="row justify-content-center mt-5">
                    <div 
                        className="col-md-6 col-sm-8 col-10 rounded shadow-lg p-4 border text-white" 
                        style={{ backgroundColor: "rgb(90, 148, 154)" }} 
                    >
                        <h1 className="h4 text-center mb-3">Sign in to your account</h1>
                        <form className="mb-3" onSubmit={handleSubmit(handleLogin)}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    placeholder="Email"
                                    {...register("email")}
                                    disabled={isSubmitting}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder="••••••••"
                                    {...register("password")}
                                    disabled={isSubmitting}
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="form-check">
                                    <input id="remember" type="checkbox" className="form-check-input" />
                                    <label htmlFor="remember" className="form-check-label">Remember me</label>
                                </div>
                                <a href="#" className="text-decoration-none text-white">Forgot password?</a>
                            </div>
                            <button type="submit" className="btn btn-light w-100" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </form>
                        <p className="text-center mt-3">
                            Don't have an account yet? <Link to="/register" className="text-decoration text-white">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
);

}

export default LoginPage;
