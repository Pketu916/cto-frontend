import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import Modal from "./Modal";
import Button from "./Button";
import { useToast } from "../../contexts/ToastContext";
import { bookingsAPI } from "../../services/api";

const ESignatureModal = ({ isOpen, onClose, bookingId, onSigned }) => {
  const sigRef = useRef(null);
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearSignature = () => {
    if (sigRef.current) sigRef.current.clear();
  };

  const isEmpty = () => {
    if (!sigRef.current) return true;
    // react-signature-canvas has method isEmpty
    return sigRef.current.isEmpty();
  };

  const submitSignature = async () => {
    if (!bookingId) {
      showError("Missing booking reference");
      return;
    }
    if (isEmpty()) {
      showError("Please provide your signature before submitting");
      return;
    }
    try {
      setIsSubmitting(true);
      const canvasApi = sigRef.current;
      // Use full canvas to avoid trim-canvas runtime issues
      const dataUrl = canvasApi.getCanvas().toDataURL("image/png");
      const res = await bookingsAPI.addESignature(bookingId, dataUrl);
      if (res.success) {
        showSuccess("Signature submitted successfully");
        if (onSigned) onSigned(res.booking);
        onClose();
      } else {
        showError(res.message || "Failed to submit signature");
      }
    } catch (err) {
      console.error("E-signature submit error:", err);
      const msg = err?.response?.data?.message || "Failed to submit signature";
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customer E-Signature"
      size="lg"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Please sign below to confirm that the service has been completed.
        </p>
        <div className="border rounded-lg bg-white">
          <SignatureCanvas
            ref={sigRef}
            penColor="#111827"
            backgroundColor="#ffffff"
            canvasProps={{
              width: 600,
              height: 220,
              className: "w-full h-[220px]",
            }}
          />
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={clearSignature}
            disabled={isSubmitting}
          >
            Clear
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={submitSignature} loading={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Signature"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ESignatureModal;
