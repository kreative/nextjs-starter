import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Record,
  Pause,
  Play,
  TrashSimple,
  Stop,
  DownloadSimple,
  HandWaving,
} from "@phosphor-icons/react/dist/ssr";
import { createDocuStream } from "@/lib/docustreams";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCookies } from "react-cookie";
import { isChrome, isFirefox } from "react-device-detect";
import { Player } from "@lottiefiles/react-lottie-player";
import { getTotalAudioDuration } from "@/lib/utils";
import { uploadAudioForDocustream } from "@/lib/audio";
import IDocuStream from "@/types/IDocuStream";

const mimeType = isChrome || isFirefox ? "audio/ogg" : "audio/mp4";
const fileName = isChrome || isFirefox ? "audio.ogg" : "audio.mp4";

interface RecordButtonProps {
  givenDocustream?: IDocuStream;
  afterUpload?: () => void;
  triggerClassname?: string;
  children: React.ReactNode;
}

export default function RecordButton(props: RecordButtonProps) {
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["kreative_id_key"]);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<any>(null);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState<string>("inactive");
  const [audioChunks, setAudioChunks] = useState<any>([]);
  const [audio, setAudio] = useState<any>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const audioRef = useRef(null);
  const [startTime, setStartTime] = useState<any>(0);
  const [trueStartTime, setTrueStartTime] = useState<any>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const interval = useRef<any>(null);
  const playerRef = useRef<Player>(null);

  const [stage, setStage] = useState<"recording" | "creating" | "done">(
    "recording"
  );

  const clear = async () => {
    setAudio(null);
    setAudioChunks([]);
    setDuration(0);
    clearInterval(interval.current);
    setProgress(0);
    setIsPaused(true);
    setRecordingStatus("inactive");
    setStage("recording");
  };

  const intervalCallback = () => {
    // @ts-ignore
    if (mediaRecorder.current.state === "recording") {
      setDuration((prev) => prev + 1);
    }
  };

  const timeoutCallback = () => {
    intervalCallback();

    setStartTime(new Date());

    interval.current = setInterval(intervalCallback, 1000);
  };

  const getMediaConstraints = () => {
    const isTypeSupported = MediaRecorder.isTypeSupported(mimeType);

    if (!isTypeSupported) {
      console.log(`MIME type ${mimeType} is not supported by this browser.`);
      return { audio: true };
    }

    const constraints = {
      video: false,
      audio: {
        mimeType,
        autoGainControl: true,
        echoCancellation: true,
        noiseSuppression: true,
      },
    };

    if (isFirefox) {
      constraints.audio.noiseSuppression = false;
      constraints.audio.echoCancellation = false;
    }

    return constraints;
  };

  const startRecording = async () => {
    if (!("MediaRecorder" in window)) {
      alert(
        "The MediaRecorder API is not supported in your browser and you will not be able to record audio in this browser."
      );
    }

    navigator.mediaDevices
      .getUserMedia(getMediaConstraints())
      .then((streamData) => {
        setPermission(true);

        setStream(streamData);

        //create new Media recorder instance using the stream
        const media = new MediaRecorder(streamData);

        //set the MediaRecorder instance to the mediaRecorder ref
        // @ts-ignore
        mediaRecorder.current = media;

        //invokes the start method to start the recording process
        // @ts-ignore
        mediaRecorder.current.start();

        playerRef.current?.play();

        // @ts-ignore
        let localAudioChunks = [];

        // @ts-ignore
        mediaRecorder.current.ondataavailable = (event: any) => {
          if (typeof event.data === "undefined") return;
          if (event.data.size === 0) return;
          localAudioChunks.push(event.data);
        };

        // @ts-ignore
        mediaRecorder.current.onstart = (event: any) => {
          setStartTime(new Date());
          setTrueStartTime(new Date());
          setRecordingStatus("recording");

          // use the interval to track the duration of the recording
          interval.current = setInterval(intervalCallback, 1000);
        };

        // @ts-ignore
        setAudioChunks(localAudioChunks);
      })
      .catch((err) => {
        // TODO: we should probably handle this error better
        console.log(err);
      });
  };

  const stopRecording = () => {
    //stops the recording instance
    // @ts-ignore
    mediaRecorder.current.stop();

    playerRef.current?.pause();

    // @ts-ignore
    mediaRecorder.current.onstop = () => {
      stream.getTracks().forEach((track: any) => {
        track.stop();
        track.enabled = false;
      });
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);

      // create a File object from the blob
      const file = new File([audioBlob], fileName, { type: mimeType });

      setAudioFile(file);
      setProgress(0);
      // stop the interval
      clearInterval(interval.current);
      setAudio(audioUrl);
      setAudioChunks([]);
      setRecordingStatus("inactive");
    };
  };

  function pauseRecording() {
    // @ts-ignore
    if (mediaRecorder && mediaRecorder.current.state === "recording") {
      // @ts-ignore
      mediaRecorder.current.pause();

      playerRef.current?.pause();

      // @ts-ignore
      const remaining = new Date() - startTime - 1000 * duration;

      setRemaining(remaining);
      clearInterval(interval.current);

      setRecordingStatus("paused");
    }
  }

  function resumeRecording() {
    // @ts-ignore
    if (mediaRecorder && mediaRecorder.current.state === "paused") {
      // @ts-ignore
      mediaRecorder.current.resume();

      playerRef.current?.play();

      setRecordingStatus("recording");
      setTimeout(timeoutCallback, remaining);
    }
  }

  const getDurationString = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMins = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSecs =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedHours}:${formattedMins}:${formattedSecs}`;
  };

  const togglePaused = () => {
    if (isPaused) {
      // @ts-ignore
      audioRef.current.play();
    } else {
      // @ts-ignore
      audioRef.current.pause();
    }

    setIsPaused(!isPaused);
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const updateProgress = () => {
        // @ts-ignore
        const _progress = (audio.currentTime / audio.duration) * 100;

        if (_progress >= 100) {
          setProgress(100);
          setIsPaused(true);
        }

        setProgress(_progress);
      };

      // @ts-ignore
      audio.addEventListener("timeupdate", updateProgress);
      // @ts-ignore
      audio.addEventListener("loadedmetadata", () => {
        setProgress(0); // Reset progress when new audio file is loaded
      });

      return () => {
        // @ts-ignore
        audio.removeEventListener("timeupdate", updateProgress);
        // @ts-ignore
        audio.removeEventListener("loadedmetadata", () => {
          setProgress(0);
        });
      };
    }
  }, [audioRef, audio]);

  return (
    <div>
      <div className="hidden sm:block">
        <Dialog
          open={open}
          onOpenChange={async (value: boolean) => {
            if (!value) await clear();
            setOpen(value);
          }}
        >
          <DialogTrigger
            className={props.triggerClassname}
            onClick={async () => await startRecording()}
          >
            {props.children}
          </DialogTrigger>
          <DialogContent showDefaultClose={false} className="bg-neutrals-3">
            {stage === "recording" && (
              <div>
                <DialogHeader className="flex flex-row items-center justify-between">
                  <DialogTitle className="flex items-center justify-start">
                    <Record
                      weight="fill"
                      size={24}
                      className={`mr-2 text-red-500 ${
                        recordingStatus === "recording"
                          ? "animate-pulse"
                          : "opacity-50"
                      }`}
                    />
                    {`${getDurationString(duration)}`}
                  </DialogTitle>
                  {(recordingStatus === "recording" ||
                    recordingStatus === "paused") && (
                    <div className="flex items-center justify-center space-x-1">
                      {recordingStatus === "paused" ? (
                        <Button variant="ghost" onClick={resumeRecording}>
                          <Play
                            weight="bold"
                            size={20}
                            className="text-brand-forrest"
                          />
                        </Button>
                      ) : (
                        <Button variant="ghost" onClick={pauseRecording}>
                          <Pause
                            weight="bold"
                            size={20}
                            className="text-brand-forrest"
                          />
                        </Button>
                      )}
                      <Button
                        variant={"ghost"}
                        onClick={stopRecording}
                        type="button"
                        className="text-red-500"
                      >
                        <Stop weight="bold" size={20} />
                      </Button>
                      <DialogClose>
                        <Button
                          variant="ghost"
                          onClick={async () => await clear()}
                          type="button"
                          className="text-neutrals-8"
                        >
                          <TrashSimple weight="bold" size={20} />
                        </Button>
                      </DialogClose>
                    </div>
                  )}
                  {audio && (
                    <div className="flex items-center justify-center space-x-1">
                      {isPaused ? (
                        <Button variant="ghost" onClick={togglePaused}>
                          <Play
                            weight="bold"
                            size={20}
                            className="text-brand-forrest"
                          />
                        </Button>
                      ) : (
                        <Button variant="ghost" onClick={togglePaused}>
                          <Pause
                            weight="bold"
                            size={20}
                            className="text-brand-forrest"
                          />
                        </Button>
                      )}
                      <a download="New Recording" href={audio}>
                        <Button
                          variant={"ghost"}
                          type="button"
                          className="text-red-500"
                        >
                          <DownloadSimple
                            weight="bold"
                            size={20}
                            className="text-brand-forrest"
                          />
                        </Button>
                      </a>
                      <DialogClose>
                        <Button
                          variant="ghost"
                          onClick={async () => await clear()}
                          type="button"
                          className="text-neutrals-8"
                        >
                          <TrashSimple weight="bold" size={20} />
                        </Button>
                      </DialogClose>
                    </div>
                  )}
                </DialogHeader>
                <div>
                  <Player
                    src="/waveform3.json"
                    className="w-full"
                    loop
                    ref={playerRef}
                  />
                </div>
                {audio ? (
                  <div className="audio-container">
                    <audio ref={audioRef} src={audio} controls={false}></audio>
                    <Progress
                      value={progress}
                      className="w-full mt-4 h-3"
                      max={100}
                    />
                    <Button
                      fullWidth
                      animatedSize="grow"
                      className="w-full mt-3"
                      disabled={loading}
                      onClick={async () => {
                        let docustream;

                        if (!props.givenDocustream) {
                          const response = await createDocuStream({
                            key: cookies.kreative_id_key,
                            startTime: trueStartTime.toUTCString(),
                          });

                          docustream = response.docustream;
                        } else {
                          docustream = props.givenDocustream;
                        }

                        let totalDuration = await getTotalAudioDuration([
                          audioFile!,
                        ]);
                        if (!totalDuration || totalDuration === Infinity)
                          totalDuration = duration;

                        await uploadAudioForDocustream({
                          key: cookies.kreative_id_key,
                          docustreamId: docustream!.id,
                          files: [audioFile!],
                          length: totalDuration,
                        });

                        queryClient.invalidateQueries({
                          queryKey: ["docustreams"],
                        });

                        setStage("done");

                        if (props.afterUpload) props.afterUpload();
                      }}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Spinner size="small" className="text-white" />
                          <span className="ml-2">Uploading...</span>
                        </div>
                      ) : (
                        "Upload new audio"
                      )}
                    </Button>
                    {isFirefox && (
                      <Alert className="mt-4">
                        <HandWaving
                          weight="bold"
                          size={20}
                          className="text-neutrals-10"
                        />
                        <AlertTitle>
                          Quick note about Firefox browsers
                        </AlertTitle>
                        <AlertDescription>
                          We detected you&apos;re recording with Firefox. Please
                          note that recordings in Firefox will be quieter than
                          other browsers.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : null}
              </div>
            )}
            {stage === "done" && (
              <div>
                <DialogHeader>
                  <DialogTitle>Your notes are generating 🔥</DialogTitle>
                  <DialogDescription className="pb-4">
                    {props.givenDocustream && (
                      <span>
                        {props.givenDocustream.title} is being processed and
                        content from your new audio recording will be added to
                        it.
                      </span>
                    )}
                    {!props.givenDocustream && (
                      <span>
                        You will have your transcript and default document in
                        less than a minute.
                      </span>
                    )}
                  </DialogDescription>
                  {props.givenDocustream && (
                    <DialogFooter>
                      <p className="italic text-neutrals-7">
                        Redirecting you to Docustreams list...
                      </p>
                    </DialogFooter>
                  )}
                  {!props.givenDocustream && (
                    <DialogFooter className="grid grid-cols-2 gap-2 pt-4">
                      <DialogClose>
                        <Button
                          variant="ghost"
                          className="w-full hover:bg-neutrals-5/70"
                        >
                          Close this dialog
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={async () => {
                          await clear();
                          await startRecording();
                        }}
                      >
                        Record more audio
                      </Button>
                    </DialogFooter>
                  )}
                </DialogHeader>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="block sm:hidden">
        <Drawer
          open={mobileOpen}
          onOpenChange={async (value: boolean) => {
            if (!value) await clear();
            setMobileOpen(value);
          }}
        >
          <DrawerTrigger
            className={props.triggerClassname}
            onClick={async () => await startRecording()}
          >
            {props.children}
          </DrawerTrigger>
          <DrawerContent className="bg-neutrals-3">
            {stage === "recording" && (
              <div>
                <DrawerHeader className="flex flex-row items-center justify-between">
                  <DrawerTitle className="flex items-center justify-start">
                    <Record
                      weight="fill"
                      size={24}
                      className={`mr-2 text-red-500 ${
                        recordingStatus === "recording"
                          ? "animate-pulse"
                          : "opacity-50"
                      }`}
                    />
                    {`${getDurationString(duration)}`}
                  </DrawerTitle>
                  {(recordingStatus === "recording" ||
                    recordingStatus === "paused") && (
                    <div className="flex items-center justify-center space-x-1">
                      {recordingStatus === "paused" ? (
                        <Button variant="ghost" onClick={resumeRecording}>
                          <Play
                            weight="bold"
                            size={20}
                            className="text-brand-forrest"
                          />
                        </Button>
                      ) : (
                        <Button variant="ghost" onClick={pauseRecording}>
                          <Pause
                            weight="bold"
                            size={20}
                            className="text-brand-forrest"
                          />
                        </Button>
                      )}
                      <Button
                        variant={"ghost"}
                        onClick={stopRecording}
                        type="button"
                        className="text-red-500"
                      >
                        <Stop weight="bold" size={20} />
                      </Button>
                      <DrawerClose>
                        <Button
                          variant="ghost"
                          onClick={async () => await clear()}
                          type="button"
                          className="text-neutrals-8"
                        >
                          <TrashSimple weight="bold" size={20} />
                        </Button>
                      </DrawerClose>
                    </div>
                  )}
                  {audio && (
                    <div className="flex items-center justify-center space-x-1">
                      {isPaused ? (
                        <Button variant="ghost" onClick={togglePaused}>
                          <Play
                            weight="bold"
                            size={20}
                            className="text-brand-forrest"
                          />
                        </Button>
                      ) : (
                        <Button variant="ghost" onClick={togglePaused}>
                          <Pause
                            weight="bold"
                            size={20}
                            className="text-brand-forrest"
                          />
                        </Button>
                      )}
                      <a download="New Recording" href={audio}>
                        <Button
                          variant={"ghost"}
                          type="button"
                          className="text-red-500"
                        >
                          <DownloadSimple
                            weight="bold"
                            size={20}
                            className="text-brand-forrest"
                          />
                        </Button>
                      </a>
                      <DrawerClose>
                        <Button
                          variant="ghost"
                          onClick={async () => await clear()}
                          type="button"
                          className="text-neutrals-8"
                        >
                          <TrashSimple weight="bold" size={20} />
                        </Button>
                      </DrawerClose>
                    </div>
                  )}
                </DrawerHeader>
                  <Player
                    src="/waveform3.json"
                    className="w-full"
                    loop
                    ref={playerRef}
                  />
                {audio ? (
                  <div className="audio-container px-4 pb-12">
                    <audio ref={audioRef} src={audio} controls={false}></audio>
                    <Progress
                      value={progress}
                      className="w-full mt-4 h-3"
                      max={100}
                    />
                    <Button
                      fullWidth
                      animatedSize="grow"
                      className="w-full mt-3"
                      disabled={loading}
                      onClick={async () => {
                        let docustream;

                        if (!props.givenDocustream) {
                          const response = await createDocuStream({
                            key: cookies.kreative_id_key,
                            startTime: trueStartTime.toUTCString(),
                          });

                          docustream = response.docustream;
                        } else {
                          docustream = props.givenDocustream;
                        }

                        let totalDuration = await getTotalAudioDuration([
                          audioFile!,
                        ]);
                        if (!totalDuration || totalDuration === Infinity)
                          totalDuration = duration;

                        await uploadAudioForDocustream({
                          key: cookies.kreative_id_key,
                          docustreamId: docustream!.id,
                          files: [audioFile!],
                          length: totalDuration,
                        });

                        queryClient.invalidateQueries({
                          queryKey: ["docustreams"],
                        });

                        setStage("done");

                        if (props.afterUpload) props.afterUpload();
                      }}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Spinner size="small" className="text-white" />
                          <span className="ml-2">Uploading...</span>
                        </div>
                      ) : (
                        "Upload new audio"
                      )}
                    </Button>
                    {isFirefox && (
                      <Alert className="mt-4">
                        <HandWaving
                          weight="bold"
                          size={20}
                          className="text-neutrals-10"
                        />
                        <AlertTitle>
                          Quick note about Firefox browsers
                        </AlertTitle>
                        <AlertDescription>
                          We detected you&apos;re recording with Firefox. Please
                          note that recordings in Firefox will be quieter than
                          other browsers.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : null}
              </div>
            )}
            {stage === "done" && (
              <div>
                <DrawerHeader>
                  <DrawerTitle>Your notes are generating 🔥</DrawerTitle>
                  <DrawerDescription className="pb-4">
                    {props.givenDocustream && (
                      <span>
                        {props.givenDocustream.title} is being processed and
                        content from your new audio recording will be added to
                        it.
                      </span>
                    )}
                    {!props.givenDocustream && (
                      <span>
                        You will have your transcript and default document in
                        less than a minute.
                      </span>
                    )}
                  </DrawerDescription>
                  {props.givenDocustream && (
                    <DrawerFooter>
                      <p className="italic text-neutrals-7">
                        Redirecting you to Docustreams list...
                      </p>
                    </DrawerFooter>
                  )}
                  {!props.givenDocustream && (
                    <DrawerFooter className="grid grid-cols-2 gap-2 pt-4">
                      <DrawerClose>
                        <Button
                          variant="ghost"
                          className="w-full hover:bg-neutrals-5/70"
                        >
                          Close this Drawer
                        </Button>
                      </DrawerClose>
                      <Button
                        onClick={async () => {
                          await clear();
                          await startRecording();
                        }}
                      >
                        Record more audio
                      </Button>
                    </DrawerFooter>
                  )}
                </DrawerHeader>
              </div>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
