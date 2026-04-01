import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EduRevDisclaimerModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isHighPerformanceFlow?: boolean;
}

const EduRevDisclaimerModal = ({ open, onConfirm, onCancel, isHighPerformanceFlow }: EduRevDisclaimerModalProps) => {
  const isEligible = Boolean(isHighPerformanceFlow);
  const [showExitAlert, setShowExitAlert] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {isEligible ? "Select your learning preference" : "Join EDU-Revolution"}
              </DialogTitle>
              <DialogDescription className="mt-2 text-base">
                Are you sure you want to be part of the EDU-Revolution program?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4 w-full overflow-auto">
          <p className="text-sm text-blue-900 leading-relaxed break-words">
            By joining EDU-Revolution, you agree to select specific academic benefits for each of your courses. These benefits can include revenue generation, projects, certifications, internships, and more. You'll be able to track your progress and achievements throughout your academic journey.
          </p>
        </div>

        <DialogFooter className="gap-3 flex flex-row justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setShowExitAlert(true);
            }}
            className="h-10 px-6"
          >
            {isEligible ? "conventional method" : "No, continue through conventional method"}
          </Button>
          <Button
            onClick={onConfirm}
            className="h-10 px-6 bg-primary hover:bg-primary/90"
          >
            {isEligible ? "Learning by doing" : "Yes, Let&apos;s Go"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

      <AlertDialog open={showExitAlert} onOpenChange={setShowExitAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conventional Mode</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-foreground mt-2">
              Not eligible yet? Start in Conventional Mode and upgrade to ‘Learning by Doing’ by achieving the required milestones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => window.location.replace("https://edurev.vercel.app/")}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EduRevDisclaimerModal;
