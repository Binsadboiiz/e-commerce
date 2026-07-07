import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/route.config';

export default function SellerPendingPage() {
    const navigate = useNavigate();

    return (
        <div style={{
            maxWidth: '600px',
            margin: '50px auto',
            textAlign: 'center',
            padding: '40px 20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            backgroundColor: '#ffffff'
        }}>
            <h2 style={{ color: '#ff9900', marginBottom: '20px' }}>Application Under Review</h2>
            <p style={{ fontSize: '16px', color: '#555555', lineHeight: '1.6' }}>
                Thank you for registering to be a seller at VeloraMall. 
                Your registration has been submitted successfully and is currently under review by our administration team.
            </p>
            <p style={{ fontSize: '14px', color: '#888888', marginTop: '10px' }}>
                We will notify you via email or notification once the review is completed (usually within 24-48 business hours).
            </p>
            <button 
                onClick={() => navigate(ROUTES.HOME)}
                style={{
                    marginTop: '30px',
                    padding: '10px 25px',
                    fontSize: '16px',
                    color: '#ffffff',
                    backgroundColor: '#1a73e8',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Back to Homepage
            </button>
        </div>
    );
}