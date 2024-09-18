import { useState, useRef } from "react";
import { updateUser } from "@/lib/users";
import { userStore } from "@/stores/user";
import { useAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { useCookies } from "react-cookie";

interface ShowNoticeOnCopyProps {}

export default function ShowNoticeOnCopy(props: ShowNoticeOnCopyProps) {
  const [user] = useAtom(userStore);
  const [cookies] = useCookies(["kreative_id_key"]);
  const [showNoticeOnCopy, setShowNoticeOnCopy] = useState(
    user?.show_kdv_notice_on_copy || false
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
      <h3 className="pb-2 text-xl font-bold tracking-tight">
        Include Kreative Docuvet disclaimer when copying Notes to clipboard?
      </h3>
      <p className="text-neutrals-8 pb-4 text-md">
        This will add{" "}
        <span className="font-bold">
          &quot;Medical Notes generated with Kreative DocuVet AI.&quot;
        </span> to the bottom of all Notes copied to clipboard.
      </p>
      <Switch
        value={showNoticeOnCopy}
        defaultChecked={showNoticeOnCopy}
        onCheckedChange={(checked) => {
          setShowNoticeOnCopy(checked);
          handleUpdate({ show_kdv_notice_on_copy: checked });
        }}
      />
    </div>
  );
}
