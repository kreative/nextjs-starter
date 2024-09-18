interface SingleStepProps {
  id: string;
  name: string;
  status: string;
}

interface ISteps {
  steps: SingleStepProps[];
}

export default ISteps;
