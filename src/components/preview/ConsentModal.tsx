import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Shield } from "lucide-react";

interface ConsentModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  subtitle?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
}

const ConsentModal = ({
  open,
  onCancel,
  onConfirm,
  title = "Finalize Selection?",
  subtitle = "This action cannot be undone",
  description = 'This action is <strong class="text-foreground">permanent</strong>. Once finalized, your course selection for this category cannot be modified. Please ensure all selections are correct.',
  cancelLabel = "Go Back",
  confirmLabel = "I Understand, Finalize",
}: ConsentModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md bg-card rounded-2xl shadow-modal p-7"
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{title}</h2>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              </div>
            </div>
            <p
              className="text-sm text-muted-foreground mb-7 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="h-11 px-5 rounded-xl bg-secondary text-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-primary to-amber-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
              >
                <Shield className="w-4 h-4" />
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConsentModal;
