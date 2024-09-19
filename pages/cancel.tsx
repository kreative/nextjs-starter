import { useState } from "react";
import  from "@/components/Authenticate";
import VerticalSteps from "@/components/offboarding/VerticalSteps";
import Navbar from "@/components/NavbarSimple";
import OffboardingSurvey from "@/components/offboarding/Survey";
import ConfirmCancellation from "@/components/offboarding/Confirm";
import Complete from "@/components/offboarding/Complete";
import Container from "@/components/Container";

export default function OffboardingIndex(): JSX.Element {
  const [step, setStep] = useState(1);

  const steps = {
    1: [
      { name: "Feedback survey", id: "#", status: "current" },
      { name: "Confirm cancellation", id: "#", status: "upcoming" },
      { name: "Completed", id: "#", status: "upcoming" },
    ],
    2: [
      { name: "Feedback survey", id: "#", status: "complete" },
      { name: "Confirm cancellation", id: "#", status: "current" },
      { name: "Completed", id: "#", status: "upcoming" },
    ],
    3: [
      { name: "Feedback survey", id: "#", status: "complete" },
      { name: "Confirm cancellation", id: "#", status: "complete" },
      { name: "Completed", id: "#", status: "current" },
    ],
  };

  return (
    <div className="background-gradient-2">
        <Navbar logoColor="black" />
        <div className="hidden sm:grid mx-auto my-24 max-w-6xl grid-cols-4">
          <div className="col-span-1 pt-6">
            {step === 1 && <VerticalSteps steps={steps[1]} />}
            {step === 2 && <VerticalSteps steps={steps[2]} />}
            {step === 3 && <VerticalSteps steps={steps[3]} />}
          </div>
          <div className="col-span-3 md:pr-24">
            {step === 1 && <OffboardingSurvey setStep={setStep} />}
            {step === 2 && <ConfirmCancellation setStep={setStep} />}
            {step === 3 && <Complete />}
          </div>
        </div>
        <Container className="sm:hidden block pt-12 py-20">
          {step === 1 && <OffboardingSurvey setStep={setStep} />}
          {step === 2 && <ConfirmCancellation setStep={setStep} />}
          {step === 3 && <Complete />}
        </Container>
    </div>
  );
}
