import React, { useState } from 'react';
import Modal from './Modal';
import QRCodeModal from './QRCodeModal';
import { exportConfigs, importConfigs } from '../../utils/storageUtils';
import './ImportExportModal.css';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'import' | 'export';
  onImportSuccess?: () => void;
  onCloseAll?: () => void;
}

const ImportExportModal: React.FC<ImportExportModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  onImportSuccess,
  onCloseAll 
}) => {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrMode, setQrMode] = useState<'import' | 'export'>('export');

  const handleQROption = () => {
    setQrMode(mode);
    setQrModalOpen(true);
  };

  const handleFileExport = () => {
    try {
      const data = exportConfigs();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'password-hash-configs-' + new Date().toISOString().split('T')[0] + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleFileImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            const success = importConfigs(data);
            if (success && onImportSuccess) {
              onImportSuccess();
            }
            onClose();
          } catch (error) {
            console.error('Import error:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleQRClose = () => {
    setQrModalOpen(false);
  };

  const handleQRImportSuccess = () => {
    if (onImportSuccess) {
      onImportSuccess();
    }
    setQrModalOpen(false);
    onClose();
    if (onCloseAll) {
      onCloseAll();
    }
  };

  return (
    <>
      <Modal 
        isOpen={isOpen && !qrModalOpen} 
        onClose={onClose} 
        title={mode === 'export' ? 'Export Configurations' : 'Import Configurations'}
      >
        <div className="import-export-modal">
          <p>Choose how you want to {mode} your configurations:</p>
          
          <div className="option-buttons">
            <button className="option-btn" onClick={handleQROption}>
              <span className="option-icon">📱</span>
              <span className="option-label">QR Code</span>
            </button>
            
            <button 
              className="option-btn"
              onClick={mode === 'export' ? handleFileExport : handleFileImport}
            >
              <span className="option-icon">📁</span>
              <span className="option-label">File</span>
            </button>
          </div>
        </div>
      </Modal>

      <QRCodeModal 
        isOpen={qrModalOpen}
        onClose={handleQRClose}
        mode={qrMode}
        onImportSuccess={handleQRImportSuccess}
        onCloseAll={onCloseAll}
      />
    </>
  );
};

export default ImportExportModal;