import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import router from "next/router";
import { APP_SUPPORT_URL } from "@/lib/constants";

export default function Error(): JSX.Element {
  return (
    <Container className="flex flex-col items-center my-14 w-full sm:w-[75%] md:w-[55%] mx-auto">
      <svg
        className="h-16 w-auto"
        enableBackground="new 0 0 512 512"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="m240.625 467.492c-.005 0 .002 0-.003 0-66.386 0-122.241-3.115-165.759-6.932-26.825-2.353-43.621-30.123-33.337-55.01 28.526-69.035 63.745-137.231 105.061-203.371 28.123-45.021 55.272-82.968 78.23-112.824 16.011-20.822 47.334-20.828 63.346-.007 22.844 29.707 49.848 67.439 77.831 112.183 41.105 65.725 76.192 133.492 104.671 202.102 10.34 24.909-6.521 52.72-33.387 55.081-66.342 5.831-132.272 8.778-196.653 8.778z"
            fill="#dd636e"
          />
          <path
            d="m265.871 74.846c-7.79 2.048-15.082 6.933-20.474 14.644-21.061 30.12-45.964 68.407-71.76 113.828-37.902 66.727-70.211 135.528-96.374 205.169-8.552 22.75 3.3 47.889 23.914 54.174-9.217-.665-17.988-1.374-26.313-2.101-26.829-2.355-43.618-30.12-33.341-55.015 28.527-69.027 63.751-137.224 105.067-203.365 28.124-45.018 55.269-82.973 78.229-112.821 10.135-13.183 26.417-18.023 41.052-14.513z"
            fill="#da4a54"
          />
          <g fill="#dd636e">
            <path d="m441.838 272.061v-2.894c0-10.208 7.904-18.673 18.089-19.372l31.327-2.149c11.221-.77 20.746 8.125 20.746 19.372v7.192c0 11.247-9.526 20.142-20.746 19.372l-31.327-2.149c-10.184-.698-18.089-9.163-18.089-19.372z" />
            <path d="m417.664 178.948-1.447-2.507c-5.104-8.841-2.491-20.124 5.979-25.821l26.055-17.524c9.333-6.277 22.029-3.337 27.653 6.403l3.596 6.229c5.624 9.74 1.821 22.206-8.281 27.15l-28.204 13.802c-9.169 4.488-20.247 1.109-25.351-7.732z" />
            <path d="m350.172 110.397-2.507-1.447c-8.841-5.104-12.219-16.182-7.732-25.351l13.802-28.204c4.944-10.102 17.41-13.904 27.15-8.281l6.229 3.596c9.74 5.624 12.68 18.32 6.403 27.653l-17.524 26.055c-5.697 8.47-16.98 11.083-25.821 5.979z" />
          </g>
          <g fill="#dd636e">
            <path d="m70.162 272.061v-2.894c0-10.208-7.904-18.673-18.089-19.372l-31.327-2.149c-11.22-.77-20.746 8.125-20.746 19.372v7.192c0 11.247 9.526 20.142 20.746 19.372l31.327-2.149c10.184-.698 18.089-9.163 18.089-19.372z" />
            <path d="m94.336 178.948 1.447-2.507c5.104-8.841 2.491-20.124-5.979-25.821l-26.055-17.524c-9.333-6.277-22.029-3.337-27.653 6.403l-3.596 6.229c-5.624 9.74-1.821 22.206 8.281 27.15l28.204 13.802c9.169 4.488 20.247 1.109 25.351-7.732z" />
            <path d="m161.828 110.397 2.507-1.447c8.841-5.104 12.219-16.182 7.732-25.351l-13.802-28.204c-4.944-10.102-17.41-13.904-27.15-8.281l-6.229 3.596c-9.74 5.624-12.68 18.32-6.403 27.653l17.524 26.055c5.697 8.47 16.98 11.083 25.821 5.979z" />
          </g>
          <g fill="#fff">
            <path d="m244.901 180.12c7.47-.751 14.94-.751 22.41 0 9.451.951 16.686 8.844 17.035 18.336 1.139 31.049 1.139 62.098 0 93.147-.348 9.492-7.584 17.386-17.035 18.336-7.47.751-14.94.751-22.41 0-9.451-.951-16.686-8.844-17.035-18.336-1.139-31.049-1.139-62.098 0-93.147.349-9.493 7.584-17.386 17.035-18.336z" />
            <path d="m245.443 344.015c7.109-.34 14.218-.34 21.327 0 9.797.469 17.665 8.355 18.107 18.153.431 9.552.431 19.104 0 28.657-.442 9.798-8.31 17.684-18.107 18.153-7.109.34-14.218.34-21.327 0-9.797-.469-17.665-8.355-18.107-18.153-.431-9.552-.431-19.104 0-28.657.442-9.798 8.31-17.684 18.107-18.153z" />
          </g>
        </g>
      </svg>
      <p className="text-2xl font-bold tracking-tight text-neutrals-11">
        Something went wrong
      </p>
      <p className="text-md text-neutrals-8 text-center py-3">
        There has been an error when trying to complete your request. This is on
        our end and we are working to fix it. Please contact us through the chat
        on the bottom right or on our support page to speed up the process.
      </p>
      <Button
        variant="outline"
        onClick={() => {
          router.push(APP_SUPPORT_URL);
        }}
      >
        Contact support
      </Button>
    </Container>
  );
}
