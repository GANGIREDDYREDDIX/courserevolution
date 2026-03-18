import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface EduRevDisclaimerModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const EduRevDisclaimerModal = ({ open, onConfirm, onCancel }: EduRevDisclaimerModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Join EDU-Revolution</DialogTitle>
              <DialogDescription className="mt-2 text-base">
                Are you sure you want to be part of the EDU-Revolution program?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
          <p className="text-sm text-blue-900 leading-relaxed">
            By joining EDU-Revolution, you agree to select specific academic benefits for each of your courses. These benefits can include revenue generation, projects, certifications, internships, and more. You'll be able to track your progress and achievements throughout your academic journey.
          </p>
        </div>

        <DialogFooter className="gap-3 flex flex-row justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-10 px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="h-10 px-6 bg-primary hover:bg-primary/90"
          >
            Yes, Let&apos;s Go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EduRevDisclaimerModal;
