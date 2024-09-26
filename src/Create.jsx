import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Create = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        phone: '',
        checked: false
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let errors = {};

        // Validate name
        if (!values.name.trim()) {
            errors.name = 'Name is required';
        }

        // Validate email
        if (!values.email.trim()) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(values.email.trim())) {
            errors.email = 'Email is invalid';
        }

        // Validate phone
        if (!values.phone.trim()) {
            errors.phone = 'Phone is required';
        } else if (!isValidPhone(values.phone.trim())) {
            errors.phone = 'Phone number must start with 0 and be 10 digits long';
        }

        // Check if there are any errors
        if (Object.keys(errors).length === 0) {
            // No errors, proceed with axios POST request
            axios.post('http://localhost:3000/users', values)
                .then(res => {
                    console.log(res);
                    navigate('/');
                })
                .catch(err => console.log(err));
        } else {
            // Errors found, update state to display errors
            setErrors(errors);
        }
    };

    // Function to validate email
    const isValidEmail = (email) => {
        // Simple email validation using indexOf and lastIndexOf
        return email.indexOf('@') !== -1 && email.lastIndexOf('.') > email.indexOf('@');
    };

    // Function to validate phone number
    const isValidPhone = (phone) => {
        // Check if phone starts with '0' and has exactly 10 digits
        return /^0[0-9]{9}$/.test(phone);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light w-100">
            <div className="w-50 border bg-white shadow px-5 pt-3 pb-5 rounded">
                <h1>Add a User</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter Name"
                            value={values.name}
                            onChange={handleChange}
                        />
                        {errors.name && <span className="text-danger">{errors.name}</span>}
                    </div>
                    <div className="mb-2">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter Email"
                            value={values.email}
                            onChange={handleChange}
                        />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    <div className="mb-2">
                        <label htmlFor="phone">Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            className="form-control"
                            placeholder="Enter Phone"
                            value={values.phone}
                            onChange={handleChange}
                        />
                        {errors.phone && <span className="text-danger">{errors.phone}</span>}
                    </div>
                    <button type="submit" className="btn btn-success">
                        Submit
                    </button>
                    <Link to="/" className="btn btn-primary ms-3">
                        Back
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Create;
