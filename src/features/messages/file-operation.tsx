import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Disclosure, DisclosureContent, DisclosureTrigger } from "@/components/ui/disclosure";
import Loading from "@/components/ui/loading";
import {
  CheckCircleSolid,
  ChevronRight,
  DangerTriangleSolid,
  InfoCircleSolid,
} from "@mynaui/icons-react";
import { FileStatus } from "@prisma/client";
import { BlocksIcon } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { File } from "../actions/post/ai-stream";

const getCompletedAction = (type: FileStatus) => {
  switch (type) {
    case FileStatus.PENDING:
      return {
        label: "Pending",
        icon: <BlocksIcon className="h-4 w-4 text-muted-foreground" />,
      };
    case FileStatus.FAILED:
      return {
        label: "Failed",
        icon: <DangerTriangleSolid className="h-4 w-4 text-muted-foreground" />,
      };
    case FileStatus.COMPLETED:
      return {
        label: "Completed",
        icon: <CheckCircleSolid className="h-4 w-4 text-muted-foreground" />,
      };
    case FileStatus.PROCESSING:
      return {
        label: "Generating",
        icon: <Loading className="size-4 animate-spin text-muted-foreground" />,
      };
    default:
      return {
        label: "Unknown",
        icon: <InfoCircleSolid className="h-4 w-4 text-muted-foreground" />,
      };
  }
};

const FileItem = memo(({ file }: { file: File }) => {
  const { label, icon } = useMemo(() => getCompletedAction(file.status), [file.status]);

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-1 items-center gap-2">
        {icon}
        <div className="max-w-52 cursor-pointer truncate text-sm font-normal text-muted-foreground hover:text-primary lg:max-w-52">
          {file.filepath}
        </div>
      </div>
      <Badge variant="default">
        <span className="p-0">{label}</span>
      </Badge>
    </div>
  );
});

FileItem.displayName = "FileItem";

const FileOperation = ({ files }: { files: File[] }) => {
  const [open, setOpen] = useState(true);
  const handleOpenChange = useCallback((value: boolean) => setOpen(value), []);

  const fileItems = useMemo(
    () => (
      <div className="space-y-2">
        {files.map((file, index) => (
          <FileItem key={`${file.filepath}-${index}`} file={file} />
        ))}
      </div>
    ),
    [files],
  );

  return (
    <div className="mb-3 text-sm">
      <Disclosure open={open} onOpenChange={handleOpenChange}>
        <div className="mb-2 mt-2 flex w-full flex-col justify-between rounded-md border border-primary/10 bg-accent/45 py-0.5 ring-muted-foreground/30 transition-all duration-200 hover:bg-accent/50 hover:ring-1 md:max-w-96">
          <div className="flex items-center px-3">
            <DisclosureTrigger className="group rounded-sm hover:bg-sidebar focus:outline-none focus:ring-2 focus:ring-primary/50">
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </DisclosureTrigger>
            <Button
              variant="ghost"
              size="sm"
              className="flex w-full items-center justify-between gap-40 bg-transparent pr-0 hover:bg-transparent"
            >
              <div className="flex w-fit items-center gap-2">
                <span className="font-medium capitalize">File Operations</span>
              </div>
            </Button>
          </div>
          <DisclosureContent className="rounded-b-lg border-t border-none border-primary/10 bg-background px-3 py-2">
            {fileItems}
          </DisclosureContent>
        </div>
      </Disclosure>
    </div>
  );
};

export default memo(FileOperation);
