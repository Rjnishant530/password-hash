# Password Hash Generator

A modern web application for generating secure password hashes with various algorithms and visualization methods.

![Password Hash Generator Screenshot](./screenshot.png)

## Features

- Generate hashes using multiple algorithms (MD5, SHA-1, SHA-256, etc.)
- Add primary and secondary salts for enhanced security
- Interactive visualization methods for secondary salt:
  - Keypad entry
  - Android pattern
  - Bank vault dial
- Display options for hash output:
  - All characters
  - Letters only
  - Numbers only
- Customizable grouping of hash characters
- Save and load configurations
- Copy hash to clipboard
- Responsive design for desktop and mobile

## Technologies Used

- React 18
- TypeScript
- Vite
- CryptoJS
- CSS3

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/password-hash.git
   cd password-hash
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```
npm run build
```

The build files will be in the `dist` directory.

## Security Considerations

- This application runs entirely in the browser - no data is sent to any server
- Salts are never saved in configurations for security reasons
- Consider using a strong secondary salt method for enhanced security
- Remember that MD5 and SHA-1 are no longer considered secure for password storage

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Logo <a href="https://www.flaticon.com/free-icons/decrypt" title="decrypt icons">Decrypt icons created by Nixxdsgn - Flaticon</a>
- CryptoJS for the hash algorithm implementations
- React team for the amazing framework
- All contributors to this project