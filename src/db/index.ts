import { mongoDb } from "@/lib/mongodb";

type CollectionTable = { collection: string };

export const db = {
  insert(table: CollectionTable) {
    return {
      values(values: Record<string, unknown>) {
        const document = { ...values, createdAt: values.createdAt ?? new Date() };
        return {
          then: (resolve: (value: unknown) => unknown, reject?: (error: unknown) => unknown) =>
            mongoDb.collection(table.collection).insertOne(document).then(resolve, reject),
          onConflictDoNothing: () =>
            mongoDb.collection(table.collection).updateOne(
              { email: values.email },
              { $setOnInsert: document },
              { upsert: true },
            ),
        };
      },
    };
  },
};
