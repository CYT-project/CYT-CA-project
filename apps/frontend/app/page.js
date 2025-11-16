// Next.js App Router main page
// Demonstrates server-side rendering and API integration

'use client'; // Mark as Client Component to use hooks

import { useState, useEffect } from 'react';

export default function Home() {
  // State for API data and loading status
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the Node service when component mounts
  useEffect(() => {
    fetch('/api/node/info') // Next.js API route that proxies to node-service
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch API data');
        }
        return response.json();
      })
      .then(data => {
        setApiData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#f8f9fa',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          color: '#2c3e50',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '2.5rem'
        }}>
          CIV2025 Next.js Frontend
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#6c757d',
          fontSize: '1.2rem',
          marginBottom: '40px'
        }}>
          Server-Side Rendered React Application for CI/CD Learning
        </p>

        {/* API Status Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '6px',
          marginBottom: '30px',
          border: '1px solid #e9ecef'
        }}>
          <h2 style={{ color: '#495057', marginTop: 0 }}>API Integration Status</h2>

          {loading && (
            <p style={{ color: '#6c757d' }}>Loading API data...</p>
          )}

          {error && (
            <p style={{ color: '#dc3545', fontWeight: 'bold' }}>
              Error: {error}
            </p>
          )}

          {apiData && (
            <div style={{ fontFamily: 'monospace', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
              <div><strong>Service:</strong> {apiData.service}</div>
              <div><strong>Description:</strong> {apiData.description}</div>
              <div><strong>Language:</strong> {apiData.language}</div>
              <div><strong>Framework:</strong> {apiData.framework}</div>
            </div>
          )}
        </div>

        {/* CI/CD Learning Features */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '6px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ color: '#495057', marginTop: 0 }}>🚀 Next.js CI/CD Features</h3>
          <ul style={{ color: '#6c757d', lineHeight: '1.6' }}>
            <li><strong>Server-Side Rendering (SSR):</strong> Better SEO and performance</li>
            <li><strong>Static Site Generation (SSG):</strong> Pre-built pages for speed</li>
            <li><strong>API Routes:</strong> Backend functionality within the frontend</li>
            <li><strong>Automatic Code Splitting:</strong> Optimized bundle sizes</li>
            <li><strong>TypeScript Support:</strong> Type-safe development</li>
            <li><strong>Built-in CSS Support:</strong> Styled components and modules</li>
          </ul>
        </div>

        {/* Service Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginTop: '30px'
        }}>
          <a href="/api/node/health" style={{
            display: 'block',
            padding: '15px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            Node Service Health
          </a>
          <a href="/api/spring/health" style={{
            display: 'block',
            padding: '15px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            Spring Service Health
          </a>
        </div>
      </main>
    </div>
  );
}