import type { Kysely } from 'kysely';

import type { DB } from './db-types';

declare const db: Kysely<DB>;

export const listEntries = async () => {
  const rows = await db
    .selectFrom('TravelEntry')
    .innerJoin('Employee as Technician', 'Technician.id', 'TravelEntry.technicianId')
    .innerJoin('User as TechnicianUser', 'TechnicianUser.id', 'Technician.userId')
    .leftJoin('Employee as Assigned', 'Assigned.id', 'TravelEntry.assignedToId')
    .leftJoin('User as AssignedUser', 'AssignedUser.id', 'Assigned.userId')
    .leftJoin('Employee as Booker', 'Booker.id', 'TravelEntry.bookedById')
    .leftJoin('User as BookerUser', 'BookerUser.id', 'Booker.userId')
    .leftJoin('Project', 'Project.id', 'TravelEntry.projectId')
    .leftJoin('System', 'System.id', 'TravelEntry.systemId')
    .select(['TravelEntry.id'])
    .execute();

  return rows;
};
