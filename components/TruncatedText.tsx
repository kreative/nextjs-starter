interface TruncatedTextProps {
  text: string;
  maxLength: number;
}

export default function TruncatedText({ text, maxLength }: TruncatedTextProps) {
  const style = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: `${maxLength}ch`,
  };

  return <div style={style}>{text}</div>;
}
