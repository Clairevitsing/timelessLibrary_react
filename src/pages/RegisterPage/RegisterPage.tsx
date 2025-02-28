import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useAuth } from "../../context/useAuth";
import styles from "./RegisterPage.module.css"; 

type RegisterFormsInputs = {
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
  roles: string[];
  subStartDate: string;
  subEndDate: string;
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  userName: Yup.string().required('User name is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  roles: Yup.array().of(Yup.string().required('Role is required')).required('Roles is required'),
  subStartDate: Yup.string().required('Subscription start date is required'),
  subEndDate: Yup.string().required('Subscription end date is required'),
});

const RegisterForm = () => {
  const { registerUser } = useAuth();
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormsInputs>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      roles: ['user'],
      subStartDate: new Date().toISOString().slice(0, 16),
      subEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 16),
    },
  });

  const onSubmit = (data: RegisterFormsInputs) => {
    setRegistrationError(null);
    registerUser(
      data.firstName,
      data.lastName,
      data.userName,
      data.phoneNumber,
      data.email,
      data.password,
      data.roles,
      data.subStartDate,
      data.subEndDate
    ).catch((error) => {
      setRegistrationError(error.response?.data?.message || 'Registration failed. Please try again.');
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2>Register</h2>

        {registrationError && (
          <div className="alert alert-danger" role="alert">
            {registrationError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input type="text" className="form-control" id="firstName" {...register("firstName")} />
            {errors.firstName && <p className={styles.textDanger}>{errors.firstName.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input type="text" className="form-control" id="lastName" {...register("lastName")} />
            {errors.lastName && <p className={styles.textDanger}>{errors.lastName.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="userName">Username</label>
            <input type="text" className="form-control" id="userName" {...register("userName")} />
            {errors.userName && <p className={styles.textDanger}>{errors.userName.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="tel" className="form-control" id="phoneNumber" {...register("phoneNumber")} />
            {errors.phoneNumber && <p className={styles.textDanger}>{errors.phoneNumber.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input type="email" className="form-control" id="email" {...register("email")} />
            {errors.email && <p className={styles.textDanger}>{errors.email.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" {...register("password")} />
            {errors.password && <p className={styles.textDanger}>{errors.password.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="roles">Roles</label>
            <select multiple className="form-select" id="roles" {...register("roles")}>
              <option value="ROLE_USER">User</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
            {errors.roles && <p className={styles.textDanger}>{errors.roles.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subStartDate">Subscription Start Date</label>
            <input type="datetime-local" className="form-control" id="subStartDate" {...register("subStartDate")} />
            {errors.subStartDate && <p className={styles.textDanger}>{errors.subStartDate.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subEndDate">Subscription End Date</label>
            <input type="datetime-local" className="form-control" id="subEndDate" {...register("subEndDate")} />
            {errors.subEndDate && <p className={styles.textDanger}>{errors.subEndDate.message}</p>}
          </div>

          <div className={styles.buttonWrapper}>
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;