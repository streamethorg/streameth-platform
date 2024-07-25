import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const Alert = ({
  triggerText,
  dialogTitle,
  dialogDescription,
  cancelClick,
  continueClick,
}: {
  triggerText: string;
  dialogTitle: string;
  dialogDescription: string;
  cancelClick?: () => void;
  continueClick?: () => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button>{triggerText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={cancelClick ? cancelClick : undefined}
            className="bg-red-300"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={continueClick ? continueClick : undefined}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
