const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'infycrest';

if (!uri) {
  console.error('MONGODB_URI missing. Check .env.local.');
  process.exit(1);
}

const jobs = [
  {
    title: 'Full Stack Developer',
    type: 'Full-time',
    location: 'Dehradun',
    description:
      'We are looking for a Full Stack Developer to build high-performance web applications using Next.js, React, Node.js and MongoDB. You will work closely with design and product teams to deliver scalable digital products, connect APIs, and improve user experience across the stack. Candidates should be comfortable with component-driven frontend architecture, backend APIs, database design, debugging, testing, and shipping features end to end.',
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'UI/UX Designer',
    type: 'Full-time',
    location: 'Dehradun',
    description:
      'We are hiring a UI/UX Designer to craft intuitive web and app experiences that solve real business problems. You will create user flows, wireframes, design systems, and polished interfaces using Figma while collaborating with developers, product owners, and stakeholders to ensure design decisions support conversion, usability, and business goals. Ideal candidates are detail-oriented, creative, and deeply aware of modern UX best practices.',
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Business Development Executive',
    type: 'Full-time',
    location: 'Dehradun',
    description:
      'We are looking for a Business Development Executive to generate international leads and build meaningful client relationships. The role involves lead generation, cold email outreach, LinkedIn outreach, client discovery calls, meeting setup, and sales follow-up for global business opportunities. Candidates should be confident in outreach, good communicators, comfortable engaging international prospects, and motivated by measurable business growth. Experience: 0–2 years. Department: Technology.',
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Digital Marketing & SEO Executive',
    type: 'Full-time',
    location: 'Dehradun',
    description:
      'We are hiring a Digital Marketing & SEO Executive to support business growth through SEO, content strategy, social media execution, search console analysis, and performance tracking. The ideal candidate will help improve organic visibility, optimize landing pages, manage content calendars, monitor campaign results, and turn insights into action using tools like Google Search Console, GA4, and SEO best practices.',
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Business Analyst / IT Consultant',
    type: 'Full-time',
    location: 'Dehradun',
    description:
      'We are looking for a Business Analyst / IT Consultant who can understand client requirements, translate them into clear business solutions, and create documentation that supports development and implementation. This role involves requirement gathering, process mapping, solution recommendations, stakeholder communication, and technical documentation for business and software projects. Strong analytical thinking, communication, and problem-solving are essential.',
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Project Manager',
    type: 'Full-time',
    location: 'Dehradun',
    description:
      'We are seeking a Project Manager to coordinate multiple client projects and ensure smooth execution from kickoff to delivery. You will manage timelines, communication, scope, risk, stakeholder expectations, and cross-functional execution across design, development, and delivery teams. Strong organizational skills, problem-solving ability, and a customer-first mindset are important for this role.',
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'AI Automation Specialist',
    type: 'Full-time',
    location: 'Dehradun',
    description:
      'We are hiring an AI Automation Specialist to design and implement AI-powered workflows, business process automation, chatbots, integrations, and operational efficiency solutions. The role includes exploring automation opportunities, integrating AI tools into existing systems, improving workflows, and creating scalable technology-driven processes that save time and improve business outcomes.',
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Video / Graphic Designer',
    type: 'Full-time',
    location: 'Dehradun',
    description:
      'We are looking for a Video / Graphic Designer to create marketing creatives, reels, social media visuals, and promotional content for client campaigns. The role involves producing engaging designs and video assets that align with brand identity and campaign goals, using modern editing and design techniques. Candidates should be creative, fast, and comfortable producing content for digital marketing and brand promotion.',
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('jobs');
  await collection.deleteMany({});
  const result = await collection.insertMany(jobs);
  console.log(`Seeded ${result.insertedCount} jobs into ${dbName}.jobs`);
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
