export type Testimonial = {
  id: string;
  clientName: string;
  businessName: string;
  service: string;
  quote: string;
  rating?: number;
  image?: string;
  projectUrl?: string;
  approved: boolean;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "jayant-rana-social-media",
    clientName: "Jayant Rana",
    businessName: "Social Media Project",
    service: "Social Media Handling",
    quote:
      "Great experience working with InfyCrest Solutions! They handled my social media professionally, understood my requirements, and helped improve my online presence. Really happy with their creativity, communication, and overall work.",
    rating: 5,
    projectUrl: "https://www.instagram.com/th.jayant_rana/",
    approved: true,
  },
];

export const APPROVED_TESTIMONIALS = TESTIMONIALS.filter(
  (testimonial) => testimonial.approved,
);
