import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../lib/db.js", () => ({
  default: {
    topic: { findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn() }
  }
}));

import prismaClient from "../../lib/db.js";
const prismaMock = prismaClient;

import { getAllTopics, getTopicByUuid, mapTopicToDto } from "../topicsService.js";
import { NotFoundError } from "../../utils/errors.js";
import { STATUSES } from "../../config.js";

describe("topicsService", () => {
  beforeEach(() => {
    prismaMock.topic.findMany.mockReset();
    prismaMock.topic.findUnique.mockReset();
  });

  it("getAllTopics returns mapped DTOs", async () => {
    const topic = {
      uuid: "t-1",
      name: "Topic 1",
      description: "Desc",
      status: { status_name: STATUSES.OPEN },
      employee: { user: { uuid: "e-1", name: "Emp", surname: "E" }, academic_title: { full_name: "Dr", shortcut: "Dr" } },
      students: [{ user: { uuid: "s-1", name: "Stu", surname: "S" }, index: "2020" }],
      opinion: { argumentation: "ok", employee: { user: { uuid: "op-1", name: "Op", surname: "O" } } }
    };

    prismaMock.topic.findMany.mockResolvedValue([topic]);

    const dtos = await getAllTopics();

    expect(dtos).toHaveLength(1);
    const dto = dtos[0];
    expect(dto.uuid).toBe(topic.uuid);
    expect(dto.name).toBe(topic.name);
    expect(dto.status_name).toBe(topic.status.status_name);
    expect(dto.supervisor).toEqual({
      uuid: topic.employee.user.uuid,
      name: topic.employee.user.name,
      surname: topic.employee.user.surname,
      full_academic_title: topic.employee.academic_title.full_name,
      shortcut_academic_title: topic.employee.academic_title.shortcut
    });
    expect(dto.students[0]).toEqual({ uuid: "s-1", index: "2020", name: "Stu", surname: "S" });
    expect(dto.opinion).toEqual({ argumentation: "ok", author: { uuid: "op-1", name: "Op", surname: "O" } });
  });

  it("getTopicByUuid returns mapped DTO", async () => {
    const topic = {
      uuid: "t-2",
      name: "Topic 2",
      description: "Desc",
      status: { status_name: STATUSES.OPEN },
      employee: null,
      students: [],
      opinion: null
    };

    prismaMock.topic.findUnique.mockResolvedValue(topic);

    const dto = await getTopicByUuid("t-2");
    expect(dto.uuid).toBe(topic.uuid);
    expect(dto.supervisor).toBeNull();
    expect(dto.opinion).toBeNull();
  });

  it("getTopicByUuid throws NotFoundError when missing", async () => {
    prismaMock.topic.findUnique.mockResolvedValue(null);
    await expect(getTopicByUuid("nope")).rejects.toBeInstanceOf(NotFoundError);
  });
});
