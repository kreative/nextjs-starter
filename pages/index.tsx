import Authenticate from "@/components/Authenticate";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import { BASE_ROLE } from "@/lib/constants";

export default function Settings() {
  return (
    <Authenticate permissions={[BASE_ROLE]}>
      <Navbar activeLink="index" gradientType="regular" />
      <Container>
        <h1 className="pt-24 text-3xl font-bold tracking-tight px-4 min-[840px]:px-0">
          Welcome to Kreative Next.js Starter
        </h1>
      </Container>
    </Authenticate>
  );
}
