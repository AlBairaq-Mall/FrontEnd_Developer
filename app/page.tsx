import { fetchApi } from "@/lib/api";
import { LandingClient } from "./LandingClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "البيرق ماركت | الرئيسية",
  description: "المتجر الرسمي للبيرق ماركت - تسوق ذكي وأسعار تنافسية وتوصيل سريع",
};

export default async function Page() {
  let aboutUsEntries = [];
  let contactInfos = [];
  let faqs = [];
  let ads = [];
  let hasError = false;

  try {
    const [aboutUsRes, contactRes, faqsRes, adsRes] = await Promise.all([
      fetchApi("/about-us?paginate=false&limit=100").catch((e) => {
        console.error("Error fetching about-us:", e);
        return null;
      }),
      fetchApi("/contact-infos?paginate=false&limit=100").catch((e) => {
        console.error("Error fetching contact-infos:", e);
        return null;
      }),
      fetchApi("/faqs?paginate=false&limit=100").catch((e) => {
        console.error("Error fetching faqs:", e);
        return null;
      }),
      fetchApi("/ads?paginate=false&limit=100").catch((e) => {
        console.error("Error fetching ads:", e);
        return null;
      }),
    ]);

    // Parse About Us
    if (aboutUsRes && aboutUsRes.ok) {
      const json = await aboutUsRes.json();
      aboutUsEntries = json.data || [];
    } else {
      if (aboutUsRes) console.error("About-us responded with status:", aboutUsRes.status);
      hasError = true;
    }

    // Parse Contact Infos
    if (contactRes && contactRes.ok) {
      const json = await contactRes.json();
      contactInfos = json.data || [];
    } else {
      if (contactRes) console.error("Contact-infos responded with status:", contactRes.status);
      hasError = true;
    }

    // Parse FAQs
    if (faqsRes && faqsRes.ok) {
      const json = await faqsRes.json();
      faqs = json.data || [];
    } else {
      if (faqsRes) console.error("FAQs responded with status:", faqsRes.status);
      hasError = true;
    }

    // Parse Ads
    if (adsRes && adsRes.ok) {
      const json = await adsRes.json();
      ads = json.data || [];
    } else {
      if (adsRes) console.error("Ads responded with status:", adsRes.status);
      hasError = true;
    }

    // If all requests failed completely (e.g. backend completely down)
    if (!aboutUsRes && !contactRes && !faqsRes && !adsRes) {
      hasError = true;
    }
  } catch (error) {
    console.error("Failed to fetch landing page data from server:", error);
    hasError = true;
  }

  return (
    <LandingClient
      aboutUsEntries={aboutUsEntries}
      contactInfos={contactInfos}
      faqs={faqs}
      ads={ads}
      hasError={hasError}
    />
  );
}
