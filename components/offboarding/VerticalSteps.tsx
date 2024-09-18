import ISteps from "@/types/ISteps";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

export default function VerticalSteps(props: ISteps) {
  const steps = props.steps;

  return (
    <div className="">
      <nav className="flex justify-center" aria-label="Progress">
        <ol role="list" className="space-y-6">
          {steps.map((step) => (
            <li key={step.name}>
              {step.status === "complete" ? (
                <span className="flex items-start">
                  <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    <CheckCircle
                      className="text-brand-primary h-full w-full"
                      weight="fill"
                    />
                  </span>
                  <span className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                    {step.name}
                  </span>
                </span>
              ) : step.status === "current" ? (
                <span className="flex items-center" aria-current="step">
                  <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    <span className="bg-brand-primary/30 absolute h-4 w-4 rounded-full" />
                    <span className="bg-brand-primary relative block h-2 w-2 rounded-full" />
                  </span>
                  <span className="text-brand-primary ml-3 text-sm font-medium">
                    {step.name}
                  </span>
                </span>
              ) : (
                <div className="flex items-start">
                  <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-gray-300 group-hover:bg-gray-400" />
                  </div>
                  <p className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                    {step.name}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
