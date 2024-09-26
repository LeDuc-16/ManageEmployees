import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Update = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Initialize state with default values and errors
    const [values, setValues] = useState({
        name: '',
        email: '',
        phone: '',
        checked: false
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch user data based on id from the API
        axios.get(`http://localhost:3000/users/${id}`)
            .then(res => {
                // Set values based on the response data
                setValues(res.data);
            })
            .catch(err => console.log(err));
    }, [id]); // Ensure useEffect runs when id changes

    const validateForm = () => {
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

        // Set errors state
        setErrors(errors);

        // Return true if no errors, false otherwise
        return Object.keys(errors).length === 0;
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        // Validate form
        if (validateForm()) {
            // Send updated values via PUT request to update user data
            axios.put(`http://localhost:3000/users/${id}`, values)
                .then(res => {
                    console.log(res);
                    navigate('/'); // Redirect to home page after successful update
                })
                .catch(err => console.log(err));
        } else {
            // Form validation failed, do not proceed with update
            console.log('Form validation failed');
        }
    };

    // Function to validate email format (similar to the one in Create component)
    const isValidEmail = (email) => {
        return email.indexOf('@') !== -1 && email.lastIndexOf('.') > email.indexOf('@');
    };

    // Function to validate phone number format (similar to the one in Create component)
    const isValidPhone = (phone) => {
        return /^0[0-9]{9}$/.test(phone);
    };

    return (
        <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light">
            <div className="w-50 border bg-white shadow px-2 pt-3 pb-2 rounded">
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-3">Update Employee</h3>
                    <Link to='/' className="btn-close" aria-label="close"></Link>
                </div>

                <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            value={values.name}
                            onChange={e => setValues({ ...values, name: e.target.value })}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            value={values.email}
                            onChange={e => setValues({ ...values, email: e.target.value })}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input
                            type="text"
                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                            id="phone"
                            value={values.phone}
                            onChange={e => setValues({ ...values, phone: e.target.value })}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>

                    <div className="d-flex justify-content-end">
                        <Link to='/' className="btn btn-secondary me-2">Cancel</Link>
                        <button type="submit" className="btn btn-success">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Update;
