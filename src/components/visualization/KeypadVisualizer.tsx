import React, { useState } from "react";
import "./KeypadVisualizer.css";
import Button from "../ui/Button";

interface KeypadVisualizerProps {
  onApplySalt: (salt: string) => void;
}

const KeypadVisualizer: React.FC<KeypadVisualizerProps> = ({ onApplySalt }) => {
  const [input, setInput] = useState("");

  const handleKeyPress = (key: string) => {
    setInput((prev) => prev + key);
  };

  const handleClear = () => {
    setInput("");
  };

  const handleApply = () => {
    if (input) {
      onApplySalt(input);
    }
  };

  const keypadKeys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ];

  return (
    <div className="keypad-visualizer">
      <div className="current-input">
        {input && (
          <>
            <span>Current Input: </span>
            <span className="input-value">{input}</span>
          </>
        )}
      </div>

      <div className="keypad">
        {keypadKeys.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="keypad-row">
            {row.map((key) => (
              <button key={key} className="keypad-key" onClick={() => handleKeyPress(key)}>
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="keypad-actions">
        <Button onClick={handleClear} variant="secondary">
          Clear
        </Button>
        <Button onClick={handleApply} disabled={!input}>
          Apply as Salt
        </Button>
      </div>
    </div>
  );
};

export default KeypadVisualizer;
