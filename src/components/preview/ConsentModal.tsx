import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConsentModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConsentModal = ({ open, onCancel, onConfirm }: ConsentModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md bg-card rounded-2xl shadow-modal p-6"
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Finalize Selection?</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              This action is <strong className="text-foreground">permanent</strong>. Once finalized, your course selection for this category
              cannot be modified. Please ensure all selections are correct.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="h-10 px-5 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={onConfirm}
                className="h-10 px-5 rounded-xl bg-foreground text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                I Understand, Finalize
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConsentModal;
