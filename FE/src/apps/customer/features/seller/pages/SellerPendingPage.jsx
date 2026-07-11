import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/route.config';
import { FiCheckCircle } from 'react-icons/fi';
import SellerReview from '../components/review/SellerReview';

export default function SellerPendingPage({ registration }) {
    const navigate = useNavigate();
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div style={{
            maxWidth: '800px',
            margin: '40px auto',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #eaeaea',
                marginBottom: '30px'
            }}>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                    <FiCheckCircle size={48} color="#22c55e" />
                </div>
                <h2 style={{ color: '#000000', marginBottom: '16px', fontSize: '24px', fontWeight: '700' }}>
                    Thank You for Your Application!
                </h2>
                <p style={{ fontSize: '16px', color: '#666666', lineHeight: '1.6', margin: '0 auto 12px', maxWidth: '500px' }}>
                    Your seller registration has been submitted successfully and is currently under review by our administration team.
                </p>
                <p style={{ fontSize: '14px', color: '#999999', marginBottom: '24px' }}>
                    We will notify you once the review is completed (usually within 24-48 business hours).
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    <button 
                        onClick={() => navigate(ROUTES.HOME)}
                        style={{
                            padding: '12px 24px',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#ffffff',
                            backgroundColor: '#000000',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: '0.2s'
                        }}
                    >
                        Go to Homepage
                    </button>
                    <button 
                        onClick={() => setShowDetails(!showDetails)}
                        style={{
                            padding: '12px 24px',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#000000',
                            backgroundColor: '#ffffff',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: '0.2s'
                        }}
                    >
                        {showDetails ? 'Hide Application Details' : 'View Application Details'}
                    </button>
                </div>
            </div>

            {showDetails && (
                <div style={{
                    backgroundColor: '#ffffff',
                    padding: '30px',
                    borderRadius: '12px',
                    border: '1px solid #eaeaea',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                    <SellerReview registration={registration} isReadOnly={true} />
                </div>
            )}
        </div>
    );
}