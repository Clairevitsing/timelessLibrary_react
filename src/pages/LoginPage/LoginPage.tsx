import React from 'react';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/useAuth";
import { useForm } from "react-hook-form";
import 'react-toastify/dist/ReactToastify.css'

interface Props {
}

type LoginFormsInputs = {
    userName: string;
    email: string;
    password: string;
}

const validationSchema = Yup.object().shape({
    userName: Yup.string().required("UserName is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

const LoginPage: React.FC<Props> = () => {
    const { loginUser } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormsInputs>({
        resolver: yupResolver(validationSchema)
    });

    const handleLogin = (form: LoginFormsInputs) => {
        loginUser(form.userName, form.email, form.password);
    };

    return (
        <section className="bg-light text-dark">
            <div className="d-flex flex-column align-items-center justify-content-center px-3 py-4 vh-100">
                <div className="w-100 bg-white rounded shadow-lg p-4 mb-5 border">
                    <h1 className="h4 text-center mb-3">
                        Sign in to your account
                    </h1>
                    <form className="mb-3" onSubmit={handleSubmit(handleLogin)}>
                        <div className="mb-3">
                            <label htmlFor="userName" className="form-label">Username</label>
                            <input
                                type="text"
                                id="userName"
                                className={`form-control ${errors.userName ? 'is-invalid' : ''}`}
                                placeholder="UserName"
                                {...register("userName")}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="text"
                                id="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                placeholder="Email"
                                {...register("email")}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="••••••••"
                                {...register("password")}
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="form-check">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="form-check-input"
                                />
                                <label htmlFor="remember" className="form-check-label">
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="text-decoration-none">
                                Forgot password?
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                        >
                            Sign in
                        </button>
                    </form>
                    <p className="text-center mt-3">
                        Don't have an account yet? <Link to="/register" className="text-decoration-none">Sign up</Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default LoginPage;