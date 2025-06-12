import React, { useState, useEffect } from "react";
import "./HashGenerator.css";
import Input from "../ui/Input";
import Dropdown from "../ui/Dropdown";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import { generateHash, hashAlgorithms, formatHash, displayFormats } from "../../utils/hashUtils";
import { saveConfig } from "../../utils/storageUtils";
import type { HashAlgorithm, VisualizationMethod, DisplayFormat } from "../../utils/hashUtils";

const specialChars = ["@", "#", "$", "%", "^", "&", "*", "=", "+","!","?",":", ";", "<", ">"];
interface HashGeneratorProps {
  secondarySalt?: string;
  onClear?: () => void;
  visualizationMethod?: VisualizationMethod;
  initialText?: string;
  initialSalt?: string;
  initialAlgorithm?: string;
  onConfigSaved?: () => void;
}

const HashGenerator: React.FC<HashGeneratorProps> = ({ secondarySalt = "", onClear, visualizationMethod = "keypad", initialText = "", initialSalt = "", initialAlgorithm = "SHA384", onConfigSaved }) => {
  const [text, setText] = useState(initialText);
  const [salt, setSalt] = useState(initialSalt);
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>(initialAlgorithm as HashAlgorithm);
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [groupSize, setGroupSize] = useState(4);
  const [displayFormat, setDisplayFormat] = useState<DisplayFormat>("all");
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [configName, setConfigName] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  // Initialize with props
  useEffect(() => {
    setText(initialText);
    setSalt(initialSalt);
    setAlgorithm(initialAlgorithm as HashAlgorithm);

    if (initialText) {
      generateHashWithSalts(initialText, initialSalt, initialAlgorithm as HashAlgorithm);
    }
  }, [initialText, initialSalt, initialAlgorithm]);

  // Re-generate hash when secondarySalt changes
  useEffect(() => {
    if (text) {
      generateHashWithSalts(text, salt, algorithm);
    }
  }, [secondarySalt]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSaltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalt(e.target.value);
  };

  const handleAlgorithmChange = (value: string) => {
    setAlgorithm(value as HashAlgorithm);
  };

  const handleGroupSizeChange = (value: string) => {
    setGroupSize(parseInt(value));
  };

  const handleDisplayFormatChange = (value: string) => {
    setDisplayFormat(value as DisplayFormat);
  };

  const generateHashWithSalts = (textValue: string, saltValue: string, algorithmValue: HashAlgorithm) => {
    try {
      // Combine primary salt and secondary salt
      const combinedSalt = saltValue + (secondarySalt ? `:${secondarySalt}` : "");
      const generatedHash = generateHash(textValue, algorithmValue, combinedSalt).replace(/[=+/]/g, "");
      const numbers = generatedHash.match(/\d/g)?.slice(0, 10) || [];

      const splitArray = generatedHash.split("");
      const newHash: string[] = Object.assign([], splitArray);
      numbers.forEach((number) => {
        const charIndex: number = parseInt(number, 10);

        const specialCharHex: string = `${splitArray[charIndex]}${splitArray[charIndex + 1] || ""}`;


        const specialCharIndex = parseInt(specialCharHex, 36) % specialChars.length;
        const hashCharIndex = parseInt(specialCharHex, 36) % splitArray.length;
        newHash[hashCharIndex] = specialChars[specialCharIndex];
        console.log(specialCharHex, parseInt(specialCharHex, 36), specialCharIndex, hashCharIndex);
      });
      setHash(newHash.join(""));
    } catch (error) {
      console.error("Error generating hash:", error);
    }
  };

  const handleGenerateHash = () => {
    if (!text) return;

    setLoading(true);

    // Simulate a small delay to show loading state
    setTimeout(() => {
      generateHashWithSalts(text, salt, algorithm);
      setLoading(false);
    }, 300);
  };

  const handleClear = () => {
    setText("");
    setSalt("");
    setHash("");
    if (onClear) {
      onClear();
    }
  };

  const handleCopyHash = () => {
    if (hash) {
      navigator.clipboard.writeText(hash);
    }
  };

  const handleOpenSaveModal = () => {
    setConfigName(`Hash Config ${new Date().toLocaleDateString()}`);
    setSaveModalOpen(true);
    setSaveMessage("");
  };

  const handleSaveConfig = () => {
    if (!configName.trim()) {
      setSaveMessage("Please enter a name for this configuration");
      return;
    }

    try {
      saveConfig({
        name: configName,
        text,
        salt: "", // Don't save primary salt
        algorithm,
        visualizationMethod,
        secondarySalt: "", // Don't save secondary salt
      });
      setSaveMessage("Configuration saved successfully!");

      // Notify parent that config was saved
      if (onConfigSaved) {
        onConfigSaved();
      }

      setTimeout(() => {
        setSaveModalOpen(false);
        setSaveMessage("");
      }, 1500);
    } catch (error) {
      setSaveMessage("Error saving configuration");
      console.error("Error saving config:", error);
    }
  };

  const groupSizeOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "4", label: "4" },
    { value: "8", label: "8" },
  ];

  const formattedHash = formatHash(hash, groupSize, displayFormat);

  return (
    <div className="hash-generator">
      <Card>
        <Input label="Text Input" value={text} onChange={handleTextChange} placeholder="Enter text to hash" />

        <Input label="Salt Input" type="password" value={salt} onChange={handleSaltChange} placeholder="Enter salt" showPasswordToggle />

        {secondarySalt && (
          <div className="secondary-salt">
            <span>Secondary Salt: </span>
            <span className="secondary-salt-value">{secondarySalt}</span>
          </div>
        )}

        <Dropdown label="Hash Algorithm" options={hashAlgorithms} value={algorithm} onChange={handleAlgorithmChange} />

        <div className="button-group">
          <Button onClick={handleGenerateHash} disabled={!text || loading}>
            {loading ? "Generating..." : "Generate Hash"}
          </Button>
          <Button onClick={handleClear} variant="secondary">
            Clear
          </Button>
        </div>

        {hash && (
          <div className="hash-result">
            <div className="hash-header">
              <h3>Generated Hash</h3>
              <Button onClick={handleCopyHash} variant="outline">
                Copy
              </Button>
            </div>
            <div className="hash-display">{formattedHash}</div>

            <div className="hash-options">
              <div className="hash-option">
                <span>Group by:</span>
                <Dropdown options={groupSizeOptions} value={groupSize.toString()} onChange={handleGroupSizeChange} />
              </div>
              <div className="hash-option">
                <span>Display:</span>
                <Dropdown options={displayFormats} value={displayFormat} onChange={handleDisplayFormatChange} />
              </div>
            </div>
          </div>
        )}

        <div className="save-config">
          <Button onClick={handleOpenSaveModal} disabled={!text} variant="outline">
            Save Configuration
          </Button>
        </div>
      </Card>

      <Modal isOpen={saveModalOpen} onClose={() => setSaveModalOpen(false)} title="Save Configuration">
        <div className="save-modal-content">
          <Input label="Configuration Name" value={configName} onChange={(e) => setConfigName(e.target.value)} placeholder="Enter a name for this configuration" />

          {saveMessage && <div className={`save-message ${saveMessage.includes("success") ? "success" : "error"}`}>{saveMessage}</div>}

          <div className="modal-actions">
            <Button onClick={() => setSaveModalOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveConfig}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HashGenerator;
