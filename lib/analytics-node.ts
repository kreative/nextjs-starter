import { Analytics } from '@segment/analytics-node';
import { SEGMENT_WRITE_KEY } from "@/lib/constants";

const analytics = new Analytics({ writeKey: SEGMENT_WRITE_KEY });

export default analytics;