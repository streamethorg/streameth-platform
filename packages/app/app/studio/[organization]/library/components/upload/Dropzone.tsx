'use client';

import { createSessionAction } from '@/lib/actions/sessions';
import * as z from 'zod';
import {
  useState,
  useCallback,
  forwardRef,
  useRef,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { FileUp } from 'lucide-react';
import uploadVideo from '@/lib/uploadVideo';
import { getUrlAction } from '@/lib/actions/livepeer';
import { toast } from 'sonner';
import { sessionSchema } from '@/lib/schema';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { createStateAction } from '@/lib/actions/state';
import { StateType } from 'streameth-new-server/src/interfaces/state.interface';
import { Uploads } from '../UploadVideoDialog';

interface DropzoneProps {
  organizationId: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  setOnEdit?: Dispatch<SetStateAction<string | null>>;
  uploads: Uploads;
  setUploads: Dispatch<SetStateAction<Uploads>>;
  stageId?: string;
  onChange?: (sessionId: string) => void;
  type?: SessionType;
  maxFiles?: number;
  maxSize?: number;
}

const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>((props, ref) => {
  const { organizationId, setOpen, uploads, setUploads, setOnEdit } = props;
  const [error, setError] = useState<string | null>(null);
  const abortControllersRef = useRef<{ [uploadId: string]: AbortController }>(
    {}
  );

  const handleEditClick = (uploadId: string) => {
    setOnEdit?.(uploadId);
    setOpen?.(true);
  };

  const cancelUpload = useCallback(
    (uploadId: string, toastId?: string | number) => {
      if (!abortControllersRef.current[uploadId]) {
        console.log('AbortController not found for uploadId:', uploadId);
        return;
      }
      abortControllersRef.current[uploadId].abort();

      const filename = uploads[uploadId]?.session.name || 'Unknown file';
      toast.error(`Upload cancelled for ${filename}`, { id: toastId });

      setUploads((prev) => {
        const { [uploadId]: _, ...rest } = prev;
        return rest;
      });

      delete abortControllersRef.current[uploadId];
      toast.dismiss(toastId);
    },
    [uploads]
  );

  const finishUpload = useCallback(
    (values: z.infer<typeof sessionSchema>) => {
      createSessionAction({
        session: {
          ...values,
          coverImage: '',
          organizationId,
          speakers: [],
          start: 0,
          end: 0,
          type: props.type ?? SessionType.video,
          stageId: props.stageId ?? '',
        },
      })
        .then(async (session) => {
          props.onChange?.(session._id);
          await createStateAction({
            state: {
              sessionId: session._id,
              type: StateType.video,
              sessionSlug: session.slug,
              organizationId: session.organizationId,
            },
          });
        })
        .catch((e) => {
          console.log(e);
          toast.error('Error creating Session');
        });
    },
    [organizationId]
  );

  const startUpload = useCallback(
    async (file: File) => {
      const uploadId = Date.now().toString();
      abortControllersRef.current[uploadId] = new AbortController();

      setOpen?.(false);
      setUploads((prev) => ({
        ...prev,
        [uploadId]: {
          progress: 0,
          session: {
            name: file.name,
            assetId: '',
            published: false,
            description: 'No description',
            coverImage: '',
          },
        },
      }));

      const toastId = toast.loading(`Preparing to upload ${file.name}...`);

      try {
        const uploadUrl = await getUrlAction(file.name);
        if (!uploadUrl) {
          throw new Error('Failed to get upload URL');
        }

        // Create a URL for the uploaded video file
        const videoUrl = URL.createObjectURL(file);
        const videoElement = document.createElement('video');

        // Load the video to get its duration
        videoElement.src = videoUrl;
        videoElement.onloadedmetadata = () => {
          const duration = videoElement.duration; // Get the duration in seconds

          // You can now use the duration as needed, e.g., store it in uploads
          setUploads((prev) => ({
            ...prev,
            [uploadId]: {
              ...prev[uploadId],
              duration: duration,
              session: {
                ...prev[uploadId].session,
              },
            },
          }));
        };

        await new Promise<string>((resolve, reject) => {
          uploadVideo(
            file,
            uploadUrl.tusEndpoint as string,
            abortControllersRef.current[uploadId],
            (percentage) => {
              setUploads((prev) => ({
                ...prev,
                [uploadId]: { ...prev[uploadId], progress: percentage },
              }));

              toast.loading(
                `Uploading ${file.name} - ${Math.round(percentage)}%`,
                {
                  cancel: {
                    label: 'Cancel',
                    onClick: () => cancelUpload(uploadId, toastId),
                  },
                  // TODO: Add edit button back in once we now how to fix it
                  // action: {
                  //   label: 'Edit',
                  //   onClick: (event) => {
                  //     event.preventDefault(); // Prevent the toast from closing
                  //     console.log('Edit button clicked for:', uploadId);
                  //     handleEditClick(uploadId);
                  //   },
                  // },
                  id: toastId,
                }
              );
            },
            async () => {
              const assetId = uploadUrl.assetId as string;

              setUploads((prev) => {
                const updatedUpload = {
                  ...prev[uploadId],
                  session: {
                    ...prev[uploadId].session,
                    assetId: assetId,
                  },
                };

                return {
                  ...prev,
                  [uploadId]: updatedUpload,
                };
              });

              // Call finishUpload only once, after setUploads
              finishUpload({
                name: file.name,
                description: 'No description',
                assetId: assetId,
                published: false,
              });

              resolve(assetId);
            }
          );
        });

        toast.success(`${file.name} uploaded successfully`, { id: toastId });
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Upload was cancelled');
        } else {
          toast.error(
            error instanceof Error ? error.message : 'Upload failed',
            {
              id: toastId,
            }
          );
        }
      } finally {
        // Only remove the upload if it was cancelled or failed
        // if (/* condition to check if upload was not successful */) {
        //   setUploads((prev) => {
        //     const { [uploadId]: _, ...rest } = prev;
        //     return rest;
        //   });
        // }
        delete abortControllersRef.current[uploadId];
      }
    },
    [cancelUpload, finishUpload, handleEditClick]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => startUpload(file));
    },
    [startUpload]
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const { code, message } = fileRejections[0].errors[0];
    if (code === 'file-too-large') {
      setError(
        `File is too large. Max size is ${props.maxSize ? props.maxSize / 1024 / 1024 + 'MB.' : '8GB.'}`
      );
    } else {
      setError(message);
    }

    setTimeout(() => {
      setError(null);
    }, 8000);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.mov'],
    },
    maxSize: props.maxSize ?? 8 * 1024 * 1024 * 1024, // 8 GB in bytes
    maxFiles: props.maxFiles ?? 5,
    onDrop,
    onDropRejected,
    disabled: Object.keys(uploads).length >= (props.maxFiles ?? 5), // Disable if maxFiles reached
  });

  const handleDelete = (uploadId: string) => {
    setUploads((prev) => {
      const { [uploadId]: _, ...rest } = prev;
      return rest;
    });
    props.onChange?.(''); // Set onChange to empty string
  };

  return (
    <div>
      <div
        ref={ref}
        {...getRootProps()}
        className={`flex flex-col justify-center items-center space-y-2 w-full h-40 text-sm bg-white rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer ${Object.keys(uploads).length >= (props.maxFiles ?? 5) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
      >
        {Object.keys(uploads).length > 0 ? (
          <div>
            <h3 className="text-base font-semibold">Uploaded Files:</h3>
            {Object.entries(uploads).map(([uploadId, upload]) => (
              <div
                key={uploadId}
                className="flex justify-between flex-col items-center"
              >
                <span className="flex flex-col">
                  {upload.session.name}
                  {upload.duration !== undefined && (
                    <span className="text-gray-500 text-center">
                      ({Math.round(upload.duration)} secs)
                    </span>
                  )}
                </span>
                {upload.progress !== undefined &&
                  upload.progress < 100 && ( // Check if progress is defined
                    <span className="text-gray-500">
                      {Math.round(upload.progress)}%{' '}
                      {/* Display progress percentage */}
                    </span>
                  )}
                {upload.progress !== undefined && upload.progress < 100 ? (
                  // Show cancel button if uploading
                  <button
                    onClick={() => cancelUpload(uploadId)}
                    className="text-red-500 hover:underline"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    // Enable delete after upload is done
                    onClick={() => handleDelete(uploadId)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mx-4">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <>
            <FileUp size={35} />
            <input {...getInputProps()} />
            <div className="mx-4 text-xs">
              {/* <p>Drag and drop videos to upload... Or just click here!</p> */}
              <p>
                Maximum video file size is{' '}
                {`${props?.maxSize ? props?.maxSize / 1024 / 1024 + 'MB' : '8GB'}`}
                . Best resolution is 1920 x 1080.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

Dropzone.displayName = 'Dropzone';

export default Dropzone;
