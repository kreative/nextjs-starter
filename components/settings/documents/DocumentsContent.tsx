import Container from "@/components/Container";
import PDFCustomizationOptions from "@/components/settings/documents/PDFCustomizationOptions";
import SectionDivider from "@/components/SectionDivider";
import ShowNoticeOnCopy from "./ShowNoticeOnCopy";
import DefaultDocTypePicker from "./DefaultDocTypePicker";
import DocumentTypesManager from "./DocumentTypesManager";

export default function DocumentsContent() {
  return (
    <Container>
      <DocumentTypesManager />
      <SectionDivider />
      <DefaultDocTypePicker />
      <SectionDivider />
      <ShowNoticeOnCopy />
      <SectionDivider />
      <PDFCustomizationOptions />
    </Container>
  );
}
