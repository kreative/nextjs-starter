import ISteps from "@/types/ISteps";

export default function Steps(props: ISteps) {
  const steps = props.steps;

  return (
    <nav aria-label="Progress" className="pb-16">
      <ol
        role="list"
        className="space-y-4 text-center md:flex md:space-x-8 md:space-y-0"
      >
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            {step.status === "complete" ? (
              <p className="border-brand-forrest group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-brand-forrest text-sm font-bold">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </p>
            ) : step.status === "current" ? (
              <p
                className="border-brand-forrest/50 flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-brand-forrest text-sm font-bold">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </p>
            ) : (
              <p className="border-neutrals-6/60 group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-neutrals-11 text-sm font-bold">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </p>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
