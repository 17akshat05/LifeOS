import React from 'react';
import clsx from 'clsx';
import '../index.css';

const Card = ({ children, className, onClick, style }) => {
    return (
        <div
            className={clsx('glass-card', className)}
            onClick={onClick}
            style={{
                padding: '20px',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                ...style
            }}
            onMouseEnter={(e) => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
                }
            }}
            onMouseLeave={(e) => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                }
            }}
        >
            {children}
        </div>
    );
};

export default Card;
