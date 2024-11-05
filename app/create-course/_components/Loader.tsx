import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

const Loader = ({ loading }: { loading: boolean }) => {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className="flex flex-col items-center py-10">
        <AlertDialogHeader>
          <AlertDialogTitle hidden>Loader</AlertDialogTitle>
          <AlertDialogDescription>
            <Image
              src="/course_loader.gif"
              alt="Loader"
              width={150}
              height={150}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="text-sm text-gray-400">
          Please wait.. while we generate course information..
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Loader;
