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
              using various cryptographic algorithms. It's designed for developers, security professionals, and
              anyone interested in understanding how password hashing works.
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
            <h3>Educational Value</h3>
            <p>
              Password hashing is a fundamental security concept. This tool helps users understand:
            </p>
            <ul>
              <li>How different hashing algorithms produce different outputs</li>
              <li>The importance of salting passwords</li>
              <li>How visualization methods can create memorable but secure secondary salts</li>
              <li>The irreversible nature of cryptographic hash functions</li>
            </ul>
          </section>
          
          <section className="intent-section">
            <h3>Security Features</h3>
            <p>
              This application includes several security-focused features:
            </p>
            <ul>
              <li><strong>Client-side processing:</strong> All hash generation happens in your browser - no data is sent to any server</li>
              <li><strong>Multiple algorithms:</strong> Support for various hash algorithms including SHA-256, SHA-512, and more</li>
              <li><strong>Primary and secondary salts:</strong> Add extra security layers to your hashes</li>
              <li><strong>No salt storage:</strong> Salts are never saved in configurations for security reasons</li>
            </ul>
          </section>
          
          <section className="intent-section">
            <h3>Practical Applications</h3>
            <p>
              While this tool is primarily educational, it can be used for:
            </p>
            <ul>
              <li>Generating consistent hashes for testing purposes</li>
              <li>Creating checksums to verify file integrity</li>
              <li>Understanding how password storage systems work</li>
              <li>Experimenting with different hashing approaches</li>
            </ul>
            <p>
              <strong>Note:</strong> For production password storage, we recommend using specialized libraries 
              like bcrypt, Argon2, or PBKDF2 that include features like key stretching and are specifically 
              designed for password hashing.
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