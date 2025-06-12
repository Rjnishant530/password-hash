import React from 'react';
import './IntentPage.css';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';

const IntentPage: React.FC = () => {
  return (
    <Layout showSidebar={false}>
      <div className="intent-page">
        <Card>
          <h2 className="intent-title">Why Use This Password Hash Generator?</h2>
          
          <section className="intent-section">
            <h3>Purpose</h3>
            <p>
              This application was created to provide a secure, client-side tool for generating password hashes
              using various cryptographic algorithms.
            </p>
          </section>
          
          <section className="intent-section highlight-section">
            <h3>Password Management Solution</h3>
            <p>
              One of the most practical applications of this tool is as a personal password management system:
            </p>
            <ul>
              <li>
                <strong>Single Master Secret:</strong> Instead of remembering dozens of different passwords, 
                you only need to remember one strong master secret that you use as your salt.
              </li>
              <li>
                <strong>Unique Passwords:</strong> Enter the website or service name (e.g., "amazon", "netflix", "gmail") 
                in the text field, and your master secret in the salt field.
              </li>
              <li>
                <strong>Consistent Generation:</strong> The same inputs will always generate the same hash, 
                so you can recreate your passwords whenever needed.
              </li>
              <li>
                <strong>Enhanced Security:</strong> The secondary salt adds another layer of protection. 
                You can use different visualization methods (keypad, pattern, or vault) for different types of accounts.
              </li>
              <li>
                <strong>Financial Account Protection:</strong> For banking or credit card accounts, you might use 
                a specific secondary salt pattern that's different from your social media accounts.
              </li>
            </ul>
            <p>
              <strong>Example:</strong> For your Amazon account, you might enter "amazon" as text, your master secret as salt, 
              and use a specific Android pattern as a secondary salt. This creates a unique, complex password that you can 
              regenerate anytime without storing it anywhere.
            </p>
          </section>
          <section className="intent-section">
            <h3>Open Source</h3>
            <p>
              This project is open source and available for review, contribution, and educational purposes.
              We believe in transparency, especially for security-related tools.
            </p>
          </section>
        </Card>
      </div>
    </Layout>
  );
};

export default IntentPage;