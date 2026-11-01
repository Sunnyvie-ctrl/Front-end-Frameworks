import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getApiKey, setApiKey } from "../utils/storage.js";

type ApiConfigModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
};

function ApiConfigModal({
  isOpen,
  onClose,
  onSaved,
}: ApiConfigModalProps) {
  const [apiKey, setApiKeyValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setApiKeyValue(getApiKey());
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleSave() {
    setApiKey(apiKey);
    onSaved();
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="api-config-modal">
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2>TMDB API Key</h2>

        <p>
          Enter your TMDB v3 API key to use live movie data.
        </p>

        <input
          type="text"
          value={apiKey}
          onChange={(event) => setApiKeyValue(event.target.value)}
          placeholder="Enter your API key"
          autoComplete="off"
        />

        <div className="api-config-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button type="button" onClick={handleSave}>
            Save API Key
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApiConfigModal;