import { mongoDb } from "@/lib/mongodb";
import { SITE } from "@/config/site";
import { unstable_cache } from "next/cache";

export type BlogStatus = "draft" | "published" | "scheduled";
export type BlogPost = {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageAlt: string;
  contentImages?: Array<{ src: string; alt: string; caption?: string; position?: string }>;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogImage?: string;
  noindex?: boolean;
  status: BlogStatus;
  publishedAt?: Date;
  publishAt?: Date;
  dateModified: Date;
  createdAt: Date;
  updatedAt: Date;
  readingTime: number;
  featured: boolean;
};

const topics: Array<[string, string, string, string, string[]]> = [
  ["How Much Does a Website Cost in India in 2026? A Practical Pricing Guide", "Web Development", "website development cost in India", "commercial investigation", ["website cost India", "business website pricing"]],
  ["How to Choose the Right Website Development Company for Your Business", "Web Development", "website development company", "commercial investigation", ["web development partner", "website agency checklist"]],
  ["Custom Website vs Template Website: Which Is Better for Your Business?", "Web Development", "custom website vs template website", "commercial investigation", ["website template benefits", "custom web design"]],
  ["How Long Does It Take to Build a Business Website?", "Web Development", "how long does it take to build a website", "informational", ["website development timeline", "website project stages"]],
  ["What Pages Should Every Business Website Have in 2026?", "Business Websites", "business website pages", "informational", ["essential website pages", "small business website structure"]],
  ["Why Your Business Needs a Professional Website in 2026", "Business Websites", "why businesses need a professional website", "commercial investigation", ["professional business website", "business website benefits"]],
  ["Website Development Checklist for Small Businesses", "Business Websites", "website checklist for small business", "informational", ["launch checklist", "small business website"]],
  ["How to Plan a Website Before Development Starts", "Web Development", "website planning", "informational", ["website brief", "content planning"]],
  ["What Makes a Professional Business Website in 2026?", "Business Websites", "professional business website", "commercial investigation", ["credible business website", "business website design"]],
  ["Modern Website Design Trends Businesses Should Know in 2026", "Web Design", "website design trends 2026", "informational", ["modern web design", "business design trends"]],
  ["Why Mobile-First Web Design Matters for Businesses", "Web Design", "mobile first web design", "informational", ["responsive website", "mobile business website"]],
  ["Website UX vs UI: What's the Difference and Why Does It Matter?", "Web Design", "UX vs UI", "informational", ["user experience design", "interface design"]],
  ["How Website Design Affects Customer Trust and Conversions", "Web Design", "website design customer trust", "informational", ["website conversion design", "online credibility"]],
  ["10 Common Website Design Mistakes That Cost Businesses Customers", "Web Design", "website design mistakes", "informational", ["conversion mistakes", "bad website design"]],
  ["How Much Does Professional Website Design Cost?", "Web Design", "professional website design cost", "commercial investigation", ["web design pricing", "website design quote"]],
  ["How to Design a Website That Converts Visitors Into Enquiries", "Digital Growth", "website conversion design", "commercial investigation", ["lead generation website", "conversion focused website"]],
  ["SEO for Small Business Websites: A Practical 2026 Guide", "SEO", "SEO for small business websites", "informational", ["small business SEO", "local website SEO"]],
  ["Technical SEO Checklist for a New Website", "SEO", "technical SEO checklist", "informational", ["crawlable website", "technical SEO basics"]],
  ["On-Page SEO: What Every Business Website Should Optimize", "SEO", "on page SEO for business websites", "informational", ["title tags", "on page optimization"]],
  ["How Website Speed Affects SEO and User Experience", "Performance", "website speed and SEO", "informational", ["fast website", "page speed user experience"]],
  ["Core Web Vitals Explained for Business Owners", "Performance", "Core Web Vitals explained", "informational", ["LCP", "INP", "CLS"]],
  ["Why Your Website Isn't Ranking on Google", "SEO", "why website is not ranking", "informational", ["SEO troubleshooting", "Google ranking basics"]],
  ["How Long Does SEO Take to Show Results?", "SEO", "how long does SEO take", "commercial investigation", ["SEO timeline", "organic traffic growth"]],
  ["Internal Linking: The Simple SEO Strategy Many Businesses Ignore", "SEO", "internal linking strategy", "informational", ["internal links SEO", "website topic structure"]],
  ["How to Build Topical Authority With a Business Blog", "SEO", "topical authority business blog", "informational", ["content clusters", "SEO content strategy"]],
  ["What Is Generative Engine Optimization (GEO)?", "AI & Search", "generative engine optimization", "informational", ["GEO explained", "AI search optimization"]],
  ["SEO vs GEO vs AEO: What's the Difference in 2026?", "AI & Search", "SEO vs GEO vs AEO", "informational", ["answer engine optimization", "AI search"]],
  ["How AI Search Is Changing the Way Customers Find Businesses", "AI & Search", "AI search for businesses", "informational", ["generative search", "business discoverability"]],
  ["How to Optimize Your Website for Google AI Search Experiences", "AI & Search", "optimize website for Google AI search", "informational", ["AI Overviews SEO", "Google AI Mode"]],
  ["How to Make Your Website Easier for AI Search Engines to Understand", "AI & Search", "make website understandable to AI search", "informational", ["clear website content", "entity SEO"]],
  ["Structured Data Explained: How Schema Helps Search Engines Understand Your Website", "AI & Search", "structured data schema explained", "informational", ["schema markup", "Article schema"]],
  ["Will AI Replace Traditional Google Search? What Businesses Should Prepare For", "AI & Search", "AI search future for businesses", "informational", ["future of search", "search strategy"]],
  ["Why Businesses Are Moving to Modern Web Frameworks Like Next.js", "Next.js", "Next.js for business websites", "commercial investigation", ["modern web framework", "Next.js benefits"]],
  ["Next.js vs WordPress: Which Is Better for a Business Website?", "Next.js", "Next.js vs WordPress", "commercial investigation", ["WordPress alternative", "business website platform"]],
  ["React vs Traditional Website Development: What Should Businesses Choose?", "Next.js", "React vs traditional website development", "commercial investigation", ["React website", "modern frontend"]],
  ["Why Website Performance Should Be Considered Before Development", "Performance", "website performance planning", "informational", ["performance budget", "fast website development"]],
  ["SSR vs CSR: What Business Owners Should Know About Modern Websites", "Next.js", "SSR vs CSR", "informational", ["server rendering", "client rendering"]],
  ["Why a Business Website Is More Than an Online Brochure", "Business Websites", "business website value", "informational", ["digital business asset", "website strategy"]],
  ["How to Turn Website Visitors Into Leads", "Digital Growth", "turn website visitors into leads", "commercial investigation", ["website lead generation", "enquiry conversion"]],
  ["Website Conversion Optimization: 10 Practical Improvements", "Digital Growth", "website conversion optimization", "informational", ["CRO checklist", "landing page improvements"]],
  ["Why Your Website Gets Traffic but No Enquiries", "Digital Growth", "website traffic but no leads", "informational", ["conversion problem", "lead generation audit"]],
  ["WhatsApp Integration for Business Websites: Does It Actually Help?", "Digital Growth", "WhatsApp integration for business website", "commercial investigation", ["WhatsApp leads", "website contact options"]],
  ["How Website Analytics Can Help You Get More Customers", "Digital Growth", "website analytics for small business", "informational", ["analytics conversion tracking", "website insights"]],
  ["What Should a Hotel Website Have in 2026?", "Business Websites", "hotel website features", "commercial investigation", ["hospitality website", "hotel direct bookings"]],
  ["How a Professional Website Can Help Vacation Rentals Get More Direct Bookings", "Business Websites", "vacation rental website direct bookings", "commercial investigation", ["holiday rental website", "direct booking strategy"]],
  ["Restaurant Website Features That Can Increase Online Orders", "E-commerce", "restaurant website features", "commercial investigation", ["restaurant online ordering", "restaurant web design"]],
  ["What Should a Real Estate Website Include?", "Business Websites", "real estate website features", "commercial investigation", ["property website", "real estate lead generation"]],
  ["How Local Businesses Can Use Their Website to Generate More Leads", "Local SEO", "local business website leads", "commercial investigation", ["local SEO website", "local lead generation"]],
  ["Website Redesign Checklist: When Should You Rebuild Your Website?", "Web Development", "website redesign checklist", "commercial investigation", ["website rebuild", "redesign planning"]],
  ["Website Security Checklist for Small Businesses", "Web Development", "website security checklist", "informational", ["website security basics", "secure business website"]],
  ["The Complete 2026 Guide to Building a High-Performing Business Website", "Digital Growth", "high performing business website", "commercial investigation", ["business website guide", "website performance strategy"]],
];

const imagePool = [
  "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1553484771-047a44eee27b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
];

export const SITE_URL = SITE.url;

export function blogImageUrl(image: string) {
  return image.startsWith("http") ? image : `${SITE_URL}${image}`;
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildContent(title: string, category: string, keyword: string, related: string[]) {
  const link = category === "SEO" || category === "AI & Search" ? "/#services" : "/templates";
  return `<p>Businesses rarely need more digital noise. They need a website that answers real questions, makes the next step obvious and stays useful after launch. This guide explains <strong>${keyword}</strong> in practical terms, with decisions you can apply to a real project.</p>
<h2>The short answer</h2><p>${title.replace(/\?$/, "")} depends on your audience, offer, content and the job the website must do. Start with the customer journey, then choose the technology and visual direction that support it. A polished interface cannot compensate for unclear positioning or a difficult enquiry path.</p>
<h2>What to evaluate first</h2><ul><li>Define the primary action: enquiry, booking, purchase, call or visit.</li><li>Write down the questions a new visitor must answer before taking that action.</li><li>Separate essential launch requirements from improvements that can follow later.</li><li>Agree on who owns content, approvals, analytics and ongoing maintenance.</li></ul>
<h2>A practical implementation approach</h2><p>Begin with a clear information architecture. Give each important service, product or location a useful page rather than hiding everything behind a generic paragraph. Use descriptive headings, specific calls to action and internal links that help people continue their research. This also gives search engines a clearer understanding of the site.</p>
<p>Performance should be part of the plan from the start. Compress images, reserve space for media, avoid unnecessary scripts and measure real user experience after launch. For search, focus on crawlability, helpful content, clear page titles, descriptive links and structured data where it accurately represents the page.</p>
<h2>Common mistakes</h2><p>The most expensive mistakes are usually strategic: building before agreeing on the audience, copying a competitor's layout, treating mobile as an afterthought, or adding analytics without deciding which business questions it should answer. Avoid promises of guaranteed rankings. Good work improves the site's ability to be understood and used; results still depend on competition, demand and execution over time.</p>
<h2>A useful next step</h2><p>Turn this advice into a one-page brief. List your audience, offer, required pages, proof points, conversion action and technical constraints. Then compare solutions against that brief instead of choosing based only on a screenshot or a feature list. Explore our <a href="${link}">${category === "SEO" || category === "AI & Search" ? "website and digital services" : "ready-to-launch templates"}</a> for a practical starting point.</p>
<h2>Frequently asked questions</h2><h3>How should a business begin?</h3><p>Start with the customer and the outcome, then map the smallest useful website that can support that outcome. Add complexity only when it solves a real need.</p><h3>Can this be improved after launch?</h3><p>Yes. A website should be measured and refined. Review questions, page performance, search visibility and enquiry quality regularly.</p>
<h2>Conclusion</h2><p>A strong business website is a working system: clear content, thoughtful design, dependable technology and a measurable path to action. The best next move is the one that makes your audience's decision easier.</p>`;
}

const highPerformanceSlug = slugify("The Complete 2026 Guide to Building a High-Performing Business Website");

function highPerformanceContent() {
  return `<p>A high-performing business website is not simply a beautiful collection of pages. It is a dependable path between a visitor's question and the action your business wants them to take. That means strategy, content, design, engineering, search visibility and measurement need to work together.</p>
<h2>What Makes a Website High-Performing?</h2><p>Performance has several dimensions: it should load quickly, explain the offer clearly, work on small screens, support accessibility, earn search visibility and create a credible route to an enquiry. A fast page with confusing content is not high-performing. Neither is a polished site that makes customers hunt for contact details.</p><h3>Measure the outcome, not vanity metrics</h3><p>Choose a primary outcome before choosing a dashboard. For one business that may be qualified enquiries; for another it may be bookings, calls or direct orders. Secondary measures such as engaged sessions, page views and CTA clicks help explain the journey, but they should support a business question.</p>
<h2>Start With Clear Business Goals</h2><p>Write a short brief that names the audience, offer, proof points, objections and next action. Interview people who sell or deliver the service. Their language often reveals the questions a homepage alone cannot answer. Make the goal specific enough to guide decisions: “help a hotel generate direct booking enquiries” is more useful than “look premium.”</p>
<h2>Plan Your Website Structure</h2><p>Map the pages a visitor needs in order to make a decision. A useful structure commonly includes a focused homepage, service or product pages, proof, an about page, FAQs and a contact path. Use descriptive URLs and link related pages together. This creates a better experience and helps search engines understand the site's subjects.</p><ul><li>Keep one clear purpose for each important page.</li><li>Give high-intent services their own useful landing pages.</li><li>Make the primary CTA consistent without making every section feel identical.</li><li>Plan content ownership before development begins.</li></ul>
<h2>Design for Users, Not Just Looks</h2><p>Visual design should establish hierarchy. A visitor should see what the business does, why it is credible and what to do next without decoding the interface. Use contrast, spacing and familiar interaction patterns. Decorative motion should reinforce the story and remain optional; it should never delay content or make the page difficult to use.</p>
<h2>Build a Mobile-First Experience</h2><p>Mobile-first means deciding what matters when space is limited, not shrinking a desktop composition. Test headings, tap targets, forms, sticky controls and image crops on real phones. Keep forms short, make phone and WhatsApp actions explicit where appropriate, and ensure the first viewport communicates the offer without relying on hover.</p>
<h2>Focus on Website Performance</h2><p>Set a performance budget before adding media and scripts. Serve responsive images, reserve their layout space, lazy-load content below the fold and remove libraries that do not solve a real problem. Monitor Core Web Vitals in the field because a local laptop test cannot represent every visitor's network or device.</p><blockquote><strong>Key takeaway:</strong> Protect the first useful interaction. A visitor should be able to understand the page and begin the next action before decorative enhancements finish loading.</blockquote>
<h2>Make SEO Part of Development</h2><p>Technical SEO is easier when it is planned rather than repaired later. Use crawlable links, descriptive titles, useful headings, canonical URLs, an XML sitemap and accurate structured data. Write for the questions your audience actually asks. Search visibility is earned through relevance and usefulness; no framework or tactic can guarantee a ranking.</p>
<h2>Add Clear Conversion Paths</h2><p>Place the next action near the information that supports it. A service page may need a project enquiry; a template page may need a customization CTA; a hospitality page may need availability details. Label actions honestly and carry useful context into forms so visitors do not have to repeat what they were reading about.</p>
<h2>Use Analytics to Understand Visitors</h2><p>Track events that answer operational questions: which pages are viewed, which sources bring engaged visitors, which CTAs are used and which forms succeed. Collect the minimum data needed, respect consent and keep reports honest. Analytics should help you improve the journey, not identify people.</p>
<h2>Security and Accessibility</h2><p>Keep dependencies current, protect admin routes, validate server inputs and avoid putting sensitive form contents into analytics. Use semantic headings, labels, keyboard focus, sufficient contrast and meaningful alternative text. Accessibility is part of quality, not a final compliance layer.</p>
<h2>Pre-Launch Website Checklist</h2><ol><li>Test the primary enquiry or booking path from a fresh device.</li><li>Check every important page on mobile and desktop.</li><li>Compress images and verify layout stability.</li><li>Review titles, descriptions, URLs, links and sitemap output.</li><li>Confirm analytics consent, events and privacy wording.</li><li>Run an accessibility and security review before launch.</li></ol>
<h2>What to Improve After Launch</h2><p>Do not redesign from a single opinion. Review search queries, page engagement, enquiry quality, support questions and real-user performance over a useful period. Fix the highest-friction step first. Small changes to content, forms, speed or calls to action often teach you more than a large visual overhaul.</p>
<h2>Final Thoughts</h2><p>A high-performing website is an evolving business tool. Clear goals give it direction, thoughtful content gives it meaning, good engineering gives it resilience and measurement gives the team a way to learn. Build the smallest strong version, publish it carefully and keep improving what customers actually experience.</p>`;
}

let blogSeedPromise: Promise<void> | undefined;

export function seedBlogPosts() {
  blogSeedPromise ??= seedBlogPostsOnce();
  return blogSeedPromise;
}

function seedBlogPostsOnce() {
  const collection = mongoDb.collection<BlogPost>("blog_posts");
  return collection.countDocuments().then(async (count) => {
    if (count >= 50) {
      const migrations = mongoDb.collection("site_migrations");
      const imageMigration = "blog-image-refresh-unsplash-v1";
      if (!(await migrations.findOne({ key: imageMigration }))) {
        const existingPosts = await collection.find({}, { projection: { _id: 1 } }).sort({ publishedAt: -1 }).toArray();
        if (existingPosts.length) {
          await collection.bulkWrite(existingPosts.map((post, index) => ({
            updateOne: {
              filter: { _id: post._id },
              update: { $set: { featuredImage: imagePool[index % imagePool.length], imageAlt: "Modern digital business experience", updatedAt: new Date() } },
            },
          })));
        }
        await migrations.insertOne({ key: imageMigration, createdAt: new Date() });
      }
      const existing = await collection.findOne({ slug: highPerformanceSlug }, { projection: { contentImages: 1 } });
      if (!existing?.contentImages) {
        await collection.updateOne({ slug: highPerformanceSlug }, { $set: { content: highPerformanceContent(), featuredImage: imagePool[1], imageAlt: "Responsive business website interfaces on desktop and mobile screens", contentImages: [{ src: imagePool[0], alt: "Website planning interface and content structure", caption: "Plan the information architecture before polishing the interface.", position: "planning" }, { src: imagePool[2], alt: "Modern business website interface", caption: "Design should make the next useful action obvious.", position: "design" }], dateModified: new Date(), updatedAt: new Date(), readingTime: 8 } });
      }
      const newTopic = topics.find(([title]) => title === "Why Your Business Needs a Professional Website in 2026");
      if (newTopic && !(await collection.findOne({ slug: slugify(newTopic[0]) }, { projection: { _id: 1 } }))) {
        const [title, category, primaryKeyword, searchIntent, secondaryKeywords] = newTopic;
        const now = new Date();
        const content = buildContent(title, category, primaryKeyword, secondaryKeywords);
        await collection.insertOne({ title, slug: slugify(title), excerpt: `A practical guide to ${primaryKeyword}, with clear decisions and useful next steps for growing businesses.`, content, featuredImage: imagePool[0], imageAlt: `${category} concept for ${title}`, category, tags: [category.toLowerCase().replace(/ & /g, "-"), ...secondaryKeywords.slice(0, 2)], author: "Hemant Pundir", authorRole: "Founder, InfyCrest Solutions", primaryKeyword, secondaryKeywords, searchIntent, metaTitle: title.slice(0, 60), metaDescription: `Learn ${primaryKeyword} with practical guidance from InfyCrest Solutions.`, status: "published", publishedAt: now, dateModified: now, createdAt: now, updatedAt: now, readingTime: Math.max(4, Math.round(content.split(/\s+/).length / 220)), featured: false });
      }
      return;
    }
    const now = new Date();
    const posts: Array<Omit<BlogPost, "_id">> = topics.map(([title, category, primaryKeyword, searchIntent, secondaryKeywords], index) => {
      const publishedAt = new Date(now);
      publishedAt.setUTCHours(12, 0, 0, 0);
      publishedAt.setUTCDate(publishedAt.getUTCDate() - index - 1);
      const slug = slugify(title);
      const content = slug === highPerformanceSlug ? highPerformanceContent() : buildContent(title, category, primaryKeyword, secondaryKeywords);
      return { title, slug, excerpt: `A practical guide to ${primaryKeyword}, with clear decisions and useful next steps for growing businesses.`, content, featuredImage: imagePool[index % imagePool.length], imageAlt: `${category} concept for ${title}`, category, tags: [category.toLowerCase().replace(/ & /g, "-"), ...secondaryKeywords.slice(0, 2)], author: "Hemant Pundir", authorRole: "Founder, InfyCrest Solutions", primaryKeyword, secondaryKeywords, searchIntent, metaTitle: title.slice(0, 60), metaDescription: `Learn ${primaryKeyword} with practical guidance from InfyCrest Solutions.`, status: "published" as const, publishedAt, dateModified: publishedAt, createdAt: now, updatedAt: now, readingTime: Math.max(4, Math.round(content.split(/\s+/).length / 220)), featured: index === 0 };
    });
    await collection.insertMany(posts);
    await collection.updateOne({ slug: highPerformanceSlug }, { $set: { featuredImage: imagePool[1], imageAlt: "Responsive business website interfaces on desktop and mobile screens", contentImages: [{ src: imagePool[0], alt: "Website planning interface and content structure", caption: "Plan the information architecture before polishing the interface.", position: "planning" }, { src: imagePool[2], alt: "Modern business website interface", caption: "Design should make the next useful action obvious.", position: "design" }] } });
  });
}

export async function getPublishedBlogPosts() {
  await seedBlogPosts();
  const posts = await getCachedPublishedBlogPosts();
  return posts.map(normalizeBlogPost);
}

const getCachedPublishedBlogPosts = unstable_cache(
  async () => mongoDb.collection<BlogPost>("blog_posts").find(
    { status: "published", noindex: { $ne: true }, publishedAt: { $lte: new Date() } },
    { projection: { title: 1, slug: 1, excerpt: 1, featuredImage: 1, imageAlt: 1, category: 1, tags: 1, author: 1, publishedAt: 1, readingTime: 1, featured: 1 } },
  ).sort({ publishedAt: -1 }).toArray(),
  ["blog-posts-published"],
  { revalidate: 300, tags: ["blog-posts"] },
);

export async function getBlogSitemapPosts() {
  await seedBlogPosts();
  return mongoDb.collection<BlogPost>("blog_posts").find(
    { status: "published", noindex: { $ne: true }, publishedAt: { $lte: new Date() } },
    { projection: { slug: 1, publishedAt: 1, updatedAt: 1, dateModified: 1 } },
  ).sort({ publishedAt: -1 }).toArray();
}

export async function getBlogPost(slug: string) {
  await seedBlogPosts();
  const post = await getCachedBlogPost(slug);
  return post ? normalizeBlogPost(post) : null;
}

const getCachedBlogPost = unstable_cache(
  async (slug: string) => mongoDb.collection<BlogPost>("blog_posts").findOne({ slug, status: "published", publishedAt: { $lte: new Date() } }),
  ["blog-post"],
  { revalidate: 300, tags: ["blog-posts"] },
);

function normalizeBlogPost(post: BlogPost): BlogPost {
  const image = typeof post.featuredImage === "string" ? post.featuredImage.trim() : "";
  const validImage = image.startsWith("/") || image.startsWith("https://images.unsplash.com/");
  return {
    ...post,
    featuredImage: validImage ? image : imagePool[0],
    publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
    publishAt: post.publishAt ? new Date(post.publishAt) : undefined,
    dateModified: new Date(post.dateModified),
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
  };
}

export function articleHeadings(content: string) {
  return Array.from(content.matchAll(/<h([23])>(.*?)<\/h\1>/gi)).map((match) => {
    const text = match[2].replace(/<[^>]+>/g, "");
    return { level: Number(match[1]), text, id: slugify(text) };
  });
}

export function prepareArticleHtml(content: string) {
  return content.replace(/<h([23])>(.*?)<\/h\1>/gi, (_match, level, text) => `<h${level} id="${slugify(text.replace(/<[^>]+>/g, ""))}">${text}</h${level}>`);
}

export function sanitizeBlogHtml(html: string) {
  return html.replace(/<(?!\/?(p|h2|h3|ul|ol|li|strong|em|a|blockquote|code|pre|hr)(\s|>|\/))[^>]*>/gi, "").replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "").replace(/javascript:/gi, "");
}
