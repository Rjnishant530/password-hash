import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import QrScanner from 'qr-scanner';
import Modal from './Modal';
import Button from './Button';
import { exportConfigsCompressed, importConfigsCompressed } from '../../utils/storageUtils';
import './QRCodeModal.css';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'export' | 'import';
  onImportSuccess?: () => void;
  onCloseAll?: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, mode, onImportSuccess, onCloseAll }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [error, setError] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (isOpen && mode === 'export') {
      generateQRCode();
    }
    if (isOpen && mode === 'import') {
      setInitializing(true);
      startScanning();
    }
    return () => {
      stopScanning();
      setInitializing(false);
    };
  }, [isOpen, mode]);

  const generateQRCode = async () => {
    try {
      const compressedData = exportConfigsCompressed();
      const url = await QRCode.toDataURL(compressedData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(url);
    } catch (error) {
      setError('Failed to generate QR code');
      console.error('QR generation error:', error);
    }
  };

  const startScanning = async () => {
    try {
      setError('');
      
      // Request camera permission and get stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Prefer back camera
        } 
      });
      
      // Only set scanning to true after we have the stream
      setIsScanning(true);
      setInitializing(false);
      
      // Wait for video element to be rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!videoRef.current) {
        throw new Error('Video element not available');
      }
      
      // Set the stream to video element
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      
      // Create QR scanner
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR detected:', result.data);
          setScanResult('QR code detected!');
          handleImport(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          returnDetailedScanResult: true,
        }
      );
      
      // Start scanning
      await qrScannerRef.current.start();
      
    } catch (error: any) {
      let errorMessage = 'Failed to start camera';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported in this browser';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setIsScanning(false);
      setInitializing(false);
      console.error('Scanner error:', error);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    
    // Stop video stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  const handleImport = (data: string) => {
    try {
      console.log('QR data received:', data);
      const success = importConfigsCompressed(data);
      if (success) {
        setScanResult('Import successful!');
        if (onImportSuccess) {
          onImportSuccess();
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError('Invalid QR code data');
      }
    } catch (error) {
      setError('Failed to import configurations: ' + error);
      console.error('Import error:', error);
    }
    stopScanning();
  };

  const handleClose = () => {
    stopScanning();
    setError('');
    setScanResult('');
    setQrCodeUrl('');
    setManualInput('');
    setShowManualInput(false);
    onClose();
  };

  const modalCloseHandler = () => {
    handleClose();
    if (onCloseAll) {
      onCloseAll();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={modalCloseHandler} title={mode === 'export' ? 'Export QR Code' : 'Import QR Code'}>
      <div className="qr-modal-content">
        {mode === 'export' && (
          <div className="qr-export">
            {qrCodeUrl ? (
              <div className="qr-display">
                <img src={qrCodeUrl} alt="Configuration QR Code" />
                <p>Scan this QR code with another device to import your configurations</p>
              </div>
            ) : (
              <div className="qr-loading">Generating QR code...</div>
            )}  
          </div>
        )}

        {mode === 'import' && (
          <div className="qr-import">
            {!isScanning && !showManualInput && !initializing ? (
              <div className="qr-start">
                <p>Click the button below to start scanning QR codes</p>
                <p className="camera-note">Make sure to allow camera permissions when prompted</p>
                <p className="camera-note">Note: Camera requires HTTPS or localhost to work</p>
                <Button onClick={startScanning}>Start Camera</Button>
                <Button onClick={() => setShowManualInput(true)} variant="secondary">Manual Input</Button>
              </div>
            ) : showManualInput ? (
              <div className="manual-input">
                <p>Paste QR code data here:</p>
                <textarea 
                  value={manualInput} 
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Paste the QR code data here..."
                  rows={4}
                  style={{width: '100%', margin: '10px 0'}}
                />
                <div>
                  <Button onClick={() => handleImport(manualInput)} disabled={!manualInput}>Import Data</Button>
                  <Button onClick={() => setShowManualInput(false)} variant="secondary">Back</Button>
                </div>
              </div>
            ) : (
              <div className="qr-scanner">
                <video ref={videoRef} className="qr-video" playsInline autoPlay muted />
                <p className="scan-instruction">Point your camera at a QR code</p>
                <div className="scanner-controls">
                  <Button onClick={stopScanning} variant="secondary">Back</Button>
                  <Button onClick={() => { stopScanning(); setShowManualInput(true); }} variant="outline">Use Manual Input</Button>
                </div>
              </div>
            )}
            
            {scanResult && (
              <div className="scan-success">{scanResult}</div>
            )}
          </div>
        )}

        {error && (
          <div className="qr-error">{error}</div>
        )}


      </div>
    </Modal>
  );
};

export default QRCodeModal;