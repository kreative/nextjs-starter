/* eslint-disable jsx-a11y/alt-text */
import { Text } from "@react-pdf/renderer";

interface RenderTranscriptPDFProps {
  docustreamId: number;
  transcript: string;
}

export default function RenderTranscriptPDF(props: RenderTranscriptPDFProps) {
  if (props.transcript === "No audio transcript available") {
    return (
      <Text style={{ fontStyle: "italic", color: "#6d6c6d" }}>
        {props.transcript}
      </Text>
    );
  }

  const displayTranscriptPDF = props.transcript
    .split("\n")
    .map((str: string, index: number) => {
      return (
        <Text key={index} style={{ marginBottom: 12, fontSize: 12 }}>
          {str}
        </Text>
      );
    });

  return displayTranscriptPDF;
}
