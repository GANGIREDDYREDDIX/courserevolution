import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface EduRevDisclaimerModalNonEligibleProps {
  open: boolean;
  onCancel: () => void;
}

const EduRevDisclaimerModalNonEligible = ({ open, onCancel }: EduRevDisclaimerModalNonEligibleProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Not Eligible for EDU-Revolution</DialogTitle>
              <DialogDescription className="mt-2 text-base">
                You are currently not eligible to join the EDU-Revolution program.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4 w-full overflow-auto">
          <p className="text-sm text-red-900 leading-relaxed break-words">
            To participate in EDU-Revolution, you must meet the minimum academic requirements. Please improve your CGPA or marks and try again. For more information, visit our website.
          </p>
        </div>

        <DialogFooter className="gap-3 flex flex-row justify-end">
          <Button
            onClick={() => {
              window.location.replace("https://edurev.vercel.app/");
            }}
            className="h-10 px-6 bg-primary hover:bg-primary/90 text-white"
          >
            Yes, continue to conventional method
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EduRevDisclaimerModalNonEligible;
