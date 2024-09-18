import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { userStore } from "@/stores/user";
import { updateUser } from "@/lib/users";
import { useAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import LogoUploadButton from "@/components/settings/LogoUploadButton";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Switch } from "@/components/ui/switch";
import { useCookies } from "react-cookie";

export default function PDFCustomizationOptions() {
  const [user] = useAtom(userStore);
  const [cookies] = useCookies(["kreative_id_key"]);
  const [topText, setTopText] = useState(user?.pdf_top_page_info || "");
  const [bottomText, setBottomText] = useState(
    user?.pdf_bottom_page_info || ""
  );
  const [includePatient, setIncludePatient] = useState(
    user?.pdf_include_patient || false
  );
  const [includeSummary, setIncludeSummary] = useState(
    user?.pdf_include_summary || false
  );
  const [includeDisclaimer, setIncludeDisclaimer] = useState(
    user?.pdf_docuvet_notice || false
  );

  const queryClient = useQueryClient();
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const handleUpdate = async (data: any) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(async () => {
      await updateUser({
        ksn: user.ksn,
        key: cookies.kreative_id_key,
        data,
      });

      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    }, 1000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-10">
        Customize your PDF Note Exports
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <h3 className="pb-2 text-xl font-bold tracking-tight">Custom Logo</h3>
          <p className="text-neutrals-8 pb-4 text-md">
            Add your own logo to add to the top left of the first page on PDF
            exported notes.
          </p>
          <LogoUploadButton>
            <Button variant="secondary" size="sm">
              Choose a new logo
            </Button>
          </LogoUploadButton>
        </div>
        <div className="col-span-1 pl-10 flex items-center justify-end">
          { /* eslint-disable-next-line @next/next/no-img-element */ }
          <img
            src={user?.pdf_custom_image}
            alt="Logo"
            className="w-full h-auto"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
        <div className="col-span-1">
          <h3 className="pb-2 text-xl font-bold tracking-tight">
            Display custom text in top right
          </h3>
          <p className="text-neutrals-8 pb-4 text-md">
            Add any custom text that you would like to display at the top right
            of the first page across from the logo.
          </p>
          <AutosizeTextarea
            value={topText}
            placeholder="Name, phone number, email, address..."
            className="text-md p-4 rounded-xl"
            minHeight={102}
            onChange={(e) => {
              setTopText(e.target.value);
              handleUpdate({ pdf_top_page_info: e.target.value });
            }}
          />
        </div>
        <div className="col-span-1">
          <h3 className="pb-2 text-xl font-bold tracking-tight">
            Display custom text at the bottom
          </h3>
          <p className="text-neutrals-8 pb-4 text-md">
            Add any custom text that you would like to display at the bottom of
            the last page.
          </p>
          <AutosizeTextarea
            value={bottomText}
            placeholder="Thank you, any notices, address, clinic name..."
            className="text-md p-4 rounded-xl"
            minHeight={102}
            onChange={(e) => {
              setBottomText(e.target.value);
              handleUpdate({ pdf_bottom_page_info: e.target.value });
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
        <div className="col-span-1 flex items-center justify-between">
          <h3 className="pb-2 text-xl font-bold tracking-tight">
            Include Docustream summary?
          </h3>
          <Switch
            value={includeSummary}
            defaultChecked={includeSummary}
            onCheckedChange={(value: boolean) => {
              setIncludeSummary(value);
              handleUpdate({ pdf_include_summary: value });
            }}
          />
        </div>
        <div className="col-span-1 flex items-center justify-between">
          <h3 className="pb-2 text-xl font-bold tracking-tight">
            Include patient signalment?
          </h3>
          <Switch
            value={includePatient}
            defaultChecked={includePatient}
            onCheckedChange={(value: boolean) => {
              setIncludePatient(value);
              handleUpdate({ pdf_include_patient: value });
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
        <div className="col-span-1">
          <div className="col-span-1 flex items-start justify-between">
            <div>
              <h3 className="pb-2 text-xl font-bold tracking-tight">
                Include Kreative Docuvet disclaimer?
              </h3>
              <p className="text-neutrals-8 pb-4 text-md pr-12">
                This will add{" "}
                <span className="font-bold">
                  &quot;Medical Notes generated with Kreative DocuVet AI.&quot;
                </span>
              </p>
            </div>
            <Switch
              value={includeDisclaimer}
              defaultChecked={includeDisclaimer}
              onCheckedChange={(value: boolean) => {
                setIncludeDisclaimer(value);
                handleUpdate({ pdf_docuvet_notice: value });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
