import { Injectable, Inject } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../../../db/index.js';
import {
  experiences,
  experiencePositions,
  type Experience,
  type ExperiencePosition,
} from '../entities/experience.entity.js';
import type { CreateExperienceDto } from '../dtos/experience.dto.js';

export interface FullExperience extends Experience {
  positions: ExperiencePosition[];
}

@Injectable()
export class ExperienceRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async findAll(): Promise<FullExperience[]> {
    const exps = await this.db
      .select()
      .from(experiences)
      .orderBy(asc(experiences.sortOrder));

    const positions = await this.db
      .select()
      .from(experiencePositions)
      .orderBy(asc(experiencePositions.sortOrder));

    return exps.map((exp) => ({
      ...exp,
      positions: positions.filter((p) => p.experienceId === exp.id),
    }));
  }

  async create(dto: CreateExperienceDto): Promise<FullExperience> {
    const insertedExp = await this.db
      .insert(experiences)
      .values({
        company: dto.company,
        location: dto.location,
        logo: dto.logo,
        sortOrder: dto.sortOrder ?? 0,
      })
      .returning();

    const exp = insertedExp[0];
    const createdPositions: ExperiencePosition[] = [];

    for (const pos of dto.positions) {
      const insertedPos = await this.db
        .insert(experiencePositions)
        .values({
          experienceId: exp.id,
          title: pos.title,
          startDate: pos.startDate,
          endDate: pos.endDate || null,
          type: pos.type,
          sortOrder: pos.sortOrder ?? 0,
        })
        .returning();
      createdPositions.push(insertedPos[0]);
    }

    return {
      ...exp,
      positions: createdPositions,
    };
  }

  async update(id: string, dto: CreateExperienceDto): Promise<FullExperience | null> {
    const updatedExp = await this.db
      .update(experiences)
      .set({
        company: dto.company,
        location: dto.location,
        logo: dto.logo,
        sortOrder: dto.sortOrder ?? 0,
      })
      .where(eq(experiences.id, id))
      .returning();

    if (updatedExp.length === 0) return null;
    const exp = updatedExp[0];

    // Replace positions
    await this.db
      .delete(experiencePositions)
      .where(eq(experiencePositions.experienceId, id));

    const createdPositions: ExperiencePosition[] = [];
    for (const pos of dto.positions) {
      const insertedPos = await this.db
        .insert(experiencePositions)
        .values({
          experienceId: exp.id,
          title: pos.title,
          startDate: pos.startDate,
          endDate: pos.endDate || null,
          type: pos.type,
          sortOrder: pos.sortOrder ?? 0,
        })
        .returning();
      createdPositions.push(insertedPos[0]);
    }

    return {
      ...exp,
      positions: createdPositions,
    };
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db
      .delete(experiences)
      .where(eq(experiences.id, id))
      .returning();
    return deleted.length > 0;
  }
}
