import { mongoDb } from "@/lib/mongodb";

export type JobStatus = "open" | "closed";

export type Job = {
  _id?: string;
  title: string;
  type: string;
  location: string;
  description: string;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
};

const jobsCollection = () => mongoDb.collection<Job>("jobs");

export async function getPublishedJobs() {
  const jobs = await jobsCollection()
    .find({ status: "open" })
    .sort({ createdAt: -1 })
    .toArray();

  return jobs.map((job) => normalizeJob(job));
}

export async function getAllJobs() {
  const jobs = await jobsCollection().find({}).sort({ createdAt: -1 }).toArray();
  return jobs.map((job) => normalizeJob(job));
}

export function normalizeJob(job: Job) {
  return {
    ...job,
    id: job._id ? String(job._id) : undefined,
    createdAt: new Date(job.createdAt),
    updatedAt: new Date(job.updatedAt),
  };
}
